import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/public/BrandLogo";
import { SITE, safeNextPath } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso Administrativo",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  return (
    <div className="flex h-full min-h-full flex-1 flex-col bg-footer text-white">
      <header className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="inline-flex" aria-label={SITE.name}>
          <BrandLogo size="header" tone="onDark" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
        <p className="kicker text-accent!">
          Acceso Administrativo
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">Iniciar sesión</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          El panel de {SITE.name} requiere autenticación activa de Supabase Auth.
        </p>
        <div className="mt-8 border border-white/10 bg-graphite p-6">
          <LoginForm next={next} />
        </div>
      </main>
    </div>
  );
}
