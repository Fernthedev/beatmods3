import { Handlers, PageProps } from "$fresh/server.ts";
import { PackageMetadata } from "../../../types.tsx";
import { getPackage } from "../../api/repo/[version]/[id].tsx";

type PackagePageData = {
  package_: PackageMetadata
};

export const handler: Handlers<PackagePageData> = {
  async GET(_req, ctx) {
    const package_ = await getPackage(ctx.params.version, ctx.params.id);

    return ctx.render({ package_ });
  },
};

export default function VersionListPage(props: PageProps<PackagePageData>) {
  const { version } = props.params;
  const { package_ } = props.data;

  return (
    <main>
      <p>Version {version}!</p>
      <p>Packages {JSON.stringify(package_)}</p>
    </main>
  );
}
