"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { adminFieldClass } from "@/components/admin/ui";

export type AdminSearchableOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  value: string;
  options: AdminSearchableOption[];
  placeholder?: string;
  disabled?: boolean;
  allowCustom?: boolean;
  otherValue?: string;
  otherLabel?: string;
  customValue?: string;
  onValueChange: (value: string) => void;
  onCustomChange?: (custom: string) => void;
  emptyLabel?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  "aria-label"?: string;
};

export function AdminSearchableSelect({
  name,
  value,
  options,
  placeholder = "Buscar…",
  disabled,
  allowCustom = false,
  otherValue = "__other__",
  otherLabel = "Otro",
  customValue = "",
  onValueChange,
  onCustomChange,
  emptyLabel = "Seleccionar",
  inputMode,
  "aria-label": ariaLabel,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isOther = allowCustom && value === otherValue;
  const selectedLabel = useMemo(() => {
    if (isOther) return otherLabel;
    if (!value) return "";
    return options.find((option) => option.value === value)?.label ?? value;
  }, [isOther, otherLabel, options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter(
          (option) =>
            option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q),
        )
      : options;
    if (!allowCustom) return base;
    return [...base, { value: otherValue, label: otherLabel }];
  }, [allowCustom, options, otherLabel, otherValue, query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={isOther ? customValue : value} />
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
          setQuery("");
        }}
        className={`${adminFieldClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className={selectedLabel ? "truncate text-[var(--admin-text)]" : "truncate text-[var(--admin-text-muted)]"}>
          {selectedLabel || emptyLabel}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--admin-text-muted)]" />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
          <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-2">
            <Search className="h-4 w-4 text-[var(--admin-text-muted)]" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              inputMode={inputMode}
              className="h-9 w-full bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-muted)]"
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-56 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                role="option"
                aria-selected={!value}
                className="flex w-full px-3 py-2.5 text-left text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-muted)]"
                onClick={() => {
                  onValueChange("");
                  setOpen(false);
                  setQuery("");
                }}
              >
                {emptyLabel}
              </button>
            </li>
            {filtered.map((option) => {
              const active = value === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`flex w-full px-3 py-2.5 text-left text-sm hover:bg-[var(--admin-surface-muted)] ${
                      active ? "bg-[var(--admin-surface-muted)] font-semibold text-[var(--admin-text)]" : "text-[var(--admin-text)]"
                    }`}
                    onClick={() => {
                      onValueChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-[var(--admin-text-muted)]">Sin coincidencias</li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {isOther ? (
        <input
          type="text"
          value={customValue}
          onChange={(event) => onCustomChange?.(event.target.value)}
          placeholder="Escribe el valor personalizado"
          className={`${adminFieldClass} mt-2`}
          autoComplete="off"
        />
      ) : null}
    </div>
  );
}
