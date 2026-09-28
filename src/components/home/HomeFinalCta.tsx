import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SITE, whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return (
    <Section className="section-dark">
      <PageContainer>
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="kicker">Siguiente paso</p>
          <h2 className="display-lg mt-4 text-balance text-white">
            ¿Listo para encontrar
            <span className="block">tu próximo vehículo?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[length:var(--text-body-lg)] leading-[1.55] text-white/70">
            Explora el inventario o cuéntanos qué buscas. Te orientamos en la compra y el
            financiamiento con bancos locales.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
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
          <p className="mt-8 text-sm text-white/50">
            {SITE.address.full} · {SITE.officePhoneDisplay}
          </p>
        </div>
      </PageContainer>
    </Section>
  );
}
