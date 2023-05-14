import { HandlerContext } from "https://deno.land/x/fresh@1.1.5/server.ts"
import { hashPassword } from "../../utils/auth.ts";

const db = await Deno.openKv();

export const handler = async (req: Request, ctx: HandlerContext) => {
  // seed users
  await db.set(['users', 'admin'], { role: 'admin', password: null });
  await db.set(['users', 'deno'], { role: 'read', password: hashPassword('land') });
  const headers = new Headers();
  headers.set('location', '/login');
  return new Response(null, {
    status: 303,
    headers,
  })
};