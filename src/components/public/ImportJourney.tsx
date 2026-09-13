"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/money";
import { SITE, whatsappHref } from "@/lib/site";

const STEPS = [
  {
    step: "01",
    title: "Selección e Inspección",
    copy: "Definimos presupuesto y condición. Inspeccionamos opciones reales en Copart y Manheim, incluyendo historial CARFAX y daños reportados, antes de pujar.",
  },
  {
    step: "02",
    title: "Adjudicación y Seguro Marítimo",
    copy: "Pujamos con techo acordado, aseguramos el título y contratamos inland más seguro de carga hasta el puerto de destino.",
  },
  {
    step: "03",
    title: "Despacho Aduanal en Santo Domingo",
    copy: "Gestión ante DGA, impuestos, exoneraciones Ley 103-13 cuando aplican, y nacionalización con expediente transparente.",
  },
  {
    step: "04",
    title: "Entrega de Llaves",
    copy: "Diagnóstico de recepción, placa y matrícula al día, y entrega en Santo Domingo Este con garantía de proceso Valcron.",
  },
] as const;

export function ImportJourney() {
  const [active, setActive] = useState(0);
  const [value, setValue] = useState(22000);

  const estimate = useMemo(() => {
    const freight = 1480;
    const localMarkup = Math.round(value * 0.14);
    const landed = value + freight;
    return { freight, localMarkup, landed, savings: Math.max(localMarkup - freight, 0) };
  }, [value]);

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div>
          <p className="kicker">Importación</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Cuatro pasos, un expediente
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            El mismo criterio de dealer, de la puja a las llaves. Selecciona cada fase para ver el
            detalle operativo.
          </p>
          <div className="mt-10 grid gap-3">
            {STEPS.map((item, index) => {
              const open = active === index;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`rounded-2xl border px-5 py-5 text-left transition ${
                    open
                      ? "border-accent/50 bg-white shadow-[0_12px_40px_rgba(11,12,16,0.06)]"
                      : "border-line bg-white/60 hover:border-accent/35"
                  }`}
                >
                  <p className="kicker">
                    Fase {item.step}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-foreground">{item.title}</h3>
                  {open ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.copy}</p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-white p-7 shadow-[0_16px_48px_rgba(11,12,16,0.06)]">
          <p className="kicker">Estimación</p>
          <h3 className="mt-3 font-display text-3xl text-foreground">Flete y ahorro</h3>
          <label className="mt-6 block text-sm text-muted">
            Valor de la unidad en subasta (USD)
            <input
              type="range"
              min={8000}
              max={60000}
              step={500}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="mt-4 w-full accent-accent"
            />
            <span className="mt-2 block text-foreground">{formatUsd(value)}</span>
          </label>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-line py-2">
              <dt className="text-muted">Flete marítimo estimado</dt>
              <dd className="text-foreground">{formatUsd(estimate.freight)}</dd>
            </div>
            <div className="flex justify-between border-b border-line py-2">
              <dt className="text-muted">Sobreprecio típico en RD</dt>
              <dd className="text-foreground">{formatUsd(estimate.localMarkup)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Ahorro ilustrativo</dt>
              <dd className="text-accent">{formatUsd(estimate.savings)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted">
            Cifras de referencia. El costo final incluye inland, seguro, DGA y honorarios, cotizados
            unidad por unidad.
          </p>
          <Link
            href="/importacion"
            className="btn-primary mt-6 w-full"
          >
            Cotizar Vehículo por Encargo
          </Link>
          <a
            href={whatsappHref(
              `Hola, quiero cotizar importación por encargo. Valor de referencia ${formatUsd(value)} visto en valcronmotors.com`,
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp mt-3 w-full"
          >
            WhatsApp {SITE.whatsapp}
          </a>
        </aside>
      </div>
    </section>
  );
}
