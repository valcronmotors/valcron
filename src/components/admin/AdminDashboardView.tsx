import Link from "next/link";
import { Car, FileEdit, Gavel, Globe2, Inbox, PackagePlus } from "lucide-react";
import { AdminPublishBadge, AdminStatusBadge } from "@/components/admin/AdminBadges";
import { AdminCard, AdminEmptyState, AdminNotice, AdminPrimaryButton } from "@/components/admin/ui";
import { adminGreeting, formatAdminDate } from "@/lib/admin-copy";
import { formatMoneyPlain, vehicleLabel } from "@/lib/admin-metrics";
import {
  filterAuctionCatalogRows,
  filterLocalStockRows,
} from "@/lib/catalogs";
import type { DashboardInquiry, DashboardVehicle } from "@/lib/admin-data";

export function AdminDashboardView({
  vehicles,
  inquiries,
  auctionCount,
  error,
}: {
  vehicles: DashboardVehicle[];
  inquiries: DashboardInquiry[];
  auctionCount: number;
  error: string | null;
}) {
  const localVehicles = filterLocalStockRows(vehicles);
  const auctionVehicles = filterAuctionCatalogRows(vehicles);
  const published = localVehicles.filter((row) => row.published);
  const drafts = localVehicles.filter((row) => !row.published);
  const newInquiries = inquiries.filter((row) => row.status === "new");
  const recentVehicles = localVehicles.slice(0, 6);

  const actions = [
    {
      href: "/admin/inventario/nuevo",
      label: "Agregar vehículo",
      hint: "Nueva unidad Valcron",
      icon: PackagePlus,
      primary: true,
    },
    {
      href: "/admin/inventario",
      label: "Inventario Valcron",
      hint: `${localVehicles.length} unidades`,
      icon: Car,
    },
    {
      href: "/admin/subastas",
      label: "Oportunidades de Subasta",
      hint: `${auctionCount} oportunidades`,
      icon: Gavel,
    },
    {
      href: "/admin/solicitudes",
      label: "Consultas",
      hint: `${newInquiries.length} nuevas`,
      icon: Inbox,
    },
    {
      href: "/admin/inventario?publicado=no",
      label: "Borradores",
      hint: `${drafts.length} sin publicar`,
      icon: FileEdit,
    },
    {
      href: "/admin/inventario?publicado=si",
      label: "Publicados",
      hint: `${published.length} en website`,
      icon: Globe2,
    },
  ] as const;

  return (
    <div className="grid gap-6">
      {error ? (
        <AdminNotice tone="warning">
          No pudimos cargar parte de la información. Revisa la conexión e inténtalo de nuevo.
        </AdminNotice>
      ) : null}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-[1.85rem]">
            {adminGreeting()}
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--admin-text-secondary)]">
            Agregar → fotos → disponibilidad → vista previa → publicar.
          </p>
        </div>
        <Link href="/admin/inventario/nuevo">
          <AdminPrimaryButton>+ Agregar vehículo</AdminPrimaryButton>
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border p-4 shadow-[var(--admin-shadow)] transition hover:border-[var(--admin-border-strong)] ${
              "primary" in item && item.primary
                ? "border-[var(--admin-text)] bg-[var(--admin-text)] text-white"
                : "border-[var(--admin-border)] bg-[var(--admin-surface)]"
            }`}
          >
            <span className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  "primary" in item && item.primary
                    ? "bg-white/10 text-white"
                    : "bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-sm font-semibold ${
                    "primary" in item && item.primary ? "text-white" : "text-[var(--admin-text)]"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    "primary" in item && item.primary ? "text-white/70" : "text-[var(--admin-text-muted)]"
                  }`}
                >
                  {item.hint}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </section>

      <AdminCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Unidades recientes</h2>
          <Link href="/admin/inventario" className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
            Ver inventario
          </Link>
        </div>
        {recentVehicles.length === 0 ? (
          <div className="mt-6">
            <AdminEmptyState
              icon={Car}
              title="Todavía no hay vehículos"
              copy="Agrega la primera unidad para comenzar el catálogo."
              action={
                <Link href="/admin/inventario/nuevo">
                  <AdminPrimaryButton>Agregar vehículo</AdminPrimaryButton>
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-[var(--admin-border)]">
            {recentVehicles.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/inventario/${row.id}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--admin-text)]">{vehicleLabel(row)}</p>
                    <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">
                      {formatMoneyPlain(Number(row.price ?? 0), row.currency)} · {formatAdminDate(row.updated_at)}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2">
                    <AdminStatusBadge estado={row.status} />
                    <AdminPublishBadge published={row.published} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      {auctionVehicles.length > 0 ? (
        <p className="text-xs text-[var(--admin-text-muted)]">
          Las oportunidades de subasta se gestionan aparte en{" "}
          <Link href="/admin/subastas" className="font-medium text-[var(--admin-text)] underline-offset-2 hover:underline">
            Subastas
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
