"use client";

import { useMemo, useState, useTransition } from "react";
import { createProspecto } from "@/app/actions/crm";
import {
  Field,
  FormError,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { COMPANIES, COMPANY_NAMES, type CompanySlug } from "@/lib/companies";
import {
  CRM_STATES,
  DEFAULT_CRM_STATE,
  DEFAULT_LEAD_ORIGIN,
  LEAD_ORIGINS,
  type ProspectoRow,
} from "@/lib/crm";
import type { PartRow, VehicleRow } from "@/lib/inventory";

export function AddLeadModal({
  open,
  onClose,
  onCreated,
  vehiculos,
  repuestos,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (record: ProspectoRow) => void;
  vehiculos: VehicleRow[];
  repuestos: PartRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [companySlug, setCompanySlug] = useState<CompanySlug>(
    "valcron-motors-group-srl",
  );
  const [vehicleId, setVehicleId] = useState("");
  const [partId, setPartId] = useState("");
  const [query, setQuery] = useState("");

  const activeVehicles = useMemo(
    () => vehiculos.filter((row) => row.estado !== "Vendido"),
    [vehiculos],
  );
  const activeParts = useMemo(
    () => repuestos.filter((row) => Number(row.cantidad ?? 0) > 0),
    [repuestos],
  );
  const isVehicles = companySlug === "valcron-motors-group-srl";
  const needle = query.trim().toLowerCase();
  const filteredVehicles = useMemo(
    () =>
      activeVehicles.filter((vehiculo) => {
        if (!needle) {
          return true;
        }
        return `${vehiculo.vin} ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.trim ?? ""} ${vehiculo.ano}`
          .toLowerCase()
          .includes(needle);
      }),
    [activeVehicles, needle],
  );
  const filteredParts = useMemo(
    () =>
      activeParts.filter((repuesto) => {
        if (!needle) {
          return true;
        }
        return `${repuesto.codigo_pieza} ${repuesto.nombre}`
          .toLowerCase()
          .includes(needle);
      }),
    [activeParts, needle],
  );

  function resetForm() {
    setError(null);
    setCompanySlug("valcron-motors-group-srl");
    setVehicleId("");
    setPartId("");
    setQuery("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(formData: FormData) {
    formData.set("empresa_slug", companySlug);
    startTransition(async () => {
      const result = await createProspecto(null, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.record) {
        onCreated(result.record);
      }
      handleClose();
    });
  }

  return (
    <Modal
      open={open}
      title="Agregar Prospecto"
      subtitle="Registra el contacto, el origen omnicanal y, si aplica, el inventario de interés."
      onClose={handleClose}
    >
      <form action={handleSubmit} className="grid gap-5">
        <FormError message={error} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Empresa">
            <SelectInput
              name="empresa_slug_display"
              value={companySlug}
              onChange={(event) => {
                const next = event.target.value as CompanySlug;
                setCompanySlug(next);
                setVehicleId("");
                setPartId("");
                setQuery("");
              }}
            >
              {COMPANIES.map((company) => (
                <option key={company.slug} value={company.slug}>
                  {company.nombre}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Origen del lead">
            <SelectInput name="origen_lead" defaultValue={DEFAULT_LEAD_ORIGIN}>
              {LEAD_ORIGINS.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Nombre">
            <TextInput
              name="nombre"
              required
              placeholder="Nombre del interesado"
            />
          </Field>
          <Field label="Teléfono">
            <TextInput name="telefono" placeholder="809-000-0000" />
          </Field>
          <Field label="Correo">
            <TextInput
              name="email"
              type="email"
              placeholder="correo@cliente.com"
            />
          </Field>
          <Field label="Estado inicial">
            <SelectInput name="estado_crm" defaultValue={DEFAULT_CRM_STATE}>
              {CRM_STATES.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <Field label={isVehicles ? "Buscar por VIN o vehículo" : "Buscar por código de pieza"}>
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isVehicles
                ? "VIN, marca o modelo"
                : "Código de pieza o nombre"
            }
          />
        </Field>

        {isVehicles ? (
          <Field label={`Vehículo de interés · ${COMPANY_NAMES.valcron}`}>
            <SelectInput
              name="vehiculo_interes_id"
              value={vehicleId}
              onChange={(event) => setVehicleId(event.target.value)}
            >
              <option value="">Sin vehículo asignado</option>
              {filteredVehicles.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.marca} {vehiculo.modelo} {vehiculo.trim ?? ""}{" "}
                  {vehiculo.ano} · {vehiculo.vin} · {vehiculo.estado}
                </option>
              ))}
            </SelectInput>
            {filteredVehicles.length === 0 ? (
              <span className="mt-2 block text-xs text-amber-200">
                No hay vehículos que coincidan con la búsqueda.
              </span>
            ) : null}
          </Field>
        ) : (
          <Field label={`Repuesto de interés · ${COMPANY_NAMES.partsDirect}`}>
            <SelectInput
              name="repuesto_interes_id"
              value={partId}
              onChange={(event) => setPartId(event.target.value)}
            >
              <option value="">Sin repuesto asignado</option>
              {filteredParts.map((repuesto) => (
                <option key={repuesto.id} value={repuesto.id}>
                  {repuesto.codigo_pieza} · {repuesto.nombre} ·{" "}
                  {repuesto.cantidad} uds
                </option>
              ))}
            </SelectInput>
            {filteredParts.length === 0 ? (
              <span className="mt-2 block text-xs text-amber-200">
                No hay repuestos que coincidan con la búsqueda.
              </span>
            ) : null}
          </Field>
        )}

        <Field label="Notas">
          <TextArea
            name="notas"
            placeholder="Presupuesto, seguimiento o detalles de la negociación"
          />
        </Field>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-5 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar prospecto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
