import { notFound } from "next/navigation";
import { PublicVehicleDetail } from "@/components/public/PublicVehicleDetail";
import { getAdminVehicle } from "@/lib/admin-data";
import { toAdminPreviewVehicle } from "@/lib/vehicles/normalizeVehicle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vista previa",
};

export default async function AdminVehiclePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { vehicle } = await getAdminVehicle(id);
  if (!vehicle) {
    notFound();
  }

  const preview = toAdminPreviewVehicle(vehicle);

  return (
    <div className="grid gap-4">
      <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 text-sm text-[var(--admin-text-secondary)]">
        Vista previa interna. Esta pantalla no publica el vehículo.
      </p>
      <div className="-mx-4 overflow-hidden rounded-xl border border-[var(--admin-border)] md:-mx-6 lg:-mx-8">
        <PublicVehicleDetail vehicle={preview} similar={[]} />
      </div>
    </div>
  );
}
