import { PageContainer, Section } from "@/components/public/layout";
import { CompactFeatureCard } from "@/components/public/CompactFeature";
import { EDITORIAL } from "@/lib/editorial-media";

/** Strategic gloss-black chapter — compact, predominantly light site around it. */
export function HomeActionMedia() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <CompactFeatureCard
          tone="dark"
          kicker="Cómo funciona Valcron"
          title="De la idea al vehículo, paso a paso."
          copy="Consulta, comparación de opciones y coordinación según el tipo de compra que elijas."
          steps={[
            "Cuéntanos qué buscas o revisa inventario",
            "Evaluamos disponibilidad y siguiente paso",
            "Coordinamos cotización, trámite o entrega",
          ]}
          href="/comprar"
          cta="Ver cómo comprar"
          image={{
            src: EDITORIAL.cityDrive.src,
            alt: EDITORIAL.cityDrive.alt,
          }}
        />
      </PageContainer>
    </Section>
  );
}
