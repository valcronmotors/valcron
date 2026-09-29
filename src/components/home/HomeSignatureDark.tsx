import { PageContainer, Section } from "@/components/public/layout";
import { CompactFeatureCard, CompactPathTile } from "@/components/public/CompactFeature";
import { EDITORIAL } from "@/lib/editorial-media";

/**
 * Compact editorial paths — replaces giant full-viewport dark cards.
 */
export function HomeSignatureDark() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <div className="max-w-[36rem] md:max-w-none md:text-left">
          <h2 className="display-lg text-balance text-[#08090b]">
            Más formas de
            <span className="block">encontrar tu vehículo.</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          <CompactPathTile
            title="Inventario"
            copy="Vehículos publicados por Valcron."
            href="/inventario"
            cta="Ver inventario"
            image={{ src: EDITORIAL.compactSuv.src, alt: EDITORIAL.compactSuv.alt }}
          />
          <CompactPathTile
            title="Financiamiento"
            copy="Orientación con bancos locales."
            href="/financiamiento"
            cta="Conocer opciones"
            image={{ src: EDITORIAL.processFinance.src, alt: EDITORIAL.processFinance.alt }}
          />
          <CompactPathTile
            title="Subastas"
            copy="Opciones mediante Copart e IAA."
            href="/subastas"
            cta="Conocer el proceso"
            image={{ src: EDITORIAL.processBrowse.src, alt: EDITORIAL.processBrowse.alt }}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <CompactFeatureCard
              tone="light"
              kicker="Importación"
              title="Coordinación del proceso contratado."
              copy="Desde la compra en EE.UU. hasta la llegada a República Dominicana."
              href="/importacion"
              cta="Ver cómo funciona"
              image={{ src: EDITORIAL.processImport.src, alt: EDITORIAL.processImport.alt }}
            />
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
