"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Puedo ver y financiar un vehículo que ya está en República Dominicana?",
    a: "Sí. El inventario Disponible se ofrece para venta local en Santo Domingo Este, con asesoría de financiamiento a través de banca local.",
  },
  {
    q: "¿Cómo funciona la importación directa desde Copart o Manheim?",
    a: "Seleccionamos la unidad, pujamos e inspeccionamos, coordinamos el embarque marítimo y gestionamos el despacho aduanal hasta la entrega en RD.",
  },
  {
    q: "¿Qué es la Ley 103-13 y cómo me beneficia?",
    a: "Es el incentivo para vehículos eco-amigables. Te orientamos sobre elegibilidad, documentación y ahorro estimado antes de importar o comprar.",
  },
  {
    q: "¿Puedo encargar un modelo que no está en stock?",
    a: "Sí. Importamos por encargo con un proceso transparente de costos, tiempos y seguimiento desde la subasta hasta tu entrega.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {FAQS.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(active ? -1 : index)}
            >
              <span className="text-sm font-medium text-white">{item.q}</span>
              <span className="text-accent">{active ? "–" : "+"}</span>
            </button>
            {active ? (
              <p className="pb-5 text-sm leading-relaxed text-white/60">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
