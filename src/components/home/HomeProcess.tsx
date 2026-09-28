"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

const STEPS = [
  {
    id: "01",
    title: "Explora",
    copy: "Revisa el inventario publicado o cuéntanos qué buscas.",
    detail:
      "Empieza por unidades disponibles en República Dominicana. Si no ves tu modelo, pedimos una búsqueda a la medida.",
  },
  {
    id: "02",
    title: "Solicita",
    copy: "Indica marca, modelo, año y presupuesto.",
    detail:
      "Mientras más clara sea tu petición, más rápido podemos revisar opciones relevantes para ti.",
  },
  {
    id: "03",
    title: "Cotiza",
    copy: "Recibes escenarios claros según la vía que aplique.",
    detail:
      "Inventario local, subasta o importación cuando corresponde — con costos y pasos explicados sin tecnicismos.",
  },
  {
    id: "04",
    title: "Decide",
    copy: "Eliges la unidad y el camino que te conviene.",
    detail:
      "Comparamos disponibilidad, condición, tiempos y financiamiento con bancos locales cuando aplica.",
  },
  {
    id: "05",
    title: "Coordina",
    copy: "Te acompañamos en el proceso contratado hasta el cierre.",
    detail:
      "Documentación, seguimiento y comunicación directa por WhatsApp u oficina en Santo Domingo Este.",
  },
] as const;

export function HomeProcess() {
  const [active, setActive] = useState(0);
  const current = STEPS[active];

  return (
    <Section className="section-light bg-white" id="proceso">
      <PageContainer>
        <div className="max-w-[40rem]">
          <p className="kicker">Cómo funciona</p>
          <h2 className="display-lg mt-3 text-[#08090b]">
            Un proceso corto,
            <span className="block">sin rodeos.</span>
          </h2>
          <p className="mt-4 text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
            Cinco pasos claros para pasar de la búsqueda a la decisión.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="space-y-3">
            {STEPS.map((step, index) => {
              const isActive = active === index;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative flex w-full items-start gap-4 overflow-hidden border px-5 py-4 text-left transition-colors duration-200 md:px-6 md:py-5 ${
                    isActive
                      ? "border-[#08090b] bg-[#08090b] text-white"
                      : "border-[#e4e6ea] bg-white text-[#08090b] hover:border-[#cfd3d8]"
                  }`}
                  style={{ borderRadius: "var(--radius-card)" }}
                  aria-pressed={isActive}
                >
                  {isActive ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1.5 bg-[#2b6cff]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span
                    className={`shrink-0 font-display text-sm font-bold tracking-[0.14em] ${
                      isActive ? "text-[#2b6cff]" : "text-[#676a70]"
                    }`}
                  >
                    {step.id}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold md:text-xl">
                      {step.title}
                    </span>
                    <span
                      className={`mt-1 block text-sm leading-relaxed ${
                        isActive ? "text-white/70" : "text-[#676a70]"
                      }`}
                    >
                      {step.copy}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="flex flex-col justify-between border border-[#e4e6ea] bg-[#f5f6f7] p-6 md:p-8"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
                Paso {current.id}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-[#08090b] md:text-3xl">
                {current.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#676a70] md:text-lg">
                {current.detail}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/inventario" className="btn-primary">
                Ver inventario
              </Link>
              <Link href="/solicitar-vehiculo" className="btn-secondary">
                Solicitar vehículo
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
