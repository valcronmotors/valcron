import type {
  AuctionPlatform,
  PublicVehicle,
  VehicleAvailability,
  VehicleSource,
} from "@/types/vehicle";
import type { VehicleRow, VehicleSourceType, VehicleStatus } from "@/lib/website-schema";

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

export function vehicleSourceFromType(sourceType: VehicleSourceType | null | undefined): VehicleSource {
  if (sourceType === "valcron_stock") {
    return "stock_rd";
  }
  return "manual";
}

export function isAuctionOpportunitySource(sourceType: VehicleSourceType | null | undefined) {
  return sourceType === "other";
}

export function vehicleAvailabilityFromStatus(status: VehicleStatus | null | undefined): VehicleAvailability {
  if (status === "sold") return "sold";
  if (status === "reserved") return "reserved";
  if (status === "hidden" || status === "draft") return "coming_soon";
  return "available_rd";
}

export function vehicleSourceFromRow(row: Pick<VehicleRow, "source_type">): VehicleSource {
  return vehicleSourceFromType(row.source_type);
}

export function vehicleAvailabilityFromRow(
  row: Pick<VehicleRow, "status" | "source_type">,
): VehicleAvailability {
  const statusAvailability = vehicleAvailabilityFromStatus(row.status);
  if (statusAvailability !== "available_rd") {
    return statusAvailability;
  }
  if (isAuctionOpportunitySource(row.source_type)) {
    return "auction";
  }
  return "available_rd";
}

export function listingKindFromAvailability(availability: VehicleAvailability): "dealer" | "auction" {
  return availability === "auction" ? "auction" : "dealer";
}

export function availabilityLabel(availability: VehicleAvailability) {
  switch (availability) {
    case "available_rd":
      return "Disponible en Valcron";
    case "auction":
      return "Disponible mediante subasta";
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
      return null;
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

export function publicListingBadge(
  vehicle: Pick<PublicVehicle, "availability" | "estado" | "listingKind" | "source">,
) {
  const availability =
    vehicle.availability ??
    (vehicle.estado === "Reservado"
      ? "reserved"
      : vehicle.estado === "Vendido"
        ? "sold"
        : vehicle.listingKind === "auction"
          ? "auction"
          : "available_rd");

  const label = availabilityLabel(availability);

  return {
    label,
    className: statusBadgeClass(availability),
    availability,
  };
}

export function isAuctionListing(
  vehicle: Pick<PublicVehicle, "listingKind" | "availability">,
) {
  return vehicle.listingKind === "auction" || vehicle.availability === "auction";
}

export function publicVehicleInquiryLabel(vehicle: Pick<PublicVehicle, "listingKind" | "availability">) {
  return isAuctionListing(vehicle) ? "Solicitar cotización" : "Solicitar información";
}

export function publicVehicleCardActionLabel(vehicle: Pick<PublicVehicle, "listingKind" | "availability">) {
  return isAuctionListing(vehicle) ? "Cotizar" : "WhatsApp";
}

export function vehicleStatusLabel(status: VehicleStatus) {
  switch (status) {
    case "draft":
      return "Borrador";
    case "available":
      return "Disponible";
    case "reserved":
      return "Reservado";
    case "sold":
      return "Vendido";
    case "hidden":
      return "Oculto";
  }
}
