import type { Metadata } from "next";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { LandingInventory } from "@/components/public/LandingInventory";
import { QuoteForm } from "@/components/public/QuoteForm";
import { PublicShell } from "@/components/public/SiteChrome";
import { loadPublicVehicles } from "@/lib/public-inventory";
import {
  SITE,
  autoDealerJsonLd,
  officeTelHref,
  whatsappHref,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Valcron Motors Group | Dealer, Financiamiento e Importación Directa en RD",
  },
  description:
    "Vendemos, importamos y financiamos vehículos de marcas confiables en República Dominicana. Asesoría Ley 103-13 y subastas Copart/Manheim.",
  keywords: [
    "dealer Santo Domingo Este",
    "importacion de vehiculos RD",
    "financiamiento de vehiculos RD",
    "subastas Copart Manheim",
    "Ley 103-13",
  ],
  openGraph: {
    locale: "es_DO",
    type: "website",
    siteName: SITE.name,
    title: "Valcron Motors Group | Dealer, Financiamiento e Importación Directa en RD",
    description:
      "Vendemos, importamos y financiamos vehículos de marcas confiables en República Dominicana. Asesoría Ley 103-13 y subastas Copart/Manheim.",
    url: SITE.url,
  },
};

const TRUST_BADGES = [
  "+30 Vehículos en Stock y Subastas",
  "100% Asesoría Transparente",
  "Expertos Ley 103-13 Incentivo Eco",
  "Garantía y Diagnóstico Técnico",
];

const IMPORT_STEPS = [
  {
    title: "Selección en Copart / Manheim",
    copy: "Identificamos la unidad según tu presupuesto, historial y uso en República Dominicana.",
  },
  {
    title: "Puja e inspección",
    copy: "Pujamos con licencia de dealer e inspeccionamos daños, motor y documentación antes de comprometer capital.",
  },
  {
    title: "Embarque marítimo",
    copy: "Coordinamos el flete, seguro y tracking desde el puerto de origen hasta RD.",
  },
  {
    title: "Despacho aduanal en RD",
    copy: "Gestionamos DGA, impuestos y entrega en Santo Domingo Este, con costos claros de principio a fin.",
  },
];

const SERVICES = [
  {
    title: "Importación por encargo",
    copy: "Traemos el modelo que buscas desde subastas de EE. UU. con un expediente de costos y tiempos.",
  },
  {
    title: "Financiamiento flexible",
    copy: "Estructuramos opciones con banca local para venta en RD o unidades importadas a tu nombre.",
  },
  {
    title: "Asesoría Ley 103-13",
    copy: "Evaluamos si tu vehículo califica al incentivo eco y preparamos la documentación correspondiente.",
  },
  {
    title: "Inspección y logística",
    copy: "Diagnóstico técnico, título, transporte interno y entrega con acompañamiento personalizado.",
  },
];

const TESTIMONIALS = [
  {
    name: "Carla M.",
    place: "Santo Domingo Este",
    quote:
      "Compré en el dealer y el financiamiento quedó claro desde el primer día. Entrega puntual y trato serio.",
  },
  {
    name: "Luis R.",
    place: "Santo Domingo",
    quote:
      "Importaron mi SUV desde Copart. Me explicaron cada costo, incluyendo aduanas, sin sorpresas.",
  },
  {
    name: "Patricia G.",
    place: "Bávaro",
    quote:
      "Me orientaron con Ley 103-13 y encontré una unidad eco con un proceso ordenado de principio a fin.",
  },
];

