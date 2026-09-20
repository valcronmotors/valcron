import { MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { QuoteForm } from "@/components/public/QuoteForm";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, officeTelHref } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Visítanos en ${SITE.address.full}. Oficina ${SITE.officePhoneDisplay}, WhatsApp ${SITE.whatsappDisplay}.`,
};

export default function ContactoPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Contacto"
          title="Hablemos de tu próximo vehículo"
          subtitle="Oficina en Brisa Oriental, Santo Domingo Este. Atención directa por teléfono y WhatsApp."
          image={PAGE_HERO_IMAGES.contacto}
          imageAlt={PAGE_HERO_ALTS.contacto}
        />

        <section className="section-light bg-[#faf9f6]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-32">
            <div>
              <p className="kicker">¿En qué podemos ayudarte?</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111]">
                {SITE.shortName}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#525252]">
                Cuéntanos si buscas un vehículo disponible, una importación, una oportunidad en
                subasta o información de financiamiento.
              </p>
              <address className="mt-8 not-italic">
                <p className="flex gap-3 text-sm text-[#262626]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C7A96B]" />
                  <span>
                    {SITE.address.sector},
                    <br />
                    {SITE.address.city},
                    <br />
                    {SITE.address.country}
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 shrink-0 text-[#C7A96B]" />
                  <a className="text-[#111] hover:underline" href={officeTelHref()}>
                    Oficina {SITE.officePhoneDisplay}
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-3 text-sm">
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25d366]" />
                  <a
                    className="text-[#111] hover:underline"
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {SITE.whatsappDisplay}
                  </a>
                </p>
              </address>
              <SocialLinks className="mt-8" tone="light" />
              <div className="relative mt-10 hidden min-h-[16rem] overflow-hidden rounded-[1.35rem] bg-[#111] lg:block">
                <EditorialImage
                  src={EDITORIAL.muscle.src}
                  alt={EDITORIAL.muscle.alt}
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <QuoteForm showVehicleInterest showSubject submitLabel="Enviar mensaje" />
          </div>
        </section>

        <section className="bg-[#111]">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Valcron Motors Group SRL en Santo Domingo Este"
                src={SITE.mapEmbedSrc}
                className="h-[420px] w-full grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
