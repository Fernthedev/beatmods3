import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { Octokit } from "https://esm.sh/octokit@3.2.1?dts";
import { PackageMetadata } from "./types.ts";
import * as path from "$std/path/mod.ts";

export const filePackagePathRegex = /^[\d\.]+\/[\w]+\.json/;

export const githubRepository = {
  owner: "DanTheMan827",
  repo: "bsqmods",
} as const;

const millisInSecond = 1000;
// 5 minutes
export const cacheTime = 5 * 60 * millisInSecond;

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
export let octokit: Octokit = null!;

export async function setupOctokit(token: string | undefined) {
  if (!token || token.length === 0) {
    console.error(
      "Github token not found. Generate one here and add it to `.env` as GITHUB_TOKEN={token}",
    );
    console.error("https://github.com/settings/tokens/new?scopes=repo");

    throw "No Github token!";
  }

  octokit = new Octokit({
    auth: token,
  });

  console.log("Authenticated octokit");
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  console.log("Hello", login);
}

if (!octokit) {
  const token = Deno.env.get("GITHUB_TOKEN");
  if (token) {
    setupOctokit(token);
  }
}

export default defineConfig({
  plugins: [tailwind()],
});
