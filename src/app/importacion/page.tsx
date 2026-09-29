import Link from "next/link";
import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualFlowDiagram, VisualStepSequence } from "@/components/public/VisualStory";
import { EDITORIAL } from "@/lib/editorial-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Importación de vehículos a República Dominicana",
  description:
    "Selección, compra, transporte e importación a RD. Sin impuestos garantizados por adelantado.",
  path: "/importacion",
});

const PHASES = [
  {
    step: "01",
    title: "Vehículo",
    copy: "Selección en inventario o subasta.",
    image: {
      src: EDITORIAL.processSelect.src,
      alt: EDITORIAL.processSelect.alt,
      caption: "Selección de unidad",
    },
  },
  {
    step: "02",
    title: "Compra",
    copy: "Costos claros antes de avanzar.",
    image: {
      src: EDITORIAL.processQuote.src,
      alt: EDITORIAL.processQuote.alt,
      caption: EDITORIAL.processQuote.caption,
    },
  },
  {
    step: "03",
    title: "Transporte / export",
    copy: "Salida hacia República Dominicana.",
    image: {
      src: EDITORIAL.processImport.src,
      alt: EDITORIAL.processImport.alt,
      caption: EDITORIAL.processImport.caption,
    },
  },
  {
    step: "04",
    title: "Llegada y entrega",
    copy: "Importación y coordinación final.",
    image: {
      src: EDITORIAL.processDelivery.src,
      alt: EDITORIAL.processDelivery.alt,
      caption: EDITORIAL.processDelivery.caption,
    },
  },
] as const;

export default function ImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Importación"
        title="Del origen a República Dominicana"
        subtitle="Selección, compra y coordinación de llegada — sin cifras fijas."
      />

      <Section className="section-light bg-white" tight>
        <PageContainer>
          <SectionHeader
            kicker="Mapa del proceso"
            title="Ruta visual"
            subtitle={
              <>
                La búsqueda en subastas está en{" "}
                <Link
                  href="/subastas"
                  className="font-semibold text-[#08090b] underline underline-offset-4"
                >
                  Subastas
                </Link>
                . Aquí va el traslado a RD.
              </>
            }
          />
          <div className="mt-8">
            <VisualFlowDiagram
              label="Flujo de importación"
              nodes={["Selección", "Compra", "Transporte", "RD", "Coordinación"]}
            />
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader kicker="Detalle" title="Qué ocurre en cada etapa" />
          <VisualStepSequence steps={PHASES} tone="light" />
        </PageContainer>
      </Section>

      <Section className="section-dark bg-[#08090b]">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
            <div>
              <SectionHeader
                kicker="Estimación"
                title="Partidas de referencia"
                subtitle={`Resultado ilustrativo. WhatsApp ${SITE.whatsappDisplay}.`}
                tone="dark"
              />
              <Link
                href="/calculadoras/importacion"
                className="btn-secondary mt-8 inline-flex border-white/35 text-white md:hidden"
              >
                Abrir calculadora
              </Link>
            </div>
            <div className="hidden md:block" style={{ borderRadius: "var(--radius-card)" }}>
              <ImportCostCalculator />
            </div>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
