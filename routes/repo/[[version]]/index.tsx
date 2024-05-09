import { Handlers, PageProps } from "$fresh/server.ts";
import { getPackagesInVersion } from "../../api/repo/[version]/index.ts";

type VersionPageData = {
  packages: string[];
};

export const handler: Handlers<VersionPageData> = {
  async GET(_req, ctx) {
    const packages = await getPackagesInVersion(ctx.params.version);

    return ctx.render({ packages });
  },
};

export default function VersionListPage(props: PageProps<VersionPageData>) {
  const { version } = props.params;
  const { packages } = props.data;

  return (
    <main>
      <p>Version {version}!</p>
      <p>Packages {packages}!</p>
    </main>
  );
}
