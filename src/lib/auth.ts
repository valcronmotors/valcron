import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function getAdminClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function requireAdmin() {
  const claims = await getAdminClaims();
  if (!claims) {
    redirect("/login");
  }

  return claims;
}
