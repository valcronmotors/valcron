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
    "Valcron puede asistirte con vehículos disponibles mediante plataformas como Copart e IAA. Cotización clara y proceso coordinado. Santo Domingo Este.",
  path: "/subastas",
});

const STEPS = [
  { step: "01", title: "Dinos qué buscas", copy: "Marca, modelo, año y presupuesto." },
  { step: "02", title: "Revisamos opciones", copy: "Opciones publicadas en plataformas de subasta." },
  { step: "03", title: "Cotizamos", copy: "Escenarios de costo y proceso." },
  { step: "04", title: "Seleccionas", copy: "Eliges la unidad que te conviene." },
  { step: "05", title: "Coordinamos el proceso contratado", copy: "Te acompañamos hasta el cierre." },
];

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Plataforma con publicaciones, fotos y datos de lote. La usamos como fuente de mercado.",
  },
  {
    name: "IAA",
    copy: "Otra plataforma de subastas. Revisamos la información disponible antes de avanzar.",
  },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas"
        title="Más opciones para encontrar tu vehículo."
        subtitle="Si no está en inventario, Valcron puede ayudarte a localizar unidades disponibles mediante plataformas de subasta en Estados Unidos."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <SectionHeader
            kicker="Plataformas"
            title="Copart e IAA, como fuentes de mercado."
            subtitle={`${SITE.shortName} te ayuda a explorar vehículos publicados en Copart e IAA. No operamos como socio, partner ni afiliado de esas compañías. Son plataformas de subasta.`}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article
                key={item.name}
                className="border border-[#e4e6ea] bg-[#f5f6f7] p-6 md:p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <p className="kicker">Plataforma</p>
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
            title="De la búsqueda a la gestión"
            subtitle="Un flujo claro para evaluar opciones publicadas y avanzar solo cuando tengas contexto."
            tone="dark"
          />
          <NumberedSteps steps={STEPS} tone="dark" className="md:grid-cols-1 lg:grid-cols-2" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <Link href="/inventario?listing=auction" className="btn-secondary">
              Ver oportunidades publicadas
            </Link>
            <a
              href={whatsappHref(
                "Hola, quiero solicitar una búsqueda de vehículo en subastas de Estados Unidos.",
              )}
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
