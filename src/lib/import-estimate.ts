import { importCostConfig as c } from "./import-cost-config";
import { rowMatchesVehicle, type ImportTaxRow } from "./import-tax-table";
export type VehicleSpecification = {
  series: string;
  fuel: string;
  cylinders: string;
  cc: string;
  passengers: string;
  doors: string;
  drive: string;
  cabins: string;
  loadWeight: string;
  axles: string;
};
export type ImportCandidate = VehicleSpecification & {
  id: string;
  vin: string;
  make: string;
  model: string;
  country: string;
  year: number;
  purchaseUsd: number;
  provider: "copart" | "iaai";
  title: "clean" | "rebuilt";
  shippingMethod: "container" | "roro";
  valuation: "invoice" | "table";
  tableFobUsd: number | null;
  taxMode: "official" | "manual";
  taxRow: ImportTaxRow | null;
  rebuiltManagement: boolean;
  co2Percent: number;
  inlandUsd: number;
  freightUsd: number;
  repairUsd: number;
  fx: number;
};
export function newImportCandidate(id: string): ImportCandidate {
  return {
    id,
    vin: "",
    make: "",
    model: "",
    country: "",
    year: c.defaults.year,
    purchaseUsd: 0,
    provider: "copart",
    title: "clean",
    shippingMethod: "container",
    valuation: "invoice",
    tableFobUsd: null,
    taxMode: "official",
    taxRow: null,
    rebuiltManagement: false,
    co2Percent: c.defaults.co2Percent,
    inlandUsd: c.defaults.inlandUsd,
    freightUsd: c.defaults.freightUsd,
    repairUsd: c.defaults.repairUsd,
    fx: c.defaults.fx,
    series: "",
    fuel: "",
    cylinders: "",
    cc: "",
    passengers: "",
    doors: "",
    drive: "",
    cabins: "",
    loadWeight: "",
    axles: "",
  };
}
export function isUsa(country: string) {
  return /^(USA|UNITED STATES(?: OF AMERICA)?|ESTADOS UNIDOS)$/i.test(
    country.trim(),
  );
}
export function auctionFeesForPrice(
  price: number,
  provider: ImportCandidate["provider"],
) {
  const buyer =
    c.buyerTiers.find(([limit]) => price < limit)?.[1] ??
    price * c.buyerHighRate;
  const internet = Math.min(
    c.internetTiers.find(([limit]) => price < limit)?.[1] ?? c.internetHighUsd,
    c.auction[provider].internetCap,
  );
  return {
    buyer,
    internet,
    fixed: c.auction[provider].fixedUsd,
    total: buyer + internet + c.auction[provider].fixedUsd,
  };
}
export function suggestedCo2(cc: string, fuel: string) {
  const s = c.co2Suggestion;
  if (/^electric(?:ity)?$|^eléctrico$/i.test(fuel.trim()))
    return s.electricPercent;
  const n = Number(cc);
  return n > 0
    ? n <= s.smallMaxCc
      ? s.smallPercent
      : n <= s.mediumMaxCc
        ? s.mediumPercent
        : s.largePercent
    : c.defaults.co2Percent;
}
export function previewImportCosts(v: ImportCandidate) {
  if (
    ![
      v.purchaseUsd,
      v.inlandUsd,
      v.freightUsd,
      v.repairUsd,
      v.fx,
      v.co2Percent,
    ].every(Number.isFinite) ||
    v.purchaseUsd <= 0 ||
    v.purchaseUsd > 1e7 ||
    v.inlandUsd < 0 ||
    v.freightUsd < 0 ||
    v.repairUsd < 0 ||
    v.fx <= 0 ||
    v.fx > 1e5 ||
    ![0, 1, 2, 3].includes(v.co2Percent)
  )
    return null;
  const identified =
    !!v.make.trim() &&
    !!v.model.trim() &&
    !!v.country.trim() &&
    Number.isInteger(v.year) &&
    v.year >= c.minimumYear &&
    v.year <= new Date().getUTCFullYear() + 2;
  const officialTax =
    v.taxMode === "official" &&
    !!v.taxRow &&
    rowMatchesVehicle(v.taxRow, v) &&
    Number.isFinite(v.taxRow.taxUsd) &&
    v.taxRow.taxUsd >= 0;
  const fob =
    v.taxMode === "manual" && v.valuation === "table"
      ? (v.tableFobUsd ?? v.purchaseUsd)
      : v.purchaseUsd;
  if (!Number.isFinite(fob) || fob <= 0 || fob > 1e7) return null;
  const insurance = v.purchaseUsd * c.insuranceRate;
  const cif = fob + v.freightUsd + insurance;
  const manual = v.taxMode === "manual" && identified;
  const tariff = manual && !isUsa(v.country) ? cif * c.tariffRate : 0;
  const itbis = manual ? (cif + tariff) * c.itbisRate : 0;
  const plate = manual ? cif * c.plateRate : 0;
  const co2 = manual ? (cif * v.co2Percent) / 100 : 0;
  const marbeteDop = manual
    ? v.year >= c.marbete.cutoffYear
      ? c.marbete.newerDop
      : c.marbete.olderDop
    : 0;
  const dga = tariff + itbis,
    dgii = plate + co2 + marbeteDop / v.fx;
  const taxAmount =
    identified && officialTax ? v.taxRow!.taxUsd : manual ? dga + dgii : null;
  const fees = auctionFeesForPrice(v.purchaseUsd, v.provider);
  const unloading = v.shippingMethod === "container" ? c.unloadingUsd : 0;
  const subtotal =
    v.purchaseUsd +
    fees.total +
    v.inlandUsd +
    v.freightUsd +
    insurance +
    unloading +
    (taxAmount ?? 0) +
    v.repairUsd;
  const dealerFee = c.dealerTiers.find(([limit]) => subtotal <= limit)![1];
  const repairFee = v.repairUsd > 0 && v.rebuiltManagement ? c.repairFeeUsd : 0;
  const honorarios =
    dealerFee + repairFee + c.customFeeUsd + c.dealerServiceDop / v.fx;
  const totalUsd = subtotal + honorarios;
  if (!Number.isFinite(totalUsd) || totalUsd * v.fx > 1e12) return null;
  const lines = [
    { key: "purchase", label: "Compra del vehículo", usd: v.purchaseUsd },
    { key: "auction", label: "Fee de subasta", usd: fees.total },
    { key: "inland", label: "Grúa USA", usd: v.inlandUsd },
    { key: "freight", label: "Flete marítimo", usd: v.freightUsd },
    {
      key: "insurance",
      label: "Seguro marítimo (2% de la compra)",
      usd: insurance,
    },
    ...(v.shippingMethod === "container"
      ? [{ key: "unloading", label: "Descarga + HIT", usd: unloading }]
      : []),
    ...(taxAmount !== null
      ? officialTax
        ? [
            {
              key: "official-tax",
              label: "Impuestos y primera placa (tabla oficial)",
              usd: taxAmount,
            },
          ]
        : [
            {
              key: "dga",
              label: "Impuestos de aduana (DGA) · fórmula",
              usd: dga,
            },
            {
              key: "dgii",
              label: "Primera placa, CO₂ y marbete (DGII) · fórmula",
              usd: dgii,
            },
          ]
      : []),
    ...(v.repairUsd > 0
      ? [{ key: "repair", label: "Reparación estimada", usd: v.repairUsd }]
      : []),
    {
      key: "usa-management",
      label: "Gestión de compra USA (Valcron)",
      usd: dealerFee,
    },
    {
      key: "repair-fee",
      label: "Repair Fee · gestión de título",
      usd: repairFee,
    },
    { key: "custom-fee", label: "Custom Fee", usd: c.customFeeUsd },
    {
      key: "rd-service",
      label: "Servicio del dealer en RD (RD$30,000)",
      usd: c.dealerServiceDop / v.fx,
    },
  ];
  return {
    lines,
    ready: identified && taxAmount !== null,
    officialTax,
    taxAmount,
    fob,
    insurance,
    cif,
    tariff,
    itbis,
    plate,
    co2,
    marbeteDop,
    fees,
    unloading,
    subtotal,
    dealerFee,
    repairFee,
    honorarios,
    totalUsd,
    totalDop: totalUsd * v.fx,
    caftaSavings:
      manual && isUsa(v.country) ? cif * c.tariffRate * (1 + c.itbisRate) : 0,
    sweetSpot: totalUsd >= c.sweetSpot.min && totalUsd <= c.sweetSpot.max,
  };
}
export function estimateImport(v: ImportCandidate) {
  const result = previewImportCosts(v);
  return result?.ready ? result : null;
}
/** Client quote keeps Valcron contract charges grouped separately from auction fees. */
export function clientQuoteLines(v: ImportCandidate) {
  const r = estimateImport(v);
  if (!r) return [];
  return [
    { key: "purchase", label: "Compra del vehículo", usd: v.purchaseUsd },
    {
      key: "auction",
      label: "Fees de subasta",
      usd: r.fees.total,
    },
    { key: "inland", label: "Transporte terrestre en USA", usd: v.inlandUsd },
    {
      key: "freight",
      label:
        v.shippingMethod === "container"
          ? "Flete marítimo, seguro y descarga"
          : "Flete marítimo y seguro",
      usd: v.freightUsd + r.insurance + r.unloading,
    },
    ...r.lines.filter((l) =>
      ["official-tax", "dga", "dgii", "repair"].includes(l.key),
    ),
    {
      key: "valcron",
      label: "Honorarios de gestión Valcron",
      usd: r.honorarios,
    },
  ];
}
export function bestCandidate(candidates: ImportCandidate[]) {
  const valid = candidates.flatMap((v) => {
    const result = estimateImport(v);
    return result ? [{ id: v.id, ...result }] : [];
  });
  const sweet = valid.filter((v) => v.sweetSpot);
  return (sweet.length ? sweet : valid).sort(
    (a, b) => a.totalUsd - b.totalUsd,
  )[0]?.id;
}
export function vehicleDescription(v: ImportCandidate) {
  return [
    `${v.make} ${v.model} ${v.year}`,
    v.series,
    v.fuel,
    v.cylinders ? `${v.cylinders} cilindros` : "",
    v.cc ? `${v.cc} CC` : "",
    v.passengers ? `${v.passengers} pasajeros` : "",
    v.doors ? `${v.doors} puertas` : "",
    v.drive,
    v.cabins ? `${v.cabins} cabinas` : "",
    v.loadWeight ? `Carga ${v.loadWeight}` : "",
    v.axles ? `${v.axles} ejes` : "",
    v.country,
    v.vin ? `VIN ${v.vin}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
