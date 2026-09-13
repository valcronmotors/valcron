import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedInventory } from "@/components/public/FeaturedInventory";
import { HeroShowcase } from "@/components/public/HeroShowcase";
import { HomeFinance } from "@/components/public/HomeFinance";
import { ImportJourney } from "@/components/public/ImportJourney";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { SITE, autoDealerJsonLd, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Valcron Motors Group | Dealer, Importación y Financiamiento en RD",
  },
  description: SITE.valueProposition,
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
    title: "Valcron Motors Group | Dealer, Importación y Financiamiento en RD",
    description: SITE.valueProposition,
    url: SITE.url,
  },
};

const METRICS = [
  { value: "+30", label: "Vehículos en Stock y Subastas" },
  { value: "Copart & Manheim", label: "Importación Directa desde EE. UU." },
  { value: "Ley 103-13", label: "Asesoría de Exoneración Eco" },
  { value: "Certificado", label: "Garantía Mecánica y Diagnóstico" },
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
    place: "Santiago",
    quote:
      "Me orientaron con Ley 103-13 y encontré una unidad eco con un proceso ordenado de principio a fin.",
  },
];

const WARRANTY = [
  { title: "Motor", copy: "Cobertura de diagnóstico y respaldo mecánico en unidades entregadas por el dealer." },
  { title: "Transmisión", copy: "Revisión de operación y criterio técnico antes de publicar o entregar la unidad." },
  { title: "Chasis", copy: "Certificación visual y documental del chasis, título e historial de importación." },
];

export default async function Home() {
  const inventory = await loadPublicVehicles();
  const gallery = inventory.data
    .flatMap((vehicle, index) =>
      vehicle.fotosUrls.slice(0, 2).map((src, photoIndex) => ({
        src,
        alt: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`,
        city: (index + photoIndex) % 2 === 0 ? "Santo Domingo" : "Santiago",
      })),
    )
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd()) }}
      />
      <main>
        <HeroShowcase vehicles={inventory.data} />

        <section className="bg-white pt-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[0_16px_48px_rgba(11,12,16,0.05)] sm:grid-cols-2 lg:grid-cols-4">
              {METRICS.map((metric) => (
                <article key={metric.label} className="bg-white px-6 py-8">
                  <p className="font-display text-2xl text-accent sm:text-3xl">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FeaturedInventory initialVehicles={inventory.data} error={inventory.error} />
        <ImportJourney />
        <HomeFinance vehicles={inventory.data} />

        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="kicker">
                  Google Reviews {SITE.googleReviews.rating}
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Entregas recientes
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                  Clientes en Santo Domingo y Santiago reciben unidades de stock local e importación
                  directa, con opiniones verificadas y un promedio de {SITE.googleReviews.rating} estrellas.
                </p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-accent bg-white px-5 py-3">
                <span className="text-sm font-medium text-accent">★★★★★ {SITE.googleReviews.rating}</span>
                <span className="text-sm text-muted">{SITE.googleReviews.count} opiniones</span>
              </div>
            </div>

            {gallery.length > 0 ? (
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((photo) => (
                  <figure
                    key={`${photo.src}-${photo.city}`}
                    className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_32px_rgba(11,12,16,0.06)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted">
                      Entrega · {photo.city}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <blockquote
                  key={item.name}
                  className="rounded-2xl border border-line bg-white p-6"
                >
                  <p className="text-xs tracking-[0.18em] text-accent">★★★★★</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">“{item.quote}”</p>
                  <footer className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
                    {item.name} · {item.place}
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-white px-6 py-10 shadow-[0_12px_40px_rgba(11,12,16,0.05)] lg:px-10">
              <p className="kicker">
                Garantía Valcron
              </p>
              <h3 className="mt-3 font-display text-3xl text-foreground">
                Cobertura de motor, transmisión y chasis
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                Cada unidad importada o vendida en dealer se entrega con diagnóstico técnico,
                revisión de título y certificación de chasis. El respaldo cubre el criterio de
                recepción: motor, transmisión y estructura.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {WARRANTY.map((item) => (
                  <article key={item.title}>
                    <h4 className="font-display text-xl text-foreground">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-footer">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <p className="kicker text-accent!">Por encargo</p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              ¿Buscas una unidad específica o configuración exclusiva? Lo importamos para ti.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/importacion"
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-medium text-foreground transition hover:bg-white/90"
              >
                Cotizar importación
              </Link>
              <a
                href={whatsappHref(
                  "Hola, busco una unidad específica o configuración exclusiva para importar con Valcron Motors.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp h-12 px-6"
              >
                WhatsApp {SITE.whatsapp}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
