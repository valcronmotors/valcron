import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="display-lg text-[#08090b]">
            ¿Listo para tu
            <span className="block">próximo vehículo?</span>
          </h2>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary">
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
