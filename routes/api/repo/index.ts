import { Handlers } from "$fresh/server.ts";
import { githubRepository, octokit } from "../../../fresh.config.ts";
import * as path from "$std/path/mod.ts";

export async function getVersions(): Promise<string[]> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  const tree = await octokit.rest.git.getTree(
    {
      ...githubRepository,
      tree_sha: "main",
      recursive: "false",
    },
  );

  // TODO: Sanitize version

  const versions = tree.data.tree
    .map((x) => x.path!)
    .map((x) => path.dirname(x))
    // match for number or period and ends with /
    .filter((x) => x.length !== 0 && x !== ".");

  if (versions.length === 0) {
    throw new Deno.errors.NotFound();
  }

  return versions;
}


export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const versions = await getVersions();
    return new Response(JSON.stringify(versions));
  },
};
