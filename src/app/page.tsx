import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeAuctionCarousel } from "@/components/home/HomeAuctionCarousel";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeBuyGuide } from "@/components/home/HomeBuyGuide";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinancingTeaser } from "@/components/home/HomeFinancingTeaser";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeModelSpotlight } from "@/components/home/HomeModelSpotlight";
import {
  loadAuctionCatalogVehicles,
  loadLocalStockVehicles,
} from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";

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
    // Corporate social card; vehicle detail pages retain their real cover photo.
    images: [{ url: "/api/public/social-image", width: 1200, height: 630, alt: "Valcron Motors — dealer en Santo Domingo Este" }],
  },
};

async function HomeLocalInventoryBand() {
  const inventory = await loadLocalStockVehicles({ limit: 12 });
  return <FeaturedInventory vehicles={inventory.data} error={inventory.error} />;
}

async function HomeAuctionInventoryBand() {
  const auctions = await loadAuctionCatalogVehicles({ limit: 12 });
  return <HomeAuctionCarousel vehicles={auctions.data} error={auctions.error} />;
}

/**
 * Vehicle-led home. Editorial model references stay separate from real stock.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd()) }}
      />
      <main>
        <HomeHero />
        <HomeBrandCarousel />
        <HomeBuyGuide />
        <HomeModelSpotlight />
        <Suspense fallback={<InventorySectionSkeleton />}>
          <HomeLocalInventoryBand />
        </Suspense>
        <Suspense fallback={null}>
          <HomeAuctionInventoryBand />
        </Suspense>
        <HomeFinancingTeaser />
        <HomeFinalCta />
      </main>
    </>
  );
}
