import Link from "next/link";
import { NumberedSteps } from "@/components/public/NumberedSteps";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { publicPageMetadata } from "@/lib/seo";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Cómo comprar un vehículo en Valcron Motors",
  description:
    "Proceso claro para comprar en inventario local o solicitar una búsqueda mediante subasta e importación. Valcron Motors, Santo Domingo Este.",
  path: "/comprar",
});

const LOCAL = [
  { step: "01", title: "Explora", copy: "Revisa el inventario publicado." },
  { step: "02", title: "Consulta", copy: "Escríbenos o visítanos." },
  { step: "03", title: "Evalúa tus opciones", copy: "Compara unidad, precio y financiamiento." },
  { step: "04", title: "Completa el proceso", copy: "Cierra con acompañamiento." },
];

const SOURCING = [
  { step: "01", title: "Dinos qué buscas", copy: "Marca, modelo, año y presupuesto." },
  { step: "02", title: "Revisamos opciones", copy: "Inventario y fuentes adecuadas." },
  { step: "03", title: "Cotizamos", copy: "Costos y escenarios claros." },
  { step: "04", title: "Seleccionas", copy: "Eliges la unidad que te conviene." },
  { step: "05", title: "Gestionamos el proceso contratado", copy: "Te acompañamos hasta el cierre." },
];

export default function ComprarPage() {
  return (
    <main>
      <PageHero
        kicker="Comprar"
        title="Más opciones. Más claridad."
        subtitle={`${SITE.shortName} te ayuda a encontrar y obtener tu próximo vehículo con un proceso corto y sin rodeos.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <SectionHeader
            kicker="Inventario local"
            title="Si ya está publicado, el camino es directo."
          />
          <NumberedSteps steps={LOCAL} tone="light" />
          <Link href="/inventario" className="btn-primary mt-10 inline-flex">
            Ver inventario
          </Link>
        </PageContainer>
      </Section>

      <Section className="section-dark bg-[#08090b]">
        <PageContainer>
          <SectionHeader
            kicker="Búsqueda y subasta"
            title="Si no está en stock, lo buscamos."
            tone="dark"
          />
          <NumberedSteps steps={SOURCING} tone="dark" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref("Hola, quiero solicitar una búsqueda de vehículo.")}
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
