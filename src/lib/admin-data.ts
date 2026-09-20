import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import { VEHICLE_INVENTORY_SELECT } from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";
import type { VehicleMetrics } from "@/lib/admin-metrics";

const VEHICLE_DASHBOARD_SELECT = `${VEHICLE_INVENTORY_SELECT}, created_at`;

export async function getValcronEmpresaId() {
  const company = COMPANIES.find((item) => item.inventario === "vehiculos");
  if (!company) {
    return { id: null as string | null, error: "Empresa Valcron no configurada." };
  }
  return getEmpresaIdByCompany(company);
}

export async function getValcronVehicles() {
  const empresa = await getValcronEmpresaId();
  const supabase = await createClient();
  let query = supabase
    .from("vehiculos")
    .select(VEHICLE_DASHBOARD_SELECT)
    .order("created_at", { ascending: false });

  if (empresa.id) {
    query = query.eq("empresa_id", empresa.id);
  }

  const { data, error } = await query;
  return {
    vehicles: (data ?? []) as VehicleMetrics[],
    error: empresa.error ?? error?.message ?? null,
  };
}
