"use client";

import { useActionState } from "react";
import { createVehiculo } from "@/app/actions/catalog";
import {
  AdminCard,
  AdminError,
  AdminField,
  AdminInput,
  AdminPrimaryButton,
  AdminSelect,
} from "@/components/admin/ui";
import { AUCTION_SOURCES } from "@/lib/auction";
import { DEFAULT_TASA_USD_DOP, VEHICLE_STATES } from "@/lib/vehicle-costs";

const currentYear = new Date().getFullYear();

export function AdminVehicleForm() {
  const [state, action, pending] = useActionState(createVehiculo, null);

  return (
    <AdminCard className="w-full">
      <h2 className="font-display text-lg font-semibold text-[#0B0C10]">
        Alta de inventario
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        El landing cost se calcula automáticamente a partir de subasta, fees,
        flete, taller e impuestos DGA.
      </p>
      <form action={action} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="return_to" value="/admin/inventario" />
        <div className="sm:col-span-2">
          <AdminError message={state?.error} />
        </div>
        <AdminField label="VIN">
          <AdminInput
            name="vin"
            required
            minLength={17}
            maxLength={17}
            placeholder="17 caracteres"
            className="font-mono uppercase"
          />
        </AdminField>
        <AdminField label="Año">
          <AdminInput
            name="ano"
            type="number"
            required
            min={1980}
            max={currentYear + 1}
            defaultValue={currentYear}
          />
        </AdminField>
        <AdminField label="Marca">
          <AdminInput name="marca" required placeholder="Mercedes-Benz" />
        </AdminField>
        <AdminField label="Modelo">
          <AdminInput name="modelo" required placeholder="GLC 300" />
        </AdminField>
        <AdminField label="Trim">
          <AdminInput name="trim" placeholder="AMG Line" />
        </AdminField>
        <AdminField label="Estado">
          <AdminSelect name="estado" defaultValue="En Subasta">
            {VEHICLE_STATES.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Fuente de subasta">
          <AdminSelect name="fuente_subasta" defaultValue="">
            <option value="">Sin fuente</option>
            {AUCTION_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Número de lote">
          <AdminInput name="lote_numero" placeholder="Lot #" />
        </AdminField>
        <AdminField label="Costo subasta USD">
          <AdminInput
            name="costo_subasta_usd"
            type="number"
            step="0.01"
            defaultValue="0"
          />
        </AdminField>
        <AdminField label="Flete USD">
          <AdminInput name="flete_usd" type="number" step="0.01" defaultValue="0" />
        </AdminField>
        <AdminField label="Fees adicionales USD">
          <AdminInput
            name="fees_adicionales_usd"
            type="number"
            step="0.01"
            defaultValue="0"
          />
        </AdminField>
        <AdminField label="Taller USA USD">
          <AdminInput
            name="gastos_taller_usa_usd"
            type="number"
            step="0.01"
            defaultValue="0"
          />
        </AdminField>
        <AdminField label="Impuestos DGA DOP">
          <AdminInput
            name="impuestos_dga_dop"
            type="number"
            step="0.01"
            defaultValue="0"
          />
        </AdminField>
        <AdminField label="Tasa USD/DOP">
          <AdminInput
            name="tasa_usd_dop"
            type="number"
            step="0.01"
            defaultValue={DEFAULT_TASA_USD_DOP}
          />
        </AdminField>
        <AdminField label="Precio de venta DOP">
          <AdminInput
            name="precio_venta_dop"
            type="number"
            step="0.01"
            placeholder="Opcional — se estima si se deja vacío"
          />
        </AdminField>
        <div className="sm:col-span-2">
          <AdminPrimaryButton type="submit" disabled={pending}>
            {pending ? "Registrando..." : "Registrar vehículo"}
          </AdminPrimaryButton>
        </div>
      </form>
    </AdminCard>
  );
}
