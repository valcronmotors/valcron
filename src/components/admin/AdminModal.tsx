"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import {
  AdminDangerButton,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/ui";

export function AdminModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[var(--admin-nav)]/50 sm:items-center sm:px-4 sm:py-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button type="button" aria-label="Cerrar" className="absolute inset-0" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descriptionId : undefined}
        tabIndex={-1}
        className="relative z-10 flex max-h-[min(92dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)] outline-none sm:rounded-xl"
      >
        <div className="shrink-0 border-b border-[var(--admin-border)] px-5 pb-4 pt-3 sm:px-6 sm:pt-5">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--admin-border-strong)] sm:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={titleId} className="font-display text-lg font-semibold text-[var(--admin-text)]">
                {title}
              </h2>
              {subtitle ? (
                <p id={descriptionId} className="mt-1 text-sm leading-5 text-[var(--admin-text-secondary)]">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-sm text-[var(--admin-text-secondary)] transition hover:bg-[var(--admin-surface-muted)]"
            >
              Cerrar
            </button>
          </div>
        </div>
        {children ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
            {children}
          </div>
        ) : null}
        {footer ? (
          <div
            className="shrink-0 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] px-5 pt-3 sm:px-6"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AdminModal
      open={open}
      title={title}
      subtitle={description}
      onClose={onClose}
      footer={
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <AdminSecondaryButton type="button" onClick={onClose} disabled={pending} className="w-full sm:w-auto">
            Cancelar
          </AdminSecondaryButton>
          {danger ? (
            <AdminDangerButton type="button" onClick={onConfirm} disabled={pending} className="w-full sm:w-auto">
              {pending ? "Procesando..." : confirmLabel}
            </AdminDangerButton>
          ) : (
            <AdminPrimaryButton type="button" onClick={onConfirm} disabled={pending} className="w-full sm:w-auto">
              {pending ? "Procesando..." : confirmLabel}
            </AdminPrimaryButton>
          )}
        </div>
      }
    />
  );
}
