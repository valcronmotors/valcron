"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Company } from "@/lib/companies";

type CompanySelectorProps = {
  companies: Pick<Company, "slug" | "nombre">[];
  selectedSlug: string;
};

export function CompanySelector({
  companies,
  selectedSlug,
}: CompanySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectCompany(slug: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === "todas") {
      params.delete("empresa");
    } else {
      params.set("empresa", slug);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-white">Empresa activa</p>
        <p className="mt-1 text-xs text-slate-400">
          Filtra las tarjetas y el inventario por razón social.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="empresa-select">
          Seleccionar empresa
        </label>
        <select
          id="empresa-select"
          className="h-10 min-w-64 rounded-xl border border-white/10 bg-[#0b1a2b] px-3 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
          value={selectedSlug}
          onChange={(event) => selectCompany(event.target.value)}
        >
          <option value="todas">Todas las empresas</option>
          {companies.map((company) => (
            <option key={company.slug} value={company.slug}>
              {company.nombre}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCompany("todas")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              selectedSlug === "todas"
                ? "bg-cyan-400 text-slate-950"
                : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
            }`}
          >
            Todas
          </button>
          {companies.map((company) => (
            <button
              key={company.slug}
              type="button"
              onClick={() => selectCompany(company.slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                selectedSlug === company.slug
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              {company.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
