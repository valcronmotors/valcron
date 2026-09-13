import { createClient } from "@supabase/supabase-js";

export const SERVICE_ROLE_MISSING_MESSAGE =
  "Configura SUPABASE_SERVICE_ROLE_KEY en el servidor (Project Settings → API → service_role) para registrar y administrar el equipo.";

export function getServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    ""
  );
}

export function isServiceRoleConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getServiceRoleKey());
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getServiceRoleKey();

  if (!url || !key) {
    throw new Error(SERVICE_ROLE_MISSING_MESSAGE);
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
