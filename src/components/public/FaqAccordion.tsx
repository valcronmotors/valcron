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
    <div className="grid gap-3">
      {FAQS.map((item, index) => {
        const active = open === index;
        return (
          <div
            key={item.q}
            className="rounded-2xl border border-white/10 bg-[#12141C]/70 backdrop-blur-xl transition hover:border-[#D4AF37]/50"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(active ? -1 : index)}
            >
              <span className="text-sm font-semibold text-[#F4F5F7]">{item.q}</span>
              <span className="text-[#D4AF37]">{active ? "–" : "+"}</span>
            </button>
            {active ? (
              <p className="px-5 pb-5 text-sm leading-7 text-[#8A909A]">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
