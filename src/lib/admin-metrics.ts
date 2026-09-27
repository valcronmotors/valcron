import type { VehicleRow } from "@/lib/website-schema";

export type VehicleMetrics = VehicleRow;

export function vehicleLabel(vehicle: Pick<VehicleRow, "year" | "make" | "model" | "trim">) {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`.trim();
}

export function vehicleSaleAmount(vehicle: Pick<VehicleRow, "price" | "currency">) {
  const amount = Number(vehicle.price ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoneyPlain(value: number, currency: "USD" | "DOP" = "USD") {
  return formatAdminPricePreview(value, currency);
}

export function formatAdminPricePreview(value: number, currency: "USD" | "DOP" = "USD") {
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
  return currency === "DOP" ? `RD$${amount}` : `US$${amount}`;
}

export function isCurrentMonth(value: string | null | undefined) {
  if (!value) {
    return false;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
