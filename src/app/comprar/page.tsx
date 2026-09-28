import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualPathCard } from "@/components/public/VisualStory";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { publicPageMetadata } from "@/lib/seo";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Cómo comprar un vehículo en Valcron Motors",
  description:
    "Inventario local, búsqueda personalizada, financiamiento u opciones de subasta. Proceso claro en Santo Domingo Este.",
  path: "/comprar",
});

const PATHS = [
  {
    title: "Vehículo en Valcron",
    copy: "Revisa unidades publicadas y avanza directo.",
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
    copy: "Dinos marca, modelo, año y presupuesto.",
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
    title: "Subasta",
    copy: "Más opciones mediante plataformas de mercado.",
    href: "/subastas",
    cta: "Ver subastas",
    image: {
      src: EDITORIAL.processBrowse.src,
      alt: EDITORIAL.processBrowse.alt,
      caption: EDITORIAL.processBrowse.caption,
    },
  },
] as const;

export default function ComprarPage() {
  return (
    <main>
      <PageHero
        kicker="Comprar"
        title="Elige tu camino"
        subtitle={`Inventario, búsqueda o subasta — ${SITE.shortName} te orienta sin rodeos.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />

      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer>
          <SectionHeader
            kicker="Opciones"
            title="Entiéndelo de un vistazo"
            subtitle="Elige el camino que mejor se ajusta a lo que buscas."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PATHS.map((path) => (
              <VisualPathCard key={path.title} {...path} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref("Hola, quiero orientación para comprar un vehículo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
