const COPART_DIRECT_IMAGE_HOSTS = new Set(["cs.copart.com"]);
const COPART_MANIFEST_HOSTS = new Set(["inventoryv2.copart.io"]);
const IMAGE_EXT_RE = /\.(?:jpe?g|png|webp)$/i;
const BLOCKED_SCHEMES = /^(javascript|data|file|blob):/i;

export type CopartNormalizedImages = {
  thumbnailUrl: string | null;
  primaryImageUrl: string | null;
  imageUrls: string[];
  manifestUrl: string | null;
};

function hostnameOf(url: URL) {
  return url.hostname.trim().toLowerCase();
}

function parseHttpsUrl(value: string | null | undefined): URL | null {
  const raw = String(value ?? "").trim();
  if (!raw || BLOCKED_SCHEMES.test(raw)) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }
  if (url.protocol === "http:") url.protocol = "https:";
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  return url;
}

export function isCopartDirectImageHost(hostname: string) {
  return COPART_DIRECT_IMAGE_HOSTS.has(hostname.trim().toLowerCase());
}

export function isCopartManifestHost(hostname: string) {
  return COPART_MANIFEST_HOSTS.has(hostname.trim().toLowerCase());
}

export function isCopartImageHost(hostname: string) {
  const host = hostname.trim().toLowerCase();
  return isCopartDirectImageHost(host) || isCopartManifestHost(host);
}

export function isCopartDirectImageUrl(value: string | null | undefined): value is string {
  const url = parseHttpsUrl(value);
  if (!url) return false;
  if (!isCopartDirectImageHost(hostnameOf(url))) return false;
  if (!url.pathname.startsWith("/v1/")) return false;
  return IMAGE_EXT_RE.test(url.pathname);
}

export function isCopartImageManifestUrl(value: string | null | undefined): value is string {
  const url = parseHttpsUrl(value);
  if (!url) return false;
  if (!isCopartManifestHost(hostnameOf(url))) return false;
  return url.pathname.startsWith("/v1/lotImages/");
}

export function normalizeCopartDirectImageUrl(value: string | null | undefined): string | null {
  const url = parseHttpsUrl(value);
  if (!url || !isCopartDirectImageUrl(url.toString())) return null;
  url.hash = "";
  return url.toString();
}

export function normalizeCopartManifestUrl(value: string | null | undefined): string | null {
  const url = parseHttpsUrl(value);
  if (!url || !isCopartImageManifestUrl(url.toString())) return null;
  url.hash = "";
  return url.toString();
}

/** Stored feed references: JPEG thumbnails or the official lotImages JSON URL. */
export function normalizeCopartImageReference(value: string | null | undefined): string | null {
  return normalizeCopartDirectImageUrl(value) ?? normalizeCopartManifestUrl(value);
}

export function copartCardImageUrl(thumbnailUrl: string | null | undefined, imageReference?: string | null) {
  return normalizeCopartDirectImageUrl(thumbnailUrl) ?? normalizeCopartDirectImageUrl(imageReference);
}

export function copartPhotoPresentation(thumbnailUrl: string | null | undefined, imageReference?: string | null) {
  const src = copartCardImageUrl(thumbnailUrl, imageReference);
  return src ? ({ kind: "image", src } as const) : ({ kind: "placeholder" } as const);
}

export function copartDisplayImage(thumbnailUrl: string | null, imageReference: string | null) {
  return copartCardImageUrl(thumbnailUrl, imageReference);
}

function dedupe(urls: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const url of urls) {
    const normalized = normalizeCopartDirectImageUrl(url);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

export function normalizeCopartFeedImages(input: {
  thumbnail?: string | null;
  imageUrl?: string | null;
  extraUrls?: string[];
}): CopartNormalizedImages {
  const thumbnailUrl = normalizeCopartDirectImageUrl(input.thumbnail);
  const manifestUrl = normalizeCopartManifestUrl(input.imageUrl);
  const imageUrls = dedupe([thumbnailUrl, ...(input.extraUrls ?? [])].filter(Boolean) as string[]);
  return {
    thumbnailUrl,
    primaryImageUrl: imageUrls[0] ?? null,
    imageUrls,
    manifestUrl,
  };
}

type ManifestLink = {
  url?: unknown;
  isThumbNail?: unknown;
  isHdImage?: unknown;
  isEngineSound?: unknown;
};

function preferredManifestUrl(links: ManifestLink[]) {
  const photos = links
    .map((link) => ({
      url: normalizeCopartDirectImageUrl(typeof link.url === "string" ? link.url : null),
      thumb: link.isThumbNail === true,
      hd: link.isHdImage === true,
      engine: link.isEngineSound === true,
    }))
    .filter((link) => link.url && !link.engine);
  const full = photos.find((link) => !link.thumb && !link.hd) ?? photos.find((link) => !link.thumb) ?? photos[0];
  return full?.url ?? null;
}

export function parseCopartLotImagesManifest(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];
  const lotImages = (payload as { lotImages?: unknown }).lotImages;
  if (!Array.isArray(lotImages)) return [];
  const urls: string[] = [];
  for (const item of lotImages) {
    if (!item || typeof item !== "object") continue;
    const links = (item as { link?: unknown }).link;
    if (!Array.isArray(links)) continue;
    const preferred = preferredManifestUrl(links as ManifestLink[]);
    if (preferred) urls.push(preferred);
  }
  return dedupe(urls);
}

export const COPART_ADMIN_MEDIA_ROUTE = "/api/admin/copart-media";

export function copartAdminMediaSrc(url: string | null | undefined) {
  const normalized = normalizeCopartDirectImageUrl(url);
  if (!normalized) return null;
  return `${COPART_ADMIN_MEDIA_ROUTE}?src=${encodeURIComponent(normalized)}`;
}

export function isAllowedCopartMediaSrc(value: string | null | undefined) {
  return Boolean(normalizeCopartDirectImageUrl(value));
}
