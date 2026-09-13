"use client";

import { useState, type DragEvent } from "react";
import { updateProspectoEstado } from "@/app/actions/crm";
import {
  CRM_STATE_PILL,
  CRM_STATE_STYLES,
  CRM_STATES,
  DEFAULT_CRM_STATE,
  companySlugFromNombre,
  interestLabel,
  isCrmState,
  whatsappHref,
  type CrmState,
  type ProspectoRow,
} from "@/lib/crm";

export function CrmBoard({
  rows,
  onMove,
  onOpen,
}: {
  rows: ProspectoRow[];
  onMove: (id: string, estado: CrmState, previous: CrmState) => void;
  onOpen: (row: ProspectoRow) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<CrmState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moveLead(id: string, nextEstado: CrmState) {
    const current = rows.find((row) => row.id === id);
    if (!current || current.estado_crm === nextEstado) {
      return;
    }
    const previous = isCrmState(current.estado_crm)
      ? current.estado_crm
      : DEFAULT_CRM_STATE;
    setError(null);
    onMove(id, nextEstado, previous);
    const result = await updateProspectoEstado(id, nextEstado);
    if (result.error) {
      onMove(id, previous, nextEstado);
      setError(result.error);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>, estado: CrmState) {
    event.preventDefault();
    setOverColumn(null);
    const id = event.dataTransfer.getData("text/plain");
    setDraggingId(null);
    if (id) {
      void moveLead(id, estado);
    }
  }

  return (
    <div className="grid gap-3">
      {error ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      ) : null}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {CRM_STATES.map((estado) => {
          const items = rows.filter((row) => row.estado_crm === estado);
          const active = overColumn === estado;
          return (
            <section
              key={estado}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOverColumn(estado);
              }}
              onDragLeave={() => {
                if (overColumn === estado) {
                  setOverColumn(null);
                }
              }}
              onDrop={(event) => handleDrop(event, estado)}
              className={`flex min-h-[28rem] w-[18.5rem] shrink-0 flex-col rounded-2xl border p-3 ${
                CRM_STATE_STYLES[estado]
              } ${active ? "ring-2 ring-cyan-300" : ""}`}
            >
              <header className="mb-3 flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">{estado}</h2>
                <span className="rounded-full bg-slate-950/40 px-2 py-0.5 text-xs text-slate-300">
                  {items.length}
                </span>
              </header>
              <div className="flex flex-1 flex-col gap-3">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/15 px-3 py-6 text-center text-xs text-slate-400">
                    Suelta un prospecto aquí
                  </p>
                ) : (
                  items.map((row) => (
                    <LeadCard
                      key={row.id}
                      row={row}
                      dragging={draggingId === row.id}
                      onDragStart={() => setDraggingId(row.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverColumn(null);
                      }}
                      onMove={(next) => void moveLead(row.id, next)}
                      onOpen={() => onOpen(row)}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LeadCard({
  row,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
  onOpen,
}: {
  row: ProspectoRow;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (estado: CrmState) => void;
  onOpen: () => void;
}) {
  const estado = isCrmState(row.estado_crm) ? row.estado_crm : DEFAULT_CRM_STATE;
  const slug = companySlugFromNombre(row.empresa?.nombre);
  const whatsapp = whatsappHref(row.telefono);

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", row.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-2xl border border-white/10 bg-[#0b1726] p-4 shadow-lg shadow-black/20 active:cursor-grabbing ${
        dragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-white">{row.nombre}</p>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${CRM_STATE_PILL[estado]}`}
        >
          {row.origen_lead}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {row.empresa?.nombre ?? "Empresa"}
      </p>
      <p className="mt-3 text-sm text-cyan-200">{interestLabel(row)}</p>
      <p className="mt-2 text-xs text-slate-400">
        {row.telefono || "Sin teléfono"}
        {row.email ? ` · ${row.email}` : ""}
      </p>
      {row.notas ? (
        <p className="mt-2 line-clamp-3 text-xs text-slate-500">{row.notas}</p>
      ) : null}
      {slug === "valcron-motors-group-srl" && row.vehiculo?.vin ? (
        <p className="mt-2 font-mono text-[11px] text-slate-500">
          {row.vehiculo.vin}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="inline-flex h-8 items-center rounded-full bg-white/5 px-3 text-[11px] font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10"
        >
          Abrir ficha
        </button>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-8 items-center rounded-full bg-emerald-500/15 px-3 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
      <label className="mt-3 block text-[11px] font-medium text-slate-400">
        Mover a
        <select
          className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-[#07111f] px-2 text-xs text-slate-100"
          value={estado}
          onChange={(event) => onMove(event.target.value as CrmState)}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {CRM_STATES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
