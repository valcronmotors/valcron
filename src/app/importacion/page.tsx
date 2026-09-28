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
    "Orientación clara sobre selección, compra, transporte e importación de vehículos a RD. Sin montos de impuestos garantizados. Valcron Motors.",
  path: "/importacion",
});

const PHASES = [
  {
    step: "01",
    title: "Selección",
    copy: "Identificamos la unidad según lo que buscas, en inventario o mediante subasta.",
  },
  {
    step: "02",
    title: "Compra",
    copy: "Organizamos la información de compra y los costos asociados antes de avanzar.",
  },
  {
    step: "03",
    title: "Transporte y exportación",
    copy: "Traslado terrestre, booking marítimo y salida hacia República Dominicana.",
  },
  {
    step: "04",
    title: "Importación y entrega",
    copy: "Llegada, contexto de importación y coordinación de entrega. Los impuestos se confirman al despacho.",
  },
];

export default function ImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Importación"
        title="Cuando el vehículo viene de fuera"
        subtitle="Selección, compra, transporte y coordinación de llegada. Sin cifras fijas que puedan cambiar."
        image={PAGE_HERO_IMAGES.importacion}
        imageAlt={PAGE_HERO_ALTS.importacion}
      />

      <Section className="section-light bg-[#f5f6f7]">
        <PageContainer>
          <SectionHeader
            kicker="Proceso"
            title="Lo esencial, sin tecnicismos."
            subtitle={
              <>
                La búsqueda en subastas está en{" "}
                <Link
                  href="/subastas"
                  className="font-semibold text-[#08090b] underline underline-offset-4"
                >
                  Subastas
                </Link>
                . Aquí cubrimos el traslado a República Dominicana.
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
                title="Calcula partidas de referencia"
                subtitle={`El resultado es ilustrativo y no sustituye una cotización. WhatsApp ${SITE.whatsapp}.`}
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
