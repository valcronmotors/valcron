"use client";

import Link from "next/link";
import { useState } from "react";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { formatDop, formatUsd } from "@/lib/money";
import { financeConfig } from "@/lib/finance-config";
import { monthlyPayment } from "@/lib/public-filters";
import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";

export function HomeFinance() {
  const [price, setPrice] = useState(25000);
  const [downPct, setDownPct] = useState<number>(financeConfig.defaultDownPaymentPct);
  const [ratePct, setRatePct] = useState(financeConfig.defaultAnnualRate * 100);
  const [term, setTerm] = useState<number>(financeConfig.defaultTermMonths);

  const down = Math.round(price * (Math.max(downPct, 0) / 100));
  const financed = Math.max(price - down, 0);
  const cuota = monthlyPayment(financed, term, ratePct / 100);

  return (
    <section className="section-light bg-[#f5f5f3]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div className="relative hidden min-h-[32rem] overflow-hidden rounded-[1.5rem] bg-[#111] lg:block">
          <EditorialImage
            src={EDITORIAL.crossover.src}
            alt={EDITORIAL.crossover.alt}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="kicker">Financiamiento</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            Financia tu
            <span className="block">próximo vehículo.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#525252]">
            Explora precio, inicial, monto a financiar, plazo y una cuota estimada antes de decidir.
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B793F]">
            Bancos locales
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#525252]">
            Las opciones, tasas, requisitos y aprobaciones dependen de cada institución financiera y
            del perfil del solicitante. Valcron Motors no es un banco.
          </p>
          <div className="mt-8 rounded-[1.35rem] border border-[#ececea] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <label className="block text-sm text-[#737373]">
              Precio vehículo (USD)
              <input
                type="number"
                min={0}
                value={price}
                onChange={(event) => setPrice(Number(event.target.value) || 0)}
                className="field-input"
              />
            </label>
            <label className="mt-5 block text-sm text-[#737373]">
              Inicial {downPct}% · {formatUsd(down)}
              <input
                type="range"
                min={0}
                max={70}
                value={downPct}
                onChange={(event) => setDownPct(Number(event.target.value))}
                className="luxury-range mt-4 w-full"
              />
            </label>
            <label className="mt-5 block text-sm text-[#737373]">
              Tasa anual {ratePct.toFixed(1)}%
              <input
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={ratePct}
                onChange={(event) => setRatePct(Number(event.target.value))}
                className="luxury-range mt-4 w-full"
              />
            </label>
            <label className="mt-5 block text-sm text-[#737373]">
              Plazo
              <select
                value={term}
                onChange={(event) => setTerm(Number(event.target.value))}
                className="field-input"
              >
                {financeConfig.terms.map((option) => (
                  <option key={option} value={option}>
                    {option} meses
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-6 rounded-2xl bg-[#111111] p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C7A96B]">Cuota mensual estimada</p>
              <p className="mt-2 font-display text-3xl font-semibold">{formatUsd(cuota)}</p>
              <p className="mt-1 text-sm text-white/45">{formatDop(cuota * DEFAULT_TASA_USD_DOP)} referencia DOP</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">Inicial</dt>
                  <dd className="mt-1">{formatUsd(down)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">A financiar</dt>
                  <dd className="mt-1">{formatUsd(financed)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">Plazo</dt>
                  <dd className="mt-1">{term} meses</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">Precio</dt>
                  <dd className="mt-1">{formatUsd(price)}</dd>
                </div>
              </dl>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#737373]">
              Estimación únicamente. Las tasas, comisiones, requisitos y aprobaciones dependen de
              cada institución financiera y del perfil del solicitante.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/calculadoras/financiamiento" className="btn-primary">
              Calcular financiamiento
            </Link>
            <Link href="/financiamiento" className="btn-secondary">
              Conocer financiamiento
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
