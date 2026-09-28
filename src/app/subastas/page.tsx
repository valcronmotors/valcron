import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualStepSequence } from "@/components/public/VisualStory";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Vehículos de subasta desde Estados Unidos",
  description:
    "Asistencia con unidades en plataformas como Copart e IAA. Cotización clara. Santo Domingo Este.",
  path: "/subastas",
});

const STEPS = [
  {
    step: "01",
    title: "Dinos qué vehículo buscas",
    copy: "Marca, modelo, año y presupuesto.",
    image: {
      src: EDITORIAL.processSearch.src,
      alt: EDITORIAL.processSearch.alt,
      caption: EDITORIAL.processSearch.caption,
    },
  },
  {
    step: "02",
    title: "Revisamos opciones disponibles",
    copy: "Lotes publicados en plataformas de mercado.",
    image: {
      src: EDITORIAL.processBrowse.src,
      alt: EDITORIAL.processBrowse.alt,
      caption: EDITORIAL.processBrowse.caption,
    },
  },
  {
    step: "03",
    title: "Preparamos la cotización",
    copy: "Costos y pasos antes de avanzar.",
    image: {
      src: EDITORIAL.processQuote.src,
      alt: EDITORIAL.processQuote.alt,
      caption: EDITORIAL.processQuote.caption,
    },
  },
  {
    step: "04",
    title: "Seleccionas la unidad",
    copy: "Tú decides con información clara.",
    image: {
      src: EDITORIAL.processSelect.src,
      alt: EDITORIAL.processSelect.alt,
      caption: EDITORIAL.processSelect.caption,
    },
  },
  {
    step: "05",
    title: "Coordinamos el proceso contratado",
    copy: "Logística y cierre según lo acordado.",
    image: {
      src: EDITORIAL.processLogistics.src,
      alt: EDITORIAL.processLogistics.alt,
      caption: EDITORIAL.processLogistics.caption,
    },
  },
] as const;

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Publicaciones y fotos de lote. Fuente de mercado, no socio.",
  },
  {
    name: "IAA",
    copy: "Otra plataforma de subasta. Revisamos datos antes de avanzar.",
  },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas"
        title="Más opciones fuera del inventario"
        subtitle="Te asistimos con vehículos publicados en subastas de Estados Unidos."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <SectionHeader
            kicker="Proceso visual"
            title="De la búsqueda al cierre"
            subtitle="Texto corto. La imagen explica el paso."
          />
          <VisualStepSequence steps={STEPS} tone="light" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <Link href="/inventario?listing=auction" className="btn-secondary">
              Ver oportunidades
            </Link>
            <a
              href={whatsappHref("Hola, quiero información sobre subastas en Estados Unidos.")}
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

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader
            kicker="Plataformas"
            title="Copart e IAA como referencia"
            subtitle={`${SITE.shortName} no es socio, partner ni afiliado de esas compañías.`}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article
                key={item.name}
                className="border border-[#e4e6ea] bg-white p-6 md:p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <p className="kicker !text-[#676a70]">Plataforma</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-[#08090b]">{item.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#676a70]">{item.copy}</p>
              </article>
            ))}
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
