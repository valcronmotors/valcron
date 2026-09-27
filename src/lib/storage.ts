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
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_VEHICLE_PHOTOS = 40;

export const ALLOWED_PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

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

export function validatePhotoFile(file: Pick<File, "type" | "size">) {
  if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_MIME_TYPES)[number])) {
    return "Solo se permiten imágenes JPEG, PNG o WebP.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Cada foto debe pesar menos de 8 MB.";
  }
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
