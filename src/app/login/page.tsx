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
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#F8F9FA] px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,12,16,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,12,16,0.035)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(248,249,250,0.72)_48%,rgba(243,244,246,0.9)_100%)]"
      />

      <div className="relative w-full max-w-[440px] rounded-2xl border border-[#E5E7EB] bg-white px-8 py-10 shadow-2xl sm:px-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="header" tone="onLight" />
          <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-[#0B0C10] sm:text-[1.7rem]">
            Acceso Administrativo
          </h1>
          <p className="mt-2 max-w-sm text-sm font-normal leading-relaxed text-gray-500">
            Gestión del inventario y contenido del website.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm next={next} />
        </div>

        <p className="mt-8 text-center text-[11px] font-normal leading-relaxed tracking-wide text-gray-400">
          Acceso restringido únicamente para personal autorizado de {SITE.name}.
          Conexión cifrada de extremo a extremo.
        </p>
      </div>

      <Link
        href="/"
        className="relative mt-8 text-sm font-medium text-gray-500 transition hover:text-[#0B0C10]"
      >
        ← Volver al sitio web principal
      </Link>
    </main>
  );
}
