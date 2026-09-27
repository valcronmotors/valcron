import { redirect } from "next/navigation";
import { isWebsiteAdminClaims } from "@/lib/auth-role";
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
  if (!claims || !isWebsiteAdminClaims(claims)) {
    redirect("/login");
  }

  return claims;
}

export async function getAdminProfile() {
  const claims = await requireAdmin();
  const metadata =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? (claims.user_metadata as Record<string, unknown>)
      : {};
  const name =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    (typeof claims.email === "string" && claims.email) ||
    "Administrador";

  return {
    id: typeof claims.sub === "string" ? claims.sub : "",
    email: typeof claims.email === "string" ? claims.email : "",
    name,
  };
}
