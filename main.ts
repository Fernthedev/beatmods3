/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config, { setupOctokit } from "./fresh.config.ts";

const token = Deno.env.get("GITHUB_TOKEN");

if (!token || token.length === 0) {
  console.error(
    "Github token not found. Generate one here and add it to `.env` as GITHUB_TOKEN={token}",
  );
  console.error("https://github.com/settings/tokens/new?scopes=repo");

  throw "No Github token!";
}

setupOctokit(token);

await start(manifest, config);
