"use client";

import { useEffect, type ReactNode } from "react";

const SIZE_CLASS = {
  lg: "max-w-4xl",
  xl: "max-w-6xl",
} as const;

const LAYER_CLASS = {
  base: "z-50",
  nested: "z-[70]",
} as const;

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  size = "lg",
  layer = "base",
  closeOnEscape = true,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  size?: keyof typeof SIZE_CLASS;
  layer?: keyof typeof LAYER_CLASS;
  closeOnEscape?: boolean;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeOnEscape, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 ${LAYER_CLASS[layer]} flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm`}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full ${SIZE_CLASS[size]} rounded-3xl border border-white/10 bg-[#0b1726] shadow-2xl shadow-black/40`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
