import type { SupabaseClient } from "@supabase/supabase-js";
import { VEHICLE_PHOTOS_BUCKET } from "@/lib/storage";

export async function loadVehicleImageBlob(supabase: SupabaseClient, path: string) {
  const downloaded = await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).download(path);
  if (downloaded.data) {
    return downloaded.data;
  }

  const signed = await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).createSignedUrl(path, 30);
  if (!signed.data?.signedUrl) {
    return null;
  }

  const response = await fetch(signed.data.signedUrl);
  if (!response.ok) {
    return null;
  }

  return response.blob();
}
