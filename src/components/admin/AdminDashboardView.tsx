import Link from "next/link";
import {
  ArrowUpRight,
  Car,
  FileSignature,
  PackagePlus,
  Receipt,
  Ship,
  Wallet,
} from "lucide-react";
import { AdminCard } from "@/components/admin/ui";
import {
  formatUsdPlain,
  isCurrentMonth,
  vehicleCostUsd,
  vehicleLabel,
  vehicleMarginUsd,
  vehicleSaleUsd,
  type VehicleMetrics,
} from "@/lib/admin-metrics";

export function AdminDashboardView({
  vehicles,
  error,
  receivableUsd,
  receivableCount,
}: {
  vehicles: VehicleMetrics[];
  error: string | null;
  receivableUsd: number;
  receivableCount: number;
}) {
  const available = vehicles.filter((row) => row.estado === "Disponible");
  const transit = vehicles.filter(
    (row) => row.estado === "En Tránsito" || row.estado === "En Subasta",
  );
  const soldMonth = vehicles.filter(
    (row) => row.estado === "Vendido" && isCurrentMonth(row.created_at),
  );
  const stockUsd = available.reduce((sum, row) => sum + vehicleSaleUsd(row), 0);
  const transitUsd = transit.reduce((sum, row) => sum + vehicleCostUsd(row), 0);
  const monthBilling = soldMonth.reduce((sum, row) => sum + vehicleSaleUsd(row), 0);
  const monthMargin = soldMonth.reduce((sum, row) => sum + vehicleMarginUsd(row), 0);
  const sourceCount = {
    Copart: transit.filter((row) => row.fuente_subasta === "Copart").length,
    IAAI: transit.filter((row) => row.fuente_subasta === "IAAI").length,
    Manheim: transit.filter((row) => row.fuente_subasta === "Manheim").length,
  };

  const chartRows = [...vehicles]
    .map((row) => ({
      id: row.id,
      label: vehicleLabel(row),
      margin: vehicleMarginUsd(row),
      sale: vehicleSaleUsd(row),
      cost: vehicleCostUsd(row),
      estado: row.estado ?? "—",
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 8);
  const maxMargin = Math.max(...chartRows.map((row) => Math.abs(row.margin)), 1);

  const kpis = [
    {
      href: "/admin/inventario",
      label: "Stock Disponible en RD",
      value: formatUsdPlain(stockUsd),
      hint: `${available.length} unidad${available.length === 1 ? "" : "es"} · valor estimado USD`,
      icon: Car,
    },
    {
      href: "/admin/importaciones/subastas",
      label: "Unidades en Tránsito",
      value: String(transit.length),
      hint: `Copart ${sourceCount.Copart} · IAAI ${sourceCount.IAAI} · Manheim ${sourceCount.Manheim} · ${formatUsdPlain(transitUsd)} invertido`,
      icon: Ship,
    },
    {
      href: "/admin/finanzas/cuentas-por-cobrar",
      label: "Balance por Cobrar",
      value: formatUsdPlain(receivableUsd),
      hint: `${receivableCount} cotización${receivableCount === 1 ? "" : "es"} / iniciales pendientes`,
      icon: Wallet,
    },
    {
      href: "/admin/finanzas/margen",
      label: "Facturación del Mes",
      value: formatUsdPlain(monthBilling),
      hint: `Utilidad neta ${formatUsdPlain(monthMargin)} · ${soldMonth.length} cierre${soldMonth.length === 1 ? "" : "s"}`,
      icon: Receipt,
    },
  ];

  const actions = [
    {
      href: "/admin/legales/actos-venta",
      label: "Nuevo Acto de Venta",
      hint: "Contrato notarial",
      icon: FileSignature,
    },
    {
      href: "/admin/importaciones/subastas",
      label: "Registrar Importación IAAI/Copart",
      hint: "Subasta y lote",
      icon: Ship,
    },
    {
      href: "/admin/finanzas/ncf",
      label: "Emitir Factura NCF",
      hint: "Comprobante fiscal",
      icon: Receipt,
    },
    {
      href: "/admin/inventario/nuevo",
      label: "Registrar Vehículo",
      hint: "Alta de inventario",
      icon: PackagePlus,
    },
  ];

  return (
    <div className="grid gap-6">
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                {kpi.label}
              </p>
              <kpi.icon className="h-4 w-4 text-gray-300 transition group-hover:text-[#C5A059]" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#0B0C10]">
              {kpi.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">{kpi.hint}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                Resumen financiero
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-[#0B0C10]">
                Utilidad neta por vehículo
              </h2>
            </div>
            <Link
              href="/admin/finanzas/margen"
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#0B0C10]"
            >
              Ver margen
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {chartRows.length === 0 ? (
            <p className="mt-8 text-sm text-gray-500">
              Aún no hay unidades para calcular utilidad.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {chartRows.map((row) => (
                <div key={row.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium text-[#0B0C10]">
                      {row.label}
                    </span>
                    <span
                      className={
                        row.margin >= 0 ? "text-emerald-700" : "text-red-700"
                      }
                    >
                      {formatUsdPlain(row.margin)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        row.margin >= 0 ? "bg-[#0B0C10]" : "bg-red-400"
                      }`}
                      style={{
                        width: `${Math.max(6, (Math.abs(row.margin) / maxMargin) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <div className="grid gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Acceso rápido
          </p>
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F9FA] text-[#0B0C10]">
                  <action.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-[#0B0C10]">
                    {action.label}
                  </span>
                  <span className="block text-xs text-gray-400">{action.hint}</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-300" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
