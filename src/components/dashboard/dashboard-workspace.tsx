"use client";

import { useMemo, useState } from "react";
import {
  AppShell,
  PrimaryButton,
  SecondaryButton,
} from "@/components/app-shell";
import { CompanySelector } from "@/components/company-selector";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { AddPartModal } from "@/components/parts/AddPartModal";
import { PartsInventoryTable } from "@/components/parts/PartsInventoryTable";
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal";
import { VehiclesInventoryTable } from "@/components/vehicles/VehiclesInventoryTable";
import { useInventorySync } from "@/hooks/use-inventory-sync";
import {
  COMPANY_NAMES,
  type Company,
  type CompanySlug,
} from "@/lib/companies";
import type { PartRow, VehicleRow } from "@/lib/inventory";
import { filterParts, filterVehicles } from "@/lib/inventory-filters";
import type { VehicleState } from "@/lib/vehicle-costs";

type DashboardCompany = Company & { registrada: boolean };

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        ok
          ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
          : "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`}
      />
      {label}
    </span>
  );
}

export function DashboardWorkspace({
  companies,
  selectedSlug,
  vehiculos,
  repuestos,
}: {
  companies: DashboardCompany[];
  selectedSlug: "todas" | CompanySlug;
  vehiculos: { rows: VehicleRow[]; error: string | null; count: number };
  repuestos: { rows: PartRow[]; error: string | null; count: number };
}) {
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [partOpen, setPartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState<"todos" | VehicleState>("todos");
  const vehicles = useInventorySync("vehiculos", vehiculos.rows);
  const parts = useInventorySync("repuestos", repuestos.rows);
  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles.rows, query, estado),
    [estado, query, vehicles.rows],
  );
  const filteredParts = useMemo(
    () => filterParts(parts.rows, query),
    [parts.rows, query],
  );
  const visibleCompanies =
    selectedSlug === "todas"
      ? companies
      : companies.filter((company) => company.slug === selectedSlug);
  const showVehicles = visibleCompanies.some(
    (company) => company.inventario === "vehiculos",
  );
  const showParts = visibleCompanies.some(
    (company) => company.inventario === "repuestos",
  );

  return (
    <AppShell
      title="Dashboard operativo"
      subtitle={`Vista de inventario para ${COMPANY_NAMES.valcron} y ${COMPANY_NAMES.partsDirect}.`}
      actions={
        <>
          <PrimaryButton onClick={() => setVehicleOpen(true)}>
            Agregar Vehículo
          </PrimaryButton>
          <SecondaryButton onClick={() => setPartOpen(true)}>
            Agregar Repuesto
          </SecondaryButton>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <CompanySelector companies={companies} selectedSlug={selectedSlug} />

        <InventoryToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Buscar por VIN, marca o código de pieza"
          showEstado={showVehicles}
          estado={estado}
          onEstadoChange={setEstado}
        />

        <section className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setVehicleOpen(true)}
            className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 text-left transition hover:bg-cyan-400/20"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Agregar Vehículo
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {COMPANY_NAMES.valcron}
              </p>
            </div>
            <span className="text-lg text-cyan-300">+</span>
          </button>
          <button
            type="button"
            onClick={() => setPartOpen(true)}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/10"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Agregar Repuesto
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {COMPANY_NAMES.partsDirect}
              </p>
            </div>
            <span className="text-lg text-slate-300">+</span>
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleCompanies.map((company) => (
            <article
              key={company.slug}
              className={`rounded-2xl border bg-white/5 p-5 ${
                selectedSlug === company.slug
                  ? "border-cyan-400/40 ring-1 ring-cyan-400/30"
                  : "border-white/10"
              }`}
            >
              <p className="text-sm text-slate-400">{company.nombre}</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {company.inventario === "vehiculos"
                  ? Math.max(vehicles.rows.length, vehiculos.count)
                  : Math.max(parts.rows.length, repuestos.count)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {company.registrada
                  ? "Registrada en empresas"
                  : company.etiquetaInventario}
              </p>
            </article>
          ))}
          {showVehicles ? (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Vehículos</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {Math.max(vehicles.rows.length, vehiculos.count)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {COMPANY_NAMES.valcron}
              </p>
            </article>
          ) : null}
          {showParts ? (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Repuestos</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {Math.max(parts.rows.length, repuestos.count)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {COMPANY_NAMES.partsDirect}
              </p>
            </article>
          ) : null}
        </section>

        <div className="grid gap-6">
          {showVehicles ? (
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {COMPANY_NAMES.valcron}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Inventario de vehículos
                  </p>
                </div>
                <StatusPill
                  ok={!vehiculos.error}
                  label={
                    vehiculos.error ? "Error de consulta" : "Supabase conectado"
                  }
                />
              </div>
              <div className="p-4">
                <VehiclesInventoryTable
                  rows={filteredVehicles}
                  error={vehiculos.error}
                  emptyLabel={
                    vehicles.rows.length === 0
                      ? "La tabla vehiculos está conectada, pero todavía no hay registros."
                      : "Ningún vehículo coincide con la búsqueda o el estado seleccionado."
                  }
                />
              </div>
            </section>
          ) : null}
          {showParts ? (
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {COMPANY_NAMES.partsDirect}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Inventario de repuestos
                  </p>
                </div>
                <StatusPill
                  ok={!repuestos.error}
                  label={
                    repuestos.error ? "Error de consulta" : "Supabase conectado"
                  }
                />
              </div>
              <div className="p-4">
                <PartsInventoryTable
                  rows={filteredParts}
                  error={repuestos.error}
                  emptyLabel={
                    parts.rows.length === 0
                      ? "La tabla repuestos está conectada, pero todavía no hay registros."
                      : "Ningún repuesto coincide con la búsqueda."
                  }
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <AddVehicleModal
        open={vehicleOpen}
        onClose={() => setVehicleOpen(false)}
        onCreated={vehicles.upsert}
      />
      <AddPartModal
        open={partOpen}
        onClose={() => setPartOpen(false)}
        onCreated={parts.upsert}
      />
    </AppShell>
  );
}
