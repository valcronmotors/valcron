import { describe, expect, it } from "vitest";
import { isWebsiteAdminClaims } from "@/lib/auth-role";
import {
  canPublicReadPhoto,
  ensureSingleCover,
  sortVehiclePhotos,
} from "@/lib/storage";
import {
  canPublishVehicleStatus,
  isPublicCatalogListing,
  isPublicDetailListing,
  isPubliclyVisible,
} from "@/lib/website-schema";

describe("published inventory gate", () => {
  it("requires published=true even when status is available", () => {
    expect(isPubliclyVisible({ published: false, status: "available" })).toBe(false);
    expect(isPublicCatalogListing({ published: false, status: "available" })).toBe(false);
    expect(isPubliclyVisible({ published: true, status: "available" })).toBe(true);
  });

  it("hides drafts from the public", () => {
    expect(isPubliclyVisible({ published: true, status: "draft" })).toBe(false);
    expect(isPubliclyVisible({ published: false, status: "draft" })).toBe(false);
    expect(canPublishVehicleStatus("draft")).toBe(false);
  });

  it("hides hidden vehicles from the public", () => {
    expect(isPubliclyVisible({ published: false, status: "hidden" })).toBe(false);
    expect(isPubliclyVisible({ published: true, status: "hidden" })).toBe(false);
  });

  it("treats reserved as catalog-visible only when published", () => {
    expect(isPublicCatalogListing({ published: true, status: "reserved" })).toBe(true);
    expect(isPublicDetailListing({ published: true, status: "reserved" })).toBe(true);
    expect(isPublicCatalogListing({ published: false, status: "reserved" })).toBe(false);
  });

  it("keeps sold off the catalog list but allows a published detail permalink", () => {
    expect(isPublicCatalogListing({ published: true, status: "sold" })).toBe(false);
    expect(isPublicDetailListing({ published: true, status: "sold" })).toBe(true);
    expect(isPublicDetailListing({ published: false, status: "sold" })).toBe(false);
  });
});

describe("photo cover and order", () => {
  it("sorts cover first then sort_order", () => {
    const sorted = sortVehiclePhotos([
      {
        id: "b",
        vehicle_id: "v1",
        storage_path: "v1/b.jpg",
        sort_order: 0,
        is_cover: false,
        alt_text: null,
        created_at: "2026-01-02T00:00:00.000Z",
      },
      {
        id: "a",
        vehicle_id: "v1",
        storage_path: "v1/a.jpg",
        sort_order: 1,
        is_cover: true,
        alt_text: null,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ]);
    expect(sorted.map((photo) => photo.id)).toEqual(["a", "b"]);
  });

  it("keeps a single cover", () => {
    const result = ensureSingleCover([
      { id: "1", is_cover: true, sort_order: 0 },
      { id: "2", is_cover: true, sort_order: 1 },
    ]);
    expect(result.filter((photo) => photo.is_cover)).toHaveLength(1);
    expect(result[0]?.is_cover).toBe(true);
  });

  it("denies public photo reads for unpublished vehicles", () => {
    expect(canPublicReadPhoto({ vehiclePublished: false, vehicleStatus: "available" })).toBe(false);
    expect(canPublicReadPhoto({ vehiclePublished: true, vehicleStatus: "draft" })).toBe(false);
    expect(canPublicReadPhoto({ vehiclePublished: true, vehicleStatus: "available" })).toBe(true);
  });
});

describe("admin role requirement", () => {
  it("accepts only app_metadata.role admin", () => {
    expect(isWebsiteAdminClaims({ app_metadata: { role: "admin" } })).toBe(true);
    expect(isWebsiteAdminClaims({ role: "authenticated" })).toBe(false);
    expect(isWebsiteAdminClaims({ app_metadata: { role: "authenticated" } })).toBe(false);
    expect(isWebsiteAdminClaims({ app_metadata: { role: "vendedor" } })).toBe(false);
    expect(isWebsiteAdminClaims({ user_metadata: { role: "admin" } })).toBe(false);
    expect(isWebsiteAdminClaims(null)).toBe(false);
  });
});
