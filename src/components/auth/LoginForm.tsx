"use client";

import { useActionState } from "react";
import { login, type AuthActionState } from "@/app/actions/auth";
import { Field, FormError, TextInput } from "@/components/form-fields";
import { PrimaryButton } from "@/components/app-shell";

const initialState: AuthActionState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <FormError message={state.error} />
      <Field label="Correo">
        <TextInput
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@valcronmotors.com"
        />
      </Field>
      <Field label="Contraseña">
        <TextInput
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Ingresando..." : "Entrar al ERP"}
      </PrimaryButton>
    </form>
  );
}
