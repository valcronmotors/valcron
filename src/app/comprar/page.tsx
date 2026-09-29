import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { CompactFeatureCard, CompactPathTile } from "@/components/public/CompactFeature";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { publicPageMetadata } from "@/lib/seo";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Cómo comprar un vehículo en Valcron Motors",
  description:
    "Inventario local, búsqueda personalizada, financiamiento u opciones de subasta. Proceso claro en Santo Domingo Este.",
  path: "/comprar",
});

export default function ComprarPage() {
  return (
    <main>
      <PageHero
        kicker="Comprar"
        title="Elige tu camino"
        subtitle={`Inventario, búsqueda o subasta — ${SITE.shortName} te orienta sin rodeos.`}
      />

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader kicker="Opciones" title="Entiéndelo de un vistazo" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CompactPathTile
              title="Comprar una unidad disponible"
              copy="Revisa el inventario publicado."
              href="/inventario"
              cta="Ver inventario"
              image={{ src: EDITORIAL.compactSuv.src, alt: EDITORIAL.compactSuv.alt }}
            />
            <CompactPathTile
              title="Solicitar un vehículo"
              copy="Dinos marca, modelo y presupuesto."
              href="/solicitar-vehiculo"
              cta="Solicitar vehículo"
              image={{ src: EDITORIAL.processSearch.src, alt: EDITORIAL.processSearch.alt }}
            />
            <CompactPathTile
              title="Financiamiento"
              copy="Orientación con bancos locales."
              href="/financiamiento"
              cta="Conocer opciones"
              image={{ src: EDITORIAL.processFinance.src, alt: EDITORIAL.processFinance.alt }}
            />
            <CompactPathTile
              title="Subasta"
              copy="Más opciones mediante Copart e IAA."
              href="/subastas"
              cta="Conocer el proceso"
              image={{ src: EDITORIAL.processBrowse.src, alt: EDITORIAL.processBrowse.alt }}
            />
          </div>

          <div className="mt-6">
            <CompactFeatureCard
              tone="blue"
              title="¿Tienes un vehículo para entregar?"
              copy="Evaluamos tu unidad como parte del proceso de compra. Sin valuación garantizada."
              href="/solicitar-vehiculo"
              cta="Solicitar evaluación"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
