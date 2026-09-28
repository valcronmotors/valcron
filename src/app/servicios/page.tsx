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
    "Compra de vehículos, búsqueda personalizada, financiamiento con bancos locales, subastas, importación y trade-in. Valcron Motors.",
  path: "/servicios",
});

const SERVICES = [
  {
    title: "Compra de vehículos",
    copy: "Unidades publicadas en inventario, listas para evaluar y comprar en República Dominicana.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.compactSuv,
  },
  {
    title: "Búsqueda personalizada",
    copy: "Dinos marca, modelo, año y presupuesto. Buscamos opciones que encajen.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
  },
  {
    title: "Financiamiento",
    copy: "Orientación para presentar tu caso ante bancos locales. Valcron no es el prestamista.",
    href: "/financiamiento",
    cta: "Conocer opciones",
  },
  {
    title: "Subastas",
    copy: "Asistencia con vehículos disponibles mediante plataformas como Copart e IAA.",
    href: "/subastas",
    cta: "Explorar subastas",
    image: EDITORIAL.silverSedan,
  },
  {
    title: "Importación",
    copy: "Acompañamos el proceso de transporte, costos y llegada cuando aplica a tu caso.",
    href: "/importacion",
    cta: "Ver importación",
    image: EDITORIAL.carrier,
  },
  {
    title: "Trade-in",
    copy: "¿Tienes un vehículo para entregar? Podemos evaluarlo como parte de la compra.",
    href: "/contacto?asunto=trade-in",
    cta: "Solicitar evaluación",
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Cómo te ayudamos a conseguir tu vehículo"
        subtitle={`Soluciones claras de ${SITE.shortName}: inventario local, búsqueda, financiamiento y opciones de subasta.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <Section className="section-light bg-[#f5f6f7]">
        <PageContainer>
          <SectionHeader
            kicker="Todo en un solo lugar"
            title="Elige el servicio que necesitas"
            subtitle="Cada camino tiene su proceso. Te orientamos con información clara antes de avanzar."
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
                  <Link href={service.href} className="btn-secondary mt-6 w-full sm:w-auto">
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
