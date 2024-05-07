import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { Octokit } from "https://esm.sh/octokit@3.2.1?dts";
import { load } from "$std/dotenv/mod.ts";

const env = await load();
const token = env["GITHUB_TOKEN"];

export const githubRepository = {
  owner: "Lauriethefish",
  repo: "quest-mod-template",
} as const;

if (!token || token.length === 0) {
  console.error(
    "Github token not found. Generate one here and add it to `.env` as GITHUB_TOKEN={token}",
  );
  console.error("https://github.com/settings/tokens/new?scopes=repo");

  throw "No Github token!";
}

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
export const octokit = new Octokit({
  auth: token,
});

console.log("Authenticated octokit");
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello", login);

export default defineConfig({
  plugins: [tailwind()],
});
