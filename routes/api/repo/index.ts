import { Handlers } from "$fresh/server.ts";
import { githubRepository, githubRepositoryFileRoot, octokit } from "../../../fresh.config.ts";
import * as path from "$std/path/mod.ts";
import { getOrUpdateCache } from "../../../cacheUtil.ts";

export function getVersions(): Promise<string[]> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  const cacheKey = ["versions"];

  return getOrUpdateCache(cacheKey, async () => {
    const tree = await octokit.rest.git.getTree(
      {
        ...githubRepository,
        tree_sha: "main",
        recursive: "false",
      },
    );

    // TODO: Sanitize version

    const versions = tree.data.tree
      .filter(x => x.path?.startsWith(githubRepositoryFileRoot))
      .map((x) => x.path!.substring(githubRepositoryFileRoot.length))
      .map((x) => path.dirname(x))
      // match for number or period and ends with /
      .filter((x) => x.length !== 0 && x !== ".");

    if (versions.length === 0) {
      throw new Deno.errors.NotFound();
    }

    return versions;
  });
}

export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const versions = await getVersions();
    return new Response(JSON.stringify(versions));
  },
};
