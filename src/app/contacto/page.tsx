import Link from "next/link";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { QuoteForm } from "@/components/public/QuoteForm";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { mapsDirectionsUrl, officeTelHref, SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Contacto en Santo Domingo Este",
    description: `Valcron Motors, Av Principal 20. Tel. ${SITE.officePhoneDisplay} · WhatsApp ${SITE.whatsappDisplay}.`,
    path: "/contacto",
  }),
};

export default function ContactoPage() {
  return (
    <main>
      <PageHero
        kicker="Contacto"
        title="Hablemos de tu vehículo"
        subtitle="Av Principal 20, Santo Domingo Este. Teléfono y WhatsApp con respuesta directa."
      />

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href={officeTelHref()} className="btn-primary h-12 w-full">
              Llamar {SITE.officePhoneDisplay}
            </a>
            <a
              href={whatsappHref("Hola, quiero información de Valcron Motors.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp h-12 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-12 w-full"
            >
              Cómo llegar
            </a>
          </div>
        </PageContainer>
      </Section>

      <BusinessLocation variant="full" heading="Visítanos" />

      <Section className="section-light bg-white">
        <PageContainer>
          <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div className="min-w-0">
              <SectionHeader
                kicker="Escríbenos"
                title="Cuéntanos qué necesitas"
                subtitle="Inventario, importación, subasta o financiamiento."
              />
              <address className="mt-8 not-italic text-base text-[#676a70]">
                <p className="font-display text-lg font-semibold text-[#08090b]">{SITE.address.street}</p>
                <p className="mt-1">
                  {SITE.address.city}, {SITE.address.country}
                </p>
                <p className="mt-4">
                  Oficina{" "}
                  <a className="font-semibold text-[#08090b]" href={officeTelHref()}>
                    {SITE.officePhoneDisplay}
                  </a>
                </p>
                <p className="mt-2">
                  WhatsApp{" "}
                  <a
                    className="font-semibold text-[#08090b]"
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {SITE.whatsappDisplay}
                  </a>
                </p>
              </address>
              <Link href="/solicitar-vehiculo" className="btn-primary mt-8 inline-flex">
                Solicitar vehículo
              </Link>
              <SocialLinks className="mt-8" tone="light" />
            </div>
            <QuoteForm showVehicleInterest showSubject submitLabel="Enviar mensaje" />
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
