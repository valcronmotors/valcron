export const COPART_CSV_HEADERS = [
  "Id",
  "Yard number",
  "Yard name",
  "Sale Date M/D/CY",
  "Day of Week",
  "Sale time (HHMM)",
  "Time Zone",
  "Item#",
  "Lot number",
  "Vehicle Type",
  "Year",
  "Make",
  "Model Group",
  "Model Detail",
  "Body Style",
  "Color",
  "Damage Description",
  "Secondary Damage",
  "Sale Title State",
  "Sale Title Type",
  "Has Keys-Yes or No",
  "Lot Cond. Code",
  "VIN",
  "Odometer",
  "Odometer Brand",
  "Est. Retail Value",
  "Repair cost",
  "Engine",
  "Drive",
  "Transmission",
  "Fuel Type",
  "Cylinders",
  "Runs/Drives",
  "Sale Status",
  "High Bid =non-vix,Sealed=Vix",
  "Special Note",
  "Location city",
  "Location state",
  "Location ZIP",
  "Location country",
  "Currency Code",
  "Image Thumbnail",
  "Create Date/Time",
  "Grid/Row",
  "Make-an-Offer Eligible",
  "Buy-It-Now Price",
  "Image URL",
  "Trim",
  "Last Updated Time",
  "Rentals",
  "Wholesale",
  "Seller Name",
  "Offsite Address1",
  "Offsite State",
  "Offsite City",
  "Offsite Zip",
  "Sale Light",
  "AutoGrade",
  "Announcements",
] as const;

export type CopartCsvHeader = (typeof COPART_CSV_HEADERS)[number];
export type CopartCsvRow = Record<CopartCsvHeader, string>;

export const COPART_REQUIRED_HEADERS: CopartCsvHeader[] = [
  "Lot number",
  "Year",
  "Make",
  "Model Group",
  "VIN",
];

export function validateCopartHeaders(headers: string[]): {
  ok: boolean;
  missing: string[];
  extras: string[];
} {
  const incoming = headers.map((header) => header.replace(/^\uFEFF/, "").trim());
  const incomingSet = new Set(incoming);
  const expected = new Set<string>(COPART_CSV_HEADERS);
  const missing = COPART_CSV_HEADERS.filter((header) => !incomingSet.has(header));
  const extras = incoming.filter((header) => header && !expected.has(header));
  const requiredMissing = COPART_REQUIRED_HEADERS.filter((header) => !incomingSet.has(header));
  return {
    ok: requiredMissing.length === 0 && missing.length === 0,
    missing,
    extras,
  };
}

export function zipCopartRow(headers: string[], values: string[]): CopartCsvRow | null {
  if (headers.length === 0) return null;
  const row = {} as CopartCsvRow;
  for (const header of COPART_CSV_HEADERS) {
    const index = headers.indexOf(header);
    row[header] = index >= 0 ? (values[index] ?? "").trim() : "";
  }
  return row;
}
