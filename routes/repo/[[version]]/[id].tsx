import { Handlers, PageProps } from "$fresh/server.ts";
import { PackageMetadata } from "../../../types.ts";
import { getPackage } from "../../api/repo/[version]/[id].ts";

type PackagePageData = {
  package_: PackageMetadata;
};

export const handler: Handlers<PackagePageData> = {
  async GET(_req, ctx) {
    const package_ = await getPackage(ctx.params.version, ctx.params.id);

    return ctx.render({ package_ });
  },
};

export default function VersionListPage(props: PageProps<PackagePageData>) {
  const { id, version } = props.params;
  const { package_ } = props.data;

  return (
    <main className="hero">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold prose">Package {id}</h1>
          <div className={"py-6 prose"}>
            <p>Version {package_.version}</p>
            {package_.checksum && <p>Checksum {package_.checksum}</p>}
          </div>

          {package_.qmodUrl && (
            <a className="btn btn-primary" href={package_.qmodUrl}>
              Download
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
