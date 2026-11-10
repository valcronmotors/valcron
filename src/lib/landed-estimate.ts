import { formatDecimal } from "@/lib/money";

export function parseLandedEstimate(raw: string, validated: boolean) {
  const amount = raw.trim() === "" ? null : Number(raw);
  if (amount != null && (!Number.isFinite(amount) || amount <= 0 || amount >= 1e12)) {
    return { error: "Ingresa un estimado válido en US$." } as const;
  }
  if (validated && amount == null) return { error: "Ingresa el monto antes de validar el estimado." } as const;
  return { data: { landed_estimate_usd: amount, landed_estimate_validated: validated } } as const;
}

export function validatedLandedEstimate(row: { source_type: string; landed_estimate_usd?: number | null; landed_estimate_validated?: boolean }) {
  const amount = Number(row.landed_estimate_usd);
  return row.source_type === "other" && row.landed_estimate_validated === true && Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function landedEstimateLabel(amount: number) {
  return `Desde US$${formatDecimal(amount, amount % 1 ? 2 : 0)} puesto en RD — precio estimado`;
}
