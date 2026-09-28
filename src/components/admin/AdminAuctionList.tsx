"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gavel } from "lucide-react";
import { AdminActionMenu } from "@/components/admin/AdminActionMenu";
import { AuctionBadge } from "@/components/admin/AdminBadges";
import { CopartPhoto } from "@/components/admin/CopartPhoto";
import { AdminConfirmDialog } from "@/components/admin/AdminModal";
import {
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  adminFieldClass,
} from "@/components/admin/ui";
import { AUCTION_STATUS_LABEL } from "@/lib/admin-copy";
import { prepareAuctionForWebsite, setAuctionOpportunityStatus } from "@/app/actions/auctions";
import {
  ACTIVE_PROVIDER_FILTERS,
  OPPORTUNITY_STATUS_FILTERS,
  OPPORTUNITY_WEBSITE_STATE_LABEL,
  filterOpportunities,
  opportunityCountLabel,
  opportunityOverflowActions,
  opportunityThumbnailUrl,
  opportunityVehicleTitle,
  opportunityVehicleTrim,
  opportunityWebsiteState,
  type ActiveAuctionProvider,
  type LinkedVehicleSummary,
  type OpportunityWebsiteState,
} from "@/lib/auctions/opportunity-admin";
import type { AuctionOpportunityRow, AuctionOpportunityStatus, AuctionProvider } from "@/lib/website-schema";

