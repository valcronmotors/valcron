export type DecodedVin = {
  marca: string;
  modelo: string;
  trim: string;
  ano: string;
};

function clean(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  return !trimmed || trimmed === "Not Applicable" ? "" : trimmed;
}

export async function decodeVin(vin: string): Promise<DecodedVin | null> {
  if (vin.length !== 17) {
    return null;
  }

  const response = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    Results?: Array<Record<string, unknown>>;
  };
  const result = payload.Results?.[0];
  if (!result) {
    return null;
  }

  return {
    marca: clean(result.Make),
    modelo: clean(result.Model),
    trim: clean(result.Trim) || clean(result.Series),
    ano: clean(result.ModelYear),
  };
}
