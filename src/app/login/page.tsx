import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/public/BrandLogo";
import { SITE, safeNextPath } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso Administrativo",
  description: "Acceso al CMS del website de Valcron Motors.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  return (
    <main className="admin-console relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden bg-[var(--admin-bg)] px-5 py-16">
      <div className="relative w-full max-w-[420px] rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-8 py-10 shadow-[var(--admin-shadow)] sm:px-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="header" tone="onLight" />
          <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
            Website Admin
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--admin-text-secondary)]">
            Gestión del inventario y la presencia digital de Valcron Motors.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm next={next} />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-[var(--admin-text-muted)]">
          Acceso restringido para personal autorizado de {SITE.name}.
        </p>
      </div>

      <Link
        href="/"
        className="relative mt-8 text-sm font-medium text-[var(--admin-text-secondary)] transition hover:text-[var(--admin-text)]"
      >
        ← Volver al sitio web
      </Link>
    </main>
  );
}
