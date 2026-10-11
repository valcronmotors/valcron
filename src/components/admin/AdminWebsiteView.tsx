import Link from "next/link";
import { Globe, Star } from "lucide-react";
import { AdminCard, AdminEmptyState, AdminError, AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton } from "@/components/admin/ui";
import { formatAdminDate } from "@/lib/admin-copy";
import { vehicleLabel } from "@/lib/admin-metrics";
import { SITE } from "@/lib/site";
import { canPublishVehicleListing, vehiclePublicationChecks } from "@/lib/publication-readiness";
import { opportunityWebsiteState, type LinkedVehicleSummary } from "@/lib/auctions/opportunity-admin";
import type { AuctionOpportunityRow, InquiryRow, VehicleRow } from "@/lib/website-schema";
import { listingQualitySuggestions } from "@/lib/listing-quality";
import { opportunityVehicleTitle } from "@/lib/auctions/opportunity-admin";

export function AdminWebsiteView({
  vehicles,
  auctionOpportunities = [],
  error,
  inquiries,
}: {
  vehicles: VehicleRow[];
  auctionOpportunities?: Array<AuctionOpportunityRow & { linked_vehicle?: LinkedVehicleSummary | null }>;
  error?: string | null;
  inquiries: Array<Pick<InquiryRow, "id" | "name" | "created_at" | "status">>;
}) {
  const published = vehicles.filter((row) => row.published);
  const featured = vehicles.filter((row) => row.featured && row.published);
  const ready = vehicles.filter((row) =>
    canPublishVehicleListing(
      vehiclePublicationChecks({
        year: row.year,
        make: row.make,
        model: row.model,
        description: row.description,
        price: row.price,
        source_type: row.source_type,
        public_price_mode: row.public_price_mode,
        status: row.status,
        photos: row.vehicle_photos,
      }),
    ),
  );
  const unpublishedReady = ready.filter((row) => !row.published);
  const publishedAuctions = auctionOpportunities.filter((row) => row.linked_vehicle?.published);
  const readyAuctions = auctionOpportunities.filter(
    (row) => row.status !== "archived" && opportunityWebsiteState(row, row.linked_vehicle) === "ready",
  );
  const contentSuggestions = [
    ...published.map((row) => ({ id: row.id, title: vehicleLabel(row), href: `/admin/inventario/${row.id}`, suggestions: listingQualitySuggestions(row) })),
    ...publishedAuctions.map((row) => ({ id: row.id, title: opportunityVehicleTitle(row), href: `/admin/subastas/${row.id}`, suggestions: listingQualitySuggestions(row.linked_vehicle ?? {}) })),
  ].filter((row) => row.suggestions.length > 0);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Website"
        subtitle="Control de publicación de Inventario Valcron y Oportunidades de Subasta."
        actions={
          <>
            <Link href="/" target="_blank">
              <AdminPrimaryButton>Ver Home</AdminPrimaryButton>
            </Link>
            <Link href="/inventario" target="_blank">
              <AdminSecondaryButton>Ver Inventario</AdminSecondaryButton>
            </Link>
            <Link href="/subastas" target="_blank">
              <AdminSecondaryButton>Ver Subastas</AdminSecondaryButton>
            </Link>
          </>
        }
      />

      {error ? <AdminError message={error} /> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Inventario Valcron
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-[var(--admin-text-muted)]">Publicados</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{published.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--admin-text-muted)]">Destacados</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{featured.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--admin-text-muted)]">Listos</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{unpublishedReady.length}</dd>
            </div>
          </dl>
        </AdminCard>
        <AdminCard>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Oportunidades de subasta
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--admin-text-muted)]">Publicadas</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{publishedAuctions.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--admin-text-muted)]">Listas</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {readyAuctions.length}
              </dd>
            </div>
   …2482 tokens truncated…m,env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-3 lg:bottom-6 lg:right-5 xl:bottom-8 xl:right-7"
      aria-label="WhatsApp de Valcron Motors"
    >
      <span className="hidden max-w-[12rem] rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-3 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md 2xl:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          WhatsApp
        </span>
        <span className="mt-0.5 block text-xs text-[#d4d4d4]">{SITE.whatsappDisplay}</span>
      </span>
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition duration-200 group-hover:scale-[1.03] group-hover:bg-[#1ebe5d] motion-reduce:transform-none sm:h-14 sm:w-14">
        <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
    </a>
  );
}
