import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { Octokit } from "https://esm.sh/octokit@3.2.1?dts";
import { load } from "$std/dotenv/mod.ts";

const env = await load();
const token = env["GITHUB_TOKEN"];

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
export const octokit = new Octokit({
  auth: token
});

console.log("Authenticated octokit")
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello", login);

export default defineConfig({
  plugins: [tailwind()],
});
