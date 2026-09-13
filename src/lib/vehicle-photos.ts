import { createClient } from "@/utils/supabase/client";
import {
  MAX_VEHICLE_PHOTOS,
  VEHICLE_PHOTOS_BUCKET,
  photoFolder,
  sanitizePhotoName,
  storagePathFromPublicUrl,
  validatePhotoFile,
} from "@/lib/storage";

export async function uploadVehiclePhotos(
  files: File[],
  options: { vehicleId?: string; draftId: string; currentCount: number },
) {
  if (files.length === 0) {
    return { urls: [] as string[], error: null as string | null };
  }

  const remaining = MAX_VEHICLE_PHOTOS - options.currentCount;
  if (remaining <= 0) {
    return {
      urls: [] as string[],
      error: `El vehículo ya tiene el máximo de ${MAX_VEHICLE_PHOTOS} fotos.`,
    };
  }

  const selected = files.slice(0, remaining);
  for (const file of selected) {
    const invalid = validatePhotoFile(file);
    if (invalid) {
      return { urls: [] as string[], error: invalid };
    }
  }

  const supabase = createClient();
  const folder = photoFolder(options.vehicleId, options.draftId);
  const urls: string[] = [];

  for (const file of selected) {
    const path = `${folder}/${sanitizePhotoName(file)}`;
    const { error } = await supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      return {
        urls,
        error: error.message || "No se pudo subir la foto al almacenamiento.",
      };
    }

    const { data } = supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls, error: null as string | null };
}

export async function removeStoredPhoto(url: string) {
  const path = storagePathFromPublicUrl(url);
  if (!path) {
    return;
  }

  const supabase = createClient();
  await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).remove([path]);
}
