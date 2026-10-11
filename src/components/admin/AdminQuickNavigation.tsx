"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput } from "@/components/admin/ui";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { ADMIN_NAV_ICONS } from "@/components/admin/admin-icons";

const destinations = ADMIN_NAV.flatMap((section) =>
  section.children
    ? section.children.map((item) => ({ ...item, icon: section.icon }))
    : section.href ? [{ href: section.href, label: section.label, description: section.description ?? "", icon: section.icon }] : [],
);

export function AdminQuickNavigation() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const results = destinations.filter((item) => `${item.label} ${item.description}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalized));

  return (
    <>
      <button type="button" onClick={() => { setQuery(""); setOpen(true); }} aria-label="Buscar una opción del admin" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 text-sm text-[var(--admin-text-secondary)] hover:bg-[var(--admin-nav-hover)]">
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden md:inline">Buscar una opción</span>
      </button>
      <AdminModal open={open} title="¿Qué quieres hacer?" subtitle="Encuentra cualquier opción del panel." onClose={() => setOpen(false)}>
        <label className="block text-sm font-medium">
          Buscar en el admin
          <AdminInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Inventario, subastas, usuarios…" />
        </label>
        <nav aria-label="Accesos rápidos" className="mt-4 grid gap-2">
          {results.map((item) => {
            const Icon = ADMIN_NAV_ICONS[item.icon];
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-16 items-center gap-3 rounded-xl border border-[var(--admin-border)] p-3 hover:bg-[var(--admin-nav-hover)]">
                <Icon className="h-5 w-5 shrink-0 text-[var(--admin-brand)]" aria-hidden />
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.label}</span><span className="block text-xs leading-5 text-[var(--admin-text-muted)]">{item.description}</span></span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            );
          })}
          {!results.length ? <p role="status" className="py-4 text-sm text-[var(--admin-text-muted)]">No encontramos esa opción. Prueba con inventario, subastas o solicitudes.</p> : null}
        </nav>
      </AdminModal>
    </>
  );
}
