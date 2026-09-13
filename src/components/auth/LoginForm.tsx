"use client";

import { useActionState } from "react";
import { login, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = { error: null };

const fieldClass =
  "mt-2 h-11 w-full border border-white/10 bg-[#0A0A0C] px-3 text-sm text-white outline-none transition focus:border-[#C5A059]";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p className="border border-white/10 px-4 py-3 text-sm text-[#9CA3AF]">{state.error}</p>
      ) : null}
      <label className="block text-sm text-[#9CA3AF]">
        Correo
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@valcronmotors.com"
          className={fieldClass}
        />
      </label>
      <label className="block text-sm text-[#9CA3AF]">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-medium text-[#0A0A0C] transition hover:bg-white/90 disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Entrar"}
      </button>
    </form>
  );
}
