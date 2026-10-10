import { Suspense } from "react";
import { AdminVehicleEditor } from "@/components/admin/AdminVehicleEditor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar vehículo",
};

export default function AdminNuevoVehiculoPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--admin-text-muted)]">Cargando editor…</p>}>
      <AdminVehicleEditor />
    </Suspense>
  );
}
