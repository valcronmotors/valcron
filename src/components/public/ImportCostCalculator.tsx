"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Landmark, Ship, Tag } from "lucide-react";
import { formatDop, formatUsd } from "@/lib/money";
import { SITE, whatsappHref } from "@/lib/site";
import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";

const fieldClass = "field-input";

export function ImportCostCalculator() {
  const [nombre, setNombre] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [fuente, setFuente] = useState("Copart");
  const [auction, setAuction] = useState(18500);
  const [freight, setFreight] = useState(1480);
  const [dgaPct, setDgaPct] = useState(16);
  const [port, setPort] = useState(450);
  const [ley103, setLey103] = useState(false);

  const estimate = useMemo(() => {
    const dutyBase = auction + freight;
    const appliedPct = ley103 ? Math.max(dgaPct - 8, 4) : dgaPct;
    const dgaUsd = Math.round(dutyBase * (appliedPct / 100));
    const totalUsd = auction + freight + dgaUsd + port;
    const totalDop = totalUsd * DEFAULT_TASA_USD_DOP;
    return { appliedPct, dgaUsd, totalUsd, totalDop };
  }, [auction, dgaPct, freight, ley103, port]);

  const href = useMemo(() => {
    const lines = [
      `Hola, quiero cotizar una importación directa con ${SITE.shortName}.`,
      nombre ? `Nombre: ${nombre}` : null,
      vehiculo ? `Vehículo: ${vehiculo}` : null,
      `Fuente: ${fuente}`,
      `Precio subasta: ${formatUsd(auction)}`,
      `Flete marítimo: ${formatUsd(freight)}`,
      `Impuestos DGA (${estimate.appliedPct}%${ley103 ? ", Ley 103-13" : ""}): ${formatUsd(estimate.dgaUsd)}`,
      `Gastos de puerto: ${formatUsd(port)}`,
      `Estimado total: ${formatUsd(estimate.totalUsd)} · ${formatDop(estimate.totalDop)}`,
    ]
      .filter(Boolean)
      .join("\n");
    return whatsappHref(lines);
  }, [auction, estimate, freight, fuente, ley103, nombre, port, vehiculo]);

  return (
    <form
      className="grid gap-5 gloss-panel p-6 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div>
        <p className="kicker">Landing cost ilustrativo</p>
        <h3 className="mt-2 font-display text-2xl text-foreground">
          Calculadora de importación directa
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Precio de subasta + flete marítimo + impuestos DGA (Ley 103-13) + gastos de puerto.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-muted">
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
          Fuente de subasta
          <select
            value={fuente}
            onChange={(event) => setFuente(event.target.value)}
            className={fieldClass}
          >
            <option>Copart</option>
            <option>IAAI</option>
            <option>Manheim</option>
          </select>
        </label>
        <label className="block text-sm text-muted md:col-span-2">
          Vehículo deseado
          <input
            value={vehiculo}
            onChange={(event) => setVehiculo(event.target.value)}
            required
            placeholder="Marca, modelo, año o VIN"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block text-sm text-muted">
        Precio de subasta · {formatUsd(auction)}
        <input
          type="range"
          min={5000}
          max={70000}
          step={250}
          value={auction}
          onChange={(event) => setAuction(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="block text-sm text-muted">
        Flete marítimo · {formatUsd(freight)}
        <input
          type="range"
          min={900}
          max={2800}
          step={20}
          value={freight}
          onChange={(event) => setFreight(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="block text-sm text-muted">
        Impuestos DGA {estimate.appliedPct}% · {formatUsd(estimate.dgaUsd)}
        <input
          type="range"
          min={4}
          max={25}
          step={1}
          value={dgaPct}
          onChange={(event) => setDgaPct(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="block text-sm text-muted">
        Gastos de puerto · {formatUsd(port)}
        <input
          type="range"
          min={250}
          max={1200}
          step={25}
          value={port}
          onChange={(event) => setPort(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/18 bg-white/5 px-4 py-3 text-sm text-[#f5f5f5]">
        <input
          type="checkbox"
          checked={ley103}
          onChange={(event) => setLey103(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Aplicar incentivo ilustrativo Ley 103-13 (híbrido / eléctrico)
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryChip icon={Tag} label="Subasta" value={formatUsd(auction)} />
        <SummaryChip icon={Ship} label="Flete" value={formatUsd(freight)} />
        <SummaryChip icon={Landmark} label="DGA" value={formatUsd(estimate.dgaUsd)} />
        <SummaryChip icon={Anchor} label="Puerto" value={formatUsd(port)} />
      </div>

      <motion.div
        key={estimate.totalUsd}
        initial={{ opacity: 0.45, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <p className="kicker">Costo estimado aterrizado</p>
        <p className="mt-2 font-display text-3xl text-foreground">{formatUsd(estimate.totalUsd)}</p>
        <p className="mt-1 text-sm text-muted">{formatDop(estimate.totalDop)}</p>
      </motion.div>

      <button type="submit" className="btn-whatsapp">
        Enviar cotización por WhatsApp
      </button>
    </form>
  );
}

function SummaryChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span>
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </span>
    </div>
  );
}
