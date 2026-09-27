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
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
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
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[var(--admin-nav)]/45 px-4 py-10">
      <button type="button" aria-label="Cerrar" className="absolute inset-0" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descriptionId : undefined}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)] outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--admin-border)] px-6 py-5">
          <div>
            <h2 id={titleId} className="font-display text-lg font-semibold text-[var(--admin-text)]">
              {title}
            </h2>
            {subtitle ? (
              <p id={descriptionId} className="mt-1 text-sm text-[var(--admin-text-secondary)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-sm text-[var(--admin-text-secondary)] transition hover:bg-[var(--admin-surface-muted)]"
          >
            Cerrar
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
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
    <AdminModal open={open} title={title} subtitle={description} onClose={onClose}>
      <div className="flex flex-wrap justify-end gap-2">
        <AdminSecondaryButton type="button" onClick={onClose} disabled={pending}>
          Cancelar
        </AdminSecondaryButton>
        {danger ? (
          <AdminDangerButton type="button" onClick={onConfirm} disabled={pending}>
            {pending ? "Procesando..." : confirmLabel}
          </AdminDangerButton>
        ) : (
          <AdminPrimaryButton type="button" onClick={onConfirm} disabled={pending}>
            {pending ? "Procesando..." : confirmLabel}
          </AdminPrimaryButton>
        )}
      </div>
    </AdminModal>
  );
}
