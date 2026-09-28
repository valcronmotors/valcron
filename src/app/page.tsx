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
import { HomeTradeIn } from "@/components/home/HomeTradeIn";
import { HomeTrust } from "@/components/home/HomeTrust";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Dealer de Vehículos en Santo Domingo Este | Valcron Motors",
  },
  description:
    "Encuentra vehículos disponibles en República Dominicana o solicita una unidad. Financiamiento con bancos locales y opciones mediante subasta. Valcron Motors, Santo Domingo Este.",
  alternates: { canonical: "/" },
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Dealer de Vehículos en Santo Domingo Este | Valcron Motors",
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
        {/* 01 Hero */}
        <HomeHero />
        {/* 02 Search + 03 Inventory */}
        <Suspense fallback={<InventorySectionSkeleton />}>
          <HomeInventoryBand />
        </Suspense>
        {/* 04 Why Valcron */}
        <HomeTrust />
        {/* 05 Services */}
        <HomeServices />
        {/* 06 Financing */}
        <HomeFinance />
        {/* 07 Auction sourcing */}
        <HomeAuctions />
        {/* 08 Trade-in */}
        <HomeTradeIn />
        {/* 09 Process */}
        <HomeProcess />
        {/* 10 Resources */}
        <HomeBlogPreview />
        {/* 11 FAQ */}
        <HomeFaqPreview />
        {/* 12 Final conversion */}
        <HomeFinalCta />
      </main>
    </>
  );
}
