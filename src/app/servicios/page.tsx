import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { CompactFeatureCard, CompactPathTile } from "@/components/public/CompactFeature";
import { EDITORIAL } from "@/lib/editorial-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Servicios automotrices en Santo Domingo Este",
  description:
    "Inventario, búsqueda, financiamiento con bancos locales, subastas, importación y trade-in.",
  path: "/servicios",
});

const SERVICES = [
  {
    title: "Compra de vehículos",
    copy: "Unidades en inventario, listas para evaluar.",
    href: "/inventario",
    cta: "Ver inventario",
    image: { src: EDITORIAL.compactSuv.src, alt: EDITORIAL.compactSuv.alt },
  },
  {
    title: "Búsqueda personalizada",
    copy: "Marca, modelo, año y presupuesto.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    image: { src: EDITORIAL.processSearch.src, alt: EDITORIAL.processSearch.alt },
  },
  {
    title: "Financiamiento",
    copy: "Orientación con bancos locales. No somos banco.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
    image: { src: EDITORIAL.processFinance.src, alt: EDITORIAL.processFinance.alt },
  },
  {
    title: "Subastas",
    copy: "Asistencia con Copart e IAA cuando aplica.",
    href: "/subastas",
    cta: "Ver subastas",
    image: { src: EDITORIAL.processBrowse.src, alt: EDITORIAL.processBrowse.alt },
  },
  {
    title: "Importación",
    copy: "Transporte, costos y llegada coordinados.",
    href: "/importacion",
    cta: "Ver importación",
    image: { src: EDITORIAL.processImport.src, alt: EDITORIAL.processImport.alt },
  },
  {
    title: "Trade-in",
    copy: "Evalúa tu unidad como parte de la compra.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar evaluación",
    image: { src: EDITORIAL.processTradeIn.src, alt: EDITORIAL.processTradeIn.alt },
  },
] as const;

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Todo lo que necesitas en un lugar"
        subtitle={`Inventario, búsqueda y financiamiento con ${SITE.shortName}.`}
      />
      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader kicker="Servicios" title="Elige tu camino" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <CompactPathTile key={service.title} {...service} />
            ))}
          </div>
          <div className="mt-6">
            <CompactFeatureCard
              tone="blue"
              title="Lo encontramos contigo"
              steps={[
                "Dinos marca y modelo",
                "Revisamos opciones",
                "Cotizamos el proceso",
              ]}
              href="/solicitar-vehiculo"
              cta="Solicitar vehículo"
              image={{ src: EDITORIAL.familySedan.src, alt: EDITORIAL.familySedan.alt }}
            />
          </div>
          <div className="mt-8">
            <Link href="/contacto" className="btn-primary">
              Hablar con Valcron
            </Link>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
