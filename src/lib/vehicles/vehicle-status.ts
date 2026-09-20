import type {
  AuctionPlatform,
  PublicVehicle,
  PublicVehicleRow,
  VehicleAvailability,
  VehicleSource,
} from "@/types/vehicle";

export function normalizeAuctionPlatform(value: string | null | undefined): AuctionPlatform | null {
  const fuente = (value ?? "").trim().toLowerCase();
  if (fuente === "copart") return "copart";
  if (fuente === "iaa" || fuente === "iaai") return "iaai";
  if (fuente === "manheim") return "manheim";
  if (!fuente) return null;
  return "other";
}

export function isAuctionSource(value: string | null | undefined) {
  const platform = normalizeAuctionPlatform(value);
  return platform === "copart" || platform === "iaai" || platform === "manheim";
}

export function vehicleSourceFromRow(row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">): VehicleSource {
  const platform = normalizeAuctionPlatform(row.fuente_subasta);
  if (platform === "copart" || platform === "iaai" || platform === "manheim") {
    return platform;
  }
  if (row.estado === "En Subasta") {
    return "other";
  }
  return "stock_rd";
}

export function vehicleAvailabilityFromRow(
  row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">,
): VehicleAvailability {
  const estado = row.estado ?? "";
  if (estado === "Vendido") return "sold";
  if (estado === "En Tránsito") return "in_transit";
  if (estado === "En Subasta" || isAuctionSource(row.fuente_subasta)) return "auction";
  return "available_rd";
}

export function isPublicCatalogListing(row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">) {
  const estado = row.estado ?? "";
  if (estado === "Disponible" || estado === "En Tránsito") {
    return true;
  }
  return estado === "En Subasta" && (isAuctionSource(row.fuente_subasta) || !row.fuente_subasta);
}

export function isPublicDetailListing(row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">) {
  return isPublicCatalogListing(row) || row.estado === "Vendido";
}

export function listingKindFromAvailability(availability: VehicleAvailability): "dealer" | "auction" {
  return availability === "auction" ? "auction" : "dealer";
}

export function availabilityLabel(availability: VehicleAvailability) {
  switch (availability) {
    case "available_rd":
      return "Disponible en RD";
    case "auction":
      return "Subasta USA";
    case "in_transit":
      return "En tránsito";
    case "reserved":
      return "Reservado";
    case "sold":
      return "Vendido";
    case "coming_soon":
      return "Próximamente";
  }
}

export function sourceLabel(source: VehicleSource) {
  switch (source) {
    case "copart":
      return "Copart";
    case "iaai":
      return "IAA";
    case "manheim":
      return "Manheim";
    case "stock_rd":
      return "Valcron Motors";
    case "manual":
      return "Valcron Motors";
    default:
      return null;
  }
}

export function statusBadgeClass(availability: VehicleAvailability) {
  switch (availability) {
    case "available_rd":
      return "border-emerald-700/20 bg-emerald-700/90 text-white";
    case "auction":
      return "border-[#C7A96B]/30 bg-[#9B793F] text-white";
    case "in_transit":
      return "border-sky-800/20 bg-sky-800/90 text-white";
    case "reserved":
      return "border-amber-800/20 bg-amber-800/90 text-white";
    case "sold":
      return "border-neutral-500/20 bg-neutral-500 text-white";
    case "coming_soon":
      return "border-neutral-700/20 bg-neutral-800 text-white";
  }
}

export function publicListingBadge(vehicle: Pick<PublicVehicle, "availability" | "estado" | "listingKind">) {
  const availability =
    vehicle.availability ??
    (vehicle.estado === "En Tránsito"
      ? "in_transit"
      : vehicle.listingKind === "auction" || vehicle.estado === "En Subasta"
        ? "auction"
        : "available_rd");
  return {
    label: availabilityLabel(availability),
    className: statusBadgeClass(availability),
    availability,
  };
}
