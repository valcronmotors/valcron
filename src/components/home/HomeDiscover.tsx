"use client";

import { useState } from "react";
import { PageContainer, Section } from "@/components/public/layout";
import { CompactFeatureCard, CompactPathTile } from "@/components/public/CompactFeature";
import { EDITORIAL } from "@/lib/editorial-media";

const TABS = [
  { id: "inventario", label: "Inventario y opciones" },
  { id: "proceso", label: "Proceso" },
  { id: "busqueda", label: "Búsqueda personalizada" },
] as const;

export function HomeDiscover() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("inventario");

  return (
    <Section className="section-light bg-white">
      <PageContainer>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
          Descubre Valcron
        </h2>
        <div className="mt-8 flex justify-center gap-6 border-b border-[#e5e5e5]" role="tablist" aria-label="Descubre Valcron">
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`relative -mb-px px-1 pb-3 text-sm font-medium transition-colors ${
                  selected ? "text-[#08090b]" : "text-[#8a8d91] hover:text-[#191919]"
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
                {selected ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#08090b]" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-8" role="tabpanel">
          {tab === "inventario" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CompactPathTile
                title="Inventario"
                copy="Vehículos publicados por Valcron."
                href="/inventario"
                cta="Ver inventario"
                image={{ src: EDITORIAL.compactSuv.src, alt: EDITORIAL.compactSuv.alt }}
              />
              <CompactPathTile
                title="Financiamiento"
                copy="Orientación con bancos locales."
                href="/financiamiento"
                cta="Conocer opciones"
                image={{ src: EDITORIAL.processFinance.src, alt: EDITORIAL.processFinance.alt }}
              />
              <CompactPathTile
                title="Subastas"
                copy="Opciones mediante Copart e IAA."
                href="/subastas"
                cta="Conocer el proceso"
                image={{ src: EDITORIAL.processBrowse.src, alt: EDITORIAL.processBrowse.alt }}
              />
            </div>
          ) : null}

          {tab === "proceso" ? (
            <CompactFeatureCard
              tone="dark"
              kicker="Proceso claro"
              title="Más opciones. Un proceso más claro."
              copy="Inventario, búsqueda, financiamiento y subastas — sin rodeos."
              steps={["Elige o solicita tu vehículo", "Revisa opciones y cotización", "Avanza con Valcron"]}
              href="/comprar"
              cta="Cómo comprar"
              image={{ src: EDITORIAL.cityDrive.src, alt: EDITORIAL.cityDrive.alt }}
            />
          ) : null}

          {tab === "busqueda" ? (
            <CompactFeatureCard
              tone="light"
              kicker="Búsqueda personalizada"
              title="Lo encontramos contigo"
              steps={["Dinos marca y modelo", "Revisamos opciones", "Cotizamos el proceso"]}
              href="/solicitar-vehiculo"
              cta="Solicitar vehículo"
              image={{ src: EDITORIAL.processSearch.src, alt: EDITORIAL.processSearch.alt }}
            />
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}
