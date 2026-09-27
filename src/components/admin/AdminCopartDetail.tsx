import { AdminCopartAddButton } from "@/components/admin/AdminCopartAddButton";
import { AuctionBadge } from "@/components/admin/AdminBadges";
import { CopartGallery } from "@/components/admin/CopartGallery";
import { CopartPhoto } from "@/components/admin/CopartPhoto";
import { AdminCard, AdminNotice } from "@/components/admin/ui";
import { copartCardImageUrl, normalizeCopartFeedImages } from "@/lib/auction-providers/copart/images";
import type { AuctionSearchVehicle } from "@/lib/auction-providers/types";
import { formatMoneyPlain } from "@/lib/admin-metrics";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-[var(--admin-text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--admin-text)]">{value == null || value === "" ? "—" : value}</dd>
    </div>
  );
}

export function AdminCopartDetail({
  vehicle,
  gallery = [],
  freshness,
  error,
}: {
  vehicle: AuctionSearchVehicle;
  gallery?: string[];
  freshness: { label: string; value: string; stale: boolean; warning: string | null };
  error: string | null;
}) {
  const feedImages = normalizeCopartFeedImages({
    thumbnail: vehicle.thumbnailUrl,
    imageUrl: vehicle.imageReference,
    extraUrls: gallery,
  });
  const images = feedImages.imageUrls.length ? feedImages.imageUrls : gallery.filter(Boolean);
  const money = (value: number | null) =>
    value != null ? formatMoneyPlain(value, vehicle.currency === "DOP" ? "DOP" : "USD") : null;
  const alt = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div className="grid gap-6">
      <p className="text-sm text-[var(--admin-text-secondary)]">
        {freshness.label}: <span className="font-medium text-[var(--admin-text)]">{freshness.value}</span>
      </p>
      {freshness.warning ? <AdminNotice tone="warning">{freshness.warning}</AdminNotice> : null}
      {error ? <AdminNotice tone="warning">{error}</AdminNotice> : null}
      <AdminNotice>
        Esta ficha es inventario Copart de referencia. Valcron no es dueño del vehículo hasta que un administrador lo
        prepare y publique en el website.
      </AdminNotice>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--admin-text)]">
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim ? ` ${vehicle.trim}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[var(--admin-text-muted)]">Lote {vehicle.lotNumber}</p>
        </div>
        <AuctionBadge source="copart" />
      </div>

      {images.length > 1 ? (
        <CopartGallery images={images} alt={alt} />
      ) : (
        <CopartPhoto
          thumbnailUrl={feedImages.thumbnailUrl ?? copartCardImageUrl(vehicle.thumbnailUrl, vehicle.imageReference)}
          alt={alt}
          className="max-h-96 w-full rounded-xl object-cover"
        />
      )}

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Vehículo</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Año" value={vehicle.year} />
          <Field label="Marca" value={vehicle.make} />
          <Field label="Modelo" value={vehicle.model} />
          <Field label="Detalle" value={vehicle.modelDetail} />
          <Field label="Versión" value={vehicle.trim} />
          <Field label="VIN" value={vehicle.vin} />
          <Field label="Millas" value={vehicle.mileage} />
          <Field label="Carrocería" value={vehicle.bodyStyle} />
          <Field label="Color" value={vehicle.color} />
        </dl>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Condición</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Daño principal" value={vehicle.primaryDamage} />
          <Field label="Daño secundario" value={vehicle.secondaryDamage} />
          <Field label="Título" value={[vehicle.titleState, vehicle.titleType].filter(Boolean).join(" ")} />
          <Field label="Llaves" value={vehicle.hasKeys == null ? null : vehicle.hasKeys ? "Sí" : "No"} />
          <Field label="Condición de marcha" value={vehicle.runCondition} />
        </dl>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Mecánica</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Motor" value={vehicle.engine} />
          <Field label="Tracción" value={vehicle.drive} />
          <Field label="Transmisión" value={vehicle.transmission} />
          <Field label="Combustible" value={vehicle.fuel} />
          <Field label="Cilindros" value={vehicle.cylinders} />
        </dl>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Información de subasta</h2>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
          Referencia de Copart
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Lote" value={vehicle.lotNumber} />
          <Field label="Ubicación" value={vehicle.location} />
          <Field label="Fecha de subasta" value={vehicle.saleDate} />
          <Field label="Hora" value={vehicle.saleTime} />
          <Field label="Estado de venta" value={vehicle.saleStatus} />
          <Field label="Moneda" value={vehicle.currency} />
          {money(vehicle.buyItNowPrice) ? <Field label="Buy It Now (referencia de Copart)" value={money(vehicle.buyItNowPrice)} /> : null}
          {money(vehicle.estimatedRetailValue) ? (
            <Field label="Valor estimado de mercado (referencia de Copart)" value={money(vehicle.estimatedRetailValue)} />
          ) : null}
          {money(vehicle.repairCost) ? (
            <Field label="Estimado de reparación (referencia de Copart)" value={money(vehicle.repairCost)} />
          ) : null}
        </dl>
        <p className="mt-4 text-sm text-[var(--admin-text-secondary)]">
          Estos valores provienen de la subasta y no representan el precio final ofrecido por Valcron Motors.
        </p>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Imágenes</h2>
        <p className="mt-2 text-sm text-[var(--admin-text-secondary)]">
          Solo referencias oficiales del feed. Valcron no copia estas fotos a Storage automáticamente.
        </p>
        {images.length > 1 ? (
          <p className="mt-2 text-xs text-[var(--admin-text-muted)]">{images.length} fotos oficiales del manifiesto Copart.</p>
        ) : null}
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">Origen</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {vehicle.sourceUrl ? (
            <a
              href={vehicle.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-lg border border-[var(--admin-border)] px-4 text-sm"
            >
              Abrir lote en Copart
            </a>
          ) : (
            <p className="text-sm text-[var(--admin-text-muted)]">No hay un enlace Copart validado para este lote.</p>
          )}
          <AdminCopartAddButton lotNumber={vehicle.lotNumber} />
        </div>
      </AdminCard>
    </div>
  );
}
