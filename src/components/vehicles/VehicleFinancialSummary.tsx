"use client";

import { Field, TextInput } from "@/components/form-fields";
import { formatDop, formatPercent, formatUsd } from "@/lib/money";
import {
  calculateVehicleMargin,
  type calculateVehicleCosts,
} from "@/lib/vehicle-costs";

type Costs = ReturnType<typeof calculateVehicleCosts>;

export function VehicleFinancialSummary({
  costs,
  tasaUsdDop,
  onTasaChange,
  precioVentaDop,
  showTasaInput = false,
}: {
  costs: Costs;
  tasaUsdDop: number;
  onTasaChange?: (value: string) => void;
  precioVentaDop: number;
  showTasaInput?: boolean;
}) {
  const precio = precioVentaDop > 0 ? precioVentaDop : costs.precioEstimadoDop;
  const { margenDop, roiPercent } = calculateVehicleMargin(
    costs.costoTotalDop,
    precio,
  );
  const margenPositive = margenDop >= 0;

  return (
    <section className="grid gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Resumen financiero
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Cálculo en tiempo real con tasa USD → DOP configurable.
          </p>
        </div>
        {showTasaInput && onTasaChange ? (
          <div className="w-36">
            <Field label="Tasa USD → DOP">
              <TextInput
                type="number"
                min={1}
                step="0.01"
                value={String(tasaUsdDop)}
                onChange={(event) => onTasaChange(event.target.value)}
              />
            </Field>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Tasa {tasaUsdDop.toFixed(2)} DOP
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total gastos USD"
          value={formatUsd(costs.costoTotalUsd)}
          hint="Subasta + taller USA + grúa + titulación + fees + flete"
        />
        <Metric
          label="Total gastos DOP"
          value={formatDop(costs.gastosDop)}
          hint="Taller RD + impuestos DGA"
        />
        <Metric
          label="Costo consolidado total"
          value={formatDop(costs.costoTotalDop)}
          hint={`USD convertidos a ${tasaUsdDop.toFixed(2)} + gastos locales`}
          accent
        />
        <Metric
          label="Margen proyectado"
          value={formatDop(margenDop)}
          hint={`ROI ${formatPercent(roiPercent)} sobre el costo consolidado`}
          tone={margenPositive ? "positive" : "negative"}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
  accent = false,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
  tone?: "positive" | "negative";
}) {
  const valueClass = tone
    ? tone === "positive"
      ? "text-emerald-300"
      : "text-rose-300"
    : accent
      ? "text-cyan-300"
      : "text-white";

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${valueClass}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
