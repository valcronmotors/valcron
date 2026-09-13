import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import {
  COMPANIES,
  isCompanySlug,
  matchesCompany,
} from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PART_INVENTORY_SELECT,
  VEHICLE_INVENTORY_SELECT,
  type PartRow,
  type VehicleRow,
} from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";

type Row = Record<string, unknown>;

const NAME_COLUMNS = [
  "nombre",
  "nombre_legal",
  "razon_social",
  "nombre_comercial",
  "name",
];

function companyNameFromRow(row: Row) {
  for (const column of NAME_COLUMNS) {
    const value = row[column];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export default async function AdminPage({
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
    .select(VEHICLE_INVENTORY_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });
  let partsQuery = supabase
    .from("repuestos")
    .select(PART_INVENTORY_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (valcronEmpresa.id) {
    vehiclesQuery = vehiclesQuery.eq("empresa_id", valcronEmpresa.id);
  }
  if (partsEmpresa.id) {
    partsQuery = partsQuery.eq("empresa_id", partsEmpresa.id);
  }

  const [empresasResult, vehiculosResult, repuestosResult] = await Promise.all([
    supabase.from("empresas").select("*").limit(50),
    vehiclesQuery,
    partsQuery,
  ]);

  const companies = COMPANIES.map((company) => {
    const match = (empresasResult.data ?? []).find((row) => {
      const nombre = companyNameFromRow(row as Row);
      return nombre ? matchesCompany(nombre, company) : false;
    });

    return {
      ...company,
      registrada: Boolean(match),
    };
  });

  return (
    <DashboardWorkspace
      companies={companies}
      selectedSlug={selectedSlug}
      vehiculos={{
        rows: (vehiculosResult.data ?? []) as VehicleRow[],
        error:
          valcronEmpresa.error ?? vehiculosResult.error?.message ?? null,
        count: vehiculosResult.count ?? vehiculosResult.data?.length ?? 0,
      }}
      repuestos={{
        rows: (repuestosResult.data ?? []) as PartRow[],
        error: partsEmpresa.error ?? repuestosResult.error?.message ?? null,
        count: repuestosResult.count ?? repuestosResult.data?.length ?? 0,
      }}
    />
  );
}
