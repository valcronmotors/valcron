import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicVehicleDetail } from "@/components/public/PublicVehicleDetail";
import { publicVehicleTitle } from "@/lib/public-catalog";
import { loadPublicVehicleById } from "@/lib/public-inventory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await loadPublicVehicleById(id);
  if (!result.data) {
    return { title: "Vehículo" };
  }
  const title = publicVehicleTitle(result.data);
  return {
    title,
    description: `${title} disponible en Valcron Motors. Consulta precio, estado y detalles de importación o inventario en República Dominicana.`,
  };
}

export default async function InventarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadPublicVehicleById(id);
  if (!result.data) {
    notFound();
  }

  return (
    <main>
      <PublicVehicleDetail vehicle={result.data} />
    </main>
  );
}
