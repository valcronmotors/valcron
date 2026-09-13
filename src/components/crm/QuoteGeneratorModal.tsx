"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createCotizacion, listCotizaciones } from "@/app/actions/crm";
import {
  Field,
  FormError,
  MoneyInput,
  TextArea,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { companyByNombre } from "@/lib/companies";
import {
  interestLabel,
  type CotizacionItem,
  type CotizacionRow,
  type ProspectoRow,
} from "@/lib/crm";
import type { PartRow, VehicleRow } from "@/lib/inventory";
import { formatDop, formatUsd } from "@/lib/money";
import { openQuotePrintWindow } from "@/lib/quote-print";
import {
  defaultQuoteItems,
  itemFromDop,
  itemFromUsd,
  quoteTotals,
  safeTasa,
} from "@/lib/quotes";
import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";

export function QuoteGeneratorModal({
  open,
  lead,
  vehiculos,
  repuestos,
  onClose,
}: {
  open: boolean;
  lead: ProspectoRow;
  vehiculos: VehicleRow[];
  repuestos: PartRow[];
  onClose: () => void;
}) {
  const company = companyByNombre(lead.empresa?.nombre);
  const usesDopSource = company?.inventario !== "repuestos";
  const initialTasa = safeTasa(
    lead.vehiculo?.tasa_usd_dop ?? DEFAULT_TASA_USD_DOP,
  );
  const [tasa, setTasa] = useState(initialTasa);
  const [items, setItems] = useState<CotizacionItem[]>(
    defaultQuoteItems(lead, vehiculos, repuestos, initialTasa),
  );
  const [notas, setNotas] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CotizacionRow[]>([]);
  const [pending, startTransition] = useTransition();
  const totals = useMemo(() => quoteTotals(items), [items]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const nextTasa = safeTasa(lead.vehiculo?.tasa_usd_dop ?? DEFAULT_TASA_USD_DOP);
    setTasa(nextTasa);
    setItems(defaultQuoteItems(lead, vehiculos, repuestos, nextTasa));
    setNotas("");
    setError(null);
    void listCotizaciones(lead.id).then((result) => {
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(result.data);
    });
  }, [lead, open, repuestos, vehiculos]);

  function updateItem(index: number, next: CotizacionItem) {
    setItems((current) => current.map((item, i) => (i === index ? next : item)));
  }

  function syncTasa(nextTasa: number) {
    const fx = safeTasa(nextTasa);
    setTasa(fx);
    setItems((current) =>
      current.map((item) =>
        usesDopSource ? itemFromDop(item, fx) : itemFromUsd(item, fx),
      ),
    );
  }

  function printQuote(quote: CotizacionRow) {
    const printed = openQuotePrintWindow({
      numero: quote.numero,
      fecha: new Date(quote.created_at).toLocaleString("es-DO"),
      companyName: company?.nombre ?? lead.empresa?.nombre ?? "Empresa",
      rnc: company?.rnc ?? "—",
      clienteNombre: lead.nombre,
      clienteTelefono: lead.telefono ?? "",
      clienteEmail: lead.email ?? "",
      interes: interestLabel(lead),
      tasa: quote.tasa_usd_dop,
      items: quote.items,
      subtotalUsd: quote.subtotal_usd,
      totalUsd: quote.total_usd,
      totalDop: quote.total_dop,
      notas: quote.notas ?? "",
    });
    if (printed.error) {
      setError(printed.error);
    }
  }

  function saveAndPrint() {
    startTransition(async () => {
      const result = await createCotizacion({
        prospectoId: lead.id,
        tasaUsdDop: tasa,
        items,
        notas: notas.trim() || null,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.record) {
        setSaved((current) => [result.record!, ...current]);
        printQuote(result.record);
      }
    });
  }

  return (
    <Modal
      open={open}
      layer="nested"
      size="xl"
      title="Cotización automática"
      subtitle={`${company?.nombre ?? lead.empresa?.nombre ?? "Empresa"} · RNC ${company?.rnc ?? "—"}`}
      onClose={onClose}
    >
      <div className="grid gap-5">
        <FormError message={error} />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tasa de cambio (DOP por USD)">
            <TextInput
              type="number"
              min={1}
              step="0.01"
              value={tasa}
              onChange={(event) => syncTasa(Number(event.target.value))}
            />
          </Field>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Total USD
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatUsd(totals.totalUsd)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Total DOP
            </p>
            <p className="mt-2 text-lg font-semibold text-cyan-200">
              {formatDop(totals.totalDop)}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {items.map((item, index) => (
            <div
              key={`${item.descripcion}-${index}`}
              className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <Field label="Descripción">
                  <TextInput
                    value={item.descripcion}
                    onChange={(event) =>
                      updateItem(index, {
                        ...item,
                        descripcion: event.target.value,
                      })
                    }
                  />
                </Field>
              </div>
              <div className="md:col-span-1">
                <Field label="Cant.">
                  <TextInput
                    type="number"
                    min={1}
                    value={item.cantidad}
                    onChange={(event) =>
                      updateItem(index, {
                        ...item,
                        cantidad: Number(event.target.value) || 1,
                      })
                    }
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Precio USD">
                  <MoneyInput
                    currency="USD"
                    value={item.precio_unitario_usd}
                    onChange={(event) =>
                      updateItem(
                        index,
                        itemFromUsd(
                          {
                            ...item,
                            precio_unitario_usd: Number(event.target.value) || 0,
                          },
                          tasa,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Precio DOP">
                  <MoneyInput
                    currency="DOP"
                    value={item.precio_unitario_dop}
                    onChange={(event) =>
                      updateItem(
                        index,
                        itemFromDop(
                          {
                            ...item,
                            precio_unitario_dop: Number(event.target.value) || 0,
                          },
                          tasa,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setItems((current) => [
              ...current,
              {
                descripcion: "",
                cantidad: 1,
                precio_unitario_usd: 0,
                precio_unitario_dop: 0,
              },
            ])
          }
          className="inline-flex h-10 w-fit items-center rounded-full bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
        >
          Agregar ítem
        </button>

        <Field label="Notas de la cotización">
          <TextArea
            value={notas}
            onChange={(event) => setNotas(event.target.value)}
            placeholder="Condiciones, vigencia o observaciones para el cliente"
          />
        </Field>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-full bg-white/5 px-5 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
          >
            Cerrar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={saveAndPrint}
            className="inline-flex h-11 items-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {pending ? "Generando..." : "Guardar e imprimir PDF"}
          </button>
        </div>

        {saved.length > 0 ? (
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-white">
              Cotizaciones guardadas
            </h3>
            {saved.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{quote.numero}</p>
                  <p className="text-xs text-slate-400">
                    {formatUsd(quote.total_usd)} · {formatDop(quote.total_dop)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => printQuote(quote)}
                  className="inline-flex h-9 items-center rounded-full bg-white/5 px-3 text-xs font-semibold text-slate-100 ring-1 ring-white/10"
                >
                  Reimprimir PDF
                </button>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </Modal>
  );
}
