import { PageContainer, Section } from "@/components/public/layout";
import { CompactFeatureCard } from "@/components/public/CompactFeature";
import { EDITORIAL } from "@/lib/editorial-media";

/** One signature electric-blue card — compact, not full-viewport. */
export function HomeSignatureBlue() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <CompactFeatureCard
          tone="blue"
          kicker="Acompañamiento"
          title="Lo encontramos contigo."
          steps={["Buscar", "Evaluar", "Cotizar", "Coordinar", "Entregar"]}
          href="/solicitar-vehiculo"
          cta="Solicitar vehículo"
          image={{
            src: EDITORIAL.processSearch.src,
            alt: EDITORIAL.processSearch.alt,
          }}
        />
      </PageContainer>
    </Section>
  );
}
