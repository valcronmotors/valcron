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
import {
  publishAuctionOpportunity,
  setAuctionOpportunityStatus,
  unpublishAuctionOpportunity,
} from "@/app/actions/auctions";
import {
  ACTIVE_PROVIDER_FILTERS,
  OPPORTUNITY_STATUS_FILTERS,
  OPPORTUNITY_WEBSITE_STATE_LABEL,
  filterOpportunities,
  opportunityCountLabel,
  opportunityOverflowActions,
  opportunityPublicationMetrics,
  opportunityThumbnailUrl,
  opportunityVehicleTitle,
  opportunityVehicleTrim,
  opportunityWebsiteState,
  type ActiveAuctionProvider,
  type LinkedVehicleSummary,
  type OpportunityWebsiteState,
} from "@/lib/auctions/opportunity-admin";
import {
  AUCTION_PRICE_MODES,
  AUCTION_SALE_STATUS_OPTIONS,
  readAuctionMetadata,
} from "@/lib/auction-admin-fields";
import { auditPublishedAuctionOpportunities } from "@/lib/auctions/eligibility-audit";
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

type Row = AuctionOpportunityRow & { linked_vehicle?: LinkedVehicleSummary | null };

export function AdminAuctionList({
  opportunities,
  error,
  provider = "all",
}: {
  opportunities: Row[];
  error: string | null;
  provider?: "all" | ActiveAuctionProvider;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<"all" | ActiveAuctionProvider>(provider);
  const [statusFilter, setStatusFilter] = useState<"all" | AuctionOpportunityStatus>("all");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priceModeFilter, setPriceModeFilter] = useState<"all" | "contact" | "buy_now">("all");
  const [auctionStatusFilter, setAuctionStatusFilter] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const metrics = useMemo(() => opportunityPublicationMetrics(opportunities), [opportunities]);
  const eligibilityAudit = useMemo(
    () => auditPublishedAuctionOpportunities(opportunities),
    [opportunities],
  );

  const filtered = useMemo(
    () =>
      filterOpportunities(opportunities, {
        provider: providerFilter,
        status: statusFilter,
        query,
        make: makeFilter,
        model: modelFilter,
        year: yearFilter,
        priceMode: priceModeFilter,
        auctionStatus: auctionStatusFilter,
      }),
    [
      opportunities,
      providerFilter,
      statusFilter,
      query,
      makeFilter,
      modelFilter,
      yearFilter,
      priceModeFilter,
      auctionStatusFilter,
    ],
  );

  const filtersActive =
    Boolean(query.trim()) ||
    providerFilter !== "all" ||
    statusFilter !== "all" ||
    Boolean(makeFilter.trim()) ||
    Boolean(modelFilter.trim()) ||
    Boolean(yearFilter.trim()) ||
    priceModeFilter !== "all" ||
    Boolean(auctionStatusFilter);

  function clearFilters() {
    setQuery("");
    setProviderFilter("all");
    setStatusFilter("all");
    setMakeFilter("");
    setModelFilter("");
    setYearFilter("");
    setPriceModeFilter("all");
    setAuctionStatusFilter("");
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
        setActionSuccess("Oportunidad archivada.");
        router.refresh();
      });
    });
  }

  function publish(id: string) {
    startTransition(() => {
      void publishAuctionOpportunity(id).then((result) => {
        if (result.error) {
          setActionError(result.error);
          return;
        }
        setActionSuccess(result.success ?? "Publicado.");
        setMenuId(null);
        router.refresh();
      });
    });
  }

  function unpublish(id: string) {
    startTransition(() => {
      void unpublishAuctionOpportunity(id).then((result) => {
        if (result.error) {
          setActionError(result.error);
          return;
        }
        setActionSuccess(result.success ?? "Despublicado.");
        setMenuId(null);
        router.refresh();
      });
    });
  }

  function menuItems(row: Row) {
    return opportunityOverflowActions(row, row.linked_vehicle).map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      target: item.target,
      danger: item.danger,
      onSelect:
        item.id === "archive"
          ? () => setArchiveId(row.id)
          : item.id === "publish"
            ? () => publish(row.id)
            : item.id === "unpublish"
              ? () => unpublish(row.id)
              : undefined,
    }));
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Oportunidades de Subasta"
        subtitle="Ingreso manual Copart, IAA y Manheim. Publicación solo en el inventario de subastas."
        count={opportunityCountLabel(filtered.length)}
        actions={
          <Link href="/admin/subastas/nuevo">
            <AdminPrimaryButton>Agregar vehículo de subasta</AdminPrimaryButton>
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Publicados", value: metrics.publicados },
          { label: "Borradores", value: metrics.borradores },
          { label: "En revisión", value: metrics.enRevision },
          { label: "Archivados", value: metrics.archivados },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-[var(--admin-shadow)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-[var(--admin-text)]">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {eligibilityAudit.failingPublic.length > 0 ? (
        <div className="rounded-xl border border-[var(--admin-warning)]/25 bg-[var(--admin-warning-bg)] px-4 py-3 text-sm text-[var(--admin-warning)]">
          <p className="font-medium">
            Auditoría Verificación Valcron: {eligibilityAudit.failingPublic.length} oportunidad
            {eligibilityAudit.failingPublic.length === 1 ? "" : "es"} publicada no cumple la política.
          </p>
          <ul className="mt-2 grid gap-1 text-xs leading-5">
            {eligibilityAudit.failingPublic.slice(0, 6).map((row) => (
              <li key={row.opportunityId}>
                <Link href={`/admin/subastas/${row.opportunityId}`} className="underline underline-offset-2">
                  {row.title}
                </Link>
                {" — "}
                {row.overallLabel}
                {row.reasons[0] ? `: ${row.reasons[0]}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs opacity-90">
            No se eliminaron registros. Abre cada oportunidad, corrige o despublica de forma controlada.
          </p>
        </div>
      ) : null}

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
            Casa de subasta
          </p>
          <div className="flex flex-wrap gap-2">
            {ACTIVE_PROVIDER_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Marca
            </span>
            <input
              value={makeFilter}
              onChange={(event) => setMakeFilter(event.target.value)}
              className={`${adminFieldClass} mt-0`}
              placeholder="Marca"
            />
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Modelo
            </span>
            <input
              value={modelFilter}
              onChange={(event) => setModelFilter(event.target.value)}
              className={`${adminFieldClass} mt-0`}
              placeholder="Modelo"
            />
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Año
            </span>
            <input
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className={`${adminFieldClass} mt-0`}
              placeholder="Año"
              inputMode="numeric"
            />
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Publicación
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className={`${adminFieldClass} mt-0`}
            >
              {OPPORTUNITY_STATUS_FILTERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Estado de subasta
            </span>
            <select
              value={auctionStatusFilter}
              onChange={(event) => setAuctionStatusFilter(event.target.value)}
              className={`${adminFieldClass} mt-0`}
            >
              <option value="">Todos</option>
              {AUCTION_SALE_STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Modo de precio
            </span>
            <select
              value={priceModeFilter}
              onChange={(event) => setPriceModeFilter(event.target.value as typeof priceModeFilter)}
              className={`${adminFieldClass} mt-0`}
            >
              <option value="all">Todos</option>
              {AUCTION_PRICE_MODES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <AdminNotice tone="warning">No pudimos cargar las oportunidades.</AdminNotice> : null}
      {actionError ? <AdminNotice tone="warning">{actionError}</AdminNotice> : null}
      {actionSuccess ? <AdminNotice tone="neutral">{actionSuccess}</AdminNotice> : null}

      {filtered.length === 0 ? (
        opportunities.length === 0 ? (
          <AdminEmptyState
            icon={Gavel}
            title="No hay oportunidades de subasta."
            copy="Agrega un vehículo Copart, IAA o Manheim de forma manual."
            action={
              <Link href="/admin/subastas/nuevo">
                <AdminPrimaryButton>Agregar vehículo de subasta</AdminPrimaryButton>
              </Link>
            }
          />
        ) : (
          <AdminEmptyState
            icon={Gavel}
            title="No encontramos oportunidades con estos filtros."
            copy={filtersActive ? "Prueba otros filtros o limpia la búsqueda." : "Cambia la vista para ver otras oportunidades."}
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
                  <th className="px-4 py-3 font-medium">Casa</th>
                  <th className="px-4 py-3 font-medium">Lote</th>
                  <th className="px-4 py-3 font-medium">Daño</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Publicación</th>
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
                  const meta = readAuctionMetadata(row.auction_metadata);
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
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <AuctionBadge source={row.provider as AuctionProvider} />
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums text-[var(--admin-text-secondary)]">
                        {row.provider_lot_id || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--admin-text-secondary)]">
                        {formatDamage(row.primary_damage)}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--admin-text-secondary)]">
                        {meta.price_mode === "buy_now" && meta.buy_now_usd
                          ? `Buy Now US$ ${meta.buy_now_usd.toLocaleString("en-US")}`
                          : "A consultar"}
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
                            className="inline-flex min-h-11 items-center rounded-lg bg-[var(--admin-text)] px-3 text-sm font-semibold text-white hover:opacity-90"
                          >
                            Editar
                          </Link>
                          <AdminActionMenu
                            label={`Más acciones para ${title}`}
                            open={menuId === row.id}
                            onOpenChange={(open) => setMenuId(open ? row.id : null)}
                            disabled={pending}
                            items={menuItems(row)}
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
              const meta = readAuctionMetadata(row.auction_metadata);
              return (
                <article
                  key={row.id}
                  className="relative overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]"
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
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
                      <AdminActionMenu
                        label={`Más acciones para ${title}`}
                        open={menuId === row.id}
                        onOpenChange={(open) => setMenuId(open ? row.id : null)}
                        disabled={pending}
                        items={menuItems(row)}
                      />
                    </div>
                    <p className="text-sm text-[var(--admin-text-secondary)]">
                      {row.primary_damage ? `Daño: ${formatDamage(row.primary_damage)}` : "Sin daño indicado"}
                      {" · "}
                      {meta.price_mode === "buy_now" && meta.buy_now_usd
                        ? `Buy Now US$ ${meta.buy_now_usd.toLocaleString("en-US")}`
                        : "Precio a consultar"}
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
                    <Link
                      href={`/admin/subastas/${row.id}`}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--admin-text)] px-4 text-sm font-medium text-white"
                    >
                      Editar vehículo
                    </Link>
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
        description="La oportunidad dejará de aparecer en el trabajo activo y se despublicará del website si estaba publicada."
        confirmLabel="Archivar"
        pending={pending}
        danger
        onConfirm={archive}
        onClose={() => setArchiveId(null)}
      />
    </div>
  );
}
