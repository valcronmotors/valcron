import { CrmWorkspace } from "@/components/crm/CrmWorkspace";
import { COMPANIES, isCompanySlug } from "@/lib/companies";
import { PROSPECTO_SELECT, normalizeProspecto } from "@/lib/crm";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PART_INVENTORY_SELECT,
  VEHICLE_INVENTORY_SELECT,
  type PartRow,
  type VehicleRow,
} from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ empresa?: string }>;
}) {
  const params = await searchParams;
  const selectedSlug = isCompanySlug(params.empresa) ? params.empresa : "todas";
  const supabase = await createClient();
  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos")!;
  const partsDirect = COMPANIES.find((company) => company.inventario === "repuestos")!;
  const [valcronEmpresa, partsEmpresa] = await Promise.all([
    getEmpresaIdByCompany(valcron),
    getEmpresaIdByCompany(partsDirect),
  ]);

  let vehiclesQuery = supabase
    .from("vehiculos")
    .select(VEHICLE_INVENTORY_SELECT)
    .order("created_at", { ascending: false });
  let partsQuery = supabase
    .from("repuestos")
    .select(PART_INVENTORY_SELECT)
    .order("created_at", { ascending: false });
  let leadsQuery = supabase
    .from("prospectos")
    .select(PROSPECTO_SELECT)
    .order("created_at", { ascending: false });

  if (valcronEmpresa.id) {
    vehiclesQuery = vehiclesQuery.eq("empresa_id", valcronEmpresa.id);
  }
  if (partsEmpresa.id) {
    partsQuery = partsQuery.eq("empresa_id", partsEmpresa.id);
  }
  if (selectedSlug === valcron.slug && valcronEmpresa.id) {
    leadsQuery = leadsQuery.eq("empresa_id", valcronEmpresa.id);
  }
  if (selectedSlug === partsDirect.slug && partsEmpresa.id) {
    leadsQuery = leadsQuery.eq("empresa_id", partsEmpresa.id);
  }

  const [leadsResult, vehiclesResult, partsResult] = await Promise.all([
    leadsQuery,
    vehiclesQuery,
    partsQuery,
  ]);

  return (
    <CrmWorkspace
      prospectos={(leadsResult.data ?? []).map(normalizeProspecto)}
      vehiculos={(vehiclesResult.data ?? []) as VehicleRow[]}
      repuestos={(partsResult.data ?? []) as PartRow[]}
      selectedSlug={selectedSlug}
      error={
        leadsResult.error?.message ??
        vehiclesResult.error?.message ??
        partsResult.error?.message ??
        valcronEmpresa.error ??
        partsEmpresa.error ??
        null
      }
    />
  );
}
