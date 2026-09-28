import Link from "next/link";
import { NumberedSteps } from "@/components/public/NumberedSteps";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
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
  { step: "01", title: "Cuéntanos", copy: "Marca, modelo, año y presupuesto." },
  { step: "02", title: "Revisamos", copy: "Lotes publicados en subasta." },
  { step: "03", title: "Cotizamos", copy: "Costos y pasos." },
  { step: "04", title: "Eliges", copy: "La opción que prefieres." },
  { step: "05", title: "Coordinamos", copy: "El proceso contratado." },
];

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
            kicker="Plataformas"
            title="Copart e IAA como referencia"
            subtitle={`${SITE.shortName} no es socio, partner ni afiliado de esas compañías.`}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article
                key={item.name}
                className="border border-[#e4e6ea] bg-[#f7f8fa] p-6 md:p-8"
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

      <Section className="section-dark bg-[#08090b]">
        <PageContainer>
          <SectionHeader
            kicker="Proceso"
            title="De la búsqueda al cierre"
            subtitle="Avanzamos cuando tengas contexto suficiente."
            tone="dark"
          />
          <NumberedSteps steps={STEPS} tone="dark" className="md:grid-cols-1 lg:grid-cols-2" />
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
    </main>
  );
}
