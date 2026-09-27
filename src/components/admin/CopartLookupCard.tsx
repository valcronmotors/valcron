import { AuctionBadge } from "@/components/admin/AdminBadges";
import { CopartPhoto } from "@/components/admin/CopartPhoto";
import { COPART_LOOKUP_LOADED_COPY, copartLookupSummary } from "@/lib/auction-providers/copart/lookup";
import type { AuctionSearchVehicle } from "@/lib/auction-providers/types";
import { formatMoneyPlain } from "@/lib/admin-metrics";

function formatMileage(value: number | null | undefined) {
  if (value == null) return null;
  return `${value.toLocaleString("en-US")} mi`;
}

function formatSale(date: string | null, time: string | null) {
  return [date, time].filter(Boolean).join(" ") || null;
}

function formatFeedUpdated(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("es-DO", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

function Ref({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-sm text-[var(--admin-text)]">{value}</dd>
    </div>
  );
}

export function CopartLookupCard({
  vehicle,
  gallery,
  lastUpdated,
  duplicateId,
}: {
  vehicle: AuctionSearchVehicle;
  gallery: string[];
  lastUpdated?: string | null;
  duplicateId?: string | null;
}) {
  const summary = copartLookupSummary(vehicle, { imageUrls: gallery, lastUpdated });
  const currency = summary.currency === "DOP" ? "DOP" : "USD";
  const money = (value: number | null) => (value != null ? formatMoneyPlain(value, currency) : null);
  const updated = formatFeedUpdated(summary.lastUpdated);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="grid gap-4 p-4 sm:grid-cols-[12rem_1fr]">
        <div className="grid gap-2">
          <CopartPhoto
            src={summary.thumbnailUrl}
            alt={summary.title}
            placeholder="quiet"
            className="h-40 w-full rounded-lg object-cover sm:h-44"
          />
          {summary.gallery.length > 1 ? (
            <div className="grid grid-cols-4 gap-1">
              {summary.gallery.slice(0, 8).map((url) => (
                <CopartPhoto
                  key={url}
                  src={url}
                  alt=""
                  placeholder="quiet"
                  className="h-12 w-full rounded-md object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="grid gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-[var(--admin-text)]">{summary.title}</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--admin-text-muted)]">
              <AuctionBadge source="copart" />
              <span>Lote {summary.lot}</span>
            </p>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Ref label="VIN" value={summary.vin} />
            <Ref label="Kilometraje" value={formatMileage(summary.mileage)} />
            <Ref label="Condición" value={summary.runCondition} />
            <Ref label="Daño" value={summary.damage} />
            <Ref label="Ubicación de subasta" value={summary.location} />
            <Ref label="Fecha de subasta" value={formatSale(summary.saleDate, summary.saleTime)} />
          </dl>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
              Referencia de Copart
            </p>
            <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
              Datos de Copart. No son el precio público de Valcron.
            </p>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
              <Ref label="Buy It Now" value={money(summary.buyItNowPrice)} />
              <Ref label="Estimated Retail" value={money(summary.estimatedRetailValue)} />
              <Ref label="Repair Cost" value={money(summary.repairCost)} />
            </dl>
          </div>
          <p className="text-sm text-[var(--admin-success)]">{COPART_LOOKUP_LOADED_COPY}</p>
          {updated ? (
            <p className="text-xs text-[var(--admin-text-muted)]">Última actualización: {updated}</p>
          ) : null}
          {duplicateId ? (
            <p className="text-sm text-[var(--admin-text-secondary)]">
              Este lote ya está en tus oportunidades.{" "}
              <a
                href={`/admin/subastas/${duplicateId}`}
                className="font-medium text-[var(--admin-text)] underline-offset-2 hover:underline"
              >
                Ver oportunidad
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
