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
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <div>
              <h1 className="display-lg text-[#08090b]">
                Preguntas
                <span className="block">frecuentes</span>
              </h1>
              <p className="mt-3 max-w-sm text-[length:var(--text-body-lg)] text-[#676a70]">
                ¿Todavía tienes dudas?
              </p>
              <Link href="/solicitar-vehiculo" className="btn-secondary mt-6">
                Solicitar vehículo
              </Link>
            </div>
            <div>
              <FaqAccordion tone="light" />
            </div>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
