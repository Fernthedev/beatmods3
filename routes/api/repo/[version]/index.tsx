import { Handlers } from "$fresh/server.ts";
import { octokit } from "../../../../fresh.config.ts";

export async function getPackagesInVersion(version: string): Promise<string[]> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  const tree = await octokit.rest.git.getTree(
    {
      owner: "Fernthedev",
      repo: "quest-rue",
      tree_sha: "master",
      recursive: "true",
    },
  );

  const filesInVersion = tree.data.tree
    .map((x) => x.path!)
    .filter((x) => x.startsWith(`${version}/`));

  // console.log(tree.data);

  if (filesInVersion.length === 0) {
    throw new Deno.errors.NotFound(version);
  }

  //   const contents = await octokit.rest.repos.getContent({
  //   owner: "Fernthedev",
  //   repo: "quest-rue",
  //   path: "/",
  // });
  // console.log(contents.data);

  return filesInVersion;
}

type VersionAPIData = {
  packages: string[];
};

export const handler: Handlers<VersionAPIData | null> = {
  async GET(_req, ctx) {
    const { version } = ctx.params;
    const packages = await getPackagesInVersion(version);
    return ctx.render({ packages });
  },
};
