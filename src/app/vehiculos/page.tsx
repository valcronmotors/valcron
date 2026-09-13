import { VehiclesInventoryPage } from "@/components/vehicles/VehiclesInventoryPage";
import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  VEHICLE_INVENTORY_SELECT,
  type VehicleRow,
} from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";

export default async function VehiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string; actualizado?: string }>;
}) {
  const params = await searchParams;
  const company = COMPANIES.find((item) => item.inventario === "vehiculos")!;
  const { id: empresaId, error: empresaError } =
    await getEmpresaIdByCompany(company);
  const supabase = await createClient();

  let query = supabase
    .from("vehiculos")
    .select(VEHICLE_INVENTORY_SELECT)
    .order("created_at", { ascending: false });

  if (empresaId) {
    query = query.eq("empresa_id", empresaId);
  }

  const { data, error } = await query;

  return (
    <VehiclesInventoryPage
      vehiculos={(data ?? []) as VehicleRow[]}
      error={empresaError ?? error?.message ?? null}
      created={params.creado === "1"}
      updated={params.actualizado === "1"}
    />
  );
}
