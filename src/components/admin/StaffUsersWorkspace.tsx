"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createStaffUser,
  setStaffAccess,
  updateStaffPassword,
  type UsersActionState,
} from "@/app/actions/users";
import {
  AppShell,
  PrimaryButton,
  SecondaryButton,
} from "@/components/app-shell";
import {
  Field,
  FormError,
  SelectInput,
  SuccessBanner,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
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

  const notice = createState.success ?? passwordState.success ?? accessState.success;

  return (
    <AppShell
      title="Gestión de Usuarios / Equipo"
      subtitle="Registra administradores y vendedores autorizados para el CRM/ERP, cambia contraseñas y revoca el acceso sin salir del panel."
    >
      <div className="grid gap-6">
        <SuccessBanner show={Boolean(notice)}>{notice}</SuccessBanner>
        <FormError message={createState.error ?? accessState.error} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-white">Registrar usuario</h2>
          <p className="mt-1 text-sm text-slate-400">
            Nombre, correo y contraseña. El usuario queda confirmado y puede
            iniciar sesión de inmediato.
          </p>
          <form
            ref={formRef}
            action={createAction}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <Field label="Nombre">
              <TextInput
                name="name"
                required
                autoComplete="name"
                placeholder="Nombre y apellido"
              />
            </Field>
            <Field label="Correo">
              <TextInput
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="correo@valcronmotors.com"
              />
            </Field>
            <Field label="Contraseña">
              <TextInput
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
            </Field>
            <Field label="Rol">
              <SelectInput name="role" defaultValue="vendedor">
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </SelectInput>
            </Field>
            <div className="sm:col-span-2">
              <PrimaryButton type="submit" disabled={creating}>
                {creating ? "Registrando..." : "Registrar usuario"}
              </PrimaryButton>
            </div>
          </form>
        </section>

        {error ? (
          <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-sm text-amber-200">
            {error}
          </p>
        ) : users.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-sm text-slate-400">
            Todavía no hay usuarios autorizados para listar.
          </p>
        ) : (
          <section className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Alta</th>
                  <th className="px-4 py-3 font-medium"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">
                        {user.name}
                        {isSelf ? (
                          <span className="ml-2 text-xs font-normal text-cyan-300">
                            Tú
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{user.email || "—"}</td>
                      <td className="px-4 py-3">{staffRoleLabel(user.role)}</td>
                      <td className="px-4 py-3">
                        {user.banned ? (
                          <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-medium text-rose-200">
                            Revocado
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                            Activo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <SecondaryButton
                            className="h-9 px-3 text-xs"
                            onClick={() => setPasswordUser(user)}
                          >
                            Cambiar contraseña
                          </SecondaryButton>
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
                                className={`inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold ring-1 transition disabled:opacity-60 ${
                                  user.banned
                                    ? "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20 hover:bg-emerald-400/20"
                                    : "bg-rose-500/10 text-rose-200 ring-rose-400/20 hover:bg-rose-500/20"
                                }`}
                              >
                                {user.banned
                                  ? "Restaurar acceso"
                                  : "Revocar acceso"}
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
      </div>

      <Modal
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
            <FormError message={passwordState.error} />
            <Field label="Nueva contraseña">
              <TextInput
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="submit" disabled={updatingPassword}>
                {updatingPassword ? "Guardando..." : "Actualizar contraseña"}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => setPasswordUser(null)}
              >
                Cancelar
              </SecondaryButton>
            </div>
          </form>
        ) : null}
      </Modal>
    </AppShell>
  );
}
