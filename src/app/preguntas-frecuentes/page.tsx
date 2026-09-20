import { PageHero } from "@/components/public/PageHero";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: `Preguntas frecuentes de ${SITE.shortName} sobre inventario, subastas, importación y financiamiento en República Dominicana.`,
};

export default function FaqPage() {
  return (
    <main>
      <PageHero
        kicker="Recursos"
        title="Preguntas frecuentes"
        subtitle="Orientación clara antes de comprar, importar o solicitar una búsqueda."
        image={PAGE_HERO_IMAGES.nosotros}
        imageAlt={PAGE_HERO_ALTS.nosotros}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
          <FaqAccordion tone="light" />
        </div>
      </section>
    </main>
  );
}
