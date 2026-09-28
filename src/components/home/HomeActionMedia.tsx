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
          kicker="Proceso claro"
          title="Más opciones. Un proceso más claro."
          copy="Inventario, búsqueda, financiamiento y subastas — sin rodeos."
          steps={[
            "Elige o solicita tu vehículo",
            "Revisa opciones y cotización",
            "Avanza con Valcron",
          ]}
          href="/comprar"
          cta="Cómo comprar"
          image={{
            src: EDITORIAL.cityDrive.src,
            alt: EDITORIAL.cityDrive.alt,
          }}
        />
      </PageContainer>
    </Section>
  );
}
