import { getValcronProspectos } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directorio de Clientes",
};

export default async function ClientesPage() {
  const { prospectos, error } = await getValcronProspectos();

  if (error) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {error}
      </p>
    );
  }

  if (prospectos.length === 0) {
    return (
      <p className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
        Aún no hay clientes ni prospectos registrados.
      </p>
    );
  }

  return (
    <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-widest text-gray-400">
          <tr>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Teléfono</th>
            <th className="px-4 py-3 font-medium">Correo</th>
            <th className="px-4 py-3 font-medium">Origen</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {prospectos.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-[#0B0C10]">{row.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{row.telefono || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{row.email || "—"}</td>
              <td className="px-4 py-3 text-gray-500">{row.origen_lead}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {row.estado_crm}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
