"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
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
    <Section className="section-light scroll-mt-24 bg-[#f5f6f7]" id="buscar" tight>
      <PageContainer>
        <form
          onSubmit={handleSubmit}
          className="border border-[#e4e6ea] bg-white p-5 md:p-7 lg:px-8 lg:py-8"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-[#08090b] md:text-2xl">
            ¿Qué vehículo buscas?
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <label className="block text-sm text-[#676a70]">
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
            <label className="block text-sm text-[#676a70]">
              Modelo
              <select
                value={modelo}
                onChange={(event) => setModelo(event.target.value)}
                className={fieldClass}
              >
                <option value="">Todos</option>
                {modelos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-[#676a70]">
              Año
              <select
                value={ano}
                onChange={(event) => setAno(event.target.value)}
                className={fieldClass}
              >
                <option value="">Todos</option>
                {anos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn-primary mt-1 w-full gap-2 lg:mt-0 lg:min-w-[12rem]">
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
          <Link
            href="/inventario"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
          >
            Ver todo el inventario
          </Link>
        </form>
      </PageContainer>
    </Section>
  );
}
