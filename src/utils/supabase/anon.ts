import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function hasPublicSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Falta la configuración pública de Supabase.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Returns null when public Supabase env is missing (e.g. Preview without secrets). */
export function tryCreateAnonClient(): SupabaseClient | null {
  if (!hasPublicSupabaseConfig()) return null;
  return createAnonClient();
}
