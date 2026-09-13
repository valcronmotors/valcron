"use client";

import { useMemo, useState } from "react";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { CompanySelector } from "@/components/company-selector";
import { AddLeadModal } from "@/components/crm/AddLeadModal";
import { CrmBoard } from "@/components/crm/CrmBoard";
import { LeadDetailModal } from "@/components/crm/LeadDetailModal";
import { useProspectosSync } from "@/hooks/use-prospectos-sync";
import {
  COMPANIES,
  COMPANY_NAMES,
  type CompanySlug,
} from "@/lib/companies";
import { companySlugFromNombre, type ProspectoRow } from "@/lib/crm";
import type { PartRow, VehicleRow } from "@/lib/inventory";

export function CrmWorkspace({
  prospectos,
  vehiculos,
  repuestos,
  selectedSlug,
  error,
}: {
  prospectos: ProspectoRow[];
  vehiculos: VehicleRow[];
  repuestos: PartRow[];
  selectedSlug: "todas" | CompanySlug;
  error: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProspectoRow | null>(null);
  const sync = useProspectosSync(prospectos);
  const visible = useMemo(() => {
    if (selectedSlug === "todas") {
      return sync.rows;
    }
    return sync.rows.filter(
      (row) => companySlugFromNombre(row.empresa?.nombre) === selectedSlug,
    );
  }, [selectedSlug, sync.rows]);
  const selectedLead =
    selected == null
      ? null
      : (sync.rows.find((row) => row.id === selected.id) ?? selected);

  return (
    <AppShell
      wide
      title="CRM omnicanal"
      subtitle={`Tablero de prospectos para ${COMPANY_NAMES.valcron} y ${COMPANY_NAMES.partsDirect}.`}
      actions={
        <PrimaryButton onClick={() => setOpen(true)}>
          Agregar Prospecto
        </PrimaryButton>
      }
    >
      <div className="grid gap-5">
        <CompanySelector companies={COMPANIES} selectedSlug={selectedSlug} />
        {error ? (
          <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-sm text-amber-200">
            {error}
          </p>
        ) : (
          <CrmBoard
            rows={visible}
            onMove={(id, estado) => sync.move(id, estado)}
            onOpen={setSelected}
          />
        )}
      </div>
      <AddLeadModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={sync.upsert}
        vehiculos={vehiculos}
        repuestos={repuestos}
      />
      <LeadDetailModal
        lead={selectedLead}
        vehiculos={vehiculos}
        repuestos={repuestos}
        onClose={() => setSelected(null)}
        onUpdated={(record) => {
          sync.upsert(record);
          setSelected(record);
        }}
      />
    </AppShell>
  );
}
