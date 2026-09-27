"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isWebsiteAdminClaims } from "@/lib/auth-role";
import { safeNextPath } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

export type AuthActionState = {
  error: string | null;
};

export async function login(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!email || !password) {
    return { error: "Ingresa correo y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const { data } = await supabase.auth.getClaims();
  if (!isWebsiteAdminClaims(data?.claims)) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene acceso de administrador del website." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
