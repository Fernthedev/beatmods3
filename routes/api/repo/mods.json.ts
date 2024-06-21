import { Handlers } from "$fresh/server.ts";
import { githubRepository, githubRepositoryFileRoot, octokit } from "../../../fresh.config.ts";
import { PackageMetadata } from "../../../types.ts";
import * as path from "$std/path/mod.ts";
import { getPackageContent } from "./[version]/[id].ts";
import { getOrUpdateCache } from "../../../cacheUtil.ts";

type PackageVersionTuple = [version: string, package_: PackageMetadata];

export async function getPackagesAsCollection(): Promise<
  Record<string, PackageMetadata[]>
  > {
  // we only partially cache here to allow using newer
  // package contents even if the tree list is outdated
  const listFiles = await getOrUpdateCache(
    ["mods.json", "listFiles"],
    async () => {
      const tree = await octokit.rest.git.getTree(
        {
          ...githubRepository,
          tree_sha: "main",
          recursive: "true",
        },
      );

      return tree.data.tree
        // match for number or period and ends with /
        // then check if word and ends with .json
        // for some reason this does not work when matching in string
        .filter((x) => x.path?.startsWith(githubRepositoryFileRoot) && x.path?.match(/^[\d\.]+\/[\w]+\.json/))
    },
  );
  const packageContents = listFiles.map(
    async (x) => {
      const content = await getPackageContent(x.path!);

      let version = path.dirname(x.path!);
      if (githubRepositoryFileRoot.length > 0) {
        version = version.substring(githubRepositoryFileRoot.length)
      }

      return [
        version,
        content,
      ] as PackageVersionTuple;
    },
  );

  const resolvedPromises = await Promise.all(packageContents);

  // group into arrays
  const grouped = resolvedPromises
    .reduce((acc, [version, x]) => {
      const newVersion = (acc[version] ?? []).concat(x);

      return {
        ...acc,
        [version]: newVersion,
      };
    }, {} as Record<string, PackageMetadata[]>);

  return grouped;
}

export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const packages = await getPackagesAsCollection();
    return new Response(JSON.stringify(packages));
  },
};
