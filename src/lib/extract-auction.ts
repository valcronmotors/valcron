import { decodeVin } from "@/lib/vin";
import {
  listingUrlsFor,
  parseAuctionQuery,
  parseListingPage,
  usableVin,
  type AuctionExtractResult,
  type AuctionListing,
} from "@/lib/auction";

const FETCH_TIMEOUT_MS = 22000;

export async function extractAuctionListing(
  query: string,
): Promise<AuctionExtractResult> {
  const parsed = parseAuctionQuery(query);
  if (parsed.error) {
    return { error: parsed.error };
  }

  const candidates = listingUrlsFor(parsed);

  for (const candidate of candidates) {
    try {
      const pageText = await fetchListingText(candidate.url);
      const listing = parseListingPage(
        candidate.source,
        candidate.url,
        candidate.lotNumber,
        pageText,
      );

      if (!listing) {
        continue;
      }

      return { data: await enrichListing(listing) };
    } catch {
      continue;
    }
  }

  if (parsed.source) {
    return {
      error:
        "No se pudo extraer ese lote. Verifica que la URL o el número existan y que el vehículo siga publicado.",
    };
  }

  return {
    error:
      "No encontramos ese lote en Copart ni IAAI. Pega la URL completa de Copart, IAAI o Manheim.",
  };
}

async function enrichListing(listing: AuctionListing): Promise<AuctionListing> {
  const vin = usableVin(listing.vin);
  if (vin.length !== 17) {
    return listing;
  }

  const decoded = await decodeVin(vin);
  if (!decoded) {
    return { ...listing, vin };
  }

  return {
    ...listing,
    vin,
    vinMasked: false,
    marca: listing.marca || decoded.marca,
    modelo: listing.modelo || decoded.modelo,
    trim: listing.trim || decoded.trim,
    ano: listing.ano || decoded.ano,
  };
}

async function fetchListingText(url: string) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const response = await fetch(jinaUrl, {
    headers: {
      Accept: "text/plain",
      "X-Timeout": "20",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("la subasta no respondió a tiempo.");
  }

  const text = await response.text();
  if (!text.trim()) {
    throw new Error("la página del lote llegó vacía.");
  }

  return text;
}
