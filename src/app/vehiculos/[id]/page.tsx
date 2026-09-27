import { redirect } from "next/navigation";

export default async function VehiculoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/inventario/${id}`);
}
