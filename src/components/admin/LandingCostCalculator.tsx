"use client";

import { useMemo, useState } from "react";
import { AdminCard, AdminField, AdminInput } from "@/components/admin/ui";
import { formatUsdPlain } from "@/lib/admin-metrics";
import {
  DEFAULT_TASA_USD_DOP,
  calculateVehicleCosts,
  parseAmount,
} from "@/lib/vehicle-costs";

export function LandingCostCalculator() {
  const [subasta, setSubasta] = useState("0");
  const [tallerUsa, setTallerUsa] = useState("0");
  const [grua, setGrua] = useState("0");
  const [titulo, setTitulo] = useState("0");
  const [fees, setFees] = useState("0");
  const [flete, setFlete] = useState("0");
  const [tasa, setTasa] = useState(String(DEFAULT_TASA_USD_DOP));
  const [tallerRd, setTallerRd] = useState("0");
  const [dga, setDga] = useState("0");

  const costs = useMemo(
    () =>
      calculateVehicleCosts({
        costoSubastaUsd: parseAmount(subasta),
        gastosTallerUsaUsd: parseAmount(tallerUsa),
        gastosGruaUsd: parseAmount(grua),
        gastosTitulacionUsd: parseAmount(titulo),
        feesAdicionalesUsd: parseAmount(fees),
        fleteUsd: parseAmount(flete),
        tasaUsdDop: parseAmount(tasa) || DEFAULT_TASA_USD_DOP,
        gastosTallerRdDop: parseAmount(tallerRd),
        impuestosDgaDop: parseAmount(dga),
      }),
    [dga, fees, flete, grua, subasta, tallerRd, tallerUsa, tasa, titulo],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-[#0B0C10]">
          Costos de importación
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AdminField label="Hammer / subasta USD">
            <AdminInput value={subasta} onChange={(e) => setSubasta(e.target.value)} />
          </AdminField>
          <AdminField label="Fees USD">
            <AdminInput value={fees} onChange={(e) => setFees(e.target.value)} />
          </AdminField>
          <AdminField label="Taller USA USD">
            <AdminInput value={tallerUsa} onChange={(e) => setTallerUsa(e.target.value)} />
          </AdminField>
          <AdminField label="Grúa USD">
            <AdminInput value={grua} onChange={(e) => setGrua(e.target.value)} />
          </AdminField>
          <AdminField label="Titulación USD">
            <AdminInput value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </AdminField>
          <AdminField label="Flete USD">
            <AdminInput value={flete} onChange={(e) => setFlete(e.target.value)} />
          </AdminField>
          <AdminField label="Taller RD DOP">
            <AdminInput value={tallerRd} onChange={(e) => setTallerRd(e.target.value)} />
          </AdminField>
          <AdminField label="Impuestos DGA DOP">
            <AdminInput value={dga} onChange={(e) => setDga(e.target.value)} />
          </AdminField>
          <AdminField label="Tasa USD/DOP">
            <AdminInput value={tasa} onChange={(e) => setTasa(e.target.value)} />
          </AdminField>
        </div>
      </AdminCard>
      <AdminCard>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          Landing cost
        </p>
        <p className="mt-4 font-display text-4xl font-semibold text-[#0B0C10]">
          {formatUsdPlain(costs.costoTotalUsd)}
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Costo USD en DOP</dt>
            <dd className="font-medium">
              DOP${" "}
              {costs.costoUsdEnDop.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Costo total DOP</dt>
            <dd className="font-medium">
              DOP${" "}
              {costs.costoTotalDop.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Precio estimado (+20%)</dt>
            <dd className="font-medium text-[#0B0C10]">
              DOP${" "}
              {costs.precioEstimadoDop.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </dd>
          </div>
        </dl>
      </AdminCard>
    </div>
  );
}
