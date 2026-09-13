"use client";

import { VehicleStatusFilterPills } from "@/components/status-badges";
import type { VehicleState } from "@/lib/vehicle-costs";

export function InventoryToolbar({
  query,
  onQueryChange,
  placeholder,
  estado,
  onEstadoChange,
  showEstado = false,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  estado?: "todos" | VehicleState;
  onEstadoChange?: (value: "todos" | VehicleState) => void;
  showEstado?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <label className="block text-sm font-medium text-slate-200">
        Búsqueda
        <input
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(event) => onQueryChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b1a2b] px-3 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
        />
      </label>
      {showEstado && estado && onEstadoChange ? (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-200">
            Estado del vehículo
          </p>
          <VehicleStatusFilterPills value={estado} onChange={onEstadoChange} />
        </div>
      ) : null}
    </div>
  );
}
