import { describe, expect, it } from "vitest";
import {
  ADMIN_VEHICLE_IMAGE_ROUTE,
  PUBLIC_VEHICLE_IMAGE_ROUTE,
  authorizeAdminVehicleImagePreview,
  authorizePublicVehicleImage,
  mergeVehicleStoragePaths,
  parseVehicleStoragePath,
  publicImageCacheControl,
  publicImageRouteConfig,
  shouldUseNextImageOptimizer,
  soldImageBehavior,
  unpublishImageBehavior,
  vehicleDeleteCleanupPlan,
  vehicleImageAdminPath,
  vehicleImagePublicPath,
  vehicleImagePublicUrl,
} from "@/lib/vehicle-image-delivery";

const VEHICLE_ID = "11111111-1111-4111-8111-111111111111";
const FILE = "22222222-2222-4222-8222-222222222222.webp";
const PATH = `${VEHICLE_ID}/${FILE}`;

describe("public image route path validation", () => {
  it("accepts uuid folder plus uuid filename", () => {
    expect(parseVehicleStoragePath(PATH)).toEqual({ path: PATH });
    expect(parseVehicleStoragePath(`/${PATH}`)).toEqual({ path: PATH });
  });

  it("rejects traversal and extra segments", () => {
    expect(parseVehicleStoragePath(`${VEHICLE_ID}/../secret.webp`)).toEqual({ error: "invalid" });
    expect(parseVehicleStoragePath(`${VEHICLE_ID}/%2e%2e/${FILE}`)).toEqual({ error: "invalid" });
    expect(parseVehicleStoragePath(`${VEHICLE_ID}/${FILE}/extra`)).toEqual({ error: "invalid" });
    expect(parseVehicleStoragePath("not-a-uuid/file.webp")).toEqual({ error: "invalid" });
    expect(parseVehicleStoragePath(`${VEHICLE_ID}/cover.exe`)).toEqual({ error: "invalid" });
  });
});

describe("draft image inaccessible publicly", () => {
  it("denies draft and unpublished photos even with a valid path", () => {
    expect(
      authorizePublicVehicleImage({
        pathValid: true,
        vehiclePublished: false,
        vehicleStatus: "draft",
        usesAnonClient: true,
        usesServiceRole: false,
        usesUserCookies: false,
      }),
    ).toBe("deny");
    expect(
      authorizePublicVehicleImage({
        pathValid: true,
        vehiclePublished: false,
        vehicleStatus: "available",
        usesAnonClient: true,
        usesServiceRole: false,
        usesUserCookies: false,
      }),
    ).toBe("deny");
    expect(vehicleImagePublicPath(PATH)).toBe(`${PUBLIC_VEHICLE_IMAGE_ROUTE}/${PATH}`);
    expect(vehicleImagePublicUrl(PATH)).toContain(PUBLIC_VEHICLE_IMAGE_ROUTE);
    expect(vehicleImagePublicUrl(PATH)).not.toContain("/storage/v1/object/public/");
  });
});

describe("published image accessible", () => {
  it("allows published available photos only through the anon proxy", () => {
    expect(
      authorizePublicVehicleImage({
        pathValid: true,
        vehiclePublished: true,
        vehicleStatus: "available",
        usesAnonClient: true,
        usesServiceRole: false,
        usesUserCookies: false,
      }),
    ).toBe("allow");
    expect(publicImageCacheControl("allow")).toContain("public");
  });

  it("fails closed if the public route would use cookies or service role", () => {
    const published = {
      pathValid: true,
      vehiclePublished: true,
      vehicleStatus: "available" as const,
      usesAnonClient: true,
      usesServiceRole: false,
      usesUserCookies: false,
    };
    expect(authorizePublicVehicleImage({ ...published, usesUserCookies: true })).toBe("deny");
    expect(authorizePublicVehicleImage({ ...published, usesServiceRole: true })).toBe("deny");
    expect(authorizePublicVehicleImage({ ...published, usesAnonClient: false })).toBe("deny");
    expect(publicImageRouteConfig()).toEqual({
      route: PUBLIC_VEHICLE_IMAGE_ROUTE,
      usesAnonClient: true,
      usesServiceRole: false,
      usesUserCookies: false,
    });
  });
});

describe("unpublish behavior", () => {
  it("keeps storage objects and denies public access", () => {
    expect(unpublishImageBehavior()).toEqual({
      storageObjects: "keep",
      publicAccess: "deny",
      adminPreview: "allow",
    });
    expect(
      authorizePublicVehicleImage({
        pathValid: true,
        vehiclePublished: false,
        vehicleStatus: "available",
        usesAnonClient: true,
        usesServiceRole: false,
        usesUserCookies: false,
      }),
    ).toBe("deny");
    expect(publicImageCacheControl("deny")).toContain("no-store");
  });
});

describe("sold behavior", () => {
  it("keeps published sold photos publicly retrievable", () => {
    expect(soldImageBehavior(true)).toEqual({
      catalogList: "hide",
      detailPermalink: "allow",
      publicAccess: "allow",
    });
    expect(soldImageBehavior(false).publicAccess).toBe("deny");
  });
});

describe("delete cleanup", () => {
  it("cascades photo rows and deletes recorded plus leftover folder objects", () => {
    expect(vehicleDeleteCleanupPlan()).toEqual({
      databasePhotos: "cascade",
      storageObjects: "delete_folder_and_recorded_paths",
    });
    expect(
      mergeVehicleStoragePaths(
        VEHICLE_ID,
        [PATH, "skip-me"],
        [FILE, "33333333-3333-4333-8333-333333333333.jpg"],
      ),
    ).toEqual([
      PATH,
      `${VEHICLE_ID}/33333333-3333-4333-8333-333333333333.jpg`,
    ]);
  });
});

describe("admin preview", () => {
  it("allows admin preview of unpublished photos on the admin route", () => {
    expect(
      authorizeAdminVehicleImagePreview({
        isAdmin: true,
        pathValid: true,
      }),
    ).toBe("allow");
    expect(
      authorizeAdminVehicleImagePreview({
        isAdmin: false,
        pathValid: true,
      }),
    ).toBe("deny");
    expect(vehicleImageAdminPath(PATH)).toBe(`${ADMIN_VEHICLE_IMAGE_ROUTE}/${PATH}`);
    expect(vehicleImageAdminPath(PATH)).not.toBe(vehicleImagePublicPath(PATH));
  });
});

describe("Vercel image optimizer", () => {
  it("skips Next/Image transformations for vehicle proxy URLs", () => {
    expect(shouldUseNextImageOptimizer(vehicleImagePublicPath(PATH))).toBe(false);
    expect(shouldUseNextImageOptimizer(vehicleImageAdminPath(PATH))).toBe(false);
    expect(shouldUseNextImageOptimizer("/branding/valcron-logo-light.webp")).toBe(true);
    expect(shouldUseNextImageOptimizer("https://images.unsplash.com/photo.jpg")).toBe(true);
  });
});
