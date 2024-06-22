import { Handlers } from "$fresh/server.ts";
import { getOrUpdateCache } from "../../../../cacheUtil.ts";
import {
  filePackagePathRegex,
  githubRepository,
  githubRepositoryFileRoot,
  octokit,
} from "../../../../fresh.config.ts";
import { PackageMetadata } from "../../../../types.ts";
import { getPackageContent } from "./[id].ts";
import * as path from "$std/path/mod.ts";


export async function getPackageNamesInVersion(
  version: string,
): Promise<string[]> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  const tree = await octokit.rest.git.getTree(
    {
      ...githubRepository,
      tree_sha: "main",
      recursive: "true",
    },
  );

  // TODO: Sanitize version

  const versionDir = path.join(githubRepositoryFileRoot, version);
  const filesInVersion = tree.data.tree
    .map((x) => x.path!)
    .filter((x) => x.startsWith(versionDir));

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

export function getPackagesInVersion(
  version: string,
): Promise<PackageMetadata[]> {
  const cacheKey = ["packageList", version];

  return getOrUpdateCache(cacheKey, async () => {
    const tree = await octokit.rest.git.getTree(
      {
        ...githubRepository,
        tree_sha: "main",
        recursive: "true",
      },
    );

    const versionDir = path.join(githubRepositoryFileRoot, version) + path.SEPARATOR;

    const parsedContent = tree.data.tree
      .filter((x) => x.path?.startsWith(versionDir))
      .filter((x) => {
        // remove base path

        // TODO: Fix
        // const fixedPath = x.path!.substring(versionDir.length)
        // return fixedPath.match(filePackagePathRegex);

        return true
      })
      .map((entry) => getPackageContent(entry.path!));

    const finished = await Promise.all(parsedContent);

    return finished
      // nonnulify
      .filter((x) => x)
      .map((x) => x!);
  });
}

export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const { version } = ctx.params;
    const packages = await getPackageNamesInVersion(version);
    return new Response(JSON.stringify(packages));
  },
};
