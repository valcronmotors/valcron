/** Manual auction Admin field catalogs (V26). Not exhaustive — custom values always allowed. */

export const AUCTION_PROVIDER_OPTIONS = [
  { value: "copart", label: "Copart" },
  { value: "iaa", label: "IAA" },
  { value: "manheim", label: "Manheim" },
] as const;

export const AUCTION_DAMAGE_OPTIONS = [
  "Front End",
  "Rear End",
  "Side",
  "Left Side",
  "Right Side",
  "All Over",
  "Hail",
  "Flood",
  "Water",
  "Fire",
  "Burn",
  "Mechanical",
  "Electrical",
  "Vandalism",
  "Theft",
  "Rollover",
  "Undercarriage",
  "Minor Dent/Scratches",
  "Normal Wear",
  "No Visible Damage",
  "Other",
] as const;

export const AUCTION_SECONDARY_DAMAGE_OPTIONS = ["None", "Not Reported", ...AUCTION_DAMAGE_OPTIONS] as const;

export const AUCTION_RUN_DRIVE_OPTIONS = [
  "Reported Run and Drive",
  "Starts",
  "Enhanced Vehicle",
  "Not Reported",
  "Not Running",
  "Other",
] as const;

export const AUCTION_KEYS_OPTIONS = ["Yes", "No", "Unknown"] as const;

export const AUCTION_ODOMETER_OPTIONS = ["Actual", "Exempt", "Not Actual", "Unknown"] as const;

export const AUCTION_TITLE_OPTIONS = [
  "Clean Title",
  "Salvage Title",
  "Rebuilt Title",
  "Certificate of Destruction",
  "Bill of Sale",
  "Parts Only",
  "Non-Repairable",
  "Other",
  "Unknown",
] as const;

export const AUCTION_SALE_STATUS_OPTIONS = [
  "Próxima subasta",
  "Subasta programada",
  "En subasta",
  "Buy Now disponible",
  "Vendido en subasta",
  "No vendido",
  "Retirado",
  "Estado desconocido",
] as const;

export const AUCTION_PRICE_MODES = [
  { value: "contact", label: "Precio a consultar" },
  { value: "buy_now", label: "Buy Now" },
] as const;

export type AuctionAdminPriceMode = (typeof AUCTION_PRICE_MODES)[number]["value"];

export const BUY_NOW_DISCLAIMER =
  "Precio de compra en subasta. No incluye transporte, impuestos, aduanas ni otros costos de importación.";

export type AuctionAdminMetadata = {
  secondary_damage?: string | null;
  run_and_drive?: string | null;
  keys?: string | null;
  odometer_status?: string | null;
  body_style?: string | null;
  fuel?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  engine?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  mileage_unit?: "mi" | "km" | null;
  description?: string | null;
  auction_sale_status?: string | null;
  city?: string | null;
  state?: string | null;
  auction_date?: string | null;
  seller_type?: string | null;
  price_mode?: AuctionAdminPriceMode | null;
  buy_now_usd?: number | null;
  video_url?: string | null;
  featured?: boolean | null;
};

export function readAuctionMetadata(raw: Record<string, unknown> | null | undefined): AuctionAdminMetadata {
  const meta = raw ?? {};
  const priceMode = meta.price_mode === "buy_now" ? "buy_now" : meta.price_mode === "contact" ? "contact" : "contact";
  const buyNow = typeof meta.buy_now_usd === "number" && Number.isFinite(meta.buy_now_usd) ? meta.buy_now_usd : null;
  return {
    secondary_damage: typeof meta.secondary_damage === "string" ? meta.secondary_damage : null,
    run_and_drive: typeof meta.run_and_drive === "string" ? meta.run_and_drive : null,
    keys: typeof meta.keys === "string" ? meta.keys : null,
    odometer_status: typeof meta.odometer_status === "string" ? meta.odometer_status : null,
    body_style: typeof meta.body_style === "string" ? meta.body_style : null,
    fuel: typeof meta.fuel === "string" ? meta.fuel : null,
    transmission: typeof meta.transmission === "string" ? meta.transmission : null,
    drivetrain: typeof meta.drivetrain === "string" ? meta.drivetrain : null,
    engine: typeof meta.engine === "string" ? meta.engine : null,
    exterior_color: typeof meta.exterior_color === "string" ? meta.exterior_color : null,
    interior_color: typeof meta.interior_color === "string" ? meta.interior_color : null,
    mileage_unit: meta.mileage_unit === "km" ? "km" : meta.mileage_unit === "mi" ? "mi" : "mi",
    description: typeof meta.description === "string" ? meta.description : null,
    auction_sale_status: typeof meta.auction_sale_status === "string" ? meta.auction_sale_status : null,
    city: typeof meta.city === "string" ? meta.city : null,
    state: typeof meta.state === "string" ? meta.state : null,
    auction_date: typeof meta.auction_date === "string" ? meta.auction_date : null,
    seller_type: typeof meta.seller_type === "string" ? meta.seller_type : null,
    price_mode: priceMode,
    buy_now_usd: buyNow,
    video_url: typeof meta.video_url === "string" ? meta.video_url : null,
    featured: Boolean(meta.featured),
  };
}

export function mergeAuctionMetadata(
  existing: Record<string, unknown> | null | undefined,
  patch: AuctionAdminMetadata,
): Record<string, unknown> {
  return {
    ...(existing ?? {}),
    ...patch,
  };
}
