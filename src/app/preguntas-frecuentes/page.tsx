import Link from "next/link";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Preguntas frecuentes",
  description: `Preguntas frecuentes de ${SITE.shortName} sobre inventario, subastas, importación y financiamiento en República Dominicana.`,
  path: "/preguntas-frecuentes",
});

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
      <Section className="section-light bg-[#f5f6f7]">
        <PageContainer narrow>
          <div className="text-center">
            <SectionHeader
              align="center"
              title="Respuestas directas"
              subtitle="Si no encuentras lo que buscas, escríbenos o solicita una búsqueda personalizada."
            />
            <Link href="/solicitar-vehiculo" className="btn-secondary mt-6">
              Solicitar vehículo
            </Link>
          </div>
          <div className="mt-10 md:mt-12">
            <FaqAccordion tone="light" />
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
