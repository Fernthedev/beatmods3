import { Handlers } from "$fresh/server.ts";
import {
  filePackagePathRegex,
  githubRepository,
  octokit,
} from "../../../../fresh.config.ts";
import { PackageMetadata } from "../../../../types.ts";
import * as path from "$std/path/mod.ts";

export async function getPackage(
  version: string,
  id: string,
): Promise<PackageMetadata> {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

  return getPackageContent(`${version}/${id}.json`);
}

export async function getPackageContent(filePath: string) {
  // TODO: Sanitize version and id

  if (!filePath.match(filePackagePathRegex)) {
    throw "File path does not match regex! should be {version}/{id}.json";
  }

  const id = path.basename(filePath, path.extname(filePath));

  const content = await octokit.rest.repos.getContent({
    ...githubRepository,
    path: filePath!,
  });
  if (Array.isArray(content.data)) throw new Deno.errors.IsADirectory();
  if (content.data.type !== "file") throw new Deno.errors.IsADirectory();
  if (!content.data.content) throw "Content is null!";

  const packageMetadata = JSON.parse(atob(content.data.content!));

  return {
    ...packageMetadata,
    id: id,
  } as PackageMetadata;
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
