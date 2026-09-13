export const DEFAULT_TASA_USD_DOP = 62;
export const MARGEN_PRECIO_ESTIMADO = 0.2;

export const VEHICLE_STATES = [
  "En Subasta",
  "En Tránsito",
  "En Taller",
  "Disponible",
  "Vendido",
] as const;

export const TRIM_SUGGESTIONS = [
  "EX",
  "EXL",
  "LX",
  "LE",
  "SE",
  "XLE",
  "Limited",
  "Prestige",
  "Sport",
  "Touring",
  "S",
  "SV",
  "SL",
];

export type VehicleState = (typeof VEHICLE_STATES)[number];

export function parseAmount(value: FormDataEntryValue | string | null) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateVehicleCosts(input: {
  costoSubastaUsd: number;
  gastosTallerUsaUsd: number;
  gastosGruaUsd: number;
  gastosTitulacionUsd: number;
  feesAdicionalesUsd: number;
  fleteUsd: number;
  tasaUsdDop: number;
  gastosTallerRdDop: number;
  impuestosDgaDop: number;
}) {
  const costoTotalUsd =
    input.costoSubastaUsd +
    input.gastosTallerUsaUsd +
    input.gastosGruaUsd +
    input.gastosTitulacionUsd +
    input.feesAdicionalesUsd +
    input.fleteUsd;
  const gastosDop = input.gastosTallerRdDop + input.impuestosDgaDop;
  const costoUsdEnDop = costoTotalUsd * input.tasaUsdDop;
  const costoTotalDop = costoUsdEnDop + gastosDop;
  const precioEstimadoDop = costoTotalDop * (1 + MARGEN_PRECIO_ESTIMADO);

  return {
    costoTotalUsd,
    gastosDop,
    costoUsdEnDop,
    costoTotalDop,
    precioEstimadoDop,
  };
}

export function calculateVehicleMargin(
  costoTotalDop: number,
  precioVentaDop: number,
) {
  const margenDop = precioVentaDop - costoTotalDop;
  const roiPercent = costoTotalDop > 0 ? (margenDop / costoTotalDop) * 100 : 0;

  return { margenDop, roiPercent };
}

export function isVehicleState(value: string): value is VehicleState {
  return VEHICLE_STATES.includes(value as VehicleState);
}
