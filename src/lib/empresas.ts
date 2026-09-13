import { matchesCompany, type Company } from "@/lib/companies";
import { createClient } from "@/utils/supabase/server";

export type EmpresaRecord = {
  id: string;
  nombre: string;
};

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

  const match = data.find((empresa) => matchesCompany(empresa.nombre, company));
  return { id: match?.id ?? null, error: null };
}
