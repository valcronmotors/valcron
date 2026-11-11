import { financeConfig } from "@/lib/finance-config";
import { DEFAULT_TASA_USD_DOP } from "@/lib/fx";
import { monthlyPayment } from "@/lib/public-filters";
import type { PublicVehicle } from "@/types/vehicle";

export function financeEstimate(priceUsd: number, downPaymentDop?: number | null, months: number = financeConfig.defaultTermMonths, annualRate: number = financeConfig.defaultAnnualRate) {
  if (!Number.isFinite(priceUsd) || priceUsd <= 0 || !Number.isFinite(annualRate) || annualRate < 0.08 || annualRate > 0.30) return null;
  const priceDop = priceUsd * DEFAULT_TASA_USD_DOP;
  const down = downPaymentDop != null ? downPaymentDop : priceDop * financeConfig.defaultDownPaymentPct / 100;
  if (!Number.isFinite(down) || down < 0 || down >= priceDop || !Number.isFinite(months) || months <= 0) return null;
  return {
    downPaymentDop: down,
    explicitDownPayment: downPaymentDop != null,
    financedDop: priceDop - down,
    monthlyDop: monthlyPayment(priceDop - down, months, annualRate),
    months,
    annualRate,
    exchangeRate: DEFAULT_TASA_USD_DOP,
  };
}

export function vehicleFinanceEstimate(vehicle: PublicVehicle) {
  return vehicle.listingKind === "dealer" && vehicle.availability !== "sold"
    ? financeEstimate(vehicle.pricing.usdPrice ?? 0, vehicle.pricing.downPaymentDop)
    : null;
}
