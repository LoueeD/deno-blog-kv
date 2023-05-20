import { load } from "https://deno.land/std/dotenv/mod.ts";
import { getCookies } from "std/http/cookie.ts";
import { hmac } from "hmac";

const env = await load();
const db = await Deno.openKv();


export interface UserDetails {
  password: string;
  role: string;
}

export const checkSessionToken = async (authSecret: string): Promise<boolean> => {
  const token  = await db.get<{username: string, expiry: string}>(['sessions', authSecret]);
  if (!token || !token.value?.expiry) {
    return false;
  }
  const now = new Date();
  const sessionExpiry = new Date(token.value.expiry);
  const valid = now.getTime() < sessionExpiry.getTime();
  console.log({valid, d: token.value.expiry});
  if (!valid) {
    await db.delete(['sessions', authSecret]);
  }
  return valid;
};

export const setSessionToken = async (username: string): Promise<{ authSecret: string, maxAgeSeconds: number }> => {
  const expiry = new Date()
  const maxAgeSeconds = 60 * 60;
  const authSecret = crypto.randomUUID();
  expiry.setTime(expiry.getTime() + (maxAgeSeconds * 1000)); //ms
  await db.set(['sessions', authSecret], { username, expiry: expiry.toUTCString() });
  return {
    authSecret,
    maxAgeSeconds,
  }
}

export function hashPassword (password: string) {
  const secretKey = env['AUTH_KEY'] || Deno.env.get('AUTH_KEY');
  if (!secretKey) throw new Error('Env missing: AUTH_KEY');
  return hmac("sha256", secretKey , password , "utf8", "base64"); 
}

export async function isLoggedIn(req: Request): Promise<boolean> {
  const cookies = getCookies(req.headers);
  if (!cookies.auth) {
    return false;
  }
  return await checkSessionToken(cookies.auth)
}