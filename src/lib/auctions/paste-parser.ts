/**
 * Deterministic paste-to-autofill parser for Copart / IAA / Manheim listing text.
 * Does not fetch URLs or scrape pages — only parses administrator-pasted text.
 */

export type PasteFieldConfidence = "high" | "medium" | "review";

export type ParsedAuctionFieldKey =
  | "provider_hint"
  | "year"
  | "make"
  | "model"
  | "trim"
  | "provider_lot_id"
  | "vin"
  | "vin_status"
  | "location"
  | "sale_name"
  | "auction_date"
  | "auction_sale_status"
  | "seller_type"
  | "vehicle_type"
  | "body_style"
  | "fuel"
  | "engine"
  | "cylinders"
  | "transmission"
  | "drivetrain"
  | "exterior_color"
  | "mileage"
  | "mileage_unit"
  | "odometer_status"
  | "primary_damage"
  | "secondary_damage"
  | "keys"
  | "run_and_drive"
  | "engine_starts"
  | "transmission_engages"
  | "title_status"
  | "estimated_retail_usd"
  | "buy_now_usd"
  | "highlights"
  | "notes"
  | "source_url"
  | "price_mode";

export type ParsedAuctionField = {
  key: ParsedAuctionFieldKey;
  label: string;
  value: string;
  confidence: PasteFieldConfidence;
  raw?: string;
};

export type ParseAuctionPasteResult = {
  fields: ParsedAuctionField[];
  byKey: Partial<Record<ParsedAuctionFieldKey, ParsedAuctionField>>;
  warnings: string[];
  providerHint: "copart" | "iaa" | "manheim" | null;
};

const FIELD_LABELS: Record<ParsedAuctionFieldKey, string> = {
  provider_hint: "Proveedor sugerido",
  year: "Año",
  make: "Marca",
  model: "Modelo",
  trim: "Trim / versión",
  provider_lot_id: "Número de lote",
  vin: "VIN",
  vin_status: "Estado del VIN",
  location: "Ubicación de subasta",
  sale_name: "Sale name",
  auction_date: "Fecha de subasta",
  auction_sale_status: "Estado de subasta",
  seller_type: "Tipo de vendedor",
  vehicle_type: "Tipo de vehículo",
  body_style: "Carrocería",
  fuel: "Combustible",
  engine: "Motor",
  cylinders: "Cilindros",
  transmission: "Transmisión",
  drivetrain: "Tracción",
  exterior_color: "Color exterior",
  mileage: "Kilometraje",
  mileage_unit: "Unidad de kilometraje",
  odometer_status: "Estado del odómetro",
  primary_damage: "Daño principal",
  secondary_damage: "Daño secundario",
  keys: "Llaves",
  run_and_drive: "Run and Drive",
  engine_starts: "Engine starts",
  transmission_engages: "Transmission engages",
  title_status: "Título / documento",
  estimated_retail_usd: "Valor estimado (informativo)",
  buy_now_usd: "Buy Now (USD)",
  highlights: "Highlights",
  notes: "Notas",
  source_url: "URL de origen",
  price_mode: "Modo de precio",
};

function cleanLines(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\u00a0/g, " ").trim())
    .filter((line) => line.length > 0);
}

