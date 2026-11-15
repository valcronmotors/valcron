/** Parámetros comerciales suministrados por Gabriel. No son una liquidación oficial. */
export const importCostConfig = {
  minimumYear: 2021,
  defaults: {
    year: 2025,
    inlandUsd: 250,
    freightUsd: 1075,
    repairUsd: 0,
    fx: 60.81,
    co2Percent: 1,
  },
  buyerTiers: [
    [50, 25],
    [100, 45],
    [200, 80],
    [300, 130],
    [500, 175],
    [750, 250],
    [1000, 320],
    [1200, 375],
    [1500, 420],
    [2000, 470],
    [2500, 560],
    [3000, 610],
    [4000, 680],
    [5000, 730],
    [6000, 775],
    [7000, 830],
    [8000, 885],
    [9000, 925],
    [10000, 960],
    [15000, 1000],
  ] as readonly (readonly [number, number])[],
  buyerHighRate: 0.075,
  internetTiers: [
    [1000, 79],
    [2500, 99],
    [5000, 129],
    [8000, 179],
  ] as readonly (readonly [number, number])[],
  internetHighUsd: 279,
  auction: {
    copart: { fixedUsd: 130, internetCap: Infinity },
    iaai: { fixedUsd: 140, internetCap: 160 },
  },
  insuranceRate: 0.02,
  tariffRate: 0.2,
  itbisRate: 0.18,
  plateRate: 0.17,
  marbete: { cutoffYear: 2022, newerDop: 4000, olderDop: 2000 },
  unloadingUsd: 140,
  dealerTiers: [
    [25000, 1000],
    [40000, 1500],
    [70000, 2000],
    [Infinity, 3000],
  ] as readonly (readonly [number, number])[],
  repairFeeUsd: 400,
  customFeeUsd: 100,
  dealerServiceDop: 30000,
  sweetSpot: { min: 25000, max: 45000 },
  // Orientación presupuestaria por motor, NO una clasificación DGII de emisiones.
  co2Suggestion: {
    smallMaxCc: 2000,
    mediumMaxCc: 3500,
    electricPercent: 0,
    smallPercent: 1,
    mediumPercent: 2,
    largePercent: 3,
  },
  quoteValidityDays: 7,
};
export const IMPORT_ESTIMATE_NOTICE =
  "Cotización estimada. Los impuestos finales los liquida la DGA según su tabla oficial de valores; cualquier diferencia se ajusta en la liquidación final.";
export const AUCTION_FEE_NOTICE =
  "Fees estimados según parámetros de Valcron (noviembre 2026). El fee final lo fija la subasta según cuenta, título, pago y lote.";

export const OFFICIAL_TAX_NOTICE =
  "El importe de impuestos y primera placa se toma de la tabla oficial de valores de la DGA suministrada a Valcron para la especificación seleccionada. La liquidación final puede variar y se confirma antes de comprar.";
