import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeAuctionCarousel } from "@/components/home/HomeAuctionCarousel";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeBuyGuide } from "@/components/home/HomeBuyGuide";
import { HomeDiscover } from "@/components/home/HomeDiscover";
import { HomeExplore } from "@/components/home/HomeExplore";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinancingTeaser } from "@/components/home/HomeFinancingTeaser";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeResourcesPreview } from "@/components/home/HomeResourcesPreview";
import { HomeStories } from "@/components/home/HomeStories";
import { HomeTrust } from "@/components/home/HomeTrust";
import { HOME_HERO_IMAGE } from "@/lib/hero-media";
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
    images: [{ url: HOME_HERO_IMAGE.src, alt: HOME_HERO_IMAGE.alt }],
  },
};

async function HomeExploreBand() {
  const inventory = await loadLocalStockVehicles({ limit: 12 });
  return <HomeExplore vehicles={inventory.data} error={inventory.error} />;
}

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
          <HomeExploreBand />
        </Suspense>
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
        <HomeStories />
        <HomeResourcesPreview />
        <HomeFaqPreview />
        <HomeFinalCta />
      </main>
    </>
  );
}
