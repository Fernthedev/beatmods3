import { Handlers, PageProps } from "$fresh/server.ts";
import { PackageMetadata } from "../../../types.ts";
import { getPackagesInVersion } from "../../api/repo/[version]/index.ts";

type VersionPageData = {
  packages: PackageMetadata[];
};

export const handler: Handlers<VersionPageData> = {
  async GET(_req, ctx) {
    const packages = await getPackagesInVersion(ctx.params.version);

    return ctx.render({ packages });
  },
};

function PackageCard(package_: PackageMetadata) {
  return (
    <div class="card card-side bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          alt={`Mod ${package_.name}`}
        />
      </figure>
      <div class="card-body prose">
        <h2 class="card-title">{package_.name ?? package_.id}</h2>
        <p>Version: {package_.version}</p>
        {package_.checksum && (
          <p>Checksum {package_.checksum}</p> 
        )}
        <div class="card-actions justify-end">
          {package_.qmodUrl && (
            <a class="btn btn-primary" href={package_.qmodUrl}>Download</a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VersionListPage(props: PageProps<VersionPageData>) {
  const { version } = props.params;
  const { packages } = props.data;

  return (
    <main className="hero">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold prose">Version {version}</h1>
          <div className={"py-6 prose"}>
            {packages.map(PackageCard)}
          </div>
        </div>
      </div>
    </main>
  );
}
