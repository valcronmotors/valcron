"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { formatDop, formatUsd } from "@/lib/money";
import { SITE, whatsappHref } from "@/lib/site";
import { monthlyPayment } from "@/lib/public-filters";
import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";

const fieldClass = "field-input";

export function FinanceForm() {
  const searchParams = useSearchParams();
  const initialMonto = Number(searchParams.get("monto") ?? 25000) || 25000;
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState(initialMonto);
  const [downPct, setDownPct] = useState(20);
  const [plazo, setPlazo] = useState(48);
  const [perfil, setPerfil] = useState("Persona física asalariada");

  const simulation = useMemo(() => {
    const down = Math.round(monto * (downPct / 100));
    const financed = Math.max(monto - down, 0);
    const cuota = monthlyPayment(financed, plazo);
    const cuotaDop = cuota * DEFAULT_TASA_USD_DOP;
    return { down, financed, cuota, cuotaDop };
  }, [downPct, monto, plazo]);

  const href = useMemo(() => {
    const lines = [
      `Hola, solicito pre-evaluación de financiamiento con ${SITE.shortName}.`,
      nombre ? `Nombre: ${nombre}` : null,
      `Perfil: ${perfil}`,
      `Monto del vehículo: ${formatUsd(monto)}`,
      `Inicial estimada: ${formatUsd(simulation.down)} (${downPct}%)`,
      `Plazo: ${plazo} meses`,
      `Monto a financiar: ${formatUsd(simulation.financed)}`,
      `Cuota ilustrativa: ${formatUsd(simulation.cuota)} / mes · ${formatDop(simulation.cuotaDop)}`,
    ]
      .filter(Boolean)
      .join("\n");

    return whatsappHref(lines);
  }, [downPct, monto, nombre, perfil, plazo, simulation]);

  return (
    <form
      className="grid gap-5 gloss-panel p-6 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div>
        <p className="kicker">Simulador en tiempo real</p>
        <h3 className="mt-2 font-display text-2xl text-foreground">Calcula tu cuota</h3>
      </div>

      <label className="block text-sm text-muted">
        Precio del auto · {formatUsd(monto)}
        <input
          type="range"
          min={8000}
          max={80000}
          step={500}
          value={monto}
          onChange={(event) => setMonto(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="block text-sm text-muted">
        Inicial {downPct}% · {formatUsd(simulation.down)}
        <input
          type="range"
          min={20}
          max={60}
          step={1}
          value={downPct}
          onChange={(event) => setDownPct(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="block text-sm text-muted">
        Plazo {plazo} meses
        <input
          type="range"
          min={24}
          max={72}
          step={12}
          value={plazo}
          onChange={(event) => setPlazo(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>

      <motion.div
        key={`${simulation.cuota}-${plazo}`}
        initial={{ opacity: 0.4, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <div>
          <p className="kicker">Cuota mensual USD</p>
          <p className="mt-1 font-display text-3xl text-foreground">
            {formatUsd(simulation.cuota)}
          </p>
        </div>
        <div>
          <p className="kicker">Cuota mensual DOP</p>
          <p className="mt-1 font-display text-3xl text-foreground">
            {formatDop(simulation.cuotaDop)}
          </p>
        </div>
        <div>
          <p className="kicker">A financiar</p>
          <p className="mt-1 text-lg text-foreground">{formatUsd(simulation.financed)}</p>
        </div>
        <div>
          <p className="kicker">Inicial</p>
          <p className="mt-1 text-lg text-foreground">{formatUsd(simulation.down)}</p>
        </div>
      </motion.div>

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
        <label className="block text-sm text-muted md:col-span-2">
          Perfil
          <select
            value={perfil}
            onChange={(event) => setPerfil(event.target.value)}
            className={fieldClass}
          >
            <option>Persona física asalariada</option>
            <option>Independiente / formalizado</option>
          </select>
        </label>
      </div>
      <p className="text-sm leading-relaxed text-[#d4d4d4]">
        Estimación ilustrativa con tasa de referencia. La pre-aprobación definitiva la define cada
        banco según historial crediticio, capacidad de pago y documentación.
      </p>
      <a href={href} target="_blank" rel="noreferrer" className="btn-whatsapp">
        Enviar pre-evaluación por WhatsApp
      </a>
    </form>
  );
}
