/** CSV-backed row. ImpuestoPlaca is a FINAL tax/first-plate amount, never FOB. */
export type ImportTaxRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  country: string;
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
  taxUsd: number;
};
export type EncodedImportTaxTable = {
  version: number;
  sourceRows: number;
  values: string[][];
  rows: number[][];
};
export function decodeImportTaxTable(
  data: EncodedImportTaxTable,
): ImportTaxRow[] {
  if (data.version !== 1 || data.values.length !== 15)
    throw new Error("Formato de tabla no válido.");
  return data.rows.map((indices, index) => {
    if (indices.length !== 15) throw new Error("Fila de tabla no válida.");
    const r = indices.map((n, i) => data.values[i][n]);
    if (
      r.some((s) => typeof s !== "string") ||
      !Number.isFinite(Number(r[14])) ||
      Number(r[14]) < 0
    )
      throw new Error("Valor de tabla no válido.");
    return {
      id: `dga-${index}`,
      make: r[0],
      model: r[1],
      year: Number(r[2]),
      country: r[3],
      series: r[4],
      fuel: r[5],
      cylinders: r[6],
      cc: r[7],
      passengers: r[8],
      doors: r[9],
      drive: r[10],
      cabins: r[11],
      loadWeight: r[12],
      axles: r[13],
      taxUsd: Number(r[14]),
    };
  });
}
export function normalizeVehicleKey(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}
export function specificationLabel(r: ImportTaxRow) {
  return [
    r.series || "Serie no indicada",
    r.country,
    r.fuel,
    r.cylinders ? `${r.cylinders} cil.` : "",
    r.cc ? `${r.cc} CC` : "",
    r.passengers ? `${r.passengers} pasajeros` : "",
    r.doors ? `${r.doors} puertas` : "",
    r.drive,
    r.cabins ? `${r.cabins} cabinas` : "",
    r.loadWeight ? `Carga ${r.loadWeight}` : "",
    r.axles ? `${r.axles} ejes` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
export function normalizeCountry(s: string) {
  const k = normalizeVehicleKey(s);
  return (
    (
      {
        USA: "ESTADOSUNIDOS",
        UNITEDSTATES: "ESTADOSUNIDOS",
        UNITEDSTATESUSA: "ESTADOSUNIDOS",
        UNITEDSTATESOFAMERICA: "ESTADOSUNIDOS",
        JAPAN: "JAPON",
        GERMANY: "ALEMANIA",
        SOUTHKOREA: "COREADELSUR",
        KOREAREPUBLICOF: "COREADELSUR",
        UNITEDKINGDOM: "REINOUNIDO",
        AUSTRIA: "AUSTRIA",
        THAILAND: "TAILANDIA",
        ITALY: "ITALIA",
        TURKEY: "TURQUIA",
      } as Record<string, string>
    )[k] ?? k
  );
}
export function preselectVin(
  rows: ImportTaxRow[],
  patch: { make?: string; model?: string; year?: number; country?: string },
) {
  const make =
    rows.find(
      (r) =>
        normalizeVehicleKey(r.make) === normalizeVehicleKey(patch.make ?? ""),
    )?.make ??
    patch.make ??
    "";
  const subset = rows.filter((r) => r.make === make);
  const model =
    subset.find(
      (r) =>
        normalizeVehicleKey(r.model) === normalizeVehicleKey(patch.model ?? ""),
    )?.model ??
    patch.model ??
    "";
  const country =
    subset.find(
      (r) =>
        r.model === model &&
        r.year === patch.year &&
        normalizeCountry(r.country) === normalizeCountry(patch.country ?? ""),
    )?.country ??
    patch.country ??
    "";
  return { make, model, country };
}
export function rowMatchesVehicle(
  row: ImportTaxRow,
  v: Omit<ImportTaxRow, "taxUsd" | "id">,
) {
  return (
    [
      "make",
      "model",
      "year",
      "country",
      "series",
      "fuel",
      "cylinders",
      "cc",
      "passengers",
      "doors",
      "drive",
      "cabins",
      "loadWeight",
      "axles",
    ] as const
  ).every((k) => row[k] === v[k]);
}
