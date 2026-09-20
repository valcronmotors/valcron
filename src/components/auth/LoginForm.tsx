"use client";

import { useActionState, useState } from "react";
import { login, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = { error: null };

const fieldClass =
  "h-12 w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] pr-4 text-sm text-[#0B0C10] outline-none transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#C5A059]";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a18.5 18.5 0 0 1-3.2 3.8" />
        <path d="M6.1 6.1A18.6 18.6 0 0 0 2 12s4 7 10 7c1.3 0 2.5-.2 3.6-.6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white"
      aria-hidden="true"
    />
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal leading-relaxed text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <label className="block text-xs font-medium uppercase tracking-widest text-gray-500">
        Correo electrónico
        <span className="relative mt-2 block">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <MailIcon />
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@valcronmotors.com"
            aria-invalid={state.error ? true : undefined}
            className={`${fieldClass} pl-10`}
          />
        </span>
      </label>

      <label className="block text-xs font-medium uppercase tracking-widest text-gray-500">
        Contraseña
        <span className="relative mt-2 block">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <LockIcon />
          </span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            aria-invalid={state.error ? true : undefined}
            className={`${fieldClass} pl-10 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400 transition hover:text-[#0B0C10]"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#0B0C10] text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? <Spinner /> : null}
        {pending ? "Verificando acceso..." : "Entrar al website admin"}
      </button>
    </form>
  );
}
