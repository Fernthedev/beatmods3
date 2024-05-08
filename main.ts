/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

const token = Deno.env.get("GITHUB_TOKEN");
if (!token) {
    console.error("No token")
}

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";



await start(manifest, config);
