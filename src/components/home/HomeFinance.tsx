"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDop, formatUsd } from "@/lib/money";
import { financeConfig } from "@/lib/finance-config";
import { monthlyPayment } from "@/lib/public-filters";
import { SITE, whatsappHref } from "@/lib/site";
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
    <section className="bg-[#f5f5f5] text-[#111111]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="kicker text-[#737373]">Financiamiento</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Planifica tu compra.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#525252]">
            Utiliza nuestra calculadora para explorar diferentes escenarios de inicial, plazo y tasa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/financiamiento" className="btn-primary">
              Abrir calculadora completa
            </Link>
            <a
              href={whatsappHref(
                `Hola, solicito información de financiamiento con ${SITE.shortName}. Precio de referencia: ${formatUsd(price)}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !border-[#d4d4d4] !text-[#111111]"
            >
              Solicitar información
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e5e5e5] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:p-8">
          <label className="block text-sm text-[#737373]">
            Precio del vehículo (USD)
            <input
              type="number"
              min={0}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value) || 0)}
              className="field-input !bg-[#fafafa] !text-[#111111]"
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
              className="field-input !bg-[#fafafa] !text-[#111111]"
            >
              {financeConfig.terms.map((option) => (
                <option key={option} value={option}>
                  {option} meses
                </option>
              ))}
            </select>
          </label>
          <div className="mt-6 rounded-2xl bg-[#0a0a0a] p-5 text-white">
            <p className="kicker text-white/45">Cuota estimada</p>
            <p className="mt-2 font-display text-3xl font-semibold">{formatUsd(cuota)}</p>
            <p className="mt-1 text-sm text-white/45">{formatDop(cuota * DEFAULT_TASA_USD_DOP)} referencia DOP</p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#737373]">
            Estimación únicamente. {financeConfig.notes}
          </p>
        </div>
      </div>
    </section>
  );
}
