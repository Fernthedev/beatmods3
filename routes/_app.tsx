import { type PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QeatQods 3</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <nav class="navbar bg-base-100">
          <a class="btn btn-ghost text-xl">QeatMods 3</a>
        </nav>
        <div class={"bg-base-200 content"} f-client-nav>
          <Partial name="body">
            <Component />
          </Partial>
        </div>
        <footer className="footer items-center p-4 bg-neutral text-neutral-content">
          <aside className="items-center grid-flow-row prose">
            <p class={"italic"}>Pronounced BeatMods 3!</p>
            <p>Copyright © 2024 - All right reserved</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
