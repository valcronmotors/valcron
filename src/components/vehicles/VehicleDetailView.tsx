"use client";

import { useMemo, useState } from "react";
import { updateVehiclePhotos } from "@/app/actions/catalog";
import {
  PrimaryButtonLink,
  SecondaryButtonLink,
} from "@/components/app-shell";
import { VehicleFinancialSummary } from "@/components/vehicles/VehicleFinancialSummary";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleStatusBadge } from "@/components/status-badges";
import type { VehicleRow } from "@/lib/inventory";
import { formatDop, formatUsd } from "@/lib/money";
import {
  DEFAULT_TASA_USD_DOP,
  calculateVehicleCosts,
  parseAmount,
} from "@/lib/vehicle-costs";

export function VehicleDetailView({ vehicle }: { vehicle: VehicleRow }) {
  const [fotosUrls, setFotosUrls] = useState(vehicle.fotos_urls ?? []);
  const [tasaUsdDop, setTasaUsdDop] = useState(
    String(vehicle.tasa_usd_dop ?? DEFAULT_TASA_USD_DOP),
  );
  const [photoError, setPhotoError] = useState<string | null>(null);

  const costs = useMemo(
    () =>
      calculateVehicleCosts({
        costoSubastaUsd: Number(vehicle.costo_subasta_usd ?? 0),
        gastosTallerUsaUsd: Number(vehicle.gastos_taller_usa_usd ?? 0),
        gastosGruaUsd: Number(vehicle.gastos_grua_usd ?? 0),
        gastosTitulacionUsd: Number(vehicle.gastos_titulacion_usd ?? 0),
        feesAdicionalesUsd: Number(vehicle.fees_adicionales_usd ?? 0),
        fleteUsd: Number(vehicle.flete_usd ?? 0),
        tasaUsdDop: parseAmount(tasaUsdDop) || DEFAULT_TASA_USD_DOP,
        gastosTallerRdDop: Number(vehicle.costo_taller_dop ?? 0),
        impuestosDgaDop: Number(vehicle.impuestos_dga_dop ?? 0),
      }),
    [tasaUsdDop, vehicle],
  );

  async function handlePhotosChange(next: string[]) {
    setFotosUrls(next);
    setPhotoError(null);
    const result = await updateVehiclePhotos(vehicle.id, next);
    if (result.error) {
      setPhotoError(result.error);
    }
  }

  const tasa = parseAmount(tasaUsdDop) || DEFAULT_TASA_USD_DOP;

  return (
    <div className="grid gap-6">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">
              {vehicle.marca} {vehicle.modelo} {vehicle.trim ?? ""}
            </h2>
            <VehicleStatusBadge estado={vehicle.estado} />
          </div>
          <p className="mt-2 font-mono text-sm text-slate-400">{vehicle.vin}</p>
          <p className="mt-2 text-sm text-slate-400">
            {[vehicle.ano, vehicle.ubicacion_lote, vehicle.fuente_subasta, vehicle.lote_numero ? `Lote ${vehicle.lote_numero}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <SecondaryButtonLink href="/vehiculos">Volver al listado</SecondaryButtonLink>
          <PrimaryButtonLink href={`/vehiculos/${vehicle.id}/editar`}>
            Editar
          </PrimaryButtonLink>
        </div>
      </section>

      <VehicleGallery
        urls={fotosUrls}
        vehicleId={vehicle.id}
        onChange={(next) => void handlePhotosChange(next)}
      />
      {photoError ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {photoError}
        </p>
      ) : null}

      <VehicleFinancialSummary
        costs={costs}
        tasaUsdDop={tasa}
        onTasaChange={setTasaUsdDop}
        precioVentaDop={Number(vehicle.precio_venta_dop ?? 0)}
        showTasaInput
      />

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
        <DetailItem label="Subasta" value={formatUsd(Number(vehicle.costo_subasta_usd ?? 0))} />
        <DetailItem label="Taller USA" value={formatUsd(Number(vehicle.gastos_taller_usa_usd ?? 0))} />
        <DetailItem label="Grúa" value={formatUsd(Number(vehicle.gastos_grua_usd ?? 0))} />
        <DetailItem label="Titulación" value={formatUsd(Number(vehicle.gastos_titulacion_usd ?? 0))} />
        <DetailItem label="Fees" value={formatUsd(Number(vehicle.fees_adicionales_usd ?? 0))} />
        <DetailItem label="Flete" value={formatUsd(Number(vehicle.flete_usd ?? 0))} />
        <DetailItem label="Taller RD" value={formatDop(Number(vehicle.costo_taller_dop ?? 0))} />
        <DetailItem label="Impuestos DGA" value={formatDop(Number(vehicle.impuestos_dga_dop ?? 0))} />
        <DetailItem label="Precio de venta" value={formatDop(Number(vehicle.precio_venta_dop ?? 0))} />
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
