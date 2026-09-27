import { getAdminClaims } from "@/lib/auth";
import { isWebsiteAdminClaims } from "@/lib/auth-role";
import { loadVehicleImageBlob } from "@/lib/load-vehicle-image";
import {
  authorizeAdminVehicleImagePreview,
  mimeFromStoragePath,
  parseVehicleStoragePath,
} from "@/lib/vehicle-image-delivery";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

function deny(status = 404) {
  return new Response(null, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const claims = await getAdminClaims();
  const { path: segments } = await context.params;
  const parsed = parseVehicleStoragePath((segments ?? []).join("/"));
  const access = authorizeAdminVehicleImagePreview({
    isAdmin: isWebsiteAdminClaims(claims),
    pathValid: !("error" in parsed),
  });

  if (access !== "allow" || "error" in parsed) {
    return deny(isWebsiteAdminClaims(claims) ? 404 : 401);
  }

  const supabase = await createClient();
  const file = await loadVehicleImageBlob(supabase, parsed.path);
  if (!file) {
    return deny(404);
  }

  return new Response(file.stream(), {
    status: 200,
    headers: {
      "Content-Type": file.type || mimeFromStoragePath(parsed.path),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
