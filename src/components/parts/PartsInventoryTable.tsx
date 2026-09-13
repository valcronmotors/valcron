import Link from "next/link";
import { SaleChannelBadges } from "@/components/status-badges";
import type { PartRow } from "@/lib/inventory";
import { formatUsd } from "@/lib/money";

function moneyUsd(value: number | null | undefined) {
  return formatUsd(Number(value ?? 0));
}

export function PartsInventoryTable({
  rows,
  error,
  emptyLabel,
  showEdit = false,
}: {
  rows: PartRow[];
  error?: string | null;
  emptyLabel: string;
  showEdit?: boolean;
}) {
  if (error) {
    return (
      <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-sm text-amber-200">
        {error}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-sm text-slate-400">
        {emptyLabel}
      </p>
    );
  }

  return (
    <section className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Cantidad</th>
            <th className="px-4 py-3 font-medium">Precio costo</th>
            <th className="px-4 py-3 font-medium">Gastos envío</th>
            <th className="px-4 py-3 font-medium">Comisión</th>
            <th className="px-4 py-3 font-medium">Precio venta</th>
            <th className="px-4 py-3 font-medium">Canales</th>
            {showEdit ? <th className="px-4 py-3 font-medium"> </th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-slate-200">
          {rows.map((repuesto) => (
            <tr key={repuesto.id} className="hover:bg-white/5">
              <td className="px-4 py-3 font-mono text-xs">
                {repuesto.codigo_pieza}
              </td>
              <td className="px-4 py-3">{repuesto.nombre}</td>
              <td className="px-4 py-3">{repuesto.cantidad ?? 0}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(repuesto.precio_costo)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(repuesto.envio_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(repuesto.comisiones_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-cyan-300">
                {moneyUsd(repuesto.precio_venta)}
              </td>
              <td className="px-4 py-3">
                <SaleChannelBadges channels={repuesto.canales_venta} />
              </td>
              {showEdit ? (
                <td className="px-4 py-3">
                  <Link
                    href={`/repuestos/${repuesto.id}/editar`}
                    className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    Editar
                  </Link>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
