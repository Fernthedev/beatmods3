import { Handlers } from "$fresh/server.ts";
import { githubRepository, octokit } from "../../../../fresh.config.ts";

export async function getPackage(
  version: string,
  id: string,
): Promise<Record<string, unknown>> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

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
  package_: Record<string, unknown>;
};

export const handler: Handlers<VersionAPIData | null> = {
  async GET(_req, ctx) {
    const { version, id } = ctx.params;
    const package_ = await getPackage(version, id);
    return ctx.render({ package_ });
  },
};
