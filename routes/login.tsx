import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import SiteBase from "../components/SiteBase.tsx";
import { setCookie } from "std/http/cookie.ts";
import { UserDetails, hashPassword, setSessionToken } from "../utils/auth.ts";

const db = await Deno.openKv();

export const handler: Handlers = {
  GET(req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const username = form.get("username");
    const password = form.get("password");
    console.log()
    if (!username || !password) {
      return new Response(null, {
        status: 403,
        statusText: 'Username or Password not defined',
      });
    }
    
    const user = await db.get<UserDetails>(['users', username.toString()]);
    console.log(user, username, password);
    if (user?.value?.password === hashPassword(password.toString())) {
      const headers = new Headers();
      const { authSecret, maxAgeSeconds } = await setSessionToken(
        username.toString(),
      );
      setCookie(headers, {
        name: "auth",
        value: authSecret,
        maxAge: maxAgeSeconds,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    } else {
      return new Response(null, {
        status: 403,
      });
    }
  },
};

export default function Login(props: PageProps<{
  authenticated: boolean,
}>) {
  return (
    <>
      <Head>
        <title>Louis' Blog</title>
      </Head>
      <SiteBase>
        <Header backHome={true} />
        <form class="flex flex-col p-6 gap-6" method="post" action="/login">
          <input class="border-1 rounded border-white border-opacity-10 bg-transparent text-base py-2 px-3" placeholder="Username" type="text" name="username" />
          <input class="border-1 rounded border-white border-opacity-10 bg-transparent text-base py-2 px-3" placeholder="Password" type="password" name="password" />
          <button class="bg-white bg-opacity-10 rounded text-base p-2" type="submit">Login</button>
        </form>
      </SiteBase>
    </>
  );
}