import { publicActionError } from "@/lib/action-errors";
import { createClient } from "@/utils/supabase/client";
import { preparePhoto } from "@/lib/prepare-photo";
import {
  MAX_VEHICLE_PHOTOS,
  VEHICLE_PHOTOS_BUCKET,
  photoFolder,
  sanitizePhotoName,
  storagePathFromPublicUrl,
  vehicleImageAdminPath,
} from "@/lib/storage";

export type PhotoUploadResult = {
  paths: string[];
  fileIndexes?: number[];
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
  const supabase = createClient();
  const folder = photoFolder(options.vehicleId);
  const paths: string[] = [];
  const errors: string[] = [];
  const fileIndexes: number[] = [];

  for (const [index, file] of selected.entries()) {
    try {
      const prepared = await preparePhoto(file);
      const path = `${folder}/${sanitizePhotoName(prepared)}`;
      const { error } = await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).upload(path, prepared, {
        cacheControl: "3600",
        upsert: false,
        contentType: prepared.type,
      });
      if (error) {
        errors.push(`${file.name}: ${publicActionError(error, "No se pudo subir la foto. Revisa tu sesión y conexión.")}`);
        continue;
      }
      paths.push(path);
      fileIndexes.push(index);
    } catch {
      errors.push(`${file.name}: no se pudo procesar o subir esta foto. Reintenta con el archivo original.`);
    }
  }
  return { paths, fileIndexes, urls: paths.map(vehicleImageAdminPath), error: errors.length ? errors.join(" ") : null };
}

export async function removeStoredPhoto(storagePathOrUrl: string) {
  const path = storagePathFromPublicUrl(storagePathOrUrl) ?? storagePathOrUrl;
  if (!path) {
    return;
  }
  const supabase = createClient();
  await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).remove([path]);
}
