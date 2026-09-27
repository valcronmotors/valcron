import { parseAuctionSourceUrl } from "@/lib/auctions/url";

export async function extractAuctionListing(query: string) {
  const parsed = parseAuctionSourceUrl(query);
  if (!parsed.data) {
    return { error: parsed.error ?? "URL inválida." };
  }

  return {
    data: {
      provider: parsed.data.provider,
      lotNumber: parsed.data.providerLotId,
      url: parsed.data.sourceUrl,
      extraction: "NOT_CONFIGURED" as const,
    },
  };
}
