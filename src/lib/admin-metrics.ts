import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";
import type { VehicleRow } from "@/lib/inventory";

export type VehicleMetrics = VehicleRow & {
  created_at?: string | null;
};

export function vehicleTasa(vehicle: VehicleMetrics) {
  const tasa = Number(vehicle.tasa_usd_dop);
  return tasa > 0 ? tasa : DEFAULT_TASA_USD_DOP;
}

export function vehicleSaleUsd(vehicle: VehicleMetrics) {
  const saleDop = Number(vehicle.precio_venta_dop ?? 0);
  const tasa = vehicleTasa(vehicle);
  return tasa > 0 ? saleDop / tasa : 0;
}

export function vehicleCostUsd(vehicle: VehicleMetrics) {
  const direct = Number(vehicle.costo_total_usd ?? 0);
  if (direct > 0) {
    return direct;
  }
  const costoDop = Number(vehicle.costo_total_dop ?? 0);
  const tasa = vehicleTasa(vehicle);
  return tasa > 0 ? costoDop / tasa : 0;
}

export function vehicleMarginUsd(vehicle: VehicleMetrics) {
  return vehicleSaleUsd(vehicle) - vehicleCostUsd(vehicle);
}

export function vehicleLabel(vehicle: VehicleMetrics) {
  return `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`.trim();
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

export function formatUsdPlain(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
) {
  if (principal <= 0 || months <= 0) {
    return 0;
  }
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}
