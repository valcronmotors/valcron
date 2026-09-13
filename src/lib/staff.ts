import type { User } from "@supabase/supabase-js";

export const STAFF_ROLES = ["administrador", "vendedor"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  banned: boolean;
  createdAt: string | null;
};

export function isStaffRole(value: unknown): value is StaffRole {
  return value === "administrador" || value === "vendedor";
}

export function staffRoleLabel(role: StaffRole) {
  return role === "vendedor" ? "Vendedor" : "Administrador";
}

function metaText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function mapAuthUser(user: User): StaffUser {
  const metadata = user.user_metadata ?? {};
  const name =
    metaText(metadata.full_name) ||
    metaText(metadata.name) ||
    user.email ||
    "Sin nombre";
  const bannedUntil =
    "banned_until" in user && typeof user.banned_until === "string"
      ? Date.parse(user.banned_until)
      : Number.NaN;

  return {
    id: user.id,
    email: user.email ?? "",
    name,
    role: isStaffRole(user.app_metadata?.role)
      ? user.app_metadata.role
      : "administrador",
    banned: Number.isFinite(bannedUntil) && bannedUntil > Date.now(),
    createdAt: user.created_at ?? null,
  };
}
