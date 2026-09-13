import { getValcronVehicles } from "@/lib/admin-data";
import {
  formatUsdPlain,
  vehicleCostUsd,
  vehicleLabel,
  vehicleMarginUsd,
  vehicleSaleUsd,
} from "@/lib/admin-metrics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Margen por Vehículo",
};

export default async function MargenPage() {
  const { vehicles, error } = await getValcronVehicles();

  if (error) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {error}
      </p>
    );
  }

  const rows = [...vehicles].sort(
    (a, b) => vehicleMarginUsd(b) - vehicleMarginUsd(a),
  );

  return (
    <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-widest text-gray-400">
          <tr>
            <th className="px-4 py-3 font-medium">Vehículo</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Costo USD</th>
            <th className="px-4 py-3 font-medium">Venta USD</th>
            <th className="px-4 py-3 font-medium">Utilidad neta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((vehicle) => {
            const margin = vehicleMarginUsd(vehicle);
            return (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#0B0C10]">
                  {vehicleLabel(vehicle)}
                </td>
                <td className="px-4 py-3 text-gray-500">{vehicle.estado ?? "—"}</td>
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
  );
}
