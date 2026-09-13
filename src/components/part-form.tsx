"use client";

import { useActionState, useMemo, useState } from "react";
import { createRepuesto, updateRepuesto } from "@/app/actions/catalog";
import {
  Field,
  FormError,
  MoneyInput,
  TextInput,
} from "@/components/form-fields";
import { COMPANY_NAMES } from "@/lib/companies";
import { formatUsd } from "@/lib/money";
import {
  SALE_CHANNELS,
  normalizeSaleChannels,
  type SaleChannel,
} from "@/lib/parts";
import { parseAmount } from "@/lib/vehicle-costs";

export type PartFormValues = {
  id: string;
  codigo_pieza: string;
  nombre: string;
  cantidad: number | null;
  precio_costo: number | null;
  envio_usd: number | null;
  comisiones_usd: number | null;
  precio_venta: number | null;
  canales_venta: string[] | null;
};

export function PartForm({ part }: { part?: PartFormValues }) {
  const action = part ? updateRepuesto.bind(null, part.id) : createRepuesto;
  const [state, formAction, pending] = useActionState(action, null);
  const [precioCosto, setPrecioCosto] = useState(String(part?.precio_costo ?? 0));
  const [envioUsd, setEnvioUsd] = useState(String(part?.envio_usd ?? 0));
  const [comisionesUsd, setComisionesUsd] = useState(
    String(part?.comisiones_usd ?? 0),
  );
  const [precioVenta, setPrecioVenta] = useState(String(part?.precio_venta ?? 0));
  const [canales, setCanales] = useState<SaleChannel[]>(
    normalizeSaleChannels(part?.canales_venta),
  );

  const costoTotalUsd = useMemo(
    () =>
      parseAmount(precioCosto) + parseAmount(envioUsd) + parseAmount(comisionesUsd),
    [precioCosto, envioUsd, comisionesUsd],
  );

  function toggleChannel(channel: SaleChannel) {
    setCanales((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      <p className="text-sm text-slate-400">
        El registro se asociará a {COMPANY_NAMES.partsDirect}. Todos los montos
        se manejan en USD.
      </p>
      <FormError message={state?.error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Código Pieza">
          <TextInput
            name="codigo_pieza"
            required
            defaultValue={part?.codigo_pieza}
            placeholder="ALT-001"
          />
        </Field>
        <Field label="Nombre">
          <TextInput
            name="nombre"
            required
            defaultValue={part?.nombre}
            placeholder="Alternador Toyota"
          />
        </Field>
        <Field label="Cantidad">
          <TextInput
            name="cantidad"
            type="number"
            required
            min={0}
            step="1"
            defaultValue={part?.cantidad ?? 1}
          />
        </Field>
        <Field label="Precio Costo (USD)">
          <MoneyInput
            currency="USD"
            name="precio_costo"
            value={precioCosto}
            onChange={(event) => setPrecioCosto(event.target.value)}
          />
        </Field>
        <Field label="Envío (USD)">
          <MoneyInput
            currency="USD"
            name="envio_usd"
            value={envioUsd}
            onChange={(event) => setEnvioUsd(event.target.value)}
          />
        </Field>
        <Field label="Comisiones (USD)">
          <MoneyInput
            currency="USD"
            name="comisiones_usd"
            value={comisionesUsd}
            onChange={(event) => setComisionesUsd(event.target.value)}
          />
        </Field>
        <Field label="Precio de Venta (USD)">
          <MoneyInput
            currency="USD"
            name="precio_venta"
            value={precioVenta}
            onChange={(event) => setPrecioVenta(event.target.value)}
          />
        </Field>
      </div>

      <fieldset className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <legend className="px-1 text-sm font-semibold text-slate-200">
          Canales de venta
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SALE_CHANNELS.map((channel) => (
            <label
              key={channel}
              className="flex items-center gap-3 text-sm text-slate-200"
            >
              <input
                type="checkbox"
                name="canales_venta"
                value={channel}
                checked={canales.includes(channel)}
                onChange={() => toggleChannel(channel)}
                className="h-4 w-4 rounded border-white/20 bg-[#0b1a2b] text-cyan-400"
              />
              {channel}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Costo consolidado USD
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {formatUsd(costoTotalUsd)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Costo + envío + comisiones
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {pending
            ? "Guardando..."
            : part
              ? "Guardar cambios"
              : "Guardar repuesto"}
        </button>
      </div>
    </form>
  );
}
