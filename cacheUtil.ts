import { cacheTime } from "./fresh.config.ts";

export async function getOrUpdateCache<T>(
  key: Deno.KvKey,
  cb: () => T | Promise<T>,
): Promise<T> {
  const kv = await Deno.openKv();

  const cacheResult = await kv.get<T>(key);

  if (cacheResult.value !== null) {
    return cacheResult.value;
  }

  const result = await cb();
  await kv.set(key, result, {
    expireIn: cacheTime
  });

  return result;
}