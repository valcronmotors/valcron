import Link from "next/link";
import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { NumberedSteps } from "@/components/public/NumberedSteps";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Importación de vehículos a República Dominicana",
  description:
    "Selección, compra, transporte e importación a RD. Sin impuestos garantizados por adelantado.",
  path: "/importacion",
});

const PHASES = [
  { step: "01", title: "Selección", copy: "Unidad en inventario o subasta." },
  { step: "02", title: "Compra", copy: "Costos antes de avanzar." },
  { step: "03", title: "Transporte", copy: "Traslado y salida hacia RD." },
  { step: "04", title: "Llegada", copy: "Importación y entrega coordinada." },
];

export default function ImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Importación"
        title="Del origen a República Dominicana"
        subtitle="Selección, compra y coordinación de llegada — sin cifras fijas."
        image={PAGE_HERO_IMAGES.importacion}
        imageAlt={PAGE_HERO_ALTS.importacion}
      />

      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer>
          <SectionHeader
            kicker="Proceso"
            title="Cuatro pasos esenciales"
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
          <NumberedSteps steps={PHASES} tone="light" />
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
