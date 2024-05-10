import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { getVersions } from "./api/repo/index.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { PackageMetadata } from "../types.ts";
import { getPackagesInVersion } from "./api/repo/[version]/index.ts";

type HomePageData = {
  versions: string[];
};

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    const versions = await getVersions();

    return ctx.render({ versions });
  },
};

export default function Home(props: PageProps<HomePageData>) {
  const { versions } = props.data;
  return (
    <div class="px-4 py-8 mx-auto bg-dark-200">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to QeatMods 3</h1>
        <div class="my-4 flex flex-col gap-2">
          {versions.map((version) => (
            <a class={"link prose text-lg"} href={`/repo/${version}`}>
              {version}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
