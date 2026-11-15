import { IMPORT_VEHICLE_POOL } from "./import-vehicle-catalog";
import { suggestedCo2, type ImportCandidate } from "./import-estimate";
export function parseVpic(
  result: Record<string, string>,
): Partial<ImportCandidate> {
  if (!result.Make || !result.Model || !Number(result.ModelYear))
    throw new Error(
      "NHTSA no devolvió marca, modelo y año. Completa los datos manualmente.",
    );
  const make =
    Object.keys(IMPORT_VEHICLE_POOL).find(
      (m) => m.toUpperCase() === result.Make.toUpperCase(),
    ) ?? result.Make;
  const models = IMPORT_VEHICLE_POOL[make] ?? [];
  const model =
    models.find((m) => result.Model.toUpperCase() === m.toUpperCase()) ??
    result.Model;
  const country = /UNITED STATES/i.test(result.PlantCountry ?? "")
    ? "USA"
    : result.PlantCountry || "";
  const cc = result.DisplacementCC
    ? String(Math.round(Number(result.DisplacementCC)))
    : result.DisplacementL
      ? String(Math.round(Number(result.DisplacementL) * 1000))
      : "";
  const fuel = result.FuelTypePrimary ?? "";
  return {
    make,
    model,
    year: Number(result.ModelYear),
    country,
    series: [result.Trim, result.Series].filter(Boolean).join(" / "),
    fuel,
    cylinders: result.EngineCylinders || "",
    cc,
    passengers: result.Seats || "",
    doors: result.Doors || "",
    drive: result.DriveType || "",
    co2Percent: suggestedCo2(cc, fuel),
    tableFobUsd: null,
  };
}
export async function decodeImportVin(vin: string, signal: AbortSignal) {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))
    throw new Error("Introduce un VIN de 17 caracteres, sin I, O ni Q.");
  const response = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
    { signal },
  );
  if (!response.ok)
    throw new Error(
      "NHTSA no está disponible. Puedes completar los datos manualmente.",
    );
  const data = await response.json();
  const result = data.Results?.[0];
  if (!result) throw new Error("No se pudo identificar este VIN.");
  // No aceptar un VIN con errores como una identificación verificada.
  if (result.ErrorCode !== "0")
    throw new Error(
      "NHTSA no validó completamente el VIN. Verifica los caracteres o introduce los datos manualmente.",
    );
  return parseVpic(result);
}
