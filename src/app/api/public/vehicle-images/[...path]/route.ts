import { canPublicReadPhoto } from "@/lib/storage-access";
import { loadVehicleImageBlob } from "@/lib/load-vehicle-image";
import {
  mimeFromStoragePath,
  parseVehicleStoragePath,
  publicImageCacheControl,
} from "@/lib/vehicle-image-delivery";
import { createAnonClient } from "@/utils/supabase/anon";


function deny() {
  return new Response(null, {
    status: 404,
    headers: {
      "Cache-Control": publicImageCacheControl("deny"),
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const parsed = parseVehicleStoragePath((segments ?? []).join("/"));
  if ("error" in parsed) {
    return deny();
  }

  const supabase = createAnonClient();
  const { data: photo } = await supabase
    .from("vehicle_photos")
    .select("storage_path, vehicles ( published, status )")
    .eq("storage_path", parsed.path)
    .maybeSingle();

  const vehicle = Array.isArray(photo?.vehicles) ? photo.vehicles[0] : photo?.vehicles;
  if (
    !photo ||
    !vehicle ||
    !canPublicReadPhoto({
      vehiclePublished: Boolean(vehicle.published),
      vehicleStatus: String(vehicle.status ?? ""),
    })
  ) {
    return deny();
  }

  const file = await loadVehicleImageBlob(supabase, parsed.path);
  if (!file) {
    return deny();
  }

  return new Response(file.stream(), {
    status: 200,
    headers: {
      "Content-Type": file.type || mimeFromStoragePath(parsed.path),
      "Cache-Control": publicImageCacheControl("allow"),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
