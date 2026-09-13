"use client";

import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/money";
import { SITE, whatsappHref } from "@/lib/site";
import { monthlyPayment } from "@/lib/public-filters";

const fieldClass = "field-input";

export function FinanceForm() {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("25000");
  const [inicial, setInicial] = useState("5000");
  const [plazo, setPlazo] = useState("48");
  const [perfil, setPerfil] = useState("Persona física asalariada");

  const simulation = useMemo(() => {
    const amount = Number(monto) || 0;
    const down = Number(inicial) || 0;
    const months = Number(plazo) || 0;
    const financed = Math.max(amount - down, 0);
    const cuota = monthlyPayment(financed, months);
    const inicialPct = amount > 0 ? (down / amount) * 100 : 0;

    return { amount, down, months, financed, cuota, inicialPct };
  }, [inicial, monto, plazo]);

  const href = useMemo(() => {
    const lines = [
      `Hola, solicito pre-evaluación de financiamiento con ${SITE.shortName}.`,
      nombre ? `Nombre: ${nombre}` : null,
      `Perfil: ${perfil}`,
      `Monto del vehículo: ${formatUsd(simulation.amount)}`,
      `Inicial estimada: ${formatUsd(simulation.down)} (${simulation.inicialPct.toFixed(0)}%)`,
      `Plazo: ${simulation.months} meses`,
      `Monto a financiar: ${formatUsd(simulation.financed)}`,
      `Cuota ilustrativa: ${formatUsd(simulation.cuota)} / mes`,
    ]
      .filter(Boolean)
      .join("\n");

    return whatsappHref(lines);
  }, [nombre, perfil, simulation]);

  return (
    <form
      className="grid gap-4 rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(11,12,16,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-muted md:col-span-2">
          Nombre
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            placeholder="Tu nombre"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-muted">
          Monto del vehículo (USD)
          <input
            type="number"
            min={0}
            value={monto}
            onChange={(event) => setMonto(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-muted">
          Inicial estimada (USD)
          <input
            type="number"
            min={0}
            value={inicial}
            onChange={(event) => setInicial(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-muted">
          Plazo
          <select value={plazo} onChange={(event) => setPlazo(event.target.value)} className={fieldClass}>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
            <option value="72">72 meses</option>
          </select>
        </label>
        <label className="block text-sm text-muted">
          Perfil
          <select value={perfil} onChange={(event) => setPerfil(event.target.value)} className={fieldClass}>
            <option>Persona física asalariada</option>
            <option>Independiente / formalizado</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 rounded-xl border border-accent/35 bg-surface p-4 sm:grid-cols-3">
        <div>
          <p className="kicker">A financiar</p>
          <p className="mt-1 text-lg text-foreground">{formatUsd(simulation.financed)}</p>
        </div>
        <div>
          <p className="kicker">Inicial</p>
          <p className="mt-1 text-lg text-foreground">{simulation.inicialPct.toFixed(0)}%</p>
        </div>
        <div>
          <p className="kicker">Cuota ilustrativa</p>
          <p className="mt-1 text-lg text-foreground">{formatUsd(simulation.cuota)}</p>
        </div>
      </div>
      <p className="text-xs leading-5 text-muted">
        Estimación ilustrativa con tasa de referencia. La pre-aprobación definitiva la define cada
        banco según historial crediticio, capacidad de pago y documentación.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="btn-whatsapp"
      >
        Enviar pre-evaluación por WhatsApp
      </a>
    </form>
  );
}
