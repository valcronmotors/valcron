import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { InventorySectionSkeleton } from "@/components/public/InventorySkeleton";
import { HomeAuctions } from "@/components/home/HomeAuctions";
import { HomeBlogPreview } from "@/components/home/HomeBlogPreview";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinance } from "@/components/home/HomeFinance";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeTrust } from "@/components/home/HomeTrust";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Valcron Motors | Encuentra tu próximo vehículo en República Dominicana",
  },
  description: SITE.valueProposition,
  alternates: { canonical: "/" },
  keywords: [
    "Valcron Motors",
    "dealer República Dominicana",
    "comprar vehículo RD",
    "inventario de vehículos Santo Domingo",
    "financiamiento de vehículos RD",
  ],
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Valcron Motors | Encuentra tu próximo vehículo en República Dominicana",
    description: SITE.valueProposition,
    url: SITE.url,
    images: [{ url: "/hero-luxury.png", alt: SITE.shortName }],
  },
};

async function HomeInventoryBand() {
  const inventory = await loadPublicVehicles();
  return (
    <>
      <HomeSearch vehicles={inventory.data} />
      <FeaturedInventory vehicles={inventory.data} error={inventory.error} />
    </>
  );
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
        <Suspense fallback={<InventorySectionSkeleton />}>
          <HomeInventoryBand />
        </Suspense>
        <HomeTrust />
        <HomeServices />
        <HomeFinance />
        <HomeAuctions />
        <HomeProcess />
        <HomeBlogPreview />
        <HomeFaqPreview />
        <HomeFinalCta />
      </main>
    </>
  );
}
