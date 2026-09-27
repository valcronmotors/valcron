import Link from "next/link";

export function AdminAuctionTabs({
  active,
}: {
  active: "opportunities" | "copart";
}) {
  const items = [
    { id: "opportunities" as const, href: "/admin/subastas", label: "Oportunidades" },
    { id: "copart" as const, href: "/admin/subastas/copart", label: "Inventario Copart" },
  ];

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Secciones de subasta">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition ${
            active === item.id
              ? "bg-[var(--admin-text)] text-white"
              : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
