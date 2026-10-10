import { COMPANIES, type Company } from "@/lib/companies";
import { createClient } from "@/utils/supabase/server";

export type EmpresaRecord = {
  id: string;
  nombre: string;
};

/**
 * Legacy empresa record wrapper.
 * New code should use companies.ts directly.
 */
export async function listEmpresas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("id, nombre")
    .order("nombre");

  if (error) {
    return { data: [] as EmpresaRecord[], error: error.message };
  }

  return { data: (data ?? []) as EmpresaRecord[], error: null };
}

export async function getEmpresaIdByCompany(company: Company) {
  const { data, error } = await listEmpresas();
  if (error) {
    return { id: null as string | null, error };
  }

  const { matchesCompany } = await import("@/lib/companies");
  const match = data.find((empresa) => matchesCompany(empresa.nombre, company));
  return { id: match?.id ?? null, error: null };
}
