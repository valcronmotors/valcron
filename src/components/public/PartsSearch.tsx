"use client";

import { useMemo, useState } from "react";
import { Field, FormError, TextInput } from "@/components/form-fields";
import { COMPANY_NAMES } from "@/lib/companies";
import { formatUsd } from "@/lib/money";
import { isVinQuery } from "@/lib/public-catalog";
import {
  catalogPartWhatsappHref,
  vinPartsWhatsappHref,
  type PublicPart,
} from "@/lib/public-catalog";

export function PartsSearch({
  initialParts,
  error,
}: {
  initialParts: PublicPart[];
  error: string | null;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim();
  const vinSearch = isVinQuery(normalized) ? normalized.toUpperCase() : null;

  const visible = useMemo(() => {
    if (vinSearch) {
      return [];
    }

    const needle = normalized.toLowerCase();
    if (!needle) {
      return initialParts;
    }

    return initialParts.filter(
      (part) =>
        part.codigoPieza.toLowerCase().includes(needle) ||
        part.nombre.toLowerCase().includes(needle),
    );
  }, [initialParts, normalized, vinSearch]);

  const vinWhatsapp = vinSearch ? vinPartsWhatsappHref(vinSearch) : null;

  return (
    <section id="repuestos" className="scroll-mt-24 border-t border-white/10 bg-[#050d18]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          {COMPANY_NAMES.partsDirect}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Repuestos originales</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Busca por código de pieza o pega un VIN de 17 caracteres para consultar disponibilidad
          con un asesor.
        </p>

        <div className="mt-8 max-w-xl">
          <Field label="VIN o código de pieza">
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. 1HGCY1F28RA000001 o RAD-220"
            />
          </Field>
        </div>

        <FormError message={error} />

        {vinSearch ? (
          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 px-6 py-8">
            <p className="text-sm text-slate-200">
              El catálogo de piezas no indexa VIN. Consulta el VIN{" "}
              <span className="font-semibold text-white">{vinSearch}</span> por WhatsApp y te
              confirmamos el repuesto original.
            </p>
            {vinWhatsapp ? (
              <a
                href={vinWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-emerald-400 px-5 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Consultar VIN por WhatsApp
              </a>
            ) : null}
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-sm text-slate-400">
            No hay piezas con ese código. Prueba otro número o solicita cotización.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((part) => {
              const whatsapp = catalogPartWhatsappHref(part);
              return (
                <article
                  key={part.id}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0b1726] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    {part.codigoPieza}
                  </p>
                  <h3 className="text-lg font-semibold text-white">{part.nombre}</h3>
                  <p className="text-sm text-slate-400">
                    {part.cantidad > 0 ? `${part.cantidad} en stock` : "Consultar disponibilidad"}
                  </p>
                  <p className="text-xl font-semibold text-cyan-200">
                    {formatUsd(part.precioVentaUsd)}
                  </p>
                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                    >
                      Consultar por WhatsApp
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
