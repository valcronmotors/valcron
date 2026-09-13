import { PageHero } from "@/components/public/PageHero";
import { QuoteForm } from "@/components/public/QuoteForm";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, mailtoHref, officeTelHref, whatsappHref } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Visítanos en ${SITE.address.full}. Oficina ${SITE.phoneOffice}, WhatsApp ${SITE.whatsapp}.`,
};

const CONTACTS = [
  { label: "Dirección", value: SITE.address.full },
  { label: "Oficina comercial", value: SITE.phoneOffice, href: officeTelHref() },
  { label: "Asistencia WhatsApp", value: SITE.whatsapp, href: whatsappHref() },
  { label: "Email", value: SITE.email, href: mailtoHref() },
];

export default function ContactoPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Contacto"
          title="Hablemos de tu próximo vehículo"
          subtitle="Oficina en Santo Domingo Este, atención comercial en horario extendido y respuesta directa por WhatsApp."
          image={PAGE_HERO_IMAGES.contacto}
          imageAlt={PAGE_HERO_ALTS.contacto}
        />

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="kicker">Ubicación</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                {SITE.shortName}
              </h2>
              <dl className="mt-8 grid gap-5">
                {CONTACTS.map((item) => (
                  <div key={item.label}>
                    <dt className="kicker">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-foreground">
                      {item.href ? (
                        <a href={item.href} className="hover:text-accent">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
                <p className="kicker">
                  Horarios de atención
                </p>
                <p className="mt-3 text-sm text-foreground">{SITE.hours.weekdays}</p>
                <p className="mt-1 text-sm text-foreground">{SITE.hours.saturday}</p>
              </div>
            </div>
            <QuoteForm showVehicleInterest submitLabel="Enviar mensaje" />
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-line shadow-[0_12px_40px_rgba(11,12,16,0.06)]">
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
