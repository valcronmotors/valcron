import type { Metadata } from "next";
import { HomeFeaturedList } from "@/components/home/HomeFeaturedList";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinancingTeaser } from "@/components/home/HomeFinancingTeaser";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HomeImport } from "@/components/home/HomeImport";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeModelSpotlight } from "@/components/home/HomeModelSpotlight";
import { loadAuctionCatalogVehicles } from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: {
    absolute:
      "Dealer en Santo Domingo Este | Vehículos en venta | Valcron Motors",
  },
  description: SITE.valueProposition,
  alternates: { canonical: "/" },
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Dealer en Santo Domingo Este | Valcron Motors",
    description: SITE.valueProposition,
    url: SITE.url,
    images: [
      {
        url: "/api/public/social-image?v=20261110",
        width: 1200,
        height: 630,
        alt: "Valcron Motors — dealer en Santo Domingo Este",
      },
    ],
  },
};

export default async function Home() {
  // Inventario destacado de la home: 12 vehículos de subasta (3 columnas × 4).
  const auctions = await loadAuctionCatalogVehicles({ limit: 12 });

  return (
    <>
      <JsonLd data={autoDealerJsonLd()} />
      <main>
        <HomeHero />
        <HomeBrandCarousel />
        <HomeFeaturedList vehicles={auctions.data} error={auctions.error} />
        <HomeImport />
        <HomeModelSpotlight />
        <HomeFinancingTeaser />
        <HomeFinalCta />
        <HomeTrust />
      </main>
    </>
  );
}
