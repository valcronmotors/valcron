"use client";

import { useMemo, useState } from "react";
import { AdminCard, AdminField, AdminInput } from "@/components/admin/ui";
import { formatUsdPlain, monthlyPayment } from "@/lib/admin-metrics";

export function CuotaSimulator() {
  const [price, setPrice] = useState("35000");
  const [down, setDown] = useState("7000");
  const [rate, setRate] = useState("12.5");
  const [months, setMonths] = useState("60");

  const result = useMemo(() => {
    const precio = Number(price) || 0;
    const inicial = Number(down) || 0;
    const principal = Math.max(0, precio - inicial);
    const plazo = Math.max(1, Number(months) || 1);
    const cuota = monthlyPayment(principal, Number(rate) || 0, plazo);
    return {
      principal,
      cuota,
      total: cuota * plazo,
      interes: cuota * plazo - principal,
    };
  }, [down, months, price, rate]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-[#0B0C10]">
          Condiciones
        </h2>
        <div className="mt-6 grid gap-4">
          <AdminField label="Precio USD">
            <AdminInput value={price} onChange={(e) => setPrice(e.target.value)} />
          </AdminField>
          <AdminField label="Inicial USD">
            <AdminInput value={down} onChange={(e) => setDown(e.target.value)} />
          </AdminField>
          <AdminField label="Tasa anual %">
            <AdminInput value={rate} onChange={(e) => setRate(e.target.value)} />
          </AdminField>
          <AdminField label="Plazo (meses)">
            <AdminInput value={months} onChange={(e) => setMonths(e.target.value)} />
          </AdminField>
        </div>
      </AdminCard>
      <AdminCard>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          Cuota estimada
        </p>
        <p className="mt-4 font-display text-4xl font-semibold text-[#0B0C10]">
          {formatUsdPlain(result.cuota)}
          <span className="ml-2 text-base font-normal text-gray-400">/ mes</span>
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Monto a financiar</dt>
            <dd className="font-medium">{formatUsdPlain(result.principal)}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Intereses estimados</dt>
            <dd className="font-medium">{formatUsdPlain(result.interes)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Total a pagar</dt>
            <dd className="font-medium">{formatUsdPlain(result.total)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-5 text-gray-400">
          Referencia interna. La pre-aprobación final depende del banco y del
          expediente del cliente.
        </p>
      </AdminCard>
    </div>
  );
}
