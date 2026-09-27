import type { AuctionOpportunityStatus, InquirySource, InquiryStatus } from "@/lib/website-schema";

export const AUCTION_STATUS_LABEL: Record<AuctionOpportunityStatus, string> = {
  draft: "Borrador",
  review: "En revisión",
  published: "Preparada",
  archived: "Archivada",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "Nueva",
  in_progress: "En seguimiento",
  closed: "Cerrada",
};

export const INQUIRY_SOURCE_LABEL: Record<InquirySource, string> = {
  web: "Website",
  whatsapp: "WhatsApp",
  other: "Otro",
};

export const PUBLIC_INVENTORY_EMPTY = {
  title: "Estamos actualizando nuestro inventario.",
  copy: "Cuéntanos qué vehículo buscas y te ayudamos a encontrarlo.",
};

export const PUBLIC_INVENTORY_FILTER_EMPTY = {
  title: "No encontramos vehículos con estos filtros.",
  copy: "Prueba otra marca, año o rango de precio, o limpia los filtros para ver todo el inventario.",
};

export function formatAdminDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function adminGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function adminInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "VM";
}
