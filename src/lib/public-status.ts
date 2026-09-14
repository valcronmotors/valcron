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
      label: "En Tránsito Marítimo",
      className:
        "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_0_0_3px_rgba(6,182,212,0.12)]",
    };
  }

  if (vehicle.listingKind === "auction" || vehicle.estado === "En Subasta") {
    return {
      label: "Adjudicado en Subasta",
      className:
        "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_0_0_3px_rgba(249,115,22,0.12)]",
    };
  }

  return {
    label: "Disponible en RD",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]",
  };
}
