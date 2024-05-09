#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config, { setupOctokit } from "./fresh.config.ts";

import "$std/dotenv/load.ts";

setupOctokit()

await dev(import.meta.url, "./main.ts", config);
