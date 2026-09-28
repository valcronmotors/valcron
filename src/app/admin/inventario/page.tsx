import { AdminInventoryWorkspace } from "@/components/admin/AdminInventoryWorkspace";
import { getValcronVehicles } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario Valcron",
};

export default async function AdminInventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string; estado?: string; publicado?: string }>;
}) {
  const params = await searchParams;
  const { vehicles, error } = await getValcronVehicles();

  return (
    <AdminInventoryWorkspace
      vehicles={vehicles}
      error={error}
      created={params.creado === "1"}
      initialStatus={params.estado}
      initialPublished={params.publicado}
    />
  );
}
