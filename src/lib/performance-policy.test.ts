import { describe, expect, it } from "vitest";
import {
  PUBLIC_IMAGE_MAX_AGE_SECONDS,
  PUBLIC_INVENTORY_CACHE_TAG,
  PUBLIC_INVENTORY_REVALIDATE_SECONDS,
} from "@/lib/public-cache";
import { hasSupabaseSessionCookie, isSupabaseAuthCookieName } from "@/lib/session-cookie";
import { publicImageCacheControl } from "@/lib/vehicle-image-delivery";

describe("public cache policy", () => {
  it("keeps a short catalog revalidate window and a named invalidation tag", () => {
    expect(PUBLIC_INVENTORY_REVALIDATE_SECONDS).toBe(60);
    expect(PUBLIC_INVENTORY_CACHE_TAG).toBe("public-inventory");
    expect(PUBLIC_IMAGE_MAX_AGE_SECONDS).toBeGreaterThanOrEqual(3600);
  });

  it("caches published proxy images longer than drafts", () => {
    expect(publicImageCacheControl("allow")).toContain("public");
    expect(publicImageCacheControl("allow")).toContain(`max-age=${PUBLIC_IMAGE_MAX_AGE_SECONDS}`);
    expect(publicImageCacheControl("deny")).toBe("private, no-store");
  });
});

describe("middleware session cookie detection", () => {
  it("recognizes supabase auth cookies without treating empty values as a session", () => {
    expect(isSupabaseAuthCookieName("sb-xxxx-auth-token")).toBe(true);
    expect(isSupabaseAuthCookieName("sb-xxxx-auth-token.0")).toBe(true);
    expect(isSupabaseAuthCookieName("theme")).toBe(false);
    expect(
      hasSupabaseSessionCookie([
        { name: "sb-demo-auth-token", value: "" },
        { name: "other", value: "1" },
      ]),
    ).toBe(false);
    expect(
      hasSupabaseSessionCookie([{ name: "sb-demo-auth-token", value: "jwt" }]),
    ).toBe(true);
  });
});
