import { PageHero } from "@/components/public/PageHero";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { QuoteForm } from "@/components/public/QuoteForm";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Contacto y Ubicación",
    description: `Visita a ${SITE.legalName} en Av Principal 20, Santo Domingo Este, República Dominicana. Oficina ${SITE.officePhoneDisplay}, WhatsApp ${SITE.whatsappDisplay}.`,
    path: "/contacto",
  }),
  title: {
    absolute: "Contacto y Ubicación | Valcron Motors Group",
  },
};

export default function ContactoPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Contacto"
          title="Hablemos de tu próximo vehículo"
          subtitle="Oficina en Av Principal 20, Santo Domingo Este. Atención directa por teléfono y WhatsApp."
          image={PAGE_HERO_IMAGES.contacto}
          imageAlt={PAGE_HERO_ALTS.contacto}
        />

        <BusinessLocation variant="full" heading="Visítanos" />

        <section className="section-light bg-white">
          <div className="mx-auto grid max-w-7xl min-w-0 gap-12 px-5 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-24">
            <div className="min-w-0">
              <p className="kicker">¿En qué podemos ayudarte?</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111]">
                {SITE.shortName}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#525252]">
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
