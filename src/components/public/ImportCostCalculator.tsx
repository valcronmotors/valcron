"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { importCostConfig as config, IMPORT_ESTIMATE_NOTICE } from "@/lib/import-cost-config";
import { auctionFeesForPrice, estimateImport, importEstimateRange, type ImportEstimateInput } from "@/lib/import-estimate";
import { formatDop, formatUsd } from "@/lib/money";
import { DEFAULT_TASA_USD_DOP } from "@/lib/fx";
import { whatsappHref } from "@/lib/site";
import { trackWhatsAppNavigation } from "@/lib/google-tags";

const inputClass = "mt-1 min-h-12 w-full min-w-0 rounded-xl border border-[#d8dbe0] bg-white px-3 py-2 text-base text-[#08090b] focus:border-[#ec752f] focus:outline-none focus:ring-2 focus:ring-[#ec752f]/20";

function ImportCalculatorBody() {
  const params = useSearchParams();
  const [vehicle, setVehicle] = useState(params.get("vehiculo") ?? "");
  const [year, setYear] = useState(params.get("ano") ?? String(new Date().getUTCFullYear()));
  const [body, setBody] = useState("SUV");
  const [purchase, setPurchase] = useState("");
  const [provider, setProvider] = useState<"copart" | "iaai">(params.get("provider") === "iaai" ? "iaai" : "copart");
  const [fees, setFees] = useState("");
  const [cafta, setCafta] = useState(false);
  const [co2, setCo2] = useState(config.tax.defaultCo2Rate);
  const [hybrid, setHybrid] = useState(false);
  const [fuelIncluded, setFuelIncluded] = useState(config.freight.baseIncludesFuelSurcharge);
  const [inland, setInland] = useState("");
  const [insurance, setInsurance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const automaticFees = auctionFeesForPrice(Number(purchase), provider);
  const values: ImportEstimateInput = useMemo(() => ({
    purchaseUsd: Number(purchase), year: Number(year), provider,
    officialAuctionFeesUsd: fees.trim() ? Number(fees) : null,
    inlandUsd: inland.trim() ? Number(inland) : undefined,
    insuranceUsd: insurance.trim() ? Number(insurance) : undefined,
    caftaConfirmed: cafta, co2Rate: co2, hybridIllustrative: hybrid, freightIncludesFuel: fuelIncluded,
  }), [purchase, year, provider, fees, inland, insurance, cafta, co2, hybrid, fuelIncluded]);
  const estimate = useMemo(() => estimateImport(values), [values]);
  const range = useMemo(() => importEstimateRange(values), [values]);
  const message = useMemo(() => [
    "Hola Valcron, quiero importar uno así.",
    vehicle.trim() ? `Vehículo: ${vehicle.trim()} · año ${year} · ${body}` : `Año: ${year} · ${body}`,
    `Subasta: ${provider === "copart" ? "Copart" : "IAAI"}`,
    Number(purchase) > 0 ? `Compra estimada: ${formatUsd(Number(purchase))}` : null,
    ...(estimate?.lines.map(line => `${line.label} (estimado): ${formatUsd(line.usd)}`) ?? []),
    estimate ? `CIF de referencia: ${formatUsd(estimate.cif)}` : null,
    estimate ? `TOTAL ESTIMADO puesto en RD: ${formatUsd(estimate.totalUsd)} · ${formatDop(estimate.totalDop)}` : "Quiero confirmar la comisión oficial de subasta para completar mi cálculo.",
    range ? `Rango por distancia de transporte: ${formatUsd(range.minUsd)}–${formatUsd(range.maxUsd)}` : null,
    cafta ? "DR-CAFTA seleccionado: sujeto a validación documental de origen y requisitos." : "Sin preferencia arancelaria seleccionada.",
    hybrid ? "Incentivo híbrido/eléctrico seleccionado, solo ilustrativo y sujeto a elegibilidad." : null,
    IMPORT_ESTIMATE_NOTICE,
  ].filter(Boolean).join("\n"), [vehicle, year, body, provider, purchase, estimate, range, cafta, hybrid]);
  const href = whatsappHref(message);

  return <form className="grid min-w-0 gap-5 rounded-2xl border border-[#e4e6ea] bg-white p-5 text-[#08090b] sm:p-7" onSubmit={event => {
    event.preventDefault();
    if (!estimate || !vehicle.trim()) { setError("Completa el vehículo, el precio de compra y la comisión oficial de subasta para calcular el total."); return; }
    setError(null); trackWhatsAppNavigation(href); window.open(href, "_blank", "noopener,noreferrer");
  }}>
    <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a54d1c]">Importación por encargo · estimador</p><h3 className="mt-2 text-2xl font-bold">¿Cuánto me sale puesto en RD?</h3><p className="mt-2 text-sm text-[#676a70]">Organiza tu presupuesto con los parámetros operativos de Valcron. Todos los resultados son estimados.</p></div>
    {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium sm:col-span-2">Marca y modelo<input className={inputClass} value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="Ej. Honda CR-V Hybrid" required maxLength={140} /></label>
      <label className="text-sm font-medium">Año<input className={inputClass} type="number" min={1980} max={new Date().getUTCFullYear() + 2} value={year} onChange={e => setYear(e.target.value)} required /></label>
      <label className="text-sm font-medium">Tipo<select className={inputClass} value={body} onChange={e => setBody(e.target.value)}>{["Pickup", "SUV", "Sedán", "Hatchback"].map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="text-sm font-medium">Subasta<select className={inputClass} value={provider} onChange={e => { setProvider(e.target.value as "copart" | "iaai"); setFees(""); }}><option value="copart">Copart</option><option value="iaai">IAAI</option></select></label>
      <label className="text-sm font-medium">Precio estimado de compra (US$)<input className={inputClass} inputMode="decimal" type="number" min="1" max="10000000" step="0.01" value={purchase} onChange={e => { setPurchase(e.target.value); setFees(""); }} placeholder="Precio de martillo" required /></label>
      <label className="text-sm font-medium sm:col-span-2">Comisión oficial de subasta + gate (US$)<input className={inputClass} type="number" inputMode="decimal" min="0.01" step="0.01" value={fees || automaticFees?.toString() || ""} onChange={e => setFees(e.target.value)} placeholder="Cargo oficial confirmado para ese precio y cuenta" required={automaticFees == null} /><span className="mt-2 block text-xs font-normal leading-relaxed text-[#676a70]">Usa la tabla oficial de tu cuenta: las comisiones varían por precio, licencia y forma de pago. <a className="font-semibold underline" href={config.auctionFees[provider].source} target="_blank" rel="noopener noreferrer">Consultar tabla oficial {provider === "copart" ? "Copart" : "IAAI"}</a>. <a className="font-semibold underline" href={href} target="_blank" rel="noopener noreferrer">Pedir el cargo a Valcron</a>.</span></label>
      <label className="text-sm font-medium sm:col-span-2">Preferencia arancelaria<select className={inputClass} value={cafta ? "cafta" : "standard"} onChange={e => setCafta(e.target.value === "cafta")}><option value="standard">Sin preferencia confirmada · arancel estimado {config.tax.tariffRate * 100}%</option><option value="cafta">Origen EE. UU. y elegibilidad DR-CAFTA confirmados · {config.tax.caftaTariffRate * 100}%</option></select><span className="mt-1 block text-xs font-normal text-[#676a70]">El origen y los requisitos se confirman con documentos; no basta el VIN ni comprar en EE. UU.</span></label>
      <label className="text-sm font-medium">Emisiones CO₂<select className={inputClass} value={co2} onChange={e => setCo2(Number(e.target.value))}>{config.tax.co2Rates.map(rate => <option key={rate} value={rate}>{rate * 100}% del CIF</option>)}</select></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hybrid} onChange={e => setHybrid(e.target.checked)} />Simular incentivo Ley 103-13 (híbrido/eléctrico, ilustrativo)</label>
    </div>
    <details className="rounded-xl border border-[#e4e6ea] p-4"><summary className="cursor-pointer text-sm font-semibold">Ajustar transporte y seguro</summary><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm">Transporte terrestre EE. UU. (US$)<input className={inputClass} type="number" min={0} step="0.01" value={inland} onChange={e => setInland(e.target.value)} placeholder={String(config.inland.typicalUsd)} /><span className="mt-1 block text-xs text-[#676a70]">Promedio {formatUsd(config.inland.typicalUsd)}; rango de referencia {formatUsd(config.inland.minUsd)}–{formatUsd(config.inland.maxUsd)} según distancia.</span></label><label className="text-sm">Seguro adicional indicado (US$)<input className={inputClass} type="number" min={0} step="0.01" value={insurance} onChange={e => setInsurance(e.target.value)} placeholder="0 si no se indicó por separado" /></label><label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={fuelIncluded} onChange={e => setFuelIncluded(e.target.checked)} className="mt-1" />El flete base de {formatUsd(config.freight.baseUsd)} ya incluye el recargo de combustible. Marcar solo si está confirmado en la cotización.</label></div></details>
    {estimate ? <section aria-live="polite" aria-label="Resultado estimado de importación" className="rounded-2xl border border-[#edddd1] bg-[#fff7f0] p-4 sm:p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a54d1c]">TOTAL ESTIMADO puesto en RD</p><p className="mt-2 text-3xl font-bold">{formatUsd(estimate.totalUsd)}</p><p className="mt-1 text-lg font-semibold">{formatDop(estimate.totalDop)}</p>{range ? <p className="mt-2 text-xs text-[#676a70]">Rango estimado según transporte: {formatUsd(range.minUsd)}–{formatUsd(range.maxUsd)}.</p> : null}<dl className="mt-5 divide-y divide-[#edddd1]">{estimate.lines.map(line => <div key={line.key} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><dt>{line.label} <span className="text-xs text-[#676a70]">· estimado</span></dt><dd className="font-semibold">{formatUsd(line.usd)}</dd></div>)}</dl><p className="mt-3 text-xs text-[#676a70]">CIF de referencia: {formatUsd(estimate.cif)}. Cambio ilustrativo: RD${DEFAULT_TASA_USD_DOP}/US$1. El valor aduanal oficial puede diferir. Puerto y gestión se presentan juntos para no duplicar US$450.</p></section> : <p className="rounded-xl bg-[#f5f6f7] p-4 text-sm text-[#676a70]">Completa el precio y la comisión oficial para ver el total estimado completo con desglose.</p>}
    <p className="text-sm font-medium leading-relaxed">{IMPORT_ESTIMATE_NOTICE}.</p><p className="text-xs leading-relaxed text-[#676a70]">No es una liquidación oficial ni una oferta de venta. El flete es una referencia para vehículos de hasta 700 pies cúbicos; seguro no indicado, dimensiones especiales y cargos extraordinarios se confirman al cotizar. El incentivo ilustrativo no acredita elegibilidad ni aprobación.</p>
    <a href={href} target="_blank" rel="noopener noreferrer" className="home-orange-button inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold">Quiero importar uno así</a>
  </form>;
}

export function ImportCostCalculator() {
  return <Suspense fallback={<div className="min-h-80 rounded-2xl border border-[#e4e6ea] bg-white p-6 text-sm text-[#676a70]">Cargando estimador de importación…</div>}><ImportCalculatorBody /></Suspense>;
}
