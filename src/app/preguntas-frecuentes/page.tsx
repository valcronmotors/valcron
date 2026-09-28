import Link from "next/link";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Preguntas frecuentes",
  description: `Respuestas de ${SITE.shortName} sobre inventario, subastas, importación y financiamiento.`,
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  return (
    <main>
      <PageHero
        kicker="Recursos"
        title="Preguntas frecuentes"
        subtitle="Respuestas cortas antes de comprar o solicitar una búsqueda."
        image={PAGE_HERO_IMAGES.nosotros}
        imageAlt={PAGE_HERO_ALTS.nosotros}
      />
      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer narrow>
          <div className="text-center">
            <SectionHeader
              align="center"
              kicker="FAQ"
              title="Lo esencial"
              subtitle="¿No encuentras tu duda? Escríbenos o solicita un vehículo."
            />
            <Link href="/solicitar-vehiculo" className="btn-primary mt-6">
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
