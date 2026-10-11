import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeAuctionCarousel } from "@/components/home/HomeAuctionCarousel";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeBuyGuide } from "@/components/home/HomeBuyGuide";
import { HomeDiscover } from "@/components/home/HomeDiscover";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinancingTeaser } from "@/components/home/HomeFinancingTeaser";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeResourcesPreview } from "@/components/home/HomeResourcesPreview";
import { HomeTrust } from "@/components/home/HomeTrust";
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
 * V19 home sequence (concise):
 * hero → marquee → Inventario Valcron → buying tools → Discover →
 * auctions → financing/import → trust → resources → FAQ → final CTA
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
        <Suspense fallback={<InventorySectionSkeleton />}>
          <HomeLocalInventoryBand />
        </Suspense>
        <HomeBuyGuide />
        <HomeDiscover />
        <Suspense fallback={null}>
          <HomeAuctionInventoryBand />
        </Suspense>
        <HomeFinancingTeaser />
        <HomeTrust />
        <HomeResourcesPreview />
        <HomeFaqPreview />
        <HomeFinalCta />
      </main>
    </>
  );
}
