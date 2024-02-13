import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://unpkg.com/mapillary-js@4.1.0/dist/mapillary.css"
          rel="stylesheet"
        />
        <script
          defer
          data-domain="maps.barikoi.com"
          src="https://plausible.barikoimaps.dev/js/script.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
