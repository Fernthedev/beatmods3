import { Handlers } from "$fresh/server.ts";
import { githubRepository, octokit } from "../../../fresh.config.ts";
import { PackageMetadata } from "../../../types.ts";
import * as path from "$std/path/mod.ts";

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
        const content = await octokit.rest.repos.getContent({
          ...githubRepository,
          path: x.path!,
        });

        return {
          ...content,
          version: path.dirname(x.path!),
        };
      },
    );

  const resolvedPromises = await Promise.all(listFiles);

  const parsedContent = resolvedPromises.map((x) => {
    if (Array.isArray(x.data)) return null;
    if (x.data.type !== "file") return null;

    return [
      x.version,
      JSON.parse(atob(x.data.content!)),
    ] as PackageVersionTuple;
  })
    // nonnulify
    .filter((x) => x)
    .map((x) => x!);

  // group into arrays
  const grouped = parsedContent
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
