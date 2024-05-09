import { Handlers } from "$fresh/server.ts";
import {
  filePackagePathRegex,
  githubRepository,
  octokit,
} from "../../../../fresh.config.ts";
import { PackageMetadata } from "../../../../types.ts";
import { getPackageContent } from "./[id].ts";

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

export async function getPackagesInVersion(
  version: string,
): Promise<PackageMetadata[]> {
  const tree = await octokit.rest.git.getTree(
    {
      ...githubRepository,
      tree_sha: "main",
      recursive: "true",
    },
  );

  const parsedContent = tree.data.tree
    .filter((x) => x.path?.startsWith(`${version}/`))
    .filter((x) => x.path?.match(filePackagePathRegex))
    .map((entry) => getPackageContent(entry.path!));

  const finished = await Promise.all(parsedContent);

  return finished
    // nonnulify
    .filter((x) => x)
    .map((x) => x!);
}

export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const { version } = ctx.params;
    const packages = await getPackageNamesInVersion(version);
    return new Response(JSON.stringify(packages));
  },
};
