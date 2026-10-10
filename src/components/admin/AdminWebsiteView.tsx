import Link from "next/link";
import { Globe, Star } from "lucide-react";
import { AdminCard, AdminEmptyState, AdminError, AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton } from "@/components/admin/ui";
import { formatAdminDate } from "@/lib/admin-copy";
import { vehicleLabel } from "@/lib/admin-metrics";
import { SITE } from "@/lib/site";
import { canPublishVehicleListing, vehiclePublicationChecks } from "@/lib/publication-readiness";
import { opportunityWebsiteState, type LinkedVehicleSummary } from "@/lib/auctions/opportunity-admin";
import type { AuctionOpportunityRow, InquiryRow, VehicleRow } from "@/lib/website-schema";

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
          </dl>
        </AdminCard>
      </section>

      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Enlaces públicos</h2>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
              <Globe className="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <Link href="/inventario" className="inline-flex items-center gap-2 text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
              <Globe className="h-4 w-4" /> Inventario Valcron
            </Link>
          </li>
          <li>
            <Link href="/subastas" className="inline-flex items-center gap-2 text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
              <Globe className="h-4 w-4" /> Oportunidades de subasta
            </Link>
          </li>
          <li>
            <Link href="/contacto" className="inline-flex items-center gap-2 text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
              <Globe className="h-4 w-4" /> Contacto
            </Link>
          </li>
        </ul>
        <p className="mt-6 text-xs text-[var(--admin-text-muted)]">
          {SITE.url} · Última solicitud:{" "}
          {inquiries[0] ? `${inquiries[0].name} · ${formatAdminDate(inquiries[0].created_at)}` : "todavía no hay mensajes"}
        </p>
      </AdminCard>

      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">
              Destacados · Inventario Valcron
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
              Aparecen primero en el carrusel local de la Home.
            </p>
          </div>
          <Link href="/admin/inventario">
            <AdminSecondaryButton>Administrar destacados</AdminSecondaryButton>
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="mt-6">
            <AdminEmptyState
              icon={Star}
              title="No hay destacados"
              copy="Marca una unidad como destacada desde su ficha, después de publicarla."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--admin-border)]">
            {featured.map((vehicle) => (
              <li key={vehicle.id} className="flex items-center justify-between py-3">
                <Link href={`/admin/inventario/${vehicle.id}`} className="font-medium text-[var(--admin-text)]">
                  {vehicleLabel(vehicle)}
                </Link>
                <span className="text-xs text-[var(--admin-text-muted)]">{formatAdminDate(vehicle.updated_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Publicados</h2>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            Unidades visibles en el website ahora mismo.
          </p>
          {published.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Todavía no hay unidades publicadas.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--admin-border)]">
              {published.slice(0, 12).map((vehicle) => (
                <li key={vehicle.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/inventario/${vehicle.id}`} className="font-medium text-[var(--admin-text)]">
                    {vehicleLabel(vehicle)}
                  </Link>
                  <Link
                    href={`/inventario/${vehicle.id}`}
                    target="_blank"
                    className="text-xs text-[var(--admin-text-muted)] underline-offset-2 hover:underline"
                  >
                    Ver ficha
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Listos sin publicar</h2>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            Cumplen lo obligatorio y aún no están en el website.
          </p>
          {unpublishedReady.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-text-muted)]">No hay borradores listos para publicar.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--admin-border)]">
              {unpublishedReady.map((vehicle) => (
                <li key={vehicle.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/inventario/${vehicle.id}`} className="font-medium text-[var(--admin-text)]">
                    {vehicleLabel(vehicle)}
                  </Link>
                  <span className="text-xs text-[var(--admin-text-muted)]">Listo</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </section>
    </div>
  );
}
