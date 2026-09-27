import { PUBLIC_IMAGE_MAX_AGE_SECONDS, PUBLIC_IMAGE_S_MAXAGE_SECONDS } from "@/lib/public-cache";
import { SITE } from "@/lib/site";
import { canPublicReadPhoto } from "@/lib/storage-access";

export const VEHICLE_PHOTOS_BUCKET = "vehicle-images";
export const PUBLIC_VEHICLE_IMAGE_ROUTE = "/api/public/vehicle-images";
export const ADMIN_VEHICLE_IMAGE_ROUTE = "/api/admin/vehicle-images";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_RE = /^[a-z0-9][a-z0-9._-]{0,120}\.(jpe?g|png|webp)$/i;

export type VehicleImageAccess = "allow" | "deny";

export function parseVehicleStoragePath(input: string): { path: string } | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: "empty" };
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return { error: "invalid" };
  }

  const normalized = decoded.replace(/\\/g, "/").replace(/^\/+/, "");
  if (
    normalized.includes("..") ||
    normalized.includes("//") ||
    normalized.includes("\0") ||
    normalized.startsWith("/") ||
    /[:?#]/.test(normalized)
  ) {
    return { error: "invalid" };
  }

  const parts = normalized.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return { error: "invalid" };
  }

  const [folder, file] = parts;
  if (!folder || !file || !UUID_RE.test(folder) || !FILE_RE.test(file)) {
    return { error: "invalid" };
  }

  return { path: `${folder}/${file}` };
}

export function vehicleImagePublicPath(storagePath: string) {
  const parsed = parseVehicleStoragePath(storagePath);
  if ("error" in parsed) {
    return "";
  }
  return `${PUBLIC_VEHICLE_IMAGE_ROUTE}/${parsed.path}`;
}

export function vehicleImageAdminPath(storagePath: string) {
  const parsed = parseVehicleStoragePath(storagePath);
  if ("error" in parsed) {
    return "";
  }
  return `${ADMIN_VEHICLE_IMAGE_ROUTE}/${parsed.path}`;
}

export function vehicleImagePublicUrl(storagePath: string) {
  const path = vehicleImagePublicPath(storagePath);
  return path ? `${SITE.url}${path}` : "";
}

export function authorizePublicVehicleImage(input: {
  pathValid: boolean;
  vehiclePublished: boolean;
  vehicleStatus: string;
  usesAnonClient: boolean;
  usesServiceRole: boolean;
  usesUserCookies: boolean;
}): VehicleImageAccess {
  if (!input.pathValid) return "deny";
  if (input.usesServiceRole || input.usesUserCookies || !input.usesAnonClient) {
    return "deny";
  }
  return canPublicReadPhoto({
    vehiclePublished: input.vehiclePublished,
    vehicleStatus: input.vehicleStatus,
  })
    ? "allow"
    : "deny";
}

export function authorizeAdminVehicleImagePreview(input: {
  isAdmin: boolean;
  pathValid: boolean;
}): VehicleImageAccess {
  return input.isAdmin && input.pathValid ? "allow" : "deny";
}

export function publicImageCacheControl(access: VehicleImageAccess) {
  return access === "allow"
    ? `public, max-age=${PUBLIC_IMAGE_MAX_AGE_SECONDS}, s-maxage=${PUBLIC_IMAGE_S_MAXAGE_SECONDS}, stale-while-revalidate=604800`
    : "private, no-store";
}

export function shouldUseNextImageOptimizer(src: string) {
  return (
    !src.startsWith(`${PUBLIC_VEHICLE_IMAGE_ROUTE}/`) &&
    !src.startsWith(`${ADMIN_VEHICLE_IMAGE_ROUTE}/`)
  );
}

export function unpublishImageBehavior() {
  return {
    storageObjects: "keep",
    publicAccess: "deny" as const,
    adminPreview: "allow" as const,
  };
}

export function soldImageBehavior(published: boolean) {
  return {
    catalogList: "hide" as const,
    detailPermalink: published ? ("allow" as const) : ("deny" as const),
    publicAccess: authorizePublicVehicleImage({
      pathValid: true,
      vehiclePublished: published,
      vehicleStatus: "sold",
      usesAnonClient: true,
      usesServiceRole: false,
      usesUserCookies: false,
    }),
  };
}

export function vehicleDeleteCleanupPlan() {
  return {
    databasePhotos: "cascade",
    storageObjects: "delete_folder_and_recorded_paths",
  } as const;
}

export function mergeVehicleStoragePaths(
  vehicleId: string,
  photoPaths: string[],
  listedFileNames: string[],
) {
  const paths = new Set<string>();
  for (const value of photoPaths) {
    const parsed = parseVehicleStoragePath(value);
    if ("path" in parsed) {
      paths.add(parsed.path);
    }
  }
  for (const name of listedFileNames) {
    const parsed = parseVehicleStoragePath(`${vehicleId}/${name}`);
    if ("path" in parsed) {
      paths.add(parsed.path);
    }
  }
  return [...paths];
}

export function mimeFromStoragePath(path: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function publicImageRouteConfig() {
  return {
    route: PUBLIC_VEHICLE_IMAGE_ROUTE,
    usesAnonClient: true,
    usesServiceRole: false,
    usesUserCookies: false,
  } as const;
}
