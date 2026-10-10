import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return (
    <Section className="section-dark bg-[#111111]" tight>
      <PageContainer>
        <div className="mx-auto flex max-w-[36rem] flex-col items-center text-center">
          <h2 className="display-lg text-balance text-white">Tu próximo vehículo comienza aquí.</h2>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-7 min-w-[14rem]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Hablar con Valcron
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </PageContainer>
    </Section>
  );
}
