import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { Octokit } from "https://esm.sh/octokit@3.2.1?dts";
import { PackageMetadata } from "./types.ts";
import * as path from "$std/path/mod.ts";

export const filePackagePathRegex = /^[\d\.]+\/[\w]+\.json/;

export const githubRepository = {
  owner: "Fernthedev",
  repo: "beatmods3-bs",
} as const;

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
let octokit: Octokit;

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

export default defineConfig({
  plugins: [tailwind()],
});
