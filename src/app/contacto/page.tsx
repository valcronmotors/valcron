import { PageHero } from "@/components/public/PageHero";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { QuoteForm } from "@/components/public/QuoteForm";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { mapsDirectionsUrl, officeTelHref, SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Contacto en Santo Domingo Este",
    description: `Visita a Valcron Motors en Av Principal 20, Santo Domingo Este. Llama al ${SITE.officePhoneDisplay} o escribe por WhatsApp al ${SITE.whatsappDisplay}.`,
    path: "/contacto",
  }),
};

export default function ContactoPage() {
  return (
    <>
      <main>
        <PageHero
          className="hidden md:block"
          kicker="Contacto"
          title="Hablemos de tu próximo vehículo"
          subtitle="Oficina en Av Principal 20, Santo Domingo Este. Atención directa por teléfono y WhatsApp."
          image={PAGE_HERO_IMAGES.contacto}
          imageAlt={PAGE_HERO_ALTS.contacto}
        />

        {/* Mobile-first contact actions */}
        <section className="section-light bg-[#f6f5f1] md:hidden">
          <div className="px-4 py-8">
            <h1 className="font-display text-[2.125rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#111214]">
              Contacto
            </h1>
            <p className="mt-3 text-base text-[#676a70]">
              Habla con Valcron Motors en Santo Domingo Este.
            </p>
            <div className="mt-6 grid gap-3">
              <a href={officeTelHref()} className="btn-primary h-12 w-full">
                Llamar
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
            <address className="mt-8 not-italic">
              <p className="font-display text-lg font-semibold text-[#111214]">{SITE.shortName}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#676a70]">
                {SITE.address.street}
                <br />
                {SITE.address.city}
                <br />
                {SITE.address.country}
              </p>
              <p className="mt-4 text-sm text-[#676a70]">
                Oficina{" "}
                <a className="font-medium text-[#111214]" href={officeTelHref()}>
                  {SITE.officePhoneDisplay}
                </a>
              </p>
              <p className="mt-2 text-sm text-[#676a70]">
                WhatsApp{" "}
                <a
                  className="font-medium text-[#111214]"
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.whatsappDisplay}
                </a>
              </p>
            </address>
          </div>
        </section>

        <BusinessLocation variant="full" heading="Visítanos" />

        <section className="section-light bg-white">
          <div className="mx-auto grid max-w-7xl min-w-0 gap-12 px-4 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-24">
            <div className="min-w-0">
              <p className="kicker">¿En qué podemos ayudarte?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#111214] md:text-4xl">
                {SITE.shortName}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#676a70]">
                Cuéntanos si buscas un vehículo disponible, una importación, una oportunidad en
                subasta o información de financiamiento. También puedes visitarnos en Santo Domingo
                Este.
              </p>
              <SocialLinks className="mt-8" tone="light" />
            </div>
            <QuoteForm showVehicleInterest showSubject submitLabel="Enviar mensaje" />
          </div>
        </section>
      </main>
    </>
  );
}
