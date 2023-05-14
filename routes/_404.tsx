import { Head } from "https://deno.land/x/fresh@1.1.5/runtime.ts";
import SiteBase from "../components/SiteBase.tsx";
import Header from "../components/Header.tsx";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Louis' Blog</title>
      </Head>
      <SiteBase>
        <Header backHome={false} />
        <div class="flex-1 flex flex-col items-center justify-center py-48">
          <p class="text-center font-bold text-8xl">404</p>
          <p class="text-center text-2xl">Page Not Found</p>
          <p class="text-center pt-12">
            <a href="/">Back Home</a>
          </p>
        </div>
      </SiteBase>
    </>
  );
}
