"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isStaffRole, mapAuthUser, type StaffUser } from "@/lib/staff";
import {
  SERVICE_ROLE_MISSING_MESSAGE,
  createAdminClient,
  getServiceRoleKey,
} from "@/utils/supabase/admin";

export type UsersActionState = {
  error: string | null;
  success?: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isUuid(value: string) {
  return UUID_RE.test(value);
}

function currentUserId(claims: Record<string, unknown>) {
  return typeof claims.sub === "string" ? claims.sub : "";
}

function revalidateUsers() {
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/configuracion/usuarios");
}

export async function listStaffUsers(): Promise<{
  users: StaffUser[];
  error: string | null;
  currentUserId: string;
}> {
  const claims = await requireAdmin();
  const viewerId = currentUserId(claims);

  if (!getServiceRoleKey()) {
    return {
      users: [],
      error: SERVICE_ROLE_MISSING_MESSAGE,
      currentUserId: viewerId,
    };
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return { users: [], error: error.message, currentUserId: viewerId };
    }

    const users = (data.users ?? [])
      .map(mapAuthUser)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));

    return { users, error: null, currentUserId: viewerId };
  } catch (error) {
    return {
      users: [],
      error:
        error instanceof Error ? error.message : SERVICE_ROLE_MISSING_MESSAGE,
      currentUserId: viewerId,
    };
  }
}

export async function createStaffUser(
  _prev: UsersActionState | null,
  formData: FormData,
): Promise<UsersActionState> {
  await requireAdmin();

  const name = requiredText(formData, "name");
  const email = requiredText(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = requiredText(formData, "role");

  if (!name) {
    return { error: "Ingresa el nombre." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Ingresa un correo válido." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!isStaffRole(role)) {
    return { error: "Selecciona un rol válido." };
  }
  if (!getServiceRoleKey()) {
    return { error: SERVICE_ROLE_MISSING_MESSAGE };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, name },
    app_metadata: { role, staff: true },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      return { error: "Ese correo ya está registrado." };
    }
    return { error: error.message };
  }

  revalidateUsers();
  return {
    error: null,
    success: `${name} ya puede iniciar sesión en el CRM/ERP.`,
  };
}

export async function updateStaffPassword(
  _prev: UsersActionState | null,
  formData: FormData,
): Promise<UsersActionState> {
  await requireAdmin();

  const userId = requiredText(formData, "userId");
  const password = String(formData.get("password") ?? "");

  if (!isUuid(userId)) {
    return { error: "Usuario inválido." };
  }
  if (password.length < 8) {
    return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  }
  if (!getServiceRoleKey()) {
    return { error: SERVICE_ROLE_MISSING_MESSAGE };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, { password });

  if (error) {
    return { error: error.message };
  }

  revalidateUsers();
  return { error: null, success: "Contraseña actualizada." };
}

export async function setStaffAccess(
  _prev: UsersActionState | null,
  formData: FormData,
): Promise<UsersActionState> {
  const claims = await requireAdmin();
  const userId = requiredText(formData, "userId");
  const revoke = requiredText(formData, "revoke") === "1";

  if (!isUuid(userId)) {
    return { error: "Usuario inválido." };
  }
  if (userId === currentUserId(claims)) {
    return { error: "No puedes revocar tu propio acceso." };
  }
  if (!getServiceRoleKey()) {
    return { error: SERVICE_ROLE_MISSING_MESSAGE };
  }

  const admin = createAdminClient();
  const { data, error: lookupError } =
    await admin.auth.admin.getUserById(userId);

  if (lookupError || !data.user) {
    return { error: lookupError?.message ?? "Usuario no encontrado." };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: revoke ? "876000h" : "none",
    app_metadata: {
      ...(data.user.app_metadata ?? {}),
      revoked: revoke,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidateUsers();
  return {
    error: null,
    success: revoke
      ? "Acceso revocado. Esa cuenta ya no puede entrar al CRM/ERP."
      : "Acceso restaurado.",
  };
}
