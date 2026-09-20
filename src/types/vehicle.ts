export type VehicleSource = "stock_rd" | "copart" | "iaai" | "manheim" | "manual" | "other";

export type VehicleAvailability =
  | "available_rd"
  | "auction"
  | "in_transit"
  | "reserved"
  | "sold"
  | "coming_soon";

export type VehicleCurrency = "USD" | "DOP";

export type VehicleImageCategory =
  | "exterior"
  | "interior"
  | "damage"
  | "engine"
  | "document"
  | "other";

export type AuctionPlatform = "copart" | "iaai" | "manheim" | "other";

export type VehiclePriceKind =
  | "sale"
  | "current_bid"
  | "buy_now"
  | "estimated"
  | "consult";

export interface VehicleImage {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  order: number;
  category?: VehicleImageCategory;
}

export interface VehiclePricing {
  currency?: VehicleCurrency;
  publicPrice?: number | null;
  rdPrice?: number | null;
  usdPrice?: number | null;
  currentBid?: number | null;
  buyNowPrice?: number | null;
  estimatedPrice?: number | null;
  priceVisible?: boolean;
  priceLabel?: string | null;
  kind?: VehiclePriceKind;
  exchangeRate?: number | null;
}

export interface AuctionInformation {
  platform?: AuctionPlatform;
  lotNumber?: string | null;
  externalId?: string | null;
  sourceUrl?: string | null;
  saleDate?: string | null;
  saleStatus?: string | null;
  currentBid?: number | null;
  buyNowPrice?: number | null;
  lastSyncedAt?: string | null;
}

export interface PublicVehicle {
  id: string;
  slug: string;
  source: VehicleSource;
  sourceVehicleId?: string | null;
  sourceUrl?: string | null;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  vin?: string | null;
  stockNumber?: string | null;
  bodyType?: string | null;
  mileage?: number | null;
  mileageUnit?: "mi" | "km";
  engine?: string | null;
  cylinders?: number | null;
  fuelType?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  titleType?: string | null;
  condition?: string | null;
  primaryDamage?: string | null;
  secondaryDamage?: string | null;
  keysAvailable?: boolean | null;
  runAndDrive?: boolean | null;
  location?: string | null;
  availability: VehicleAvailability;
  images: VehicleImage[];
  pricing: VehiclePricing;
  auction?: AuctionInformation | null;
  description?: string | null;
  features?: string[];
  published: boolean;
  featured?: boolean;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastSyncedAt?: string | null;
  marca: string;
  modelo: string;
  ano: number;
  fotosUrls: string[];
  estado: string;
  fuenteSubasta: string | null;
  ubicacion: string;
  listingKind: "dealer" | "auction";
  precioVentaDop: number;
  precioVentaUsd: number;
  tasaUsdDop: number;
  especificaciones: {
    marca: string;
    modelo: string;
    ano: number;
    version: string | null;
    vin: string;
  };
}

export type PublicVehicleRow = {
  id: string;
  vin: string | null;
  marca: string | null;
  modelo: string | null;
  trim: string | null;
  trim_version?: string | null;
  ano: number | null;
  precio_venta_dop: number | null;
  tasa_usd_dop?: number | null;
  fotos_urls: string[] | null;
  estado?: string | null;
  fuente_subasta?: string | null;
  ubicacion_lote?: string | null;
  lote_numero?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type VehicleSort =
  | "recent"
  | "price_asc"
  | "price_desc"
  | "year_desc"
  | "year_asc";

export type VehicleQuery = {
  q?: string;
  availability?: VehicleAvailability | "all";
  source?: VehicleSource | "";
  make?: string;
  model?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  priceMinUsd?: number;
  priceMaxUsd?: number;
  sort?: VehicleSort;
  page?: number;
  limit?: number;
  includeSold?: boolean;
};

export type VehiclePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type VehicleFacets = {
  makes: string[];
  models: string[];
  years: number[];
  sources: VehicleSource[];
  availability: Partial<Record<VehicleAvailability, number>>;
};

export type VehicleListResult = {
  data: PublicVehicle[];
  pagination: VehiclePagination;
  facets: VehicleFacets;
  error: string | null;
};
