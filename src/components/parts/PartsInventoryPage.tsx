"use client";

import { useMemo, useState } from "react";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { SuccessBanner } from "@/components/form-fields";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { AddPartModal } from "@/components/parts/AddPartModal";
import { PartsInventoryTable } from "@/components/parts/PartsInventoryTable";
import { useInventorySync } from "@/hooks/use-inventory-sync";
import { COMPANY_NAMES } from "@/lib/companies";
import type { PartRow } from "@/lib/inventory";
import { filterParts } from "@/lib/inventory-filters";

export function PartsInventoryPage({
  repuestos,
  error,
  created,
  updated,
}: {
  repuestos: PartRow[];
  error: string | null;
  created: boolean;
  updated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inventory = useInventorySync("repuestos", repuestos);
  const filtered = useMemo(
    () => filterParts(inventory.rows, query),
    [inventory.rows, query],
  );

  return (
    <AppShell
      title="Repuestos"
      subtitle={`Módulo de gestión de ${COMPANY_NAMES.partsDirect}. Montos en USD.`}
      actions={
        <PrimaryButton onClick={() => setOpen(true)}>
          Agregar Repuesto
        </PrimaryButton>
      }
    >
      <SuccessBanner show={created}>
        Repuesto guardado y asociado a {COMPANY_NAMES.partsDirect}.
      </SuccessBanner>
      <SuccessBanner show={updated}>
        Repuesto actualizado correctamente.
      </SuccessBanner>
      <div className="grid gap-4">
        <InventoryToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Buscar por código de pieza o nombre"
        />
        <PartsInventoryTable
          rows={filtered}
          error={error}
          emptyLabel={
            inventory.rows.length === 0
              ? `Todavía no hay repuestos registrados para ${COMPANY_NAMES.partsDirect}.`
              : "Ningún repuesto coincide con la búsqueda."
          }
          showEdit
        />
      </div>
      <AddPartModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={inventory.upsert}
      />
    </AppShell>
  );
}
