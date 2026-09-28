import { PageContainer, Section } from "@/components/public/layout";
import { VisualRequestBand } from "@/components/public/VisualStory";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeSignatureBlue() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <VisualRequestBand
          image={{
            src: EDITORIAL.processSearch.src,
            alt: EDITORIAL.processSearch.alt,
            caption: EDITORIAL.processSearch.caption,
          }}
        />
      </PageContainer>
    </Section>
  );
}
