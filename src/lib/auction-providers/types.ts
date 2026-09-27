export type AuctionProviderId = "copart" | "iaa" | "manheim";

export type AuctionSearchVehicle = {
  provider: AuctionProviderId;
  lotNumber: string;
  vin: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  modelDetail: string | null;
  trim: string | null;
  mileage: number | null;
  mileageUnit: "mi" | "km" | null;
  bodyStyle: string | null;
  color: string | null;
  primaryDamage: string | null;
  secondaryDamage: string | null;
  titleState: string | null;
  titleType: string | null;
  hasKeys: boolean | null;
  engine: string | null;
  drive: string | null;
  transmission: string | null;
  fuel: string | null;
  cylinders: string | null;
  runCondition: string | null;
  saleStatus: string | null;
  location: string | null;
  locationCity: string | null;
  locationState: string | null;
  saleDate: string | null;
  saleTime: string | null;
  estimatedRetailValue: number | null;
  repairCost: number | null;
  buyItNowPrice: number | null;
  currency: string | null;
  thumbnailUrl: string | null;
  imageReference: string | null;
  sellerName: string | null;
  lastUpdated: string | null;
  sourceUrl: string | null;
};

export type AuctionProviderSearchFilters = {
  query?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  locationState?: string;
  titleType?: string;
  primaryDamage?: string;
  runCondition?: string;
  buyItNow?: boolean;
  mileageMin?: number;
  mileageMax?: number;
  page?: number;
  pageSize?: number;
};

export type AuctionProviderFacets = {
  makes: string[];
  models: string[];
  locationStates: string[];
  titleTypes: string[];
  primaryDamages: string[];
  runConditions: string[];
};

export type AuctionFeedSnapshot = {
  id: string;
  status: "staging" | "active" | "failed" | "archived";
  importedAt: string | null;
  feedLastUpdated: string | null;
  rowCount: number;
  sourceFilename: string | null;
  facets: AuctionProviderFacets;
};
