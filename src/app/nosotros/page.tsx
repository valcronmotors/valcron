import Link from "next/link";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualMedia } from "@/components/public/VisualStory";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Nosotros | Dealer en Santo Domingo Este",
  description:
    "Valcron Motors en Av Principal 20. Inventario local, búsqueda y financiamiento con bancos locales.",
  path: "/nosotros",
});

const POINTS = [
  "Inventario local y búsqueda cuando no hay stock.",
  "Copart e IAA como fuentes de mercado — no socios.",
  "Proceso claro hasta el cierre, sin promesas vacías.",
];

export default function NosotrosPage() {
  return (
    <main>
      <PageHero
        kicker="Nosotros"
        title="Dealer directo en Santo Domingo Este"
        subtitle={`${SITE.shortName}: unidades reales, opciones de pago y búsqueda cuando hace falta.`}
        image={PAGE_HERO_IMAGES.nosotros}
        imageAlt={PAGE_HERO_ALTS.nosotros}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
            <VisualMedia
              asset={{
                src: EDITORIAL.citySuv.src,
                alt: EDITORIAL.citySuv.alt,
                caption: "Fotografía editorial · no representa instalaciones de Valcron",
              }}
              aspect="4/3"
              sizes="(max-width: 1024px) 92vw, 48vw"
            />
            <div>
              <SectionHeader kicker="Quiénes somos" title="Atención personalizada, proceso serio." />
              <ul
                className="mt-8 grid gap-4 border border-[#e4e6ea] bg-[#f7f8fa] p-6 md:p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                {POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-base leading-relaxed text-[#676a70] md:text-lg"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2b6cff]" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/inventario" className="btn-primary">
                  Ver inventario
                </Link>
                <Link href="/solicitar-vehiculo" className="btn-secondary">
                  Solicitar vehículo
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      <BusinessLocation variant="full" heading="Nuestra ubicación" />
    </main>
  );
}
