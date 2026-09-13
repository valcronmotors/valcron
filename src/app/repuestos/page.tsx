import { PartsInventoryPage } from "@/components/parts/PartsInventoryPage";
import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import { PART_INVENTORY_SELECT, type PartRow } from "@/lib/inventory";
import { createClient } from "@/utils/supabase/server";

export default async function RepuestosPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string; actualizado?: string }>;
}) {
  const params = await searchParams;
  const company = COMPANIES.find((item) => item.inventario === "repuestos")!;
  const { id: empresaId, error: empresaError } =
    await getEmpresaIdByCompany(company);
  const supabase = await createClient();

  let query = supabase
    .from("repuestos")
    .select(PART_INVENTORY_SELECT)
    .order("created_at", { ascending: false });

  if (empresaId) {
    query = query.eq("empresa_id", empresaId);
  }

  const { data, error } = await query;

  return (
    <PartsInventoryPage
      repuestos={(data ?? []) as PartRow[]}
      error={empresaError ?? error?.message ?? null}
      created={params.creado === "1"}
      updated={params.actualizado === "1"}
    />
  );
}
