import {
  ADMIN_PUBLISH_BADGE,
  AUCTION_BRAND,
  adminStatusBadgeClass,
  type AuctionBrand,
} from "@/lib/admin-theme";
import { vehicleStatusLabel } from "@/lib/vehicles/vehicle-status";
import type { VehicleStatus } from "@/lib/website-schema";

const BADGE_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide";

export function AdminStatusBadge({
  estado,
  label,
}: {
  estado: string | null | undefined;
  label?: string;
}) {
  const text =
    label ??
    (estado && ["draft", "available", "reserved", "sold", "hidden"].includes(estado)
      ? vehicleStatusLabel(estado as VehicleStatus)
      : estado) ??
    "—";
  return (
    <span className={`${BADGE_BASE} ${adminStatusBadgeClass(estado)}`}>
      {text}
    </span>
  );
}

export function AdminPublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`${BADGE_BASE} ${
        published ? ADMIN_PUBLISH_BADGE.published : ADMIN_PUBLISH_BADGE.unpublished
      }`}
    >
      {published ? "Publicado" : "No publicado"}
    </span>
  );
}

export function AuctionBadge({
  source,
  count,
}: {
  source: string | null | undefined;
  count?: number;
}) {
  const key = (source ?? "").toLowerCase();
  if (!key || !(key in AUCTION_BRAND)) {
    return source ? (
      <span
        className={`${BADGE_BASE} border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]`}
      >
        {source}
      </span>
    ) : (
      <span className="text-[var(--admin-text-muted)]">—</span>
    );
  }

  const brand = AUCTION_BRAND[key as AuctionBrand];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${brand.className}`}
      title={source ?? brand.label}
    >
      {brand.label}
      {typeof count === "number" ? (
        <span className="font-medium text-[var(--admin-text-muted)]">{count}</span>
      ) : null}
    </span>
  );
}

export function AuctionBadgeRow({
  counts,
}: {
  counts: Partial<Record<AuctionBrand, number>>;
}) {
  return (
    <span className="mt-2 flex flex-wrap items-center gap-1.5">
      {(Object.keys(AUCTION_BRAND) as AuctionBrand[])
        .filter((source) => source !== "manheim" || (counts[source] ?? 0) > 0)
        .map((source) => (
        <AuctionBadge key={source} source={source} count={counts[source] ?? 0} />
      ))}
    </span>
  );
}
