import type { Metadata } from "next";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { HomeAuctions } from "@/components/home/HomeAuctions";
import { HomeBlogPreview } from "@/components/home/HomeBlogPreview";
import { HomeEditorial } from "@/components/home/HomeEditorial";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinance } from "@/components/home/HomeFinance";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImport } from "@/components/home/HomeImport";
import { HomeLocation } from "@/components/home/HomeLocation";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeProtection } from "@/components/home/HomeProtection";
import { HomePurchase } from "@/components/home/HomePurchase";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HomeShopBy } from "@/components/home/HomeShopBy";
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
    "seguro de vehículos RD",
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

export default async function Home() {
  const inventory = await loadPublicVehicles();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd()) }}
      />
      <main>
        <HomeHero />
        <HomeSearch vehicles={inventory.data} />
        <FeaturedInventory initialVehicles={inventory.data} error={inventory.error} />
        <HomeShopBy />
        <HomeEditorial />
        <HomePurchase />
        <HomeFinance />
        <HomeProtection />
        <HomeProcess />
        <HomeAuctions />
        <HomeImport />
        <HomeBlogPreview />
        <HomeFaqPreview />
        <HomeLocation />
        <HomeFinalCta />
      </main>
    </>
  );
}
