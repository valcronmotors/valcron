import { publicActionError } from "@/lib/action-errors";
import {
  clientIpFromRequest,
  inquiryAbuseGuard,
  inquiryFingerprint,
  inquiryIpGuard,
  isInquiryHoneypot,
} from "@/lib/inquiry-abuse";
import { validatePublicInquiry } from "@/lib/inquiries";
import { publicJson, publicOptions } from "@/lib/public-catalog";
import { isPubliclyVisible, type VehicleRow } from "@/lib/website-schema";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return publicJson(request, { error: "No se pudo leer la solicitud." }, 400);
  }

  if (isInquiryHoneypot(body.empresa ?? body.company ?? body.website)) {
    return publicJson(request, { data: { received: true } }, 201);
  }

  const parsed = validatePublicInquiry({
    name: body.nombre ?? body.name,
    phone: body.telefono ?? body.phone,
    email: body.email,
    message: body.mensaje ?? body.message,
    vehicleId: body.vehiculoId ?? body.vehiculo_id ?? body.vehicleId,
    auctionOpportunityId: body.auctionOpportunityId ?? body.auction_opportunity_id,
    source: body.source ?? "web",
  });

  if (!parsed.data) {
    return publicJson(request, { error: parsed.error }, 400);
  }

  const fingerprint = inquiryFingerprint({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    vehicleId: parsed.data.vehicle_id,
  });
  const ip = clientIpFromRequest(request);
  const ipLimit = inquiryIpGuard(ip);
  if (!ipLimit.ok) {
    return publicJson(request, { error: ipLimit.error }, 429);
  }
  const abuse = inquiryAbuseGuard(fingerprint);
  if (!abuse.ok) {
    return publicJson(request, { error: abuse.error }, 429);
  }

  const supabase = await createClient();

  if (parsed.data.vehicle_id) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id, published, status")
      .eq("id", parsed.data.vehicle_id)
      .maybeSingle();
    const row = vehicle as Pick<VehicleRow, "id" | "published" | "status"> | null;
    if (!row || !isPubliclyVisible(row)) {
      parsed.data.vehicle_id = null;
    }
  }

  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  let duplicateQuery = supabase
    .from("inquiries")
    .select("id")
    .eq("name", parsed.data.name)
    .gte("created_at", since)
    .limit(1);
  if (parsed.data.email) {
    duplicateQuery = duplicateQuery.eq("email", parsed.data.email);
  } else if (parsed.data.phone) {
    duplicateQuery = duplicateQuery.eq("phone", parsed.data.phone);
  }
  if (parsed.data.vehicle_id) {
    duplicateQuery = duplicateQuery.eq("vehicle_id", parsed.data.vehicle_id);
  }
  const { data: recent } = await duplicateQuery;
  if (recent && recent.length > 0) {
    return publicJson(request, { error: "Ya recibimos una solicitud similar. Te contactaremos pronto." }, 429);
  }

  const vin = String(body.vin ?? "").trim().toUpperCase();
  const message = [parsed.data.message, vin ? `VIN consultado: ${vin}` : null]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("inquiries").insert({
    ...parsed.data,
    message: message || null,
  });

  if (error) {
    console.error("public inquiry insert failed", error.code ?? "unknown");
    return publicJson(request, { error: publicActionError(error, "No se pudo enviar la solicitud.") }, 500);
  }

  return publicJson(request, { data: { received: true } }, 201);
}
