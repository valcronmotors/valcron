import type { Metadata } from "next";
import { HomeInventoryTabs } from "@/components/home/HomeInventoryTabs";
import { HomeBuyGuide } from "@/components/home/HomeBuyGuide";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinancingTeaser } from "@/components/home/HomeFinancingTeaser";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HomeImport } from "@/components/home/HomeImport";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeModelSpotlight } from "@/components/home/HomeModelSpotlight";
import {
  loadAuctionCatalogVehicles,
  loadLocalStockVehicles,
} from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: {
    absolute: "Dealer en Santo Domingo Este | Vehículos en venta | Valcron Motors",
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
    images: [{ url: "/api/public/social-image?v=20261110", width: 1200, height: 630, alt: "Valcron Motors — dealer en Santo Domingo Este" }],
  },
};

export default async function Home() {
  const [inventory, auctions] = await Promise.all([
    loadLocalStockVehicles(),
    loadAuctionCatalogVehicles(),
  ]);

  return (
    <>
      <JsonLd data={autoDealerJsonLd()} />
      <main>
        <HomeHero />
        <HomeInventoryTabs
          vehicles={inventory.data}
          auctions={auctions.data}
          inventoryError={inventory.error}
          auctionError={auctions.error}
        />
        <HomeTrust />
        <HomeBrandCarousel />
        <HomeImport />
        <HomeModelSpotlight />
        <HomeBuyGuide />
        <HomeFinancingTeaser />
        <HomeFinalCta />
      </main>
    </>
  );
}
