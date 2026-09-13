export const VEHICLE_PHOTOS_BUCKET = "vehiculos-fotos";
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_VEHICLE_PHOTOS = 80;

export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export function isWorkshopPhoto(url: string) {
  return url.includes(`/storage/v1/object/public/${VEHICLE_PHOTOS_BUCKET}/`);
}

export function storagePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${VEHICLE_PHOTOS_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0] ?? "");
}

export function photoFolder(vehicleId?: string, draftId?: string) {
  if (vehicleId) {
    return `${vehicleId}/taller`;
  }

  return `pending/${draftId ?? "nuevo"}/taller`;
}

export function validatePhotoFile(file: File) {
  if (
    !ALLOWED_PHOTO_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_PHOTO_MIME_TYPES)[number],
    )
  ) {
    return "Solo se permiten imágenes JPG, PNG, WEBP o GIF.";
  }

  if (file.size > MAX_PHOTO_BYTES) {
    return "Cada foto debe pesar menos de 10 MB.";
  }

  return null;
}

export function sanitizePhotoName(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension
    : "jpg";
  return `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
}
