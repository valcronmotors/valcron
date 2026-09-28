import Link from "next/link";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { PageContainer, Section } from "@/components/public/layout";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Preguntas frecuentes",
  description: `Preguntas frecuentes de ${SITE.shortName} sobre inventario, subastas, importación y financiamiento en República Dominicana.`,
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  return (
    <main className="section-light bg-[#f7f8fa]">
      <Section tight>
        <PageContainer narrow>
          <div className="text-center">
            <h1 className="display-lg text-[#08090b]">
              Preguntas
              <span className="block">frecuentes</span>
            </h1>
            <p className="mt-3 text-[length:var(--text-body-lg)] text-[#676a70]">
              ¿Todavía tienes dudas?
            </p>
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
