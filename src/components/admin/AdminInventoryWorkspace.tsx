"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Car, Search } from "lucide-react";
import { deleteVehicle, setVehiclePublished, setVehicleStatus } from "@/app/actions/vehicles";
import { AdminActionMenu, type AdminMenuItem } from "@/components/admin/AdminActionMenu";
import { AdminConfirmDialog } from "@/components/admin/AdminModal";
import { AdminPublishBadge, AdminStatusBadge } from "@/components/admin/AdminBadges";
import {
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminPrimaryButton,
  adminFieldClass,
} from "@/components/admin/ui";
import {
  INVENTORY_ACTION_LABEL,
  INVENTORY_DELETE_CONFIRMATION,
  inventoryActionHref,
  inventoryRowActions,
  isDestructiveInventoryAction,
  type InventoryActionId,
} from "@/lib/admin-inventory-actions";
import { formatAdminDate } from "@/lib/admin-copy";
import { formatMoneyPlain, vehicleLabel } from "@/lib/admin-metrics";
import { sortVehiclePhotos, vehicleImageAdminPath } from "@/lib/storage";
import { VEHICLE_STATUSES, type VehicleRow } from "@/lib/website-schema";
import { vehicleStatusLabel } from "@/lib/vehicles/vehicle-status";

const PUBLISHED_FILTERS = [
  { id: "all", label: "Publicación" },
  { id: "si", label: "Publicados" },
  { id: "no", label: "No publicados" },
] as const;

type ConfirmKind = "unpublish" | "sold" | "delete";

