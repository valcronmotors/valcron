import {
  AUCTION_BRAND,
  adminStatusBadgeClass,
  type AuctionBrand,
} from "@/lib/admin-theme";

const BADGE_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide";

export function AdminStatusBadge({
  estado,
}: {
  estado: string | null | undefined;
}) {
  return (
    <span className={`${BADGE_BASE} ${adminStatusBadgeClass(estado)}`}>
      {estado || "—"}
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
  if (!source || !(source in AUCTION_BRAND)) {
    return source ? (
      <span className={`${BADGE_BASE} border-gray-200 bg-gray-50 text-gray-600`}>
        {source}
      </span>
    ) : (
      <span className="text-gray-400">—</span>
    );
  }

  const brand = AUCTION_BRAND[source as AuctionBrand];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-[0.08em] shadow-sm ${brand.className}`}
      title={source}
    >
      {brand.label}
      {typeof count === "number" ? (
        <span className="rounded-sm bg-white/20 px-1 font-semibold">{count}</span>
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
      {(Object.keys(AUCTION_BRAND) as AuctionBrand[]).map((source) => (
        <AuctionBadge key={source} source={source} count={counts[source] ?? 0} />
      ))}
    </span>
  );
}
