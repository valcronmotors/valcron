import { AppShell } from "@/components/app-shell";
import { VehicleDetailView } from "@/components/vehicles/VehicleDetailView";
import { COMPANY_NAMES } from "@/lib/companies";
import { VEHICLE_INVENTORY_SELECT, type VehicleRow } from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function VehiculoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select(VEHICLE_INVENTORY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const vehicle = data as VehicleRow;

  return (
    <AppShell
      title="Ficha del vehículo"
      subtitle={`Detalle operativo y rentabilidad de ${COMPANY_NAMES.valcron}.`}
    >
      <VehicleDetailView vehicle={vehicle} />
    </AppShell>
  );
}
