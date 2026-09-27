import { getAdminClaims } from "@/lib/auth";
import { isWebsiteAdminClaims } from "@/lib/auth-role";
import { isAllowedCopartMediaSrc, normalizeCopartDirectImageUrl } from "@/lib/auction-providers/copart/images";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2_500_000;
const FETCH_MS = 8_000;

function deny(status = 404) {
  return new Response(null, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  const claims = await getAdminClaims();
  if (!isWebsiteAdminClaims(claims)) {
    return deny(401);
  }

  const src = new URL(request.url).searchParams.get("src");
  const normalized = normalizeCopartDirectImageUrl(src);
  if (!normalized || !isAllowedCopartMediaSrc(normalized)) {
    return deny(404);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    const upstream = await fetch(normalized, {
      signal: controller.signal,
      headers: { Accept: "image/jpeg,image/png,image/webp,image/*" },
      redirect: "follow",
    });
    if (!upstream.ok || !upstream.body) {
      return deny(404);
    }
    const type = (upstream.headers.get("content-type") ?? "").toLowerCase();
    if (!type.startsWith("image/")) {
      return deny(404);
    }
    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (!buffer.length || buffer.length > MAX_BYTES) {
      return deny(404);
    }
    const safeType = type.startsWith("image/jpeg")
      ? "image/jpeg"
      : type.startsWith("image/png")
        ? "image/png"
        : type.startsWith("image/webp")
          ? "image/webp"
          : "application/octet-stream";
    if (safeType === "application/octet-stream") {
      return deny(404);
    }
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": safeType,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return deny(404);
  } finally {
    clearTimeout(timer);
  }
}
