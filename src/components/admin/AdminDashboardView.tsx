import Link from "next/link";
import { ArrowUpRight, Car, Globe, PackagePlus, Ship } from "lucide-react";
import {
  AdminStatusBadge,
  AuctionBadgeRow,
} from "@/components/admin/AdminBadges";
import { AdminCard } from "@/components/admin/ui";
import {
  formatUsdPlain,
  vehicleLabel,
  vehicleSaleUsd,
  type VehicleMetrics,
} from "@/lib/admin-metrics";

export function AdminDashboardView({
  vehicles,
  error,
}: {
  vehicles: VehicleMetrics[];
  error: string | null;
}) {
  const available = vehicles.filter((row) => row.estado === "Disponible");
  const auction = vehicles.filter((row) => row.estado === "En Subasta");
  const published = vehicles.filter(
    (row) => row.estado === "Disponible" || row.estado === "En Subasta",
  );
  const sourceCount = {
    Copart: auction.filter((row) => row.fuente_subasta === "Copart").length,
    IAAI: auction.filter((row) => row.fuente_subasta === "IAAI").length,
    Manheim: auction.filter((row) => row.fuente_subasta === "Manheim").length,
  };
  const recent = vehicles.slice(0, 8);

  const kpis = [
    {
      href: "/admin/inventario",
      label: "Unidades en website",
      value: String(published.length),
      hint: "Disponibles en RD o en proceso de subasta/importación",
      icon: Car,
    },
    {
      href: "/admin/inventario",
      label: "Stock en RD",
      value: String(available.length),
      hint: `${formatUsdPlain(available.reduce((sum, row) => sum + vehicleSaleUsd(row), 0))} valor estimado`,
      icon: Car,
    },
    {
      href: "/admin/inventario",
      label: "En subasta / importación",
      value: String(auction.length),
      hint: "Listados públicos con origen de subasta",
      icon: Ship,
      auctions: true,
    },
  ];

  return (
    <div className="grid h-full w-full min-h-full gap-6">
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : null}

      <section className="grid w-full gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 border-l-4 border-l-slate-800 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                {kpi.label}
              </p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <kpi.icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#0B0C10]">
              {kpi.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">{kpi.hint}</p>
            {"auctions" in kpi && kpi.auctions ? (
              <AuctionBadgeRow counts={sourceCount} />
            ) : null}
          </Link>
        ))}
      </section>

      <section className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <AdminCard>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Inventario reciente
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-[#0B0C10]">
            Unidades del website
          </h2>
          {recent.length === 0 ? (
            <p className="mt-8 text-sm text-gray-500">Aún no hay vehículos cargados.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {recent.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0B0C10]">
                      {vehicleLabel(row)}
                    </p>
                    <p className="text-xs text-gray-400">{formatUsdPlain(vehicleSaleUsd(row))}</p>
                  </div>
                  <AdminStatusBadge estado={row.estado} />
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <div className="grid gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Acceso rápido
          </p>
          <Link
            href="/admin/inventario/nuevo"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <PackagePlus className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span>
                <span className="block text-sm font-medium text-[#0B0C10]">Agregar vehículo</span>
                <span className="block text-xs text-gray-400">Publicar en el website</span>
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-gray-300" />
          </Link>
          <Link
            href="/"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Globe className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span>
                <span className="block text-sm font-medium text-[#0B0C10]">Sitio público</span>
                <span className="block text-xs text-gray-400">valcronMotors</span>
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-gray-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}
