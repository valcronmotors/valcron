import { publicActionError } from "@/lib/action-errors";
import { createClient } from "@/utils/supabase/client";
import {
  MAX_VEHICLE_PHOTOS,
  VEHICLE_PHOTOS_BUCKET,
  photoFolder,
  sanitizePhotoName,
  storagePathFromPublicUrl,
  validatePhotoFile,
  vehicleImageAdminPath,
} from "@/lib/storage";

export type PhotoUploadResult = {
  paths: string[];
  urls: string[];
  error: string | null;
};

export async function uploadVehiclePhotos(
  files: File[],
  options: { vehicleId?: string; currentCount: number },
): Promise<PhotoUploadResult> {
  if (!options.vehicleId) {
    return { paths: [], urls: [], error: "Guarda el vehículo antes de subir fotos." };
  }
  if (files.length === 0) {
    return { paths: [], urls: [], error: null };
  }

  const remaining = MAX_VEHICLE_PHOTOS - options.currentCount;
  if (remaining <= 0) {
    return {
      paths: [],
      urls: [],
      error: `El vehículo ya tiene el máximo de ${MAX_VEHICLE_PHOTOS} fotos.`,
    };
  }

  const selected = files.slice(0, remaining);
  for (const file of selected) {
    const invalid = validatePhotoFile(file);
    if (invalid) {
      return { paths: [], urls: [], error: invalid };
    }
  }

  const supabase = createClient();
  const folder = photoFolder(options.vehicleId);
  const paths: string[] = [];

  for (const file of selected) {
    const path = `${folder}/${sanitizePhotoName(file)}`;
    const { error } = await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (error) {
      return {
        paths,
        urls: paths.map(vehicleImageAdminPath),
        error: publicActionError(error, "No se pudo subir la foto al almacenamiento."),
      };
    }

    paths.push(path);
  }

  return { paths, urls: paths.map(vehicleImageAdminPath), error: null };
}

export async function removeStoredPhoto(storagePathOrUrl: string) {
  const path = storagePathFromPublicUrl(storagePathOrUrl) ?? storagePathOrUrl;
  if (!path) {
    return;
  }
  const supabase = createClient();
  await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).remove([path]);
}