function normalizeKey(label: string) {
  return label
    .toLowerCase()
    .replace(/[:：]\s*$/, "")
    .replace(/[^a-z0-9áéíóúüñ\s/-]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const FLAG_LINES = [
  /^run and drive$/i,
  /^engine starts$/i,
  /^transmission engages$/i,
  /^order condition report$/i,
];

function isFlagLine(line: string) {
  return FLAG_LINES.some((pattern) => pattern.test(line.trim()));
}

function stripLabelPrefix(line: string, labels: string[]) {
  if (isFlagLine(line)) return null;
  // Longer labels first so "engine type" wins over "engine".
  const ordered = [...labels].sort((a, b) => b.length - a.length);
  for (const label of ordered) {
    const re = new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[:：]?\\s*`, "i");
    if (re.test(line)) {
      const rest = line.replace(re, "").trim();
      // Avoid treating "Engine starts" as engine value "starts".
      if (!rest && /^(engine|transmission)$/i.test(label) === false) {
        return rest;
      }
      if (rest && /^(starts|engages)$/i.test(rest) && /^(engine|transmission)$/i.test(label)) {
        return null;
      }
      return rest;
    }
  }
  return null;
}

function valueAfterLabel(lines: string[], labels: string[]) {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;
    const sameLine = stripLabelPrefix(line, labels);
    if (sameLine != null) {
      if (sameLine) return { value: sameLine, index: i };
      const next = lines[i + 1];
      if (next && !looksLikeLabel(next)) {
        return { value: next, index: i + 1 };
      }
      return { value: "", index: i };
    }
    const normalized = normalizeKey(line);
    if (labels.some((label) => normalizeKey(label) === normalized)) {
      const next = lines[i + 1];
      if (next && !looksLikeLabel(next)) {
        return { value: next, index: i + 1 };
      }
      return { value: "", index: i };
    }
  }
  return null;
}

function looksLikeLabel(line: string) {
  const normalized = normalizeKey(line);
  return LABEL_CATALOG.some((entry) => entry.labels.some((label) => normalizeKey(label) === normalized));
}

const LABEL_CATALOG: { key: ParsedAuctionFieldKey; labels: string[] }[] = [
  {
    key: "provider_lot_id",
    labels: [
      "lot number",
      "lot #",
      "work order / lot",
      "work order",
      "work order number",
      "lot",
      "número de lote",
      "numero de lote",
      "item #",
    ],
  },
  { key: "vin", labels: ["vin", "vehicle identification number"] },
  { key: "location", labels: ["location", "ubicación", "ubicacion", "yard location", "auction location"] },
  { key: "sale_name", labels: ["sale name", "sale", "nombre de venta"] },
  { key: "auction_date", labels: ["sale date", "auction date", "fecha de subasta", "fecha de venta"] },
  { key: "seller_type", labels: ["seller", "seller type", "tipo de vendedor"] },
  { key: "vehicle_type", labels: ["vehicle type", "tipo de vehículo", "tipo de vehiculo"] },
  { key: "body_style", labels: ["body style", "body type", "carrocería", "carroceria"] },
  { key: "fuel", labels: ["fuel", "fuel type", "combustible"] },
  { key: "engine", labels: ["engine type", "motor"] },
  { key: "cylinders", labels: ["cylinders", "cilindros"] },
  { key: "transmission", labels: ["transmission", "transmisión", "transmision"] },
  { key: "drivetrain", labels: ["drivetrain", "drive", "tracción", "traccion"] },
  { key: "exterior_color", labels: ["color", "exterior color", "color exterior"] },
  { key: "mileage", labels: ["odometer", "odometer reading", "mileage", "kilometraje"] },
  { key: "odometer_status", labels: ["odometer brand", "odometer status", "estado del odómetro", "estado del odometro"] },
  { key: "primary_damage", labels: ["primary damage", "daño principal", "dano principal"] },
  { key: "secondary_damage", labels: ["secondary damage", "daño secundario", "dano secundario"] },
  { key: "keys", labels: ["has key", "keys", "key", "llaves"] },
  { key: "title_status", labels: ["title code", "title", "document", "título", "titulo"] },
  { key: "estimated_retail_usd", labels: ["estimated retail value", "est. retail value", "estimated retail", "valor estimado"] },
  { key: "buy_now_usd", labels: ["buy now", "buy it now", "bin", "comprar ahora"] },
  { key: "highlights", labels: ["highlights", "destacados"] },
  { key: "notes", labels: ["notes", "notas", "seller notes"] },
  { key: "source_url", labels: ["source url", "url", "enlace", "link"] },
  { key: "run_and_drive", labels: ["run and drive", "r&d"] },
  { key: "auction_sale_status", labels: ["sale status", "auction status", "estado de subasta"] },
];

function titleCaseMake(value: string) {
  const known: Record<string, string> = {
    honda: "Honda",
    toyota: "Toyota",
    hyundai: "Hyundai",
    kia: "Kia",
    nissan: "Nissan",
    chevrolet: "Chevrolet",
    ford: "Ford",
    mazda: "Mazda",
    mitsubishi: "Mitsubishi",
    bmw: "BMW",
    "mercedes-benz": "Mercedes-Benz",
    mercedes: "Mercedes-Benz",
    lexus: "Lexus",
    acura: "Acura",
    jeep: "Jeep",
    volkswagen: "Volkswagen",
    subaru: "Subaru",
    dodge: "Dodge",
    ram: "RAM",
    gmc: "GMC",
    audi: "Audi",
    volvo: "Volvo",
    infiniti: "Infiniti",
    suzuki: "Suzuki",
    porsche: "Porsche",
    "land rover": "Land Rover",
    cadillac: "Cadillac",
    buick: "Buick",
    chrysler: "Chrysler",
    mini: "Mini",
    tesla: "Tesla",
    byd: "BYD",
  };
  const key = value.trim().toLowerCase();
  return known[key] ?? value
    .split(/[\s-]+/)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join(value.includes("-") ? "-" : " ");
}

function parseTitleLine(line: string) {
  const match = line.match(
    /^(\d{4})\s+([A-Z0-9][A-Z0-9 /-]*?)\s+([A-Z0-9][A-Z0-9-]*)(?:\s+(.+))?$/i,
  );
  if (!match) return null;
  return {
    year: match[1]!,
    make: titleCaseMake(match[2]!.trim()),
    model: match[3]!.trim().toUpperCase() === match[3]!.trim()
      ? match[3]!.trim().replace(/([A-Z]+)(\d)/g, "$1-$2") // leave CR-V style
      : match[3]!.trim(),
    trim: (match[4] ?? "").trim(),
  };
}

function normalizeModel(raw: string) {
  const value = raw.trim();
  if (/^cr[\s-]?v$/i.test(value)) return "CR-V";
  if (/^rav[\s-]?4$/i.test(value)) return "RAV4";
  if (/^f[\s-]?150$/i.test(value)) return "F-150";
  return value;
}

function parseMileage(raw: string) {
  const match = raw.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(mi|km|miles|kilometers)?/i);
  if (!match) return null;
  const amount = Math.round(Number(match[1]));
  if (!Number.isFinite(amount)) return null;
  const unitRaw = (match[2] ?? "mi").toLowerCase();
  const unit = unitRaw.startsWith("km") ? "km" : "mi";
  return { amount: String(amount), unit };
}

function parseMoneyUsd(raw: string) {
  const match = raw.replace(/,/g, "").match(/\$?\s*(\d+(?:\.\d+)?)\s*(usd)?/i);
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) ? String(Math.round(amount)) : null;
}

function normalizeFuel(raw: string) {
  const value = raw.toLowerCase();
  if (value.includes("hybrid") || (value.includes("electric") && value.includes("gas"))) {
    return "Hybrid gasoline/electric";
  }
  if (value.includes("electric") || value.includes("ev")) return "Eléctrico";
  if (value.includes("diesel") || value.includes("diésel") || value.includes("diesel")) return "Diésel";
  if (value.includes("gas")) return "Gasolina";
  return raw.trim();
}

function normalizeDrivetrain(raw: string) {
  const value = raw.toLowerCase();
  if (value.includes("all wheel") || value === "awd") return "AWD";
  if (value.includes("four wheel") || value.includes("4wd") || value.includes("4x4")) return "4WD";
  if (value.includes("front") || value === "fwd") return "FWD";
  if (value.includes("rear") || value === "rwd") return "RWD";
  return raw.trim();
}

function normalizeBodyStyle(raw: string) {
  const value = raw.toLowerCase();
  if (value.includes("sport utility") || value.includes("suv")) return "SUV";
  if (value.includes("sedan")) return "Sedan";
  if (value.includes("pickup") || value.includes("truck")) return "Pickup";
  if (value.includes("coupe")) return "Coupe";
  if (value.includes("hatch")) return "Hatchback";
  if (value.includes("van") && value.includes("mini")) return "Minivan";
  if (value.includes("convertible")) return "Convertible";
  return raw.trim();
}

function normalizeTransmission(raw: string) {
  const value = raw.toLowerCase();
  if (value.includes("automatic") || value.includes("automática") || value.includes("automatica")) {
    return "Automática";
  }
  if (value.includes("manual")) return "Manual";
  if (value.includes("cvt")) return "CVT";
  return raw.trim();
}

function normalizeKeys(raw: string) {
  const value = raw.toLowerCase();
  if (value === "yes" || value === "y" || value === "si" || value === "sí" || value.includes("present")) {
    return "Yes";
  }
  if (value === "no" || value === "n" || value.includes("missing")) return "No";
  return "Unknown";
}

function normalizeOdometerStatus(raw: string, nearby: string) {
  const blob = `${raw} ${nearby}`.toLowerCase();
  if (blob.includes("not actual") || blob.includes("exceeds")) return "Not Actual";
  if (blob.includes("exempt")) return "Exempt";
  if (blob.includes("actual")) return "Actual";
  return raw.trim() || "Unknown";
}

function parseSaleDate(raw: string) {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  // Tue. Oct 13, 2026 01:00 PM EDT
  const match = cleaned.match(
    /(?:[A-Za-z]{3}\.?\s+)?([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?(?:\s+([A-Z]{2,4}))?/i,
  );
  if (!match) {
    const iso = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!iso) return null;
    return {
      display: `${iso[1]}-${iso[2]}-${iso[3]}`,
      isoLocal: `${iso[1]}-${iso[2]}-${iso[3]}`,
      zone: "America/New_York",
    };
  }
  const months: Record<string, string> = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };
  const month = months[match[1]!.toLowerCase()];
  if (!month) return null;
  const day = match[2]!.padStart(2, "0");
  const year = match[3]!;
  let hour = match[4] ? Number(match[4]) : 0;
  const minute = match[5] ?? "00";
  const ampm = (match[6] ?? "").toUpperCase();
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const hh = String(hour).padStart(2, "0");
  return {
    display: `${year}-${month}-${day} ${hh}:${minute} America/New_York`,
    isoLocal: `${year}-${month}-${day}`,
    zone: "America/New_York",
  };
}

function detectProviderHint(text: string): "copart" | "iaa" | "manheim" | null {
  const lower = text.toLowerCase();
  const copart = /\bcopart\b/.test(lower);
  const iaa = /\biaa(?:i)?\b/.test(lower);
  const manheim = /\bmanheim\b/.test(lower);
  const hits = [copart, iaa, manheim].filter(Boolean).length;
  if (hits !== 1) return null;
  if (copart) return "copart";
  if (iaa) return "iaa";
  if (manheim) return "manheim";
  return null;
}

function pushField(
  fields: ParsedAuctionField[],
  key: ParsedAuctionFieldKey,
  value: string,
  confidence: PasteFieldConfidence,
  raw?: string,
) {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (fields.some((field) => field.key === key)) return;
  fields.push({
    key,
    label: FIELD_LABELS[key],
    value: trimmed,
    confidence,
    raw,
  });
}

export function parseAuctionPasteText(input: string): ParseAuctionPasteResult {
  const text = (input ?? "").replace(/<[^>]*>/g, "");
  const lines = cleanLines(text);
  const fields: ParsedAuctionField[] = [];
  const warnings: string[] = [];
  const providerHint = detectProviderHint(text);

  // Title line: YEAR MAKE MODEL TRIM
  for (const line of lines.slice(0, 6)) {
    const title = parseTitleLine(line);
    if (!title) continue;
    pushField(fields, "year", title.year, "high", line);
    pushField(fields, "make", title.make, "high", line);
    pushField(fields, "model", normalizeModel(title.model), "high", line);
    if (title.trim) pushField(fields, "trim", title.trim.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bTouring\b/i, "Touring").replace(/\bSport\b/i, "Sport"), "high", line);
    break;
  }

  // Standalone flags
  const joined = lines.join("\n");
  if (/\brun and drive\b/i.test(joined)) {
    pushField(fields, "run_and_drive", "Reported Run and Drive", "high");
  }
  if (/\bengine starts\b/i.test(joined)) {
    pushField(fields, "engine_starts", "Reported by Copart", providerHint === "copart" ? "high" : "medium");
  }
  if (/\btransmission engages\b/i.test(joined)) {
    pushField(fields, "transmission_engages", "Reported by Copart", providerHint === "copart" ? "high" : "medium");
  }

  for (const entry of LABEL_CATALOG) {
    const found = valueAfterLabel(lines, entry.labels);
    if (!found || !found.value) continue;
    let value = found.value;
    let confidence: PasteFieldConfidence = "high";

    if (entry.key === "vin") {
      const vin = value.replace(/\s+/g, "").toUpperCase();
      const masked = /\*/.test(vin) || vin.length < 17;
      pushField(fields, "vin", vin, masked ? "review" : "high", found.value);
      pushField(fields, "vin_status", masked ? "Masked / incomplete" : "Complete", masked ? "review" : "high");
      if (masked) warnings.push("VIN enmascarado o incompleto — no se trata como VIN válido completo.");
      continue;
    }

    if (entry.key === "mileage") {
      const mileage = parseMileage(value);
      if (!mileage) continue;
      pushField(fields, "mileage", mileage.amount, "high", found.value);
      pushField(fields, "mileage_unit", mileage.unit, "high");
      const statusNearby = lines.slice(found.index, found.index + 3).join(" ");
      const odo = normalizeOdometerStatus("", statusNearby);
      if (odo && odo !== "Unknown") {
        pushField(fields, "odometer_status", odo, "high", statusNearby);
      }
      continue;
    }

    if (entry.key === "estimated_retail_usd") {
      const amount = parseMoneyUsd(value);
      if (!amount) continue;
      pushField(fields, "estimated_retail_usd", amount, "high", found.value);
      warnings.push("El valor estimado es solo informativo; no se usa como precio público.");
      continue;
    }

    if (entry.key === "buy_now_usd") {
      const amount = parseMoneyUsd(value);
      if (!amount) continue;
      pushField(fields, "buy_now_usd", amount, "review", found.value);
      warnings.push("Buy Now detectado — confirma el monto verificado antes de publicar.");
      continue;
    }

    if (entry.key === "auction_date") {
      const parsed = parseSaleDate(value);
      if (!parsed) {
        pushField(fields, "auction_date", value, "review", found.value);
        continue;
      }
      pushField(fields, "auction_date", parsed.isoLocal, "high", parsed.display);
      continue;
    }

    if (entry.key === "fuel") value = normalizeFuel(value);
    if (entry.key === "drivetrain") value = normalizeDrivetrain(value);
    if (entry.key === "body_style") value = normalizeBodyStyle(value);
    if (entry.key === "transmission") value = normalizeTransmission(value);
    if (entry.key === "keys") value = normalizeKeys(value);
    if (entry.key === "engine") {
      const engineMatch = value.match(/(\d+(?:\.\d+)?\s*L(?:\s*\d)?)/i);
      if (engineMatch) value = engineMatch[1]!.replace(/\s+/g, "").replace(/L(\d)/i, "L $1").replace(/(\d)L/i, "$1L");
      // Prefer "2.0L" style
      const compact = value.match(/(\d+(?:\.\d+)?)L/i);
      if (compact) value = `${compact[1]}L`;
    }
    if (entry.key === "title_status") {
      // May be split: "TX -" then "Salvage Vehicle Title"
      const next = lines[found.index + 1];
      if (/^[A-Z]{2}\s*-?\s*$/i.test(value) && next && /title|salvage|clean|rebuilt|certificate/i.test(next)) {
        value = `${value.replace(/\s*-\s*$/, "").trim()} — ${next.trim()}`;
      } else if (/^[A-Z]{2}\s*-/i.test(value) === false && /salvage|clean|rebuilt/i.test(value)) {
        // keep
      }
      confidence = /salvage|clean|rebuilt|destruction|bill of sale/i.test(value) ? "high" : "medium";
    }
    if (entry.key === "notes") {
      if (/there are no notes/i.test(value) || /^n\/?a$/i.test(value) || /no notes/i.test(value)) {
        value = "No notes reported";
      }
    }
    if (entry.key === "location" || entry.key === "sale_name") {
      if (value === "-/-" || value === "-" || value === "—") continue;
    }
    if (entry.key === "run_and_drive") {
      value = /run and drive/i.test(value) ? "Reported Run and Drive" : value;
    }

    pushField(fields, entry.key, value, confidence, found.value);
  }

  // If sale name looks like a location and location missing, copy it.
  const saleName = fields.find((field) => field.key === "sale_name");
  const location = fields.find((field) => field.key === "location");
  if (saleName && !location && /[A-Z]{2}\s*-/.test(saleName.value)) {
    pushField(fields, "location", saleName.value, "medium", saleName.raw);
  }

  // Default public price mode
  pushField(fields, "price_mode", "contact", "high");
  if (!fields.some((field) => field.key === "buy_now_usd")) {
    // keep contact
  }

  if (providerHint) {
    pushField(
      fields,
      "provider_hint",
      providerHint === "iaa" ? "IAA" : providerHint === "manheim" ? "Manheim" : "Copart",
      "medium",
    );
    warnings.push("Confirma la casa de subasta — la sugerencia del texto no se aplica sola.");
  } else {
    warnings.push("No se pudo confirmar la casa de subasta desde el texto. Selecciónala manualmente.");
  }

  if (/\brun and drive\b/i.test(joined)) {
    warnings.push("“Run and Drive” no es una garantía de estado mecánico ni de aptitud para circular.");
  }

  const byKey = Object.fromEntries(fields.map((field) => [field.key, field])) as Partial<
    Record<ParsedAuctionFieldKey, ParsedAuctionField>
  >;

  return { fields, byKey, warnings, providerHint };
}

export function parsedFieldsToFormPatch(result: ParseAuctionPasteResult): Record<string, string> {
  const get = (key: ParsedAuctionFieldKey) => result.byKey[key]?.value ?? "";
  const patch: Record<string, string> = {};
  const map: Array<[ParsedAuctionFieldKey, string]> = [
    ["year", "year"],
    ["make", "make"],
    ["model", "model"],
    ["trim", "trim"],
    ["provider_lot_id", "provider_lot_id"],
    ["vin", "vin"],
    ["location", "location"],
    ["auction_date", "auction_date"],
    ["auction_sale_status", "auction_sale_status"],
    ["seller_type", "seller_type"],
    ["body_style", "body_style"],
    ["fuel", "fuel"],
    ["engine", "engine"],
    ["transmission", "transmission"],
    ["drivetrain", "drivetrain"],
    ["exterior_color", "exterior_color"],
    ["mileage", "mileage"],
    ["mileage_unit", "mileage_unit"],
    ["odometer_status", "odometer_status"],
    ["primary_damage", "primary_damage"],
    ["secondary_damage", "secondary_damage"],
    ["keys", "keys"],
    ["run_and_drive", "run_and_drive"],
    ["title_status", "title_status"],
    ["notes", "internal_notes"],
    ["source_url", "source_url"],
    ["price_mode", "price_mode"],
    ["buy_now_usd", "buy_now_usd"],
  ];
  for (const [from, to] of map) {
    const value = get(from);
    if (value) patch[to] = value;
  }
  // Prefer location; keep sale name only as fallback already handled.
  if (!patch.location && get("sale_name")) patch.location = get("sale_name");
  // Description from highlights/notes for public use when empty later.
  const highlights = get("highlights");
  const engineStarts = get("engine_starts");
  const txEngages = get("transmission_engages");
  const descParts = [highlights, engineStarts, txEngages].filter(Boolean);
  if (descParts.length) patch.description = descParts.join(". ");
  return patch;
}
