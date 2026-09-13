import { getValcronProspectos } from "@/lib/admin-data";
import { CRM_STATES } from "@/lib/crm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embudo Kanban",
};

export default async function KanbanPage() {
  const { prospectos, error } = await getValcronProspectos();

  if (error) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {error}
      </p>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {CRM_STATES.map((estado) => {
        const cards = prospectos.filter((row) => row.estado_crm === estado);
        return (
          <section
            key={estado}
            className="w-72 shrink-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-[#0B0C10]">{estado}</h2>
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                {cards.length}
              </span>
            </div>
            <div className="grid gap-3">
              {cards.length === 0 ? (
                <p className="text-xs text-gray-400">Sin tarjetas</p>
              ) : (
                cards.map((row) => (
                  <article
                    key={row.id}
                    className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-3"
                  >
                    <p className="text-sm font-medium text-[#0B0C10]">
                      {row.nombre}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.telefono || row.email || row.origen_lead}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
