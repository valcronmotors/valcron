import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeActionMedia } from "@/components/home/HomeActionMedia";
import { HomeBrandCarousel } from "@/components/home/HomeBrandCarousel";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSignatureBlue } from "@/components/home/HomeSignatureBlue";
import { HomeSignatureDark } from "@/components/home/HomeSignatureDark";
import { HomeStories } from "@/components/home/HomeStories";
import { loadPublicVehicles } from "@/lib/public-inventory";
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

async function HomeInventoryBand() {
  const inventory = await loadPublicVehicles();
  return <FeaturedInventory vehicles={inventory.data} error={inventory.error} />;
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
          <HomeInventoryBand />
        </Suspense>
        <HomeSignatureDark />
        <HomeSignatureBlue />
        <HomeActionMedia />
        <HomeStories />
        <HomeFaqPreview />
        <HomeFinalCta />
      </main>
    </>
  );
}
