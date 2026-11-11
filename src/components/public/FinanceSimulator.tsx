"use client";

import { useState } from "react";
import { financeEstimate } from "@/lib/vehicle-finance";
import { financeConfig } from "@/lib/finance-config";
import { DEFAULT_TASA_USD_DOP } from "@/lib/fx";
import { formatDecimal, formatUsd } from "@/lib/money";
import { whatsappHref } from "@/lib/site";

const field = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-[#d8dbe0] bg-white px-3 py-2 text-base text-[#08090b] focus:outline-none focus:ring-2 focus:ring-[#ec752f]";
const dop = (value: number) => `RD$${formatDecimal(value, 0)}`;

export function FinanceSimulator({ priceUsd = 25000, downPaymentDop, vehicleTitle, fixedPrice = false }: {
  priceUsd?: number; downPaymentDop?: number | null; vehicleTitle?: string; fixedPrice?: boolean;
}) {
  const [price, setPrice] = useState(String(priceUsd));
  const [down, setDown] = useState(String(Math.round(downPaymentDop ?? priceUsd * DEFAULT_TASA_USD_DOP * financeConfig.defaultDownPaymentPct / 100)));
  const [months, setMonths] = useState<number>(financeConfig.defaultTermMonths);
  const estimate = price.trim() && down.trim() ? financeEstimate(Number(price), Number(down), months) : null;
  const message = ["Hola Valcron, quiero cotizar financiamiento.", vehicleTitle,
    `Precio del vehículo: ${formatUsd(Number(price) || 0)}`,
    ...(estimate ? [`Inicial estimada: ${dop(estimate.downPaymentDop)}`, `Plazo: ${months} meses`, `Cuota estimada: ${dop(estimate.monthlyDop)}/mes`, `Tasa ilustrativa: ${estimate.annualRate * 100}% anual`] : []),
    "Estimación sujeta a evaluación bancaria y cotización final."].filter(Boolean).join("\n");
  return <section aria-label="Simulador de financiamiento" className="min-w-0 rounded-2xl border border-[#e4e6ea] bg-white p-5 text-[#08090b] sm:p-6">
    <h3 className="text-xl font-bold">Simula tu cuota</h3>
    <p className="mt-1 text-sm text-[#676a70]">Ajusta la inicial y el plazo.</p>
    {downPaymentDop != null ? <p className="mt-3 rounded-xl bg-[#fff4eb] px-3 py-2 text-sm font-bold text-[#944314]">Inicial: {dop(downPaymentDop)}</p> : null}
    <div className="mt-5 grid min-w-0 gap-4">
      {fixedPrice ? <p className="text-sm text-[#50545b]">Precio del vehículo <strong className="text-[#08090b]">{formatUsd(priceUsd)}</strong></p> : <label className="text-sm font-semibold">Precio del vehículo (US$)<input className={field} type="number" min="1" step="100" value={price} onChange={e => setPrice(e.target.value)} /></label>}
      <label className="text-sm font-semibold">Inicial (RD$)<input className={field} type="number" min="0" step="1000" value={down} onChange={e => setDown(e.target.value)} /></label>
      <label className="text-sm font-semibold">Plazo<select className={field} value={months} onChange={e => setMonths(Number(e.target.value))}>{[24, 36, 48, 60, 72].map(value => <option key={value} value={value}>{value} meses</option>)}</select></label>
    </div>
    <div aria-live="polite" className="mt-5 rounded-xl border border-[#edddd1] bg-[#fff4eb] p-4">
      {estimate ? <><p className="text-xs font-semibold uppercase tracking-wider text-[#944314]">Cuota estimada mensual</p><p className="mt-2 break-words text-3xl font-bold">{dop(Math.ceil(estimate.monthlyDop))}</p><p className="mt-2 text-sm text-[#50545b]">A financiar: {dop(estimate.financedDop)}</p></> : <p className="text-sm text-[#944314]">La inicial debe ser menor que el precio del vehículo. Introduce importes válidos.</p>}
    </div>
    <p className="mt-3 text-xs leading-relaxed text-[#676a70]">Tasa ilustrativa {financeConfig.defaultAnnualRate * 100}% anual · cambio RD${DEFAULT_TASA_USD_DOP}/US$1. Cuota estimada, sujeta a aprobación bancaria y cotización final.</p>
    <a className="home-orange-button mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-center text-sm font-semibold" href={whatsappHref(message)} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp</a>
  </section>;
}
