"use client";

import { useMemo, useState } from "react";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { SuccessBanner } from "@/components/form-fields";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal";
import { VehiclesInventoryTable } from "@/components/vehicles/VehiclesInventoryTable";
import { useInventorySync } from "@/hooks/use-inventory-sync";
import { COMPANY_NAMES } from "@/lib/companies";
import type { VehicleRow } from "@/lib/inventory";
import { filterVehicles } from "@/lib/inventory-filters";
import type { VehicleState } from "@/lib/vehicle-costs";

export function VehiclesInventoryPage({
  vehiculos,
  error,
  created,
  updated,
}: {
  vehiculos: VehicleRow[];
  error: string | null;
  created: boolean;
  updated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState<"todos" | VehicleState>("todos");
  const inventory = useInventorySync("vehiculos", vehiculos);
  const filtered = useMemo(
    () => filterVehicles(inventory.rows, query, estado),
    [estado, inventory.rows, query],
  );

  return (
    <AppShell
      title="Vehículos"
      subtitle={`Módulo de gestión de ${COMPANY_NAMES.valcron}.`}
      actions={
        <PrimaryButton onClick={() => setOpen(true)}>
          Agregar Vehículo
        </PrimaryButton>
      }
    >
      <SuccessBanner show={created}>
        Vehículo guardado y asociado a {COMPANY_NAMES.valcron}.
      </SuccessBanner>
      <SuccessBanner show={updated}>
        Vehículo actualizado correctamente.
      </SuccessBanner>
      <div className="grid gap-4">
        <InventoryToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Buscar por VIN o marca"
          showEstado
          estado={estado}
          onEstadoChange={setEstado}
        />
        <VehiclesInventoryTable
          rows={filtered}
          error={error}
          emptyLabel={
            inventory.rows.length === 0
              ? `Todavía no hay vehículos registrados para ${COMPANY_NAMES.valcron}.`
              : "Ningún vehículo coincide con la búsqueda o el estado seleccionado."
          }
          showEdit
        />
      </div>
      <AddVehicleModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={inventory.upsert}
      />
    </AppShell>
  );
}
