import { isCopartImageManifestUrl, parseCopartLotImagesManifest } from "./images";

const FETCH_MS = 8_000;

export async function fetchCopartLotImageUrls(manifestUrl: string | null | undefined): Promise<string[]> {
  if (!isCopartImageManifestUrl(manifestUrl)) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    const response = await fetch(manifestUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      redirect: "follow",
    });
    if (!response.ok) return [];
    const type = (response.headers.get("content-type") ?? "").toLowerCase();
    if (!type.includes("json")) return [];
    const payload = await response.json();
    return parseCopartLotImagesManifest(payload);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
