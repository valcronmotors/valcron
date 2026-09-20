import { getFeaturedVehicles, getPublicVehicles } from "@/lib/vehicles/adapter";
import { publicJson, publicOptions } from "@/lib/public-catalog";
import type { VehicleAvailability, VehicleSort, VehicleSource } from "@/types/vehicle";

export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

function numberParam(value: string | null) {
  const amount = Number(value ?? "");
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("featured") === "1") {
    const featured = await getFeaturedVehicles(4);
    if (featured.error) {
      return publicJson(request, { error: featured.error }, 500);
    }
    return publicJson(
      request,
      { data: featured.data, pagination: { page: 1, limit: 4, total: featured.data.length, totalPages: 1 }, meta: { generatedAt: new Date().toISOString() } },
      200,
    );
  }

  const listing = url.searchParams.get("listing")?.trim() ?? "";
  const availabilityParam = url.searchParams.get("availability")?.trim() ?? "";
  const availability: VehicleAvailability | "all" | undefined =
    availabilityParam === "available_rd" ||
    availabilityParam === "auction" ||
    availabilityParam === "in_transit" ||
    availabilityParam === "sold"
      ? availabilityParam
      : listing === "dealer"
        ? "available_rd"
        : listing === "auction" || listing === "subasta"
          ? "auction"
          : listing === "transit"
            ? "in_transit"
            : "all";

  const result = await getPublicVehicles({
    q: (url.searchParams.get("q") ?? url.searchParams.get("vin") ?? "").trim() || undefined,
    make: url.searchParams.get("marca")?.trim() || undefined,
    model: url.searchParams.get("modelo")?.trim() || undefined,
    source: (url.searchParams.get("fuente")?.trim() || undefined) as VehicleSource | undefined,
    availability,
    year: numberParam(url.searchParams.get("ano")),
    yearMin: numberParam(url.searchParams.get("anoMin") ?? url.searchParams.get("anoDesde")),
    yearMax: numberParam(url.searchParams.get("anoMax") ?? url.searchParams.get("anoHasta")),
    priceMinUsd: numberParam(url.searchParams.get("precioMin")),
    priceMaxUsd: numberParam(url.searchParams.get("precioMax")),
    sort: (url.searchParams.get("orden")?.trim() || "recent") as VehicleSort,
    page: numberParam(url.searchParams.get("page")) ?? 1,
    limit: numberParam(url.searchParams.get("limit")) ?? 12,
  });

  if (result.error) {
    return publicJson(request, { error: result.error }, 500);
  }

  return publicJson(
    request,
    {
      data: result.data,
      pagination: result.pagination,
      facets: result.facets,
      meta: { generatedAt: new Date().toISOString() },
    },
    200,
  );
}
