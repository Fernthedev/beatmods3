import { Handlers } from "$fresh/server.ts";
import { githubRepository, octokit } from "../../../fresh.config.ts";
import { PackageMetadata } from "../../../types.ts";
import * as path from "$std/path/mod.ts";
import { getPackageContent } from "./[version]/[id].ts";

type PackageVersionTuple = [version: string, package_: PackageMetadata];

export async function getPackagesAsCollection(): Promise<
  Record<string, PackageMetadata[]>
> {
  const tree = await octokit.rest.git.getTree(
    {
      ...githubRepository,
      tree_sha: "main",
      recursive: "true",
    },
  );

  const listFiles = tree.data.tree
    // match for number or period and ends with /
    // then check if word and ends with .json
    // for some reason this does not work when matching in string
    .filter((x) => x.path?.match(/^[\d\.]+\/[\w]+\.json/))
    .map(
      async (x) => {
        const content = await getPackageContent(x.path!);

        return [
          path.dirname(x.path!),
          content,
        ] as PackageVersionTuple;
      },
    );

  const resolvedPromises = await Promise.all(listFiles);

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
