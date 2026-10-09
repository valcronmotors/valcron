import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeAuctionCarousel } from "@/components/home/HomeAuctionCarousel";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeBuyGuide } from "@/components/home/HomeBuyGuide";
import { HomeDiscover } from "@/components/home/HomeDiscover";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeLineup } from "@/components/home/HomeLineup";
import {
  loadAuctionCatalogVehicles,
  loadLocalStockVehicles,
} from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Más opciones. Más cerca de ti. | Valcron Motors",
  },
  description: SITE.valueProposition,
  alternates: { canonical: "/" },
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Más opciones. Más cerca de ti. | Valcron Motors",
    description: SITE.valueProposition,
    url: SITE.url,
    images: [{ url: "/hero-luxury.png", alt: SITE.shortName }],
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
        <Suspense fallback={null}>
          <HomeAuctionInventoryBand />
        </Suspense>
        <HomeDiscover />
        <HomeFaqPreview />
        <HomeLineup />
      </main>
    </>
  );
}
