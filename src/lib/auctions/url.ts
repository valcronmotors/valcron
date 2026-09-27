import type { AuctionProvider } from "@/lib/website-schema";
import { normalizeCopartLotNumber } from "@/lib/auction-providers/copart/urls";

export type AuctionUrlParseResult = {
  provider: AuctionProvider;
  providerLotId: string | null;
  sourceUrl: string;
};

export type AuctionProviderAdapter = {
  id: AuctionProvider;
  label: string;
  detect(url: URL): boolean;
  parseLot(url: URL): string | null;
  extractAuthorized(): { status: "NOT_CONFIGURED" };
};

function extractLotFromPath(pathname: string, pattern: RegExp) {
  const match = pathname.match(pattern);
  return match?.[1] ?? null;
}

export const AUCTION_PROVIDER_ADAPTERS: AuctionProviderAdapter[] = [
  {
    id: "copart",
    label: "Copart",
    detect(url) {
      return url.hostname.toLowerCase().includes("copart.");
    },
    parseLot(url) {
      return normalizeCopartLotNumber(extractLotFromPath(url.pathname, /\/lot\/(\d+)/i));
    },
    extractAuthorized() {
      return { status: "NOT_CONFIGURED" };
    },
  },
  {
    id: "iaa",
    label: "IAA",
    detect(url) {
      const host = url.hostname.toLowerCase();
      return host.includes("iaai.") || host.includes("iaa.");
    },
    parseLot(url) {
      return (
        extractLotFromPath(url.pathname, /\/vehicledetail\/(\d+)/i) ||
        extractLotFromPath(url.pathname, /\/vehicle\/(\d+)/i)
      );
    },
    extractAuthorized() {
      return { status: "NOT_CONFIGURED" };
    },
  },
  {
    id: "manheim",
    label: "Manheim",
    detect(url) {
      return url.hostname.toLowerCase().includes("manheim.");
    },
    parseLot(url) {
      return (
        url.searchParams.get("workOrderNumber") ||
        url.searchParams.get("lot") ||
        extractLotFromPath(url.pathname, /\/(\d{5,})/)
      );
    },
    extractAuthorized() {
      return { status: "NOT_CONFIGURED" };
    },
  },
];

export function detectAuctionProvider(url: URL) {
  return AUCTION_PROVIDER_ADAPTERS.find((adapter) => adapter.detect(url)) ?? null;
}

export function parseAuctionSourceUrl(input: string): {
  data: AuctionUrlParseResult | null;
  error: string | null;
  extraction: "NOT_CONFIGURED";
} {
  const query = input.trim();
  if (!query) {
    return {
      data: null,
      error: "Pega una URL de Copart o IAA.",
      extraction: "NOT_CONFIGURED",
    };
  }

  if (!/^https?:\/\//i.test(query)) {
    return {
      data: null,
      error: "Pega la URL completa de la subasta. No extraemos datos automáticamente.",
      extraction: "NOT_CONFIGURED",
    };
  }

  let url: URL;
  try {
    url = new URL(query);
  } catch {
    return { data: null, error: "La URL no es válida.", extraction: "NOT_CONFIGURED" };
  }

  const adapter = detectAuctionProvider(url);
  if (!adapter) {
    return {
      data: {
        provider: "other",
        providerLotId: null,
        sourceUrl: url.toString(),
      },
      error: null,
      extraction: "NOT_CONFIGURED",
    };
  }

  return {
    data: {
      provider: adapter.id,
      providerLotId: adapter.parseLot(url),
      sourceUrl: url.toString(),
    },
    error: null,
    extraction: "NOT_CONFIGURED",
  };
}

export function authorizedAuctionExtraction() {
  return { status: "NOT_CONFIGURED" as const };
}

export function isAuctionOpportunityPublic(status: string, publishedVehicle = false) {
  return publishedVehicle && status === "published";
}
