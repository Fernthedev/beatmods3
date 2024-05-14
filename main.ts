/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config, { setupOctokit } from "./fresh.config.ts";

const token = Deno.env.get("GITHUB_TOKEN");
if (token) {
    console.log("Token is setup!")
}
setupOctokit(token);

await start(manifest, config);
