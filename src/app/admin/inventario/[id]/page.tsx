import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminVehicleEditor } from "@/components/admin/AdminVehicleEditor";
import { AdminSuccess } from "@/components/admin/ui";
import { getAdminVehicle } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar vehículo",
};

export default async function AdminVehicleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string; fotos?: string; paso?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const { vehicle, error } = await getAdminVehicle(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <AdminSuccess show={query.creado === "1"}>Vehículo creado correctamente.</AdminSuccess>
      <AdminSuccess show={query.fotos === "pendiente"}>
        El vehículo quedó creado. Reintenta las fotos pendientes.
      </AdminSuccess>
      {error ? (
        <p className="rounded-xl border border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] px-4 py-3 text-sm text-[var(--admin-warning)]">
          {error}
        </p>
      ) : null}
      <Suspense fallback={<p className="text-sm text-[var(--admin-text-muted)]">Cargando editor…</p>}>
        <AdminVehicleEditor vehicle={vehicle} />
      </Suspense>
    </div>
  );
}
