import { importCostConfig as c } from "./import-cost-config";
export type VehicleSpecification = {
  series: string;
  fuel: string;
  cylinders: string;
  cc: string;
  passengers: string;
  doors: string;
  drive: string;
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
  valuation: "invoice" | "table";
  tableFobUsd: number | null;
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
    valuation: "invoice",
    tableFobUsd: null,
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
export function estimateImport(v: ImportCandidate) {
  if (
    !v.make.trim() ||
    !v.model.trim() ||
    !v.country.trim() ||
    !Number.isInteger(v.year) ||
    v.year < c.minimumYear ||
    v.year > new Date().getUTCFullYear() + 2 ||
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
  const fob =
    v.valuation === "table" ? (v.tableFobUsd ?? v.purchaseUsd) : v.purchaseUsd;
  if (!Number.isFinite(fob) || fob <= 0 || fob > 1e7) return null;
  const fees = auctionFeesForPrice(v.purchaseUsd, v.provider);
  const repairing = v.repairUsd > 0;
  const purchaseManagement =
    c.purchaseManagement.baseUsd +
    c.purchaseManagement.processingUsd +
    (v.purchaseUsd > c.purchaseManagement.highThresholdUsd
      ? v.purchaseUsd * c.purchaseManagement.highRate
      : 0) +
    (repairing ? c.purchaseManagement.repairUsd : 0);
  const insurance = fob * c.insuranceRate;
  const cif = fob + v.freightUsd + insurance;
  const tariff = isUsa(v.country) ? 0 : cif * c.tariffRate;
  const itbis = (cif + tariff) * c.itbisRate;
  const dga = tariff + itbis;
  const plate = cif * c.plateRate;
  const co2 = (cif * v.co2Percent) / 100;
  const marbeteDop =
    v.year >= c.marbete.cutoffYear ? c.marbete.newerDop : c.marbete.olderDop;
  const dgii = plate + co2 + marbeteDop / v.fx;
  // Seguro real a cargo del cliente: se suma una sola vez y también integra la base CIF.
  const subtotal =
    v.purchaseUsd +
    fees.total +
    purchaseManagement +
    v.inlandUsd +
    v.freightUsd +
    insurance +
    c.unloadingUsd +
    dga +
    dgii +
    v.repairUsd;
  const dealerFee = c.dealerTiers.find(([limit]) => subtotal <= limit)![1];
  const honorarios =
    dealerFee +
    (repairing ? c.repairFeeUsd : 0) +
    c.customFeeUsd +
    c.dealerServiceDop / v.fx;
  const totalUsd = subtotal + honorarios;
  if (!Number.isFinite(totalUsd) || totalUsd * v.fx > 1e12) return null;
  const lines = [
    { key: "purchase", label: "Compra del vehículo", usd: v.purchaseUsd },
    {
      key: "auction",
      label: "Fees de subasta y gestión de compra",
      usd: fees.total + purchaseManagement,
    },
    { key: "inland", label: "Transporte terrestre en USA", usd: v.inlandUsd },
    {
      key: "freight",
      label: "Flete marítimo",
      usd: v.freightUsd,
    },
    { key: "insurance", label: "Seguro (2% del FOB)", usd: insurance },
    { key: "unloading", label: "Descarga + HIT", usd: c.unloadingUsd },
    { key: "dga", label: "Impuestos de aduana (DGA)", usd: dga },
    { key: "dgii", label: "Primera placa, CO₂ y marbete (DGII)", usd: dgii },
    ...(repairing
      ? [{ key: "repair", label: "Reparación estimada", usd: v.repairUsd }]
      : []),
    { key: "valcron", label: "Honorarios de gestión Valcron", usd: honorarios },
  ];
  return {
    lines,
    fob,
    insurance,
    cif,
    tariff,
    itbis,
    plate,
    co2,
    marbeteDop,
    fees,
    subtotal,
    dealerFee,
    totalUsd,
    totalDop: totalUsd * v.fx,
    caftaSavings: isUsa(v.country) ? cif * c.tariffRate * (1 + c.itbisRate) : 0,
    sweetSpot: totalUsd >= c.sweetSpot.min && totalUsd <= c.sweetSpot.max,
  };
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
    v.country,
    v.vin ? `VIN ${v.vin}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
