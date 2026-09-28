import Link from "next/link";
import {
  ArrowUpRight,
  Car,
  Gavel,
  Globe,
  Inbox,
  PackagePlus,
} from "lucide-react";
import { AdminPublishBadge, AdminStatusBadge } from "@/components/admin/AdminBadges";
import { AdminCard, AdminEmptyState, AdminNotice, AdminPrimaryButton, AdminSecondaryButton } from "@/components/admin/ui";
import { adminGreeting, formatAdminDate } from "@/lib/admin-copy";
import { formatMoneyPlain, vehicleLabel } from "@/lib/admin-metrics";
import {
  filterAuctionCatalogRows,
  filterLocalStockRows,
} from "@/lib/catalogs";
import type { DashboardInquiry, DashboardVehicle } from "@/lib/admin-data";

function DistributionBar({
  items,
}: {
  items: { label: string; value: number; tone: string }[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Todavía no hay unidades para mostrar.</p>
    );
  }

  return (
    <div className="mt-4 grid gap-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-[var(--admin-surface-muted)]">
        {items.map((item) =>
          item.value > 0 ? (
            <span
              key={item.label}
              className={`h-full ${item.tone}`}
              style={{ width: `${(item.value / total) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <ul className="grid gap-2 text-sm sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-[var(--admin-text-secondary)]">
            <span className="inline-flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.tone}`} />
              {item.label}
            </span>
            <span className="tabular-nums font-medium text-[var(--admin-text)]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  const available = localVehicles.filter((row) => row.status === "available");
  const reserved = localVehicles.filter((row) => row.status === "reserved");
  const sold = localVehicles.filter((row) => row.status === "sold");
  const drafts = localVehicles.filter((row) => row.status === "draft" || !row.published);
  const hidden = localVehicles.filter((row) => row.status === "hidden");
  const publishedAuctions = auctionVehicles.filter((row) => row.published);
  const newInquiries = inquiries.filter((row) => row.status === "new");
  const recentVehicles = localVehicles.slice(0, 6);
  const recentInquiries = inquiries.slice(0, 4);

  const compact = [
    { href: "/admin/inventario?estado=reserved", label: "Reservados Valcron", value: reserved.length },
    { href: "/admin/inventario?estado=sold", label: "Vendidos Valcron", value: sold.length },
    { href: "/admin/inventario?publicado=no", label: "Borradores Valcron", value: drafts.length },
    { href: "/admin/subastas", label: "Oportunidades", value: auctionCount },
    { href: "/admin/website", label: "Subastas publicadas", value: publishedAuctions.length },
  ];

  return (
    <div className="grid gap-7">
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
            Agregar → datos → fotos → precio → vista previa → publicar → website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/inventario/nuevo">
            <AdminPrimaryButton>+ Agregar vehículo</AdminPrimaryButton>
          </Link>
          <Link href="/admin/subastas/copart">
            <AdminSecondaryButton>Buscar en Copart</AdminSecondaryButton>
          </Link>
        </div>
      </header>

      <AdminCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
          Flujo principal
        </p>
        <ol className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--admin-text-secondary)]">
          {[
            "Agregar vehículo",
            "Completar datos",
            "Subir fotos",
            "Definir precio",
            "Vista previa",
            "Publicar",
            "Aparece en website",
          ].map((step, index) => (
            <li
              key={step}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-surface-muted)] px-3 py-2"
            >
              <span className="tabular-nums text-[var(--admin-brand)]">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/inventario/nuevo">
            <AdminPrimaryButton>+ Agregar vehículo</AdminPrimaryButton>
          </Link>
          <Link href="/admin/subastas/copart">
            <AdminSecondaryButton>Buscar en Copart</AdminSecondaryButton>
          </Link>
          <Link href="/admin/subastas/nuevo">
            <AdminSecondaryButton>Agregar oportunidad IAA</AdminSecondaryButton>
          </Link>
          <Link href="/admin/solicitudes">
            <AdminSecondaryButton>Ver solicitudes</AdminSecondaryButton>
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <AdminSecondaryButton>Ver website</AdminSecondaryButton>
          </Link>
        </div>
      </AdminCard>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/inventario"
          className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Vehículos Valcron
          </p>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-[var(--admin-text)]">
            {localVehicles.length}
          </p>
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
            {published.length} publicados · {available.length} disponibles
          </p>
        </Link>
        <Link
          href="/admin/subastas"
          className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Oportunidades
          </p>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-[var(--admin-text)]">
            {auctionCount}
          </p>
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
            {publishedAuctions.length} publicadas en website
          </p>
        </Link>
        <Link
          href="/admin/solicitudes?estado=new"
          className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Solicitudes nuevas
          </p>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-[var(--admin-text)]">
            {newInquiries.length}
          </p>
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {compact.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-4 transition duration-200 hover:border-[var(--admin-border-strong)]"
          >
            <p className="text-xs text-[var(--admin-text-muted)]">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-[var(--admin-text)]">
              {item.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Salud de publicación</h2>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            Solo las unidades publicadas aparecen en el website.
          </p>
          <DistributionBar
            items={[
              { label: "Publicados Valcron", value: published.length, tone: "bg-[var(--admin-success)]" },
              {
                label: "Sin publicar Valcron",
                value: localVehicles.length - published.length,
                tone: "bg-[var(--admin-border-strong)]",
              },
            ]}
          />
        </AdminCard>
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">
            Estado Inventario Valcron
          </h2>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">Distribución del stock local.</p>
          <DistributionBar
            items={[
              { label: "Disponibles", value: available.length, tone: "bg-[var(--admin-success)]" },
              { label: "Reservados", value: reserved.length, tone: "bg-[var(--admin-warning)]" },
              { label: "Vendidos", value: sold.length, tone: "bg-[var(--admin-text-muted)]" },
              {
                label: "Borradores",
                value: localVehicles.filter((row) => row.status === "draft").length,
                tone: "bg-[var(--admin-border-strong)]",
              },
              { label: "Ocultos", value: hidden.length, tone: "bg-[#c5c8cc]" },
            ]}
          />
        </AdminCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
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
                      <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                        {vehicleLabel(row)}
                      </p>
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

        <div className="grid content-start gap-4">
          <AdminCard>
            <h2 className="font-display text-base font-semibold text-[var(--admin-text)]">Acciones rápidas</h2>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/admin/inventario/nuevo", label: "Agregar vehículo", hint: "Nueva unidad al catálogo", icon: PackagePlus },
                { href: "/admin/subastas/nuevo", label: "Agregar oportunidad", hint: "Registro interno de subasta", icon: Gavel },
                { href: "/admin/solicitudes", label: "Revisar solicitudes", hint: "Mensajes del website", icon: Inbox },
                { href: "/", label: "Ver website", hint: "Sitio público de Valcron", icon: Globe },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-lg px-2 py-2.5 transition duration-200 hover:bg-[var(--admin-surface-muted)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]">
                      <item.icon className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-[var(--admin-text)]">{item.label}</span>
                      <span className="block text-xs text-[var(--admin-text-muted)]">{item.hint}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--admin-text-muted)] transition group-hover:text-[var(--admin-text)]" />
                </Link>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-semibold text-[var(--admin-text)]">Solicitudes recientes</h2>
              <Link href="/admin/solicitudes" className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
                Ver todas
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Todavía no hay solicitudes.</p>
            ) : (
              <ul className="mt-3 divide-y divide-[var(--admin-border)]">
                {recentInquiries.map((inquiry) => (
                  <li key={inquiry.id} className="py-3">
                    <p className="text-sm font-medium text-[var(--admin-text)]">{inquiry.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[var(--admin-text-muted)]">
                      {inquiry.message || "Sin mensaje."}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </section>
    </div>
  );
}
