export const financeConfig = {
  source: "internal-illustrative",
  effectiveDate: "2026-09-01",
  lastVerified: "2026-09-20",
  defaultAnnualRate: 0.16,
  defaultTermMonths: 48,
  defaultDownPaymentPct: 20,
  terms: [12, 24, 36, 48, 60, 72, 84] as const,
  notes:
    "Tasa ilustrativa para simulación en el website. No es una tasa oficial, aprobada ni prometida. Las condiciones las define cada institución financiera y el perfil del solicitante.",
} as const;
