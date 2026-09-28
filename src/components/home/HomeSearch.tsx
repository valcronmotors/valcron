"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { uniqueAnos, uniqueMarcas, uniqueModelos, inventorySearchHref } from "@/lib/public-filters";
import type { PublicVehicle } from "@/lib/public-catalog";

const fieldClass = "field-input mt-1.5";

export function HomeSearch({ vehicles = [] }: { vehicles?: PublicVehicle[] }) {
  const router = useRouter();
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");

  const marcas = useMemo(() => uniqueMarcas(vehicles), [vehicles]);
  const modelos = useMemo(() => uniqueModelos(vehicles, marca), [marca, vehicles]);
  const anos = useMemo(() => uniqueAnos(vehicles), [vehicles]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    router.push(inventorySearchHref({ marca, modelo, ano }));
  }

  return (
    <section id="buscar" className="section-light relative z-10 -mt-6 scroll-mt-24 px-4 pb-4 md:-mt-10 md:px-8 md:pb-6">
      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e6e2db] bg-white p-4 shadow-[0_12px_32px_rgba(20,20,20,0.08)] md:p-6">
          <p className="text-sm font-semibold text-[#141414]">Buscar vehículo</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-sm text-[#5c5c5c]">
              Marca
              <select
                value={marca}
                onChange={(event) => {
                  setMarca(event.target.value);
                  setModelo("");
                }}
                className={fieldClass}
              >
                <option value="">Todas</option>
                {marcas.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-[#5c5c5c]">
              Modelo
              <select value={modelo} onChange={(event) => setModelo(event.target.value)} className={fieldClass}>
                <option value="">Todos</option>
                {modelos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-[#5c5c5c]">
              Año
              <select value={ano} onChange={(event) => setAno(event.target.value)} className={fieldClass}>
                <option value="">Todos</option>
                {anos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button type="submit" className="btn-primary h-12 w-full gap-2">
                <Search className="h-4 w-4" />
                Buscar vehículos
              </button>
            </div>
          </div>
          <Link href="/inventario" className="mt-3 inline-block min-h-11 text-sm font-medium text-[#141414] underline-offset-4 hover:underline">
            Ver todos
          </Link>
        </form>
      </div>
    </section>
  );
}
