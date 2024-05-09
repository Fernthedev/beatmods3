import { Handlers } from "$fresh/server.ts";
import { githubRepository, octokit } from "../../../../fresh.config.ts";
import { PackageMetadata } from "../../../../types.ts";

export async function getPackage(
  version: string,
  id: string,
): Promise<PackageMetadata> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  // TODO: Sanitize version and id

  const contents = await octokit.rest.repos.getContent(
    {
      ...githubRepository,
      path: `${version}/${id}.json`,
    },
  );

  if (Array.isArray(contents.data)) throw new Deno.errors.IsADirectory();
  if (contents.data.type !== "file") throw new Deno.errors.IsADirectory();
  
  const base64Decode = atob(contents.data.content)

  const json = JSON.parse(base64Decode);

  return json;
}

type VersionAPIData = {
  package_: PackageMetadata;
};

export const handler: Handlers<null> = {
  async GET(_req, ctx) {
    const { version, id } = ctx.params;
    const package_ = await getPackage(version, id);
    return new Response(JSON.stringify(package_));
  },
};