export default async function Home() {
  const inventory = await loadPublicVehicles();
  const gallery = inventory.data
    .flatMap((vehicle) =>
      vehicle.fotosUrls.slice(0, 2).map((src) => ({
        src,
        alt: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`,
      })),
    )
    .slice(0, 6);

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd()) }}
      />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.16),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(255,85,0,0.12),_transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                {SITE.name}
              </p>
              <h1 className="mt-5 font-display text-4xl leading-tight text-[#F4F5F7] sm:text-6xl">
                {SITE.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#8A909A] sm:text-lg">
                {SITE.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#inventario"
                  className="inline-flex h-12 items-center rounded-full bg-[#D4AF37] px-6 text-sm font-semibold text-[#0B0C10] transition hover:bg-[#FFD700]"
                >
                  Ver Inventario
                </a>
                <a
                  href={whatsappHref(
                    "Hola, quiero consultar venta local, financiamiento o importación directa con Valcron Motors.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-[#FF5500] px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,85,0,0.35)] transition hover:bg-[#ff6a1a]"
                >
                  Consultar WhatsApp
                </a>
              </div>
            </div>
            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#12141C]/70 p-6 backdrop-blur-xl">
              <p className="text-sm text-[#8A909A]">{SITE.address.full}</p>
              <p className="text-sm text-[#F4F5F7]">
                Oficina comercial{" "}
                <a href={officeTelHref()} className="text-[#FFD700]">
                  {SITE.phoneOffice}
                </a>
              </p>
              <p className="text-sm text-[#F4F5F7]">
                WhatsApp{" "}
                <a href={whatsappHref()} className="text-[#FFD700]">
                  {SITE.whatsapp}
                </a>
              </p>
              <p className="text-sm text-[#F4F5F7]">
                Correo{" "}
                <a href={`mailto:${SITE.email}`} className="text-[#FFD700]">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#12141C]">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-sm font-medium text-[#F4F5F7] backdrop-blur-xl"
              >
                {badge}
              </div>
            ))}
          </div>
        </section>

        <LandingInventory initialVehicles={inventory.data} error={inventory.error} />

        <section id="importacion" className="scroll-mt-24 border-t border-white/10 bg-[#12141C]/40">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Dealer license
            </p>
            <h2 className="mt-3 font-display text-4xl text-[#F4F5F7]">
              Subastas e importación directa
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A909A]">
              Operamos Copart y Manheim con un proceso de dealer: selección, puja, inspección,
              embarque marítimo y despacho aduanal en República Dominicana.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {IMPORT_STEPS.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-white/10 bg-[#0B0C10]/70 p-6 backdrop-blur-xl transition hover:border-[#D4AF37]/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-[#F4F5F7]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8A909A]">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="financiamiento" className="scroll-mt-24 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Servicios
            </p>
            <h2 className="mt-3 font-display text-4xl text-[#F4F5F7]">
              Financiamiento y acompañamiento
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {SERVICES.map((service) => (
                <article
                  key={service.title}
                  className="rounded-[1.75rem] border border-white/10 bg-[#12141C]/80 p-6 backdrop-blur-xl transition hover:border-[#D4AF37]/50"
                >
                  <h3 className="font-display text-2xl text-[#F4F5F7]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8A909A]">{service.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="nosotros" className="scroll-mt-24 border-t border-white/10 bg-[#12141C]/40">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                Prueba social
              </p>
              <h2 className="mt-3 font-display text-4xl text-[#F4F5F7]">
                Entregas recientes en RD
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#8A909A]">
                Clientes en Santo Domingo Este y todo el país reciben unidades de venta local e
                importación directa con diagnóstico técnico y garantía de proceso.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-3">
                <span className="text-lg font-semibold text-[#FFD700]">
                  {SITE.googleReviews.rating} ★
                </span>
                <span className="text-sm text-[#F4F5F7]">
                  Google Reviews · {SITE.googleReviews.count} opiniones
                </span>
              </div>
              {gallery.length > 0 ? (
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {gallery.map((photo) => (
                    <div
                      key={photo.src}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0C10]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="grid gap-4">
              {TESTIMONIALS.map((item) => (
                <blockquote
                  key={item.name}
                  className="rounded-[1.75rem] border border-white/10 bg-[#0B0C10]/70 p-5 backdrop-blur-xl"
                >
                  <p className="text-sm leading-7 text-[#F4F5F7]">“{item.quote}”</p>
                  <footer className="mt-3 text-xs uppercase tracking-[0.18em] text-[#8A909A]">
                    {item.name} · {item.place}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <h2 className="font-display text-4xl text-[#F4F5F7]">Preguntas frecuentes</h2>
            <div className="mt-8">
              <FaqAccordion />
            </div>
          </div>
        </section>

        <section id="contacto" className="scroll-mt-24 border-t border-white/10 bg-[#12141C]/40">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                Contacto
              </p>
              <h2 className="mt-3 font-display text-4xl text-[#F4F5F7]">Hablemos de tu próximo vehículo</h2>
              <p className="mt-4 text-sm leading-7 text-[#8A909A]">{SITE.address.full}</p>
              <p className="mt-3 text-sm text-[#F4F5F7]">
                Oficina {SITE.phoneOffice} · WhatsApp {SITE.whatsapp}
              </p>
              <p className="text-sm text-[#F4F5F7]">{SITE.email}</p>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