export function AdminInventoryWorkspace({
  vehicles,
  error,
  created,
  initialStatus,
  initialPublished,
}: {
  vehicles: VehicleRow[];
  error: string | null;
  created?: boolean;
  initialStatus?: string;
  initialPublished?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(initialStatus ?? "all");
  const [published, setPublished] = useState<string>(initialPublished ?? "all");
  const [featured, setFeatured] = useState<"all" | "si">("all");
  const [make, setMake] = useState("all");
  const [year, setYear] = useState("all");
  const [notice, setNotice] = useState<string | null>(
    created ? "Vehículo registrado. Completa fotos y publicación cuando esté listo." : null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; vehicle: VehicleRow } | null>(null);

  const makes = useMemo(
    () => [...new Set(vehicles.map((row) => row.make).filter(Boolean))].sort(),
    [vehicles],
  );
  const years = useMemo(
    () => [...new Set(vehicles.map((row) => row.year))].sort((a, b) => b - a),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return vehicles.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (published === "si" && !row.published) return false;
      if (published === "no" && row.published) return false;
      if (featured === "si" && !row.featured) return false;
      if (make !== "all" && row.make !== make) return false;
      if (year !== "all" && String(row.year) !== year) return false;
      if (!needle) return true;
      const haystack = [vehicleLabel(row), row.vin, row.stock_number, row.trim]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [featured, make, published, query, status, vehicles, year]);

  function run(label: string, task: () => Promise<{ error?: string | null }>) {
    setOpenMenuId(null);
    startTransition(async () => {
      const result = await task();
      if (result.error) {
        setNotice(result.error);
        return;
      }
      setNotice(label);
      setConfirm(null);
      router.refresh();
    });
  }

  function confirmAction() {
    if (!confirm) return;
    if (confirm.kind === "unpublish") {
      run("Publicación retirada.", () => setVehiclePublished(confirm.vehicle.id, false));
      return;
    }
    if (confirm.kind === "delete") {
      run("Vehículo eliminado.", () => deleteVehicle(confirm.vehicle.id));
      return;
    }
    run("Marcado como vendido.", () => setVehicleStatus(confirm.vehicle.id, "sold"));
  }

  function menuItems(vehicle: VehicleRow): AdminMenuItem[] {
    return inventoryRowActions(vehicle)
      .filter((id) => id !== "edit")
      .map((id) => ({
        id,
        label: INVENTORY_ACTION_LABEL[id],
        href: inventoryActionHref(id, vehicle.id) ?? undefined,
        danger: isDestructiveInventoryAction(id),
        disabled: pending,
        onSelect: () => handleInventoryAction(id, vehicle),
      }));
  }

  function handleInventoryAction(id: InventoryActionId, vehicle: VehicleRow) {
    if (id === "publish") {
      run("Vehículo publicado.", () => setVehiclePublished(vehicle.id, true));
      return;
    }
    if (id === "unpublish") {
      setConfirm({ kind: "unpublish", vehicle });
      return;
    }
    if (id === "available") {
      run("Unidad marcada como disponible.", () => setVehicleStatus(vehicle.id, "available"));
      return;
    }
    if (id === "reserve") {
      run("Unidad marcada como reservada.", () => setVehicleStatus(vehicle.id, "reserved"));
      return;
    }
    if (id === "sold") {
      setConfirm({ kind: "sold", vehicle });
      return;
    }
    if (id === "hide") {
      run("Unidad oculta.", () => setVehicleStatus(vehicle.id, "hidden"));
      return;
    }
    if (id === "delete") {
      setConfirm({ kind: "delete", vehicle });
    }
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Inventario"
        subtitle="Una unidad solo aparece en el website si está publicada y en estado disponible, reservado o vendido."
        count={`${filtered.length} de ${vehicles.length} unidades`}
        actions={
          <Link href="/admin/inventario/nuevo">
            <AdminPrimaryButton>Agregar vehículo</AdminPrimaryButton>
          </Link>
        }
      />

      {notice ? (
        <p
          role="status"
          className="rounded-lg border border-[var(--admin-success)]/15 bg-[var(--admin-success-bg)] px-4 py-3 text-sm text-[var(--admin-success)]"
        >
          {notice}
        </p>
      ) : null}
      {error ? <AdminNotice tone="warning">No pudimos cargar el inventario. Inténtalo de nuevo.</AdminNotice> : null}

      <div className="grid gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3">
        <label className="relative">
          <span className="sr-only">Buscar inventario</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar marca, modelo, VIN o stock"
            className={`${adminFieldClass} mt-0 pl-10`}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={`${adminFieldClass} mt-0`}
          aria-label="Estado"
        >
          <option value="all">Estado</option>
          {VEHICLE_STATUSES.map((value) => (
            <option key={value} value={value}>
              {vehicleStatusLabel(value)}
            </option>
          ))}
        </select>
        <select
          value={published}
          onChange={(event) => setPublished(event.target.value)}
          className={`${adminFieldClass} mt-0`}
          aria-label="Publicación"
        >
          {PUBLISHED_FILTERS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={featured}
          onChange={(event) => setFeatured(event.target.value as "all" | "si")}
          className={`${adminFieldClass} mt-0`}
          aria-label="Destacado"
        >
          <option value="all">Destacado</option>
          <option value="si">Solo destacados</option>
        </select>
        <select
          value={make}
          onChange={(event) => setMake(event.target.value)}
          className={`${adminFieldClass} mt-0`}
          aria-label="Marca"
        >
          <option value="all">Marca</option>
          {makes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className={`${adminFieldClass} mt-0`}
          aria-label="Año"
        >
          <option value="all">Año</option>
          {years.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Car}
          title={vehicles.length === 0 ? "Todavía no hay unidades" : "Sin coincidencias"}
          copy={
            vehicles.length === 0
              ? "Agrega el primer vehículo para armar el catálogo."
              : "Prueba otro filtro o búsqueda."
          }
          action={
            vehicles.length === 0 ? (
              <Link href="/admin/inventario/nuevo">
                <AdminPrimaryButton>Agregar vehículo</AdminPrimaryButton>
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)] lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--admin-surface-muted)] text-[11px] uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Publicación</th>
                  <th className="px-4 py-3 font-medium">Destacado</th>
                  <th className="px-4 py-3 font-medium">Actualizado</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {filtered.map((vehicle) => (
                  <InventoryRow
                    key={vehicle.id}
                    vehicle={vehicle}
                    pending={pending}
                    menuOpen={openMenuId === vehicle.id}
                    items={menuItems(vehicle)}
                    onMenuOpenChange={(open) => setOpenMenuId(open ? vehicle.id : null)}
                  />
                ))}
              </tbody>
            </table>
          </section>

          <section className="grid gap-3 lg:hidden">
            {filtered.map((vehicle) => (
              <InventoryCard
                key={vehicle.id}
                vehicle={vehicle}
                pending={pending}
                menuOpen={openMenuId === vehicle.id}
                items={menuItems(vehicle)}
                onMenuOpenChange={(open) => setOpenMenuId(open ? vehicle.id : null)}
              />
            ))}
          </section>
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.kind === "delete"
            ? "Eliminar vehículo"
            : confirm?.kind === "sold"
              ? "Marcar como vendido"
              : "Retirar del website"
        }
        description={
          confirm?.kind === "delete"
            ? INVENTORY_DELETE_CONFIRMATION
            : confirm?.kind === "sold"
              ? "El vehículo quedará como vendido. Si está publicado, seguirá visible con ese estado."
              : "La unidad dejará de aparecer en el inventario público."
        }
        confirmLabel={
          confirm?.kind === "delete" ? "Eliminar" : confirm?.kind === "sold" ? "Marcar vendido" : "Retirar"
        }
        danger={confirm?.kind === "unpublish" || confirm?.kind === "delete"}
        pending={pending}
        onConfirm={confirmAction}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

function coverFor(vehicle: VehicleRow) {
  return sortVehiclePhotos(vehicle.vehicle_photos ?? []).find((photo) => photo.is_cover)
    ?? sortVehiclePhotos(vehicle.vehicle_photos ?? [])[0];
}

function VehicleIdentity({ vehicle }: { vehicle: VehicleRow }) {
  const cover = coverFor(vehicle);
  return (
    <span className="flex min-w-0 items-center gap-3">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vehicleImageAdminPath(cover.storage_path)}
          alt=""
          className="h-14 w-[4.5rem] shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="flex h-14 w-[4.5rem] shrink-0 items-center justify-center rounded-md bg-[var(--admin-surface-muted)] text-[10px] text-[var(--admin-text-muted)]">
          Sin foto
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate font-medium text-[var(--admin-text)]">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
        <span className="block truncate text-xs text-[var(--admin-text-muted)]">
          {vehicle.trim || "Sin versión"}
          {vehicle.vin ? ` · ${vehicle.vin}` : ""}
        </span>
      </span>
    </span>
  );
}

function InventoryRow({
  vehicle,
  pending,
  menuOpen,
  items,
  onMenuOpenChange,
}: {
  vehicle: VehicleRow;
  pending: boolean;
  menuOpen: boolean;
  items: AdminMenuItem[];
  onMenuOpenChange: (open: boolean) => void;
}) {
  return (
    <tr className="align-middle">
      <td className="px-4 py-3">
        <Link href={`/admin/inventario/${vehicle.id}`} className="block min-w-0">
          <VehicleIdentity vehicle={vehicle} />
        </Link>
      </td>
      <td className="px-4 py-3 text-xs text-[var(--admin-text-secondary)]">{vehicle.stock_number || "—"}</td>
      <td className="px-4 py-3 tabular-nums font-medium">
        {formatMoneyPlain(Number(vehicle.price ?? 0), vehicle.currency)}
      </td>
      <td className="px-4 py-3">
        <AdminStatusBadge estado={vehicle.status} />
      </td>
      <td className="px-4 py-3">
        <AdminPublishBadge published={vehicle.published} />
      </td>
      <td className="px-4 py-3 text-xs text-[var(--admin-text-secondary)]">{vehicle.featured ? "Sí" : "—"}</td>
      <td className="px-4 py-3 text-xs text-[var(--admin-text-muted)]">{formatAdminDate(vehicle.updated_at)}</td>
      <td
        className="px-4 py-3"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/inventario/${vehicle.id}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-medium text-[var(--admin-text-secondary)] transition duration-200 hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-text)]"
            onClick={(event) => event.stopPropagation()}
          >
            Editar
          </Link>
          <AdminActionMenu
            open={menuOpen}
            onOpenChange={onMenuOpenChange}
            items={items}
            disabled={pending}
          />
        </div>
      </td>
    </tr>
  );
}

function InventoryCard({
  vehicle,
  pending,
  menuOpen,
  items,
  onMenuOpenChange,
}: {
  vehicle: VehicleRow;
  pending: boolean;
  menuOpen: boolean;
  items: AdminMenuItem[];
  onMenuOpenChange: (open: boolean) => void;
}) {
  return (
    <article className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/admin/inventario/${vehicle.id}`} className="min-w-0">
          <VehicleIdentity vehicle={vehicle} />
        </Link>
        <AdminActionMenu
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
          items={items}
          disabled={pending}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="tabular-nums text-lg font-semibold text-[var(--admin-text)]">
          {formatMoneyPlain(Number(vehicle.price ?? 0), vehicle.currency)}
        </p>
        <span className="flex flex-wrap gap-2">
          <AdminStatusBadge estado={vehicle.status} />
          <AdminPublishBadge published={vehicle.published} />
        </span>
      </div>
      <div className="mt-4">
        <Link
          href={`/admin/inventario/${vehicle.id}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--admin-text)] px-5 text-sm font-medium text-white transition duration-200 hover:bg-[#1c1f24]"
        >
          Editar vehículo
        </Link>
      </div>
    </article>
  );
}
