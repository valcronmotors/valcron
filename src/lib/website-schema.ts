export const VEHICLE_STATUSES = ["draft", "available", "reserved", "sold", "hidden"] as const;
export const VEHICLE_SOURCE_TYPES = ["valcron_stock", "consignment", "trade_in", "other"] as const;
export const VEHICLE_MILEAGE_UNITS = ["mi", "km"] as const;
export const VEHICLE_CURRENCIES = ["USD", "DOP"] as const;
export const PUBLIC_PRICE_MODES = ["contact", "from", "estimated", "fixed"] as const;
export const PUBLIC_VEHICLE_STATUSES = ["available", "reserved", "sold"] as const;
export const CATALOG_VEHICLE_STATUSES = ["available", "reserved"] as const;

export const AUCTION_PROVIDERS = ["copart", "iaa", "manheim", "other"] as const;
export const AUCTION_OPPORTUNITY_STATUSES = ["draft", "review", "published", "archived"] as const;

export const INQUIRY_STATUSES = ["new", "in_progress", "closed"] as const;
export const INQUIRY_SOURCES = ["web", "whatsapp", "other"] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
export type VehicleSourceType = (typeof VEHICLE_SOURCE_TYPES)[number];
export type VehicleMileageUnit = (typeof VEHICLE_MILEAGE_UNITS)[number];
export type VehicleCurrencyCode = (typeof VEHICLE_CURRENCIES)[number];
export type PublicPriceMode = (typeof PUBLIC_PRICE_MODES)[number];
export type AuctionProvider = (typeof AUCTION_PROVIDERS)[number];
export type AuctionOpportunityStatus = (typeof AUCTION_OPPORTUNITY_STATUSES)[number];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export type VehiclePhotoRow = {
  id: string;
  vehicle_id: string;
  storage_path: string;
  sort_order: number;
  is_cover: boolean;
  alt_text: string | null;
  created_at: string;
};

export type VehicleRow = {
  id: string;
  stock_number: string | null;
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  mileage_unit: VehicleMileageUnit;
  exterior_color: string | null;
  interior_color: string | null;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  fuel: string | null;
  condition: string | null;
  title_status: string | null;
  description: string | null;
  price: number | null;
  currency: VehicleCurrencyCode;
  public_price_mode?: PublicPriceMode | null;
  location: string | null;
  source_type: VehicleSourceType;
  status: VehicleStatus;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  vehicle_photos?: VehiclePhotoRow[] | null;
};

export type AuctionOpportunityRow = {
  id: string;
  provider: AuctionProvider;
  provider_lot_id: string | null;
  source_url: string | null;
  vin: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  mileage: number | null;
  title_status: string | null;
  primary_damage: string | null;
  location: string | null;
  auction_metadata: Record<string, unknown>;
  internal_notes: string | null;
  status: AuctionOpportunityStatus;
  linked_vehicle_id: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  vehicle_id: string | null;
  auction_opportunity_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  source: InquirySource;
  status: InquiryStatus;
  created_at: string;
};

export function isVehicleStatus(value: unknown): value is VehicleStatus {
  return VEHICLE_STATUSES.includes(value as VehicleStatus);
}

export function isVehicleSourceType(value: unknown): value is VehicleSourceType {
  return VEHICLE_SOURCE_TYPES.includes(value as VehicleSourceType);
}

export function isPublicPriceMode(value: unknown): value is PublicPriceMode {
  return PUBLIC_PRICE_MODES.includes(value as PublicPriceMode);
}

export function isAuctionProvider(value: unknown): value is AuctionProvider {
  return AUCTION_PROVIDERS.includes(value as AuctionProvider);
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return INQUIRY_STATUSES.includes(value as InquiryStatus);
}

export function canPublishVehicleStatus(status: VehicleStatus) {
  return (PUBLIC_VEHICLE_STATUSES as readonly string[]).includes(status);
}

export function isPubliclyVisible(vehicle: Pick<VehicleRow, "published" | "status">) {
  return vehicle.published === true && canPublishVehicleStatus(vehicle.status);
}

export function isPublicCatalogListing(vehicle: Pick<VehicleRow, "published" | "status">) {
  return vehicle.published === true && (CATALOG_VEHICLE_STATUSES as readonly string[]).includes(vehicle.status);
}

export function isPublicDetailListing(vehicle: Pick<VehicleRow, "published" | "status">) {
  return isPubliclyVisible(vehicle);
}