function formatDamage(value: string | null | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return "—";
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function websiteBadgeClass(state: OpportunityWebsiteState) {
  if (state === "published") {
    return "border-transparent bg-[var(--admin-success-bg)] text-[var(--admin-success)]";
  }
  if (state === "ready") {
    return "border-transparent bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]";
  }
  return "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]";
}

function statusBadgeClass(status: AuctionOpportunityStatus) {
  if (status === "archived") {
    return "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]";
  }
  if (status === "published") {
    return "border-transparent bg-[var(--admin-success-bg)] text-[var(--admin-success)]";
  }
  if (status === "review") {
    return "border-transparent bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]";
  }
  return "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]";
}

export function AdminAuctionList({
  opportunities,
  error,
  provider = "all",
}: {
  opportunities: Array<AuctionOpportunityRow & { linked_vehicle?: LinkedVehicleSummary | null }>;
  error: string | null;
  provider?: "all" | ActiveAuctionProvider;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<"all" | ActiveAuctionProvider>(provider);
  const [statusFilter, setStatusFilter] = useState<"all" | AuctionOpportunityStatus>("all");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      filterOpportunities(opportunities, {
        provider: providerFilter,
        status: statusFilter,
        query,
      }),
    [opportunities, providerFilter, statusFilter, query],
  );
  const filtersActive = Boolean(query.trim()) || providerFilter !== "all" || statusFilter !== "all";

  function clearFilters() {
    setQuery("");
    setProviderFilter("all");
    setStatusFilter("all");
  }

  function archive() {
    if (!archiveId) return;
    startTransition(() => {
      void setAuctionOpportunityStatus(archiveId, "archived").then((result) => {
        if (result.error) {
          setActionError(result.error);
          return;
        }
        setArchiveId(null);
        router.refresh();
      });
    });
  }

  function prepare(id: string) {
    startTransition(() => {
      void prepareAuctionForWebsite(id).then((result) => {
        if (result.error) {
          setActionError(result.error);
          return;
        }
        if (result.id) {
          router.push(`/admin/inventario/${result.id}`);
          return;
        }
        router.refresh();
      });
    });
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Oportunidades de subasta"
        subtitle="Busca, revisa y prepara vehículos de subasta para publicarlos en Valcron Motors."
        count={opportunityCountLabel(filtered.length)}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/subastas/copart">
              <AdminSecondaryButton>Buscar en Copart</AdminSecondaryButton>
            </Link>
            <Link href="/admin/subastas/nuevo">
              <AdminPrimaryButton>+ Agregar oportunidad</AdminPrimaryButton>
            </Link>
          </div>
        }
      />

      <label className="block">
        <span className="sr-only">Buscar vehículo, VIN o lote</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar vehículo, VIN o lote"
          className={`${adminFieldClass} mt-0`}
        />
      </label>

      <div className="grid gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Proveedor
          </p>
          <div className="flex flex-wrap gap-2">
            {ACTIVE_PROVIDER_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.id === "iaa" ? "Ingreso manual" : undefined}
                onClick={() => setProviderFilter(item.id)}
                className={`min-h-10 rounded-lg px-3 text-sm font-medium transition duration-200 ${
                  providerFilter === item.id
                    ? "bg-[var(--admin-text)] text-white"
                    : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <label className="max-w-xs">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Estado
          </span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className={`${adminFieldClass} mt-0`}
            aria-label="Todos los estados"
          >
            {OPPORTUNITY_STATUS_FILTERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <AdminNotice tone="warning">No pudimos cargar las oportunidades.</AdminNotice> : null}
      {actionError ? <AdminNotice tone="warning">{actionError}</AdminNotice> : null}

      {filtered.length === 0 ? (
        opportunities.length === 0 ? (
          <AdminEmptyState
            icon={Gavel}
            title="No hay oportunidades de subasta."
            copy="Busca en Copart o agrega una oportunidad."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/admin/subastas/copart">
                  <AdminPrimaryButton>Buscar en Copart</AdminPrimaryButton>
                </Link>
                <Link href="/admin/subastas/nuevo">
                  <AdminSecondaryButton>Agregar manualmente</AdminSecondaryButton>
                </Link>
              </div>
            }
          />
        ) : (
          <AdminEmptyState
            icon={Gavel}
            title="No encontramos oportunidades con estos filtros."
            copy={filtersActive ? "Prueba otro proveedor, estado o término de búsqueda." : "Cambia la vista para ver otras oportunidades."}
            action={
              <AdminSecondaryButton type="button" onClick={clearFilters}>
                Limpiar filtros
              </AdminSecondaryButton>
            }
          />
        )
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)] lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--admin-surface-muted)] text-[11px] uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Proveedor</th>
                  <th className="px-4 py-3 font-medium">Lote</th>
                  <th className="px-4 py-3 font-medium">Kilometraje</th>
                  <th className="px-4 py-3 font-medium">Daño</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Website</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {filtered.map((row) => {
                  const title = opportunityVehicleTitle(row);
                  const trim = opportunityVehicleTrim(row);
                  const website = opportunityWebsiteState(row, row.linked_vehicle);
                  const thumb = opportunityThumbnailUrl(row);
                  return (
                    <tr key={row.id} className="align-middle">
                      <td className="px-4 py-3">
                        <Link href={`/admin/subastas/${row.id}`} className="flex min-w-0 items-center gap-3">
                          <CopartPhoto
                            src={thumb}
                            alt=""
                            placeholder="quiet"
                            className="h-14 w-20 shrink-0 rounded-md object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block font-medium text-[var(--admin-text)]">{title}</span>
                            {trim ? <span className="block text-xs text-[var(--admin-text-muted)]">{trim}</span> : null}
                            {row.vin ? (
                              <span className="mt-0.5 block font-mono text-[11px] text-[var(--admin-text-muted)]">
                                {row.vin}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <AuctionBadge source={row.provider as AuctionProvider} />
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums text-[var(--admin-text-secondary)]">
                        {row.provider_lot_id || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums text-[var(--admin-text-secondary)]">
                        {row.mileage != null ? `${row.mileage.toLocaleString("en-US")} mi` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--admin-text-secondary)]">
                        {formatDamage(row.primary_damage)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(row.status)}`}
                        >
                          {AUCTION_STATUS_LABEL[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${websiteBadgeClass(website)}`}
                        >
                          {OPPORTUNITY_WEBSITE_STATE_LABEL[website]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/subastas/${row.id}`}
                            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm font-medium text-[var(--admin-text)] hover:bg-[var(--admin-surface-muted)]"
                          >
                            Revisar
                          </Link>
                          <AdminActionMenu
                            label={`Más acciones para ${title}`}
                            open={menuId === row.id}
                            onOpenChange={(open) => setMenuId(open ? row.id : null)}
                            disabled={pending}
                            items={opportunityOverflowActions(row).map((item) => ({
                              id: item.id,
                              label: item.label,
                              href: item.href,
                              target: item.target,
                              danger: item.danger,
                              onSelect:
                                item.id === "archive"
                                  ? () => setArchiveId(row.id)
                                  : item.id === "prepare"
                                    ? () => prepare(row.id)
                                    : undefined,
                            }))}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="grid gap-3 lg:hidden">
            {filtered.map((row) => {
              const title = opportunityVehicleTitle(row);
              const trim = opportunityVehicleTrim(row);
              const website = opportunityWebsiteState(row, row.linked_vehicle);
              const thumb = opportunityThumbnailUrl(row);
              return (
                <article
                  key={row.id}
                  className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]"
                >
                  <Link href={`/admin/subastas/${row.id}`} className="block">
                    <CopartPhoto
                      src={thumb}
                      alt=""
                      placeholder="quiet"
                      className="h-40 w-full object-cover"
                    />
                  </Link>
                  <div className="grid gap-3 p-4">
                    <div>
                      <Link href={`/admin/subastas/${row.id}`} className="font-medium text-[var(--admin-text)]">
                        {title}
                        {trim ? ` ${trim}` : ""}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                        <AuctionBadge source={row.provider as AuctionProvider} />
                        <span className="ml-2">
                          {row.provider_lot_id ? `Lote ${row.provider_lot_id}` : "Sin lote"}
                        </span>
                      </p>
                    </div>
                    <p className="text-sm text-[var(--admin-text-secondary)]">
                      {row.mileage != null ? `${row.mileage.toLocaleString("en-US")} mi` : "Kilometraje no indicado"}
                      {row.primary_damage ? ` · Daño: ${formatDamage(row.primary_damage)}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {AUCTION_STATUS_LABEL[row.status]}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${websiteBadgeClass(website)}`}
                      >
                        {OPPORTUNITY_WEBSITE_STATE_LABEL[website]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/subastas/${row.id}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[var(--admin-text)] px-4 text-sm font-medium text-white"
                      >
                        Revisar
                      </Link>
                      <AdminActionMenu
                        label={`Más acciones para ${title}`}
                        open={menuId === row.id}
                        onOpenChange={(open) => setMenuId(open ? row.id : null)}
                        disabled={pending}
                        items={opportunityOverflowActions(row).map((item) => ({
                          id: item.id,
                          label: item.label,
                          href: item.href,
                          target: item.target,
                          danger: item.danger,
                          onSelect:
                            item.id === "archive"
                              ? () => setArchiveId(row.id)
                              : item.id === "prepare"
                                ? () => prepare(row.id)
                                : undefined,
                        }))}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(archiveId)}
        title="Archivar oportunidad"
        description="La oportunidad dejará de aparecer en el trabajo activo. No se publica ni se elimina el vehículo vinculado."
        confirmLabel="Archivar"
        pending={pending}
        danger
        onConfirm={archive}
        onClose={() => setArchiveId(null)}
      />
    </div>
  );
}
