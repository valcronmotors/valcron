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

export async function getAdminProfile() {
  const claims = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const metadata = user?.user_metadata ?? {};
  const name =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    user?.email ||
    "Administrador";

  return {
    id: user?.id ?? (typeof claims.sub === "string" ? claims.sub : ""),
    email: user?.email ?? "",
    name,
  };
}
