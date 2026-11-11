import { formatDecimal } from "@/lib/money";
import { DEFAULT_TASA_USD_DOP } from "@/lib/fx";

/** Operational assumptions supplied by Gabriel, 2026-11-10. All import
 * amounts, rates, fee tables and formula switches are maintained HERE. */
export type AuctionFeeTier = { upTo: number; buyerFeeUsd: number; buyerFeeRate?: number; gateFeeUsd: number };

export const importCostConfig = {
  verifiedOn: "2026-11-10",
  inland: { typicalUsd: 400, minUsd: 250, maxUsd: 900 },
  freight: {
    baseUsd: 1075,
    fuelSurchargeUsd: 500,
    // Set true if the quoted base already contains the surcharge; never add twice.
    baseIncludesFuelSurcharge: false,
    source: "https://www.tropical.com/news/2026/tropical-shipping-announces-a-bunker-surcharge-increase-effective-november-08-2026-between-the-continental-u-s-or-canada-and-the-ports-of-the-british-virgin-islands-dominican-republ/",
  },
  tax: { tariffRate: 0.20, caftaTariffRate: 0, itbisRate: 0.18, firstPlateRate: 0.17, co2Rates: [0, 0.01, 0.02, 0.03], defaultCo2Rate: 0.01, illustrativeHybridFactor: 0.5 },
  marbete: { cutoffYear: 2022, newerDop: 4000, olderDop: 2000 },
  portAndManagementUsd: 450,
  cif: { includesAuctionFees: true, includesInland: true },
  auctionFees: {
    // Official US schedules are account-dependent and currently access-restricted.
    // Paste the VERIFIED account-specific buyer/gate tiers here; no Canadian,
    // guessed or generic percentage table is substituted. Until populated, the
    // calculator requires an explicit official buyer+gate quote from the visitor.
    copart: { source: "https://www.copart.com/content/us/en/member-fees-us-licensed", accountProfile: "Por confirmar con Valcron", tiers: [] as AuctionFeeTier[] },
    iaai: { source: "https://www.iaai.com/Marketing/buyer-fees", accountProfile: "Por confirmar con Valcron", tiers: [] as AuctionFeeTier[] },
  },
};

export const IMPORT_ESTIMATE_NOTICE = "Precio estimado. La cotización final se confirma por WhatsApp según el lote y el día de la subasta";

// All calculation formulas live alongside the editable operational parameters.
const config = importCostConfig;

export type ImportEstimateInput = {
  purchaseUsd: number;
  year: number;
  provider: "copart" | "iaai";
  officialAuctionFeesUsd?: number | null;
  inlandUsd?: number;
  caftaConfirmed: boolean;
  co2Rate: number;
  hybridIllustrative: boolean;
  freightIncludesFuel?: boolean;
  insuranceUsd?: number;
};

export function auctionFeesForPrice(price: number, provider: ImportEstimateInput["provider"]) {
  const tier = config.auctionFees[provider].tiers.find(tier => price <= tier.upTo);
  return tier ? tier.buyerFeeUsd + price * (tier.buyerFeeRate ?? 0) + tier.gateFeeUsd : null;
}

export function estimateImport(input: ImportEstimateInput) {
  const auctionFees = input.officialAuctionFeesUsd ?? auctionFeesForPrice(input.purchaseUsd, input.provider);
  const inland = input.inlandUsd ?? config.inland.typicalUsd;
  const insurance = input.insuranceUsd ?? 0;
  if (!Number.isFinite(input.purchaseUsd) || input.purchaseUsd <= 0 || input.purchaseUsd > 1e7 ||
      !Number.isInteger(input.year) || input.year < 1980 || input.year > new Date().getUTCFullYear() + 2 ||
      auctionFees == null || !Number.isFinite(auctionFees) || auctionFees <= 0 ||
      !Number.isFinite(inland) || inland < 0 || !Number.isFinite(insurance) || insurance < 0 ||
      !config.tax.co2Rates.includes(input.co2Rate)) return null;
  const fuel = (input.freightIncludesFuel ?? config.freight.baseIncludesFuelSurcharge) ? 0 : config.freight.fuelSurchargeUsd;
  const freight = config.freight.baseUsd + fuel;
  const factor = input.hybridIllustrative ? config.tax.illustrativeHybridFactor : 1;
  const cif = input.purchaseUsd + freight + insurance + (config.cif.includesAuctionFees ? auctionFees : 0) + (config.cif.includesInland ? inland : 0);
  const tariff = cif * (input.caftaConfirmed ? config.tax.caftaTariffRate : config.tax.tariffRate) * factor;
  const itbis = (cif + tariff) * config.tax.itbisRate * factor;
  const firstPlate = cif * config.tax.firstPlateRate * factor;
  const co2 = cif * input.co2Rate;
  const marbeteDop = input.year >= config.marbete.cutoffYear ? config.marbete.newerDop : config.marbete.olderDop;
  const marbete = marbeteDop / DEFAULT_TASA_USD_DOP;
  const lines = [
    { key: "purchase", label: "Compra en subasta", usd: input.purchaseUsd },
    { key: "fees", label: "Comisión de subasta + gate", usd: auctionFees },
    { key: "inland", label: "Transporte terrestre en EE. UU.", usd: inland },
    { key: "freight", label: "Flete marítimo base", usd: config.freight.baseUsd },
    { key: "fuel", label: "Recargo de combustible", usd: fuel },
    { key: "insurance", label: "Seguro indicado", usd: insurance },
    { key: "tariff", label: `Arancel estimado (${(input.caftaConfirmed ? config.tax.caftaTariffRate : config.tax.tariffRate) * factor * 100}% del CIF)`, usd: tariff },
    { key: "itbis", label: `ITBIS estimado (${config.tax.itbisRate * factor * 100}% sobre CIF + arancel)`, usd: itbis },
    { key: "plate", label: `Primera placa estimada (${config.tax.firstPlateRate * factor * 100}% del CIF)`, usd: firstPlate },
    { key: "co2", label: `CO₂ estimado (${input.co2Rate * 100}% del CIF)`, usd: co2 },
    { key: "marbete", label: `Marbete (RD$${formatDecimal(marbeteDop, 0)})`, usd: marbete },
    { key: "management", label: "Puerto y gestión Valcron", usd: config.portAndManagementUsd },
  ];
  const totalUsd = lines.reduce((sum, line) => sum + line.usd, 0);
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) return null;
  return { lines, cif, totalUsd, totalDop: totalUsd * DEFAULT_TASA_USD_DOP, marbeteDop, tariff, itbis, firstPlate, co2, freight, auctionFees };
}

export function importEstimateRange(input: ImportEstimateInput) {
  const low = estimateImport({ ...input, inlandUsd: input.inlandUsd ?? config.inland.minUsd });
  const high = estimateImport({ ...input, inlandUsd: input.inlandUsd ?? config.inland.maxUsd });
  return low && high ? { minUsd: low.totalUsd, maxUsd: high.totalUsd } : null;
}
