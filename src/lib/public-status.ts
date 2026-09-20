import type { PublicVehicle } from "@/lib/public-catalog";

export type PublicListingBadge = {
  label: string;
  className: string;
};

export function publicListingBadge(
  vehicle: Pick<PublicVehicle, "estado" | "listingKind">,
): PublicListingBadge {
  if (vehicle.estado === "En Tránsito") {
    return {
      label: "En tránsito",
      className: "border-white/20 bg-black/55 text-white backdrop-blur-sm",
    };
  }

  if (vehicle.listingKind === "auction" || vehicle.estado === "En Subasta") {
    return {
      label: "En subasta",
      className: "border-white/20 bg-black/55 text-white backdrop-blur-sm",
    };
  }

  return {
    label: "Disponible en RD",
    className: "border-white/20 bg-black/55 text-white backdrop-blur-sm",
  };
}
