import { Head, asset } from "https://deno.land/x/fresh@1.1.5/runtime.ts";
import { AppProps } from "https://deno.land/x/fresh@1.1.5/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html data-custom="data">
      <Head>
        <title>Louis - I write about the web stuff</title>
        <link rel="icon" href={asset("favicon.svg")} sizes="any" type="image/svg+xml"></link>
        <link rel="stylesheet" href={asset("styles.css")} />
      </Head>
      <body class="bg-[#222] ">
        <Component />
      </body>
    </html>
  );
}