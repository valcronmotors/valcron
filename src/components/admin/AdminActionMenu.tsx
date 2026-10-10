"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { ADMIN_ACTION_MENU_A11Y, positionAdminMenu } from "@/lib/admin-action-menu";

export type AdminMenuItem = {
  id: string;
  label: string;
  href?: string;
  target?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export function AdminActionMenu({
  label = "Más acciones",
  items,
  open,
  onOpenChange,
  disabled,
}: {
  label?: string;
  items: AdminMenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  const onOpenChangeRef = useRef(onOpenChange);
  const menuId = useId();
  const [coords, setCoords] = useState<ReturnType<typeof positionAdminMenu> | null>(null);
  const mounted = typeof document !== "undefined";

  useEffect(() => {
    itemsRef.current = items;
    onOpenChangeRef.current = onOpenChange;
  }, [items, onOpenChange]);

  function place() {
    const trigger = triggerRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const estimatedHeight = Math.min(itemsRef.current.length * 48 + 72, 420);
    setCoords(
      positionAdminMenu({
        trigger,
        menu: { width: 260, height: estimatedHeight },
        viewport: { width: window.innerWidth, height: window.innerHeight },
      }),
    );
  }

  function close() {
    onOpenChangeRef.current(false);
    triggerRef.current?.focus();
  }

  function openMenu() {
    place();
    onOpenChangeRef.current(true);
  }

  useEffect(() => {
    if (!open) return;
    place();

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    function onReposition() {
      place();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    const frame = window.requestAnimationFrame(() => {
      const itemsEls = menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      );
      itemsEls?.[0]?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const nodes = [
      ...(menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? []),
    ];
    const index = nodes.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      nodes[(index + 1) % nodes.length]?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      nodes[(index - 1 + nodes.length) % nodes.length]?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      nodes[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      nodes[nodes.length - 1]?.focus();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      close();
    }
  }

  const sheet = coords?.mode === "sheet" || (open && typeof window !== "undefined" && window.innerWidth < 1024);
  const normalItems = items.filter((item) => !item.danger);
  const dangerItems = items.filter((item) => item.danger);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup={ADMIN_ACTION_MENU_A11Y.triggerHaspopup}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--admin-text-secondary)] transition hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-text)] disabled:opacity-60"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (open) {
            close();
            return;
          }
          openMenu();
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] overflow-x-hidden overscroll-none"
              onClick={close}
              data-admin-action-overlay="true"
            >
              <div className="absolute inset-0 bg-[#08090b]/55 backdrop-blur-[2px]" aria-hidden />
              <div
                ref={menuRef}
                id={menuId}
                role="menu"
                aria-label={label}
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={onMenuKeyDown}
                className={
                  sheet
                    ? "absolute inset-x-0 bottom-0 z-[201] max-h-[min(85vh,32rem)] overflow-x-hidden overflow-y-auto rounded-t-2xl border border-[var(--admin-border)] bg-white p-2 shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
                    : "absolute z-[201] overflow-x-hidden overflow-y-auto rounded-lg border border-[var(--admin-border)] bg-white py-1 shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
                }
                style={
                  sheet
                    ? {
                        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                      }
                    : {
                        top: coords?.top ?? 16,
                        left: coords?.left ?? 16,
                        width: coords?.width ?? 260,
                        maxHeight: "min(24rem, calc(100vh - 1rem))",
                      }
                }
              >
                {sheet ? (
                  <>
                    <div className="mx-auto mb-2 mt-1 h-1.5 w-10 rounded-full bg-[#d4d4d4]" aria-hidden />
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
                      Acciones
                    </p>
                  </>
                ) : null}
                {normalItems.map((item) => (
                  <MenuRow key={item.id} item={item} onClose={close} />
                ))}
                {dangerItems.length > 0 ? (
                  <div className="mt-1 border-t border-[var(--admin-border)] pt-1">
                    {dangerItems.map((item) => (
                      <MenuRow key={item.id} item={item} onClose={close} />
                    ))}
                  </div>
                ) : null}
                {sheet ? (
                  <button
                    type="button"
                    className="mt-2 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#f3f4f6] text-sm font-medium text-[var(--admin-text)]"
                    onClick={close}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function MenuRow({ item, onClose }: { item: AdminMenuItem; onClose: () => void }) {
  const className = `flex min-h-12 w-full items-center rounded-lg px-3 text-left text-sm font-medium ${
    item.danger
      ? "text-[var(--admin-danger)] hover:bg-[var(--admin-danger-bg)]"
      : "text-[var(--admin-text)] hover:bg-[var(--admin-surface-muted)]"
  } disabled:opacity-50`;

  if (item.href) {
    return (
      <Link
        role="menuitem"
        href={item.href}
        target={item.target}
        rel={item.target === "_blank" ? "noreferrer" : undefined}
        className={className}
        onClick={onClose}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={item.disabled}
      aria-disabled={item.disabled || undefined}
      className={className}
      onClick={() => {
        if (item.disabled) return;
        item.onSelect?.();
        onClose();
      }}
    >
      {item.label}
    </button>
  );
}
