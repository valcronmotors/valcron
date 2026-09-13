import { LoginForm } from "@/components/auth/LoginForm";
import { PublicShell } from "@/components/public/SiteChrome";
import { SITE, safeNextPath } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso ERP/CRM",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  return (
    <PublicShell>
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            Acceso interno
          </p>
          <h1 className="mt-3 font-display text-4xl text-[#F4F5F7]">Iniciar sesión</h1>
          <p className="mt-3 text-sm leading-7 text-[#8A909A]">
            El ERP/CRM de {SITE.name} requiere correo y contraseña de Supabase Auth.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[#12141C]/80 p-6 backdrop-blur-xl">
          <LoginForm next={next} />
        </div>
      </main>
    </PublicShell>
  );
}
