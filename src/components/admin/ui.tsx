import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export const adminFieldClass =
  "mt-2 h-11 w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-3 text-sm text-[#0B0C10] outline-none transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#C5A059]";

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-medium uppercase tracking-widest text-gray-500">
      {label}
      {children}
    </label>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`${adminFieldClass} ${props.className ?? ""}`} />
  );
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${adminFieldClass} ${props.className ?? ""}`} />
  );
}

export function AdminPrimaryButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex h-11 items-center justify-center rounded-lg bg-[#0B0C10] px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-[#0B0C10] transition hover:bg-gray-50 disabled:opacity-60 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

export function AdminError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {message}
    </p>
  );
}

export function AdminSuccess({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  if (!show) {
    return null;
  }
  return (
    <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {children}
    </p>
  );
}
