"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createStaffUser,
  setStaffAccess,
  updateStaffPassword,
  type UsersActionState,
} from "@/app/actions/users";
import { AdminModal } from "@/components/admin/AdminModal";
import {
  AdminCard,
  AdminError,
  AdminField,
  AdminInput,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSelect,
  AdminSuccess,
} from "@/components/admin/ui";
import { staffRoleLabel, type StaffUser } from "@/lib/staff";

const createInitial: UsersActionState = { error: null };
const passwordInitial: UsersActionState = { error: null };
const accessInitial: UsersActionState = { error: null };

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function StaffUsersWorkspace({
  users,
  error,
  currentUserId,
}: {
  users: StaffUser[];
  error: string | null;
  currentUserId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [createState, createAction, creating] = useActionState(
    createStaffUser,
    createInitial,
  );
  const [passwordState, passwordAction, updatingPassword] = useActionState(
    updateStaffPassword,
    passwordInitial,
  );
  const [accessState, accessAction, updatingAccess] = useActionState(
    setStaffAccess,
    accessInitial,
  );
  const [passwordUser, setPasswordUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    if (createState.success) {
      formRef.current?.reset();
    }
  }, [createState.success]);

  useEffect(() => {
    if (passwordState.success) {
      setPasswordUser(null);
    }
  }, [passwordState.success]);

  const notice =
    createState.success ?? passwordState.success ?? accessState.success;

  return (
    <div className="grid gap-6">
      <AdminSuccess show={Boolean(notice)}>{notice}</AdminSuccess>
      <AdminError message={createState.error ?? accessState.error} />

      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-[#0B0C10]">
          Registrar usuario
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Nombre, correo y contraseña. El usuario queda confirmado y puede
          iniciar sesión de inmediato.
        </p>
        <form
          ref={formRef}
          action={createAction}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <AdminField label="Nombre">
            <AdminInput
              name="name"
              required
              autoComplete="name"
              placeholder="Nombre y apellido"
            />
          </AdminField>
          <AdminField label="Correo">
            <AdminInput
              name="email"
              type="email"
              required
              autoComplete="off"
              placeholder="correo@valcronmotors.com"
            />
          </AdminField>
          <AdminField label="Contraseña">
            <AdminInput
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
          </AdminField>
          <AdminField label="Rol">
            <AdminSelect name="role" defaultValue="vendedor">
              <option value="vendedor">Vendedor</option>
              <option value="administrador">Administrador</option>
            </AdminSelect>
          </AdminField>
          <div className="sm:col-span-2">
            <AdminPrimaryButton type="submit" disabled={creating}>
              {creating ? "Registrando..." : "Registrar usuario"}
            </AdminPrimaryButton>
          </div>
        </form>
      </AdminCard>

      {error ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-sm text-amber-800">
          {error}
        </p>
      ) : users.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-sm text-gray-500">
          Todavía no hay usuarios autorizados para listar.
        </p>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Alta</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#0B0C10]">
                      {user.name}
                      {isSelf ? (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          Tú
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{user.email || "—"}</td>
                    <td className="px-4 py-3">{staffRoleLabel(user.role)}</td>
                    <td className="px-4 py-3">
                      {user.banned ? (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          Revocado
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <AdminSecondaryButton
                          className="h-9 px-3 text-xs"
                          onClick={() => setPasswordUser(user)}
                        >
                          Cambiar contraseña
                        </AdminSecondaryButton>
                        {isSelf ? null : (
                          <form action={accessAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <input
                              type="hidden"
                              name="revoke"
                              value={user.banned ? "0" : "1"}
                            />
                            <button
                              type="submit"
                              disabled={updatingAccess}
                              className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-medium transition disabled:opacity-60 ${
                                user.banned
                                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 hover:bg-red-100"
                              }`}
                            >
                              {user.banned ? "Restaurar acceso" : "Revocar acceso"}
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      <AdminModal
        open={Boolean(passwordUser)}
        title="Cambiar contraseña"
        subtitle={
          passwordUser
            ? `Nueva clave para ${passwordUser.name} (${passwordUser.email}).`
            : undefined
        }
        onClose={() => setPasswordUser(null)}
      >
        {passwordUser ? (
          <form action={passwordAction} className="grid gap-4">
            <input type="hidden" name="userId" value={passwordUser.id} />
            <AdminError message={passwordState.error} />
            <AdminField label="Nueva contraseña">
              <AdminInput
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
            </AdminField>
            <div className="flex flex-wrap gap-3">
              <AdminPrimaryButton type="submit" disabled={updatingPassword}>
                {updatingPassword ? "Guardando..." : "Actualizar contraseña"}
              </AdminPrimaryButton>
              <AdminSecondaryButton
                type="button"
                onClick={() => setPasswordUser(null)}
              >
                Cancelar
              </AdminSecondaryButton>
            </div>
          </form>
        ) : null}
      </AdminModal>
    </div>
  );
}
