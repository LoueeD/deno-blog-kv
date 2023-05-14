import { PageProps } from "https://deno.land/x/fresh@1.1.5/server.ts";
import { ComponentChildren } from "preact";

export default function SiteBase({ children }: { children: ComponentChildren }) {
  return (
    <div class="min-h-screen justify-center flex">
      <div class="mx-5 flex-1 max-w-[540px] border-r-1 border-l-1 border-white border-opacity-10">
        { children }
      </div>
    </div>
  )
}