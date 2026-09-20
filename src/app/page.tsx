import type { Metadata } from "next";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { HomeAuctions } from "@/components/home/HomeAuctions";
import { HomeBlogPreview } from "@/components/home/HomeBlogPreview";
import { HomeCalculators } from "@/components/home/HomeCalculators";
import { HomeEditorial } from "@/components/home/HomeEditorial";
import { HomeEducation } from "@/components/home/HomeEducation";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeFinance } from "@/components/home/HomeFinance";
import { HomeGallery } from "@/components/home/HomeGallery";
import { HomeHelp } from "@/components/home/HomeHelp";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImmersive } from "@/components/home/HomeImmersive";
import { HomeImport } from "@/components/home/HomeImport";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeStory } from "@/components/home/HomeStory";
import { HomeTrust } from "@/components/home/HomeTrust";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Valcron Motors | Vehículos importados en República Dominicana",
  },
  description: SITE.valueProposition,
  alternates: { canonical: "/" },
  keywords: [
    "Valcron Motors",
    "dealer República Dominicana",
    "vehículos importados RD",
    "importación de vehículos",
    "compra vehículos en subasta",
    "vehículos desde Estados Unidos",
    "dealer Santo Domingo",
  ],
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.shortName,
    title: "Valcron Motors | Vehículos importados en República Dominicana",
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
        <HomeEditorial />
        <FeaturedInventory initialVehicles={inventory.data} error={inventory.error} />
        <HomeImmersive />
        <HomeServices />
        <HomeImport />
        <HomeAuctions />
        <HomeEducation />
        <HomeStory />
        <HomeFinance />
        <HomeCalculators />
        <HomeProcess />
        <HomeTrust />
        <HomeGallery />
        <HomeBlogPreview />
        <HomeFaqPreview />
        <HomeHelp />
        <HomeFinalCta />
      </main>
    </>
  );
}
