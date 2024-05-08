import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { Octokit } from "https://esm.sh/octokit@3.2.1?dts";

export const githubRepository = {
  owner: "Fernthedev",
  repo: "beatmods3-bs",
} as const;

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
export let octokit: Octokit;

export async function setupOctokit(token: string) {
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
