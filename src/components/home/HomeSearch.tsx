"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  PRICE_RANGES,
  inventorySearchHref,
  uniqueAnos,
  uniqueMarcas,
  uniqueModelos,
} from "@/lib/public-filters";
import type { PublicVehicle } from "@/lib/public-catalog";

const fieldClass = "field-input mt-1.5";

export function HomeSearch({ vehicles }: { vehicles: PublicVehicle[] }) {
  const router = useRouter();
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [price, setPrice] = useState("");

  const marcas = useMemo(() => uniqueMarcas(vehicles), [vehicles]);
  const modelos = useMemo(() => uniqueModelos(vehicles, marca), [marca, vehicles]);
  const anos = useMemo(() => uniqueAnos(vehicles), [vehicles]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    router.push(inventorySearchHref({ marca, modelo, ano, price }));
  }

  return (
    <section className="section-light relative z-10 -mt-20 px-5 pb-6 lg:-mt-24 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-7xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.35rem] border border-[#ececea] bg-[#faf9f6] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] md:p-7"
        >
          <p className="kicker">Encuentra tu próximo vehículo</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="block text-xs uppercase tracking-[0.16em] text-[#737373]">
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
            <label className="block text-xs uppercase tracking-[0.16em] text-[#737373]">
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
            <label className="block text-xs uppercase tracking-[0.16em] text-[#737373]">
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
            <label className="block text-xs uppercase tracking-[0.16em] text-[#737373]">
              Precio máximo
              <select value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass}>
                {PRICE_RANGES.map((range) => (
                  <option key={range.value || "any"} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </button>
            </div>
          </div>
          <Link
            href="/inventario"
            className="mt-4 inline-block text-sm text-[#525252] underline-offset-4 hover:text-[#111] hover:underline"
          >
            Ver inventario completo
          </Link>
        </form>
      </div>
    </section>
  );
}
