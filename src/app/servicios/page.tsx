import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualMedia, VisualPathCard } from "@/components/public/VisualStory";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
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
    image: {
      src: EDITORIAL.compactSuv.src,
      alt: EDITORIAL.compactSuv.alt,
      caption: "Inventario publicado",
    },
  },
  {
    title: "Búsqueda personalizada",
    copy: "Marca, modelo, año y presupuesto.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    image: {
      src: EDITORIAL.processSearch.src,
      alt: EDITORIAL.processSearch.alt,
      caption: EDITORIAL.processSearch.caption,
    },
  },
  {
    title: "Financiamiento",
    copy: "Orientación con bancos locales. No somos banco.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
    image: {
      src: EDITORIAL.processFinance.src,
      alt: EDITORIAL.processFinance.alt,
      caption: EDITORIAL.processFinance.caption,
    },
  },
  {
    title: "Subastas",
    copy: "Asistencia con Copart e IAA cuando aplica.",
    href: "/subastas",
    cta: "Ver subastas",
    image: {
      src: EDITORIAL.processBrowse.src,
      alt: EDITORIAL.processBrowse.alt,
      caption: EDITORIAL.processBrowse.caption,
    },
  },
  {
    title: "Importación",
    copy: "Transporte, costos y llegada coordinados.",
    href: "/importacion",
    cta: "Ver importación",
    image: {
      src: EDITORIAL.processImport.src,
      alt: EDITORIAL.processImport.alt,
      caption: EDITORIAL.processImport.caption,
    },
  },
] as const;

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Todo lo que necesitas en un lugar"
        subtitle={`Inventario, búsqueda y financiamiento con ${SITE.shortName}.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer>
          <SectionHeader
            kicker="Servicios"
            title="Elige tu camino"
            subtitle="La imagen muestra el servicio. El botón es el siguiente paso."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {SERVICES.map((service) => (
              <VisualPathCard key={service.title} {...service} />
            ))}
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-white">
        <PageContainer>
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <VisualMedia
              asset={{
                src: EDITORIAL.processTradeIn.src,
                alt: EDITORIAL.processTradeIn.alt,
                caption: EDITORIAL.processTradeIn.caption,
              }}
              aspect="4/3"
              sizes="(max-width: 1024px) 92vw, 48vw"
            />
            <div>
              <p className="kicker !text-[#676a70]">Trade-in</p>
              <h2 className="mt-3 display-lg text-[#08090b]">
                ¿Tienes un vehículo
                <span className="block">para entregar?</span>
              </h2>
              <p className="mt-4 max-w-[28rem] text-[length:var(--text-body-lg)] text-[#676a70]">
                Podemos evaluar tu unidad como parte del proceso de compra.
              </p>
              <p className="mt-2 text-sm text-[#676a70]">Sin valor prometido por adelantado.</p>
              <Link href="/contacto?asunto=trade-in" className="btn-primary mt-7">
                Solicitar evaluación
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
