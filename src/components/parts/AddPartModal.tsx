"use client";

import { useMemo, useState, useTransition } from "react";
import { createRepuesto } from "@/app/actions/catalog";
import {
  Field,
  FormError,
  MoneyInput,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { COMPANY_NAMES } from "@/lib/companies";
import type { PartRow } from "@/lib/inventory";
import { formatUsd } from "@/lib/money";
import { SALE_CHANNELS, type SaleChannel } from "@/lib/parts";
import { parseAmount } from "@/lib/vehicle-costs";

export function AddPartModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (record: PartRow) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [precioCosto, setPrecioCosto] = useState("0");
  const [envioUsd, setEnvioUsd] = useState("0");
  const [comisionesUsd, setComisionesUsd] = useState("0");
  const [precioVenta, setPrecioVenta] = useState("0");
  const [canales, setCanales] = useState<SaleChannel[]>([]);

  const costoTotalUsd = useMemo(
    () =>
      parseAmount(precioCosto) +
      parseAmount(envioUsd) +
      parseAmount(comisionesUsd),
    [comisionesUsd, envioUsd, precioCosto],
  );

  function resetForm() {
    setError(null);
    setPrecioCosto("0");
    setEnvioUsd("0");
    setComisionesUsd("0");
    setPrecioVenta("0");
    setCanales([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function toggleChannel(channel: SaleChannel) {
    setCanales((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  function handleSubmit(formData: FormData) {
    formData.set("mode", "modal");
    startTransition(async () => {
      const result = await createRepuesto(null, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.record) {
        onCreated(result.record);
      }
      handleClose();
    });
  }

  return (
    <Modal
      open={open}
      title="Agregar repuesto"
      subtitle={`Alta de inventario para ${COMPANY_NAMES.partsDirect}. Montos en USD.`}
      onClose={handleClose}
    >
      <form action={handleSubmit} className="grid gap-6">
        <FormError message={error} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Código de Pieza">
            <TextInput
              name="codigo_pieza"
              required
              placeholder="ALT-001"
            />
          </Field>
          <Field label="Nombre">
            <TextInput
              name="nombre"
              required
              placeholder="Alternador Honda"
            />
          </Field>
          <Field label="Cantidad">
            <TextInput
              name="cantidad"
              type="number"
              required
              min={0}
              step="1"
              defaultValue={1}
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
          <Field label="Gastos Envío (USD)">
            <MoneyInput
              currency="USD"
              name="envio_usd"
              value={envioUsd}
              onChange={(event) => setEnvioUsd(event.target.value)}
            />
          </Field>
          <Field label="Comisión Plataforma (USD)">
            <MoneyInput
              currency="USD"
              name="comisiones_usd"
              value={comisionesUsd}
              onChange={(event) => setComisionesUsd(event.target.value)}
            />
          </Field>
          <Field label="Precio Venta (USD)">
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

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Costo consolidado USD
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-300">
            {formatUsd(costoTotalUsd)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Costo + envío + comisión de plataforma
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-5 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar repuesto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
