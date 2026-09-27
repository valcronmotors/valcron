import type { LucideIcon } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";

export const adminFieldClass =
  "mt-1.5 h-11 w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-sm text-[var(--admin-text)] outline-none transition duration-200 placeholder:text-[var(--admin-text-muted)] focus:border-[var(--admin-brand)] focus:ring-2 focus:ring-[var(--admin-focus)]/25 disabled:cursor-not-allowed disabled:bg-[var(--admin-surface-muted)] disabled:opacity-70";

export function AdminField({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block text-[13px] font-medium text-[var(--admin-text-secondary)]">
      <span className="inline-flex items-center gap-1">
        {label}
        {required ? (
          <span className="text-[var(--admin-brand)]" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {children}
      {hint && !error ? (
        <span className="mt-1.5 block text-xs font-normal text-[var(--admin-text-muted)]">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span role="alert" className="mt-1.5 block text-xs font-normal text-[var(--admin-danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AdminInput(props, ref) {
    return <input ref={ref} {...props} className={`${adminFieldClass} ${props.className ?? ""}`} />;
  },
);

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${adminFieldClass} ${props.className ?? ""}`} />;
}

export function AdminTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1.5 min-h-32 w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--admin-text)] outline-none transition duration-200 placeholder:text-[var(--admin-text-muted)] focus:border-[var(--admin-brand)] focus:ring-2 focus:ring-[var(--admin-focus)]/25 ${props.className ?? ""}`}
    />
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--admin-text)] px-5 text-sm font-medium text-white transition duration-200 hover:bg-[#1c1f24] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-5 text-sm font-medium text-[var(--admin-text)] transition duration-200 hover:bg-[var(--admin-surface-muted)] active:scale-[0.99] disabled:opacity-60 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function AdminGhostButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--admin-text-secondary)] transition duration-200 hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-text)] disabled:opacity-60 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function AdminDangerButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-bg)] px-5 text-sm font-medium text-[var(--admin-danger)] transition duration-200 hover:bg-[#f3dede] disabled:opacity-60 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function AdminCard({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)] sm:p-6 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

export function AdminError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-bg)] px-4 py-3 text-sm text-[var(--admin-danger)]"
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
  if (!show) return null;
  return (
    <p
      role="status"
      className="rounded-lg border border-[var(--admin-success)]/15 bg-[var(--admin-success-bg)] px-4 py-3 text-sm text-[var(--admin-success)]"
    >
      {children}
    </p>
  );
}

export function AdminSectionTitle({
  kicker,
  title,
  hint,
}: {
  kicker?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      {kicker ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-[var(--admin-text)]">
        {title}
      </h2>
      {hint ? (
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function AdminEmptyState({
  title,
  copy,
  action,
  icon: Icon,
}: {
  title: string;
  copy: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-6 py-12 text-center">
      {Icon ? (
        <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}
      <p className="font-display text-lg font-semibold text-[var(--admin-text)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--admin-text-secondary)]">{copy}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminNotice({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "warning" | "danger";
  children: ReactNode;
}) {
  const styles = {
    neutral:
      "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
    warning:
      "border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]",
    danger:
      "border-[var(--admin-danger)]/20 bg-[var(--admin-danger-bg)] text-[var(--admin-danger)]",
  }[tone];
  return <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}

export function AdminPageHeader({
  title,
  subtitle,
  count,
  actions,
}: {
  title: string;
  subtitle?: string;
  count?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-[1.75rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">
            {subtitle}
          </p>
        ) : null}
        {count ? (
          <p className="mt-1 text-xs font-medium text-[var(--admin-text-muted)]">{count}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
