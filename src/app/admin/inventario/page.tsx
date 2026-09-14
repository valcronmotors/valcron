import Link from "next/link";
import { AdminStatusBadge, AuctionBadge } from "@/components/admin/AdminBadges";
import { AdminSuccess } from "@/components/admin/ui";
import { getValcronVehicles } from "@/lib/admin-data";
import {
  formatUsdPlain,
  vehicleCostUsd,
  vehicleMarginUsd,
  vehicleSaleUsd,
} from "@/lib/admin-metrics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock RD",
};

export default async function AdminInventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string }>;
}) {
  const params = await searchParams;
  const { vehicles, error } = await getValcronVehicles();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-gray-500">
          Inventario de Valcron Motors Group SRL. Valores estimados en USD según
          precio de venta y tasa registrada.
        </p>
        <Link
          href="/admin/inventario/nuevo"
          className="inline-flex h-11 items-center rounded-lg bg-[#0B0C10] px-5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Agregar vehículo
        </Link>
      </div>
      <AdminSuccess show={params.creado === "1"}>
        Vehículo registrado en el inventario.
      </AdminSuccess>
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : vehicles.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
          Todavía no hay unidades en stock.
        </p>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">VIN</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fuente</th>
                <th className="px-4 py-3 font-medium">Costo</th>
                <th className="px-4 py-3 font-medium">Venta</th>
                <th className="px-4 py-3 font-medium">Margen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => {
                const margin = vehicleMarginUsd(vehicle);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#0B0C10]">
                      {vehicle.marca} {vehicle.modelo} {vehicle.ano}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {vehicle.vin}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge estado={vehicle.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <AuctionBadge source={vehicle.fuente_subasta} />
                    </td>
                    <td className="px-4 py-3">{formatUsdPlain(vehicleCostUsd(vehicle))}</td>
                    <td className="px-4 py-3">{formatUsdPlain(vehicleSaleUsd(vehicle))}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        margin >= 0 ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {formatUsdPlain(margin)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
