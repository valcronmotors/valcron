import Link from "next/link";
import {
  VehicleLink,
  VehicleStatusBadge,
} from "@/components/status-badges";
import type { VehicleRow } from "@/lib/inventory";
import { formatDop, formatUsd } from "@/lib/money";

function moneyUsd(value: number | null | undefined) {
  return formatUsd(Number(value ?? 0));
}

function moneyDop(value: number | null | undefined) {
  return formatDop(Number(value ?? 0));
}

export function VehiclesInventoryTable({
  rows,
  error,
  emptyLabel,
  showEdit = false,
}: {
  rows: VehicleRow[];
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
            <th className="px-4 py-3 font-medium">VIN</th>
            <th className="px-4 py-3 font-medium">Marca</th>
            <th className="px-4 py-3 font-medium">Modelo</th>
            <th className="px-4 py-3 font-medium">Trim</th>
            <th className="px-4 py-3 font-medium">Año</th>
            <th className="px-4 py-3 font-medium">Ubicación</th>
            <th className="px-4 py-3 font-medium">Fotos</th>
            <th className="px-4 py-3 font-medium">Subasta</th>
            <th className="px-4 py-3 font-medium">Taller USA</th>
            <th className="px-4 py-3 font-medium">Grúa</th>
            <th className="px-4 py-3 font-medium">Titulación</th>
            <th className="px-4 py-3 font-medium">Fees</th>
            <th className="px-4 py-3 font-medium">Flete</th>
            <th className="px-4 py-3 font-medium">Costo USD</th>
            <th className="px-4 py-3 font-medium">Taller RD</th>
            <th className="px-4 py-3 font-medium">Impuestos DGA</th>
            <th className="px-4 py-3 font-medium">Costo DOP</th>
            <th className="px-4 py-3 font-medium">Precio venta</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            {showEdit ? <th className="px-4 py-3 font-medium"> </th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-slate-200">
          {rows.map((vehiculo) => (
            <tr key={vehiculo.id} className="hover:bg-white/5">
              <td className="px-4 py-3 font-mono text-xs">
                <VehicleLink id={vehiculo.id}>{vehiculo.vin}</VehicleLink>
              </td>
              <td className="px-4 py-3">{vehiculo.marca}</td>
              <td className="px-4 py-3">{vehiculo.modelo}</td>
              <td className="px-4 py-3">{vehiculo.trim || "—"}</td>
              <td className="px-4 py-3">{vehiculo.ano}</td>
              <td className="px-4 py-3 text-xs">
                {vehiculo.ubicacion_lote || "—"}
              </td>
              <td className="px-4 py-3">
                {(vehiculo.fotos_urls ?? []).length > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <img
                      src={vehiculo.fotos_urls![0]}
                      alt=""
                      className="h-10 w-14 rounded-md object-cover"
                    />
                    <span className="text-xs text-slate-400">
                      {vehiculo.fotos_urls!.length}
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.costo_subasta_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.gastos_taller_usa_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.gastos_grua_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.gastos_titulacion_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.fees_adicionales_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyUsd(vehiculo.flete_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                {moneyUsd(vehiculo.costo_total_usd)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyDop(vehiculo.costo_taller_dop)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {moneyDop(vehiculo.impuestos_dga_dop)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                {moneyDop(vehiculo.costo_total_dop)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-cyan-300">
                {moneyDop(vehiculo.precio_venta_dop)}
              </td>
              <td className="px-4 py-3">
                <VehicleStatusBadge estado={vehiculo.estado} />
              </td>
              {showEdit ? (
                <td className="px-4 py-3">
                  <span className="flex flex-col gap-1">
                    <Link
                      href={`/vehiculos/${vehiculo.id}`}
                      className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      Ver ficha
                    </Link>
                    <Link
                      href={`/vehiculos/${vehiculo.id}/editar`}
                      className="text-xs font-medium text-slate-400 hover:text-slate-200"
                    >
                      Editar
                    </Link>
                  </span>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
