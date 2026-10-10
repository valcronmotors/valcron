import type { VehiclePhotoRow } from "@/lib/website-schema";
import { canPublicReadPhoto } from "@/lib/storage-access";
import {
  ADMIN_VEHICLE_IMAGE_ROUTE,
  PUBLIC_VEHICLE_IMAGE_ROUTE,
  parseVehicleStoragePath,
  vehicleImageAdminPath,
  vehicleImagePublicPath,
  vehicleImagePublicUrl,
} from "@/lib/vehicle-image-delivery";

export const VEHICLE_PHOTOS_BUCKET = "vehicle-images";
export const MAX_PHOTO_BYTES = 50 * 1024 * 1024;
export const MAX_VEHICLE_PHOTOS = 40;

export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/gif",
  "image/bmp", "image/heic", "image/heif", "image/tiff",
] as const;

const PHOTO_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", pjg: "image/jpeg", jfif: "image/jpeg",
  png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif",
  bmp: "image/bmp", heic: "image/heic", heif: "image/heif", tif: "image/tiff", tiff: "image/tiff",
};

export const PHOTO_FILE_ACCEPT = [...ALLOWED_PHOTO_MIME_TYPES, ...Object.keys(PHOTO_EXTENSIONS).map((ext) => `.${ext}`)].join(",");
export const PHOTO_FORMAT_HINT =
  "JPG, PNG, WebP, AVIF, GIF, BMP, HEIC/HEIF y TIFF · hasta 50 MB por foto · hasta 40 fotos. Se optimizan automáticamente.";

export function photoMimeType(file: Pick<File, "type"> & { name?: string }) {
  const type = file.type.toLowerCase().split(";")[0].trim();
  const aliases: Record<string, string> = { "image/jpg": "image/jpeg", "image/pjpeg": "image/jpeg", "image/x-png": "image/png", "image/x-ms-bmp": "image/bmp", "image/x-tiff": "image/tiff" };
  const normalized = aliases[type] ?? type;
  if (ALLOWED_PHOTO_MIME_TYPES.includes(normalized as (typeof ALLOWED_PHOTO_MIME_TYPES)[number])) return normalized;
  if (!type || type === "application/octet-stream") return PHOTO_EXTENSIONS[file.name?.split(".").pop()?.toLowerCase() ?? ""] ?? "";
  return "";
}

export {
  canPublicReadPhoto,
  ADMIN_VEHICLE_IMAGE_ROUTE,
  PUBLIC_VEHICLE_IMAGE_ROUTE,
  parseVehicleStoragePath,
  vehicleImageAdminPath,
  vehicleImagePublicPath,
  vehicleImagePublicUrl,
};

export function isVehicleImageUrl(url: string) {
  return (
    url.includes(`${PUBLIC_VEHICLE_IMAGE_ROUTE}/`) ||
    url.includes(`${ADMIN_VEHICLE_IMAGE_ROUTE}/`) ||
    url.includes(`/storage/v1/object/public/${VEHICLE_PHOTOS_BUCKET}/`)
  );
}

export function isWorkshopPhoto(url: string) {
  return isVehicleImageUrl(url);
}

export function storagePathFromPublicUrl(url: string) {
  const markers = [
    `${PUBLIC_VEHICLE_IMAGE_ROUTE}/`,
    `${ADMIN_VEHICLE_IMAGE_ROUTE}/`,
    `/storage/v1/object/public/${VEHICLE_PHOTOS_BUCKET}/`,
  ];
  for (const marker of markers) {
    const index = url.indexOf(marker);
    if (index === -1) {
      continue;
    }
    const rest = decodeURIComponent(url.slice(index + marker.length).split("?")[0] ?? "");
    const parsed = parseVehicleStoragePath(rest);
    if ("path" in parsed) {
      return parsed.path;
    }
  }
  const parsed = parseVehicleStoragePath(url);
  return "path" in parsed ? parsed.path : null;
}

export function photoFolder(vehicleId: string) {
  return vehicleId;
}

export function validatePhotoFile(file: Pick<File, "type" | "size"> & { name?: string }) {
  if (!photoMimeType(file)) return "Selecciona una foto JPG, PNG, WebP, AVIF, GIF, BMP, HEIC/HEIF o TIFF.";
  if (!file.size) return "La foto está vacía. Selecciona el archivo original.";
  if (file.size > MAX_PHOTO_BYTES) return "Cada foto puede pesar hasta 50 MB.";
  return null;
}

export function sanitizePhotoName(file: Pick<File, "name" | "type">) {
  const extension = file.name.split(".").pop()?.toLowerCase() || mimeExtension(file.type);
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : mimeExtension(file.type);
  return `${crypto.randomUUID()}.${safeExt}`;
}

function mimeExtension(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export function sortVehiclePhotos(photos: VehiclePhotoRow[]) {
  return [...photos].sort((a, b) => {
    if (a.is_cover !== b.is_cover) {
      return a.is_cover ? -1 : 1;
    }
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return a.created_at.localeCompare(b.created_at);
  });
}

export function ensureSingleCover(photos: Array<Pick<VehiclePhotoRow, "id" | "is_cover" | "sort_order">>) {
  const ordered = [...photos].sort((a, b) => a.sort_order - b.sort_order);
  const cover = ordered.find((photo) => photo.is_cover) ?? ordered[0];
  return ordered.map((photo) => ({
    ...photo,
    is_cover: cover ? photo.id === cover.id : false,
  }));
}
