export const auctionFeeConfig = {
  source: "pending-verification",
  effectiveDate: "2026-09-01",
  lastVerified: "2026-09-20",
  platforms: ["Copart", "IAAI", "Manheim"] as const,
  feeSchedule: [] as const,
  notes:
    "Los fees de subasta varían por plataforma, tipo de comprador, método de pago y lote. Esta configuración existe para la calculadora pública; no hay tarifas hardcodeadas como oficiales hasta verificarlas.",
} as const;
