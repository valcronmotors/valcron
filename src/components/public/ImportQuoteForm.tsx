"use client";

import { useMemo, useState } from "react";
import { SITE, whatsappHref } from "@/lib/site";

const fieldClass = "field-input";

export function ImportQuoteForm() {
  const [nombre, setNombre] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fuente, setFuente] = useState("Copart / Manheim");
  const [notas, setNotas] = useState("");

  const href = useMemo(() => {
    const lines = [
      `Hola, quiero cotizar una importación por encargo con ${SITE.shortName}.`,
      nombre ? `Nombre: ${nombre}` : null,
      vehiculo ? `Vehículo: ${vehiculo}` : null,
      presupuesto ? `Presupuesto estimado: ${presupuesto}` : null,
      `Fuente: ${fuente}`,
      notas ? `Notas: ${notas}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return whatsappHref(lines);
  }, [fuente, nombre, notas, presupuesto, vehiculo]);

  return (
    <form
      className="grid gap-4 gloss-panel p-6"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
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
          Presupuesto estimado (USD)
          <input
            value={presupuesto}
            onChange={(event) => setPresupuesto(event.target.value)}
            placeholder="Ej. 18,500"
            className={fieldClass}
          />
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
        <label className="block text-sm text-muted md:col-span-2">
          Fuente de subasta
          <select
            value={fuente}
            onChange={(event) => setFuente(event.target.value)}
            className={fieldClass}
          >
            <option>Copart / Manheim</option>
            <option>Copart</option>
            <option>Manheim</option>
          </select>
        </label>
      </div>
      <label className="block text-sm text-muted">
        Notas
        <textarea
          value={notas}
          onChange={(event) => setNotas(event.target.value)}
          placeholder="Condición, color, kilometraje máximo o si aplica Ley 103-13"
          className="field-input mt-2 h-auto min-h-24 py-2"
        />
      </label>
      <button type="submit" className="btn-whatsapp">
        Enviar cotización por WhatsApp
      </button>
    </form>
  );
}
