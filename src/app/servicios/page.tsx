import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { EditorialImage } from "@/components/shared/EditorialImage";
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
    image: EDITORIAL.compactSuv,
  },
  {
    title: "Búsqueda personalizada",
    copy: "Marca, modelo, año y presupuesto.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
  },
  {
    title: "Financiamiento",
    copy: "Orientación con bancos locales. No somos banco.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
  },
  {
    title: "Subastas",
    copy: "Asistencia con Copart e IAA cuando aplica.",
    href: "/subastas",
    cta: "Ver subastas",
    image: EDITORIAL.silverSedan,
  },
  {
    title: "Importación",
    copy: "Transporte, costos y llegada coordinados.",
    href: "/importacion",
    cta: "Ver importación",
    image: EDITORIAL.carrier,
  },
  {
    title: "Trade-in",
    copy: "Evaluamos tu vehículo como parte de la compra.",
    href: "/contacto?asunto=trade-in",
    cta: "Solicitar evaluación",
  },
];

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
            subtitle="Te orientamos antes de comprometerte."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="flex flex-col overflow-hidden border border-[#e4e6ea] bg-white"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                {"image" in service && service.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#12141a]">
                    <EditorialImage
                      src={service.image.src}
                      alt={service.image.alt}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-[#08090b]">
                    {service.title}
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-[#676a70]">{service.copy}</p>
                  <Link href={service.href} className="btn-primary mt-6 w-full sm:w-auto">
                    {service.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
