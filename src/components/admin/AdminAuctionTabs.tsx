import Link from "next/link";

export function AdminAuctionTabs({
  active,
}: {
  active: "opportunities" | "copart";
}) {
  const items = [{ id: "opportunities" as const, href: "/admin/subastas", label: "Oportunidades" }];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium ${
            active === item.id || item.id === "opportunities"
              ? "bg-[var(--admin-text)] text-white"
              : "border border-[var(--admin-border)] text-[var(--admin-text-secondary)]"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
