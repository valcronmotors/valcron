"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { VehicleCard } from "@/components/public/VehicleCard";
import {
  catalogQueryString,
  filterCatalogVehicles,
  uniqueAnos,
  uniqueMarcas,
  uniqueModelos,
} from "@/lib/public-filters";
import { PUBLIC_INVENTORY_EMPTY, PUBLIC_INVENTORY_FILTER_EMPTY } from "@/lib/admin-copy";
import type { PublicVehicle } from "@/lib/public-catalog";

const fieldClass = "field-input";

export type CatalogFilters = {
  listing: string;
  marca: string;
  modelo: string;
  ano: string;
  precioMin: string;
  precioMax: string;
  search: string;
};

export function VehicleCatalog({
  initialFilters,
  initialVehicles = [],
  initialError = null,
  catalogKind = "local",
  basePath = "/inventario",
}: {
  initialFilters: CatalogFilters;
  initialVehicles?: PublicVehicle[];
  initialError?: string | null;
  /** Locks catalog boundary — never mixes local stock with auction opportunities. */
  catalogKind?: "local" | "auction";
  basePath?: "/inventario" | "/subastas";
}) {
  const router = useRouter();
  const vehicles = initialVehicles;
  const error = initialError;
  const listing = catalogKind === "auction" ? "auction" : "dealer";
  const [marca, setMarca] = useState(initialFilters.marca);
  const [modelo, setModelo] = useState(initialFilters.modelo);
  const [ano, setAno] = useState(initialFilters.ano);
  const [precioMin, setPrecioMin] = useState(initialFilters.precioMin);
  const [precioMax, setPrecioMax] = useState(initialFilters.precioMax);
  const [search, setSearch] = useState(initialFilters.search);
  const [sort, setSort] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const marcas = useMemo(() => {
    const values = new Set(uniqueMarcas(vehicles));
    if (marca) values.add(marca);
    return [...values].sort();
  }, [marca, vehicles]);
  const modelos = useMemo(() => uniqueModelos(vehicles, marca || undefined), [marca, vehicles]);
  const anos = useMemo(() => {
    const values = new Set(uniqueAnos(vehicles));
    const selected = Number(ano);
    if (Number.isFinite(selected) && selected > 0) values.add(selected);
    return [...values].sort((a, b) => b - a);
  }, [ano, vehicles]);

  const visible = useMemo(
    () =>
      filterCatalogVehicles(
        vehicles,
        { listing, marca, modelo, ano, precioMin, precioMax, search },
        sort,
      ),
    [ano, listing, marca, modelo, precioMax, precioMin, search, sort, vehicles],
  );

  useEffect(() => {
    const qs = catalogQueryString({
      listing: "",
      marca,
      modelo,
      ano,
      precioMin,
      precioMax,
      search,
    });
    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }, [ano, basePath, marca, modelo, precioMax, precioMin, router, search]);

  function clearFilters() {
    setMarca("");
    setModelo("");
    setAno("");
    setPrecioMin("");
    setPrecioMax("");
    setSearch("");
  }

  const chips = [
    marca ? { key: "marca", label: marca } : null,
    modelo ? { key: "modelo", label: modelo } : null,
    ano ? { key: "ano", label: ano } : null,
    search ? { key: "search", label: search } : null,
    precioMin ? { key: "precioMin", label: `Desde US$ ${precioMin}` } : null,
    precioMax ? { key: "precioMax", label: `Hasta US$ ${precioMax}` } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  const filters = (
    <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="hidden min-w-0 text-sm text-[#5c5c5c] lg:block lg:col-span-2 xl:col-span-4">
        Buscar
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Marca, modelo o VIN"
          className={fieldClass}
          inputMode="search"
        />
      </label>
      <label className="block min-w-0 text-sm text-[#5c5c5c]">
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
      <label className="block min-w-0 text-sm text-[#5c5c5c]">
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
      <label className="block min-w-0 text-sm text-[#5c5c5c]">
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
      <label className="block min-w-0 text-sm text-[#5c5c5c]">
        Precio mínimo (USD)
        <input type="number" min={0} inputMode="numeric" value={precioMin} onChange={(event) => setPrecioMin(event.target.value)} className={fieldClass} />
      </label>
      <label className="block min-w-0 text-sm text-[#5c5c5c]">
        Precio máximo (USD)
        <input type="number" min={0} inputMode="numeric" value={precioMax} onChange={(event) => setPrecioMax(event.target.value)} className={fieldClass} />
      </label>
      <div className="flex items-end">
        <button type="button" onClick={clearFilters} className="h-12 w-full rounded-full border border-[#e4e6ea] text-sm font-medium text-[#08090b]">
          Limpiar filtros
        </button>
      </div>
    </div>
  );

  const emptyCatalog = vehicles.length === 0 || Boolean(error);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;
    const root = sheetRef.current;
    if (!root) return;
    const focusables = [...root.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")].filter(
      (node) => !node.hasAttribute("disabled"),
    );
    focusables[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="hidden lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">
          {catalogKind === "auction" ? "Oportunidades" : "Todos los modelos"}
        </p>
        <nav className="mt-4 grid" aria-label="Filtrar por marca">
          <button
            type="button"
            className={`border-l-2 py-2 pl-3 text-left text-sm transition-colors ${
              !marca ? "border-[#08090b] font-semibold text-[#08090b]" : "border-transparent text-[#58595b] hover:text-[#08090b]"
            }`}
            onClick={() => {
              setMarca("");
              setModelo("");
            }}
          >
            Todos
          </button>
          {marcas.map((option) => (
            <button
              type="button"
              key={option}
              className={`border-l-2 py-2 pl-3 text-left text-sm transition-colors ${
                marca === option
                  ? "border-[#08090b] font-semibold text-[#08090b]"
                  : "border-transparent text-[#58595b] hover:text-[#08090b]"
              }`}
              onClick={() => {
                setMarca(option);
                setModelo("");
              }}
            >
              {option}
            </button>
          ))}
        </nav>
      </aside>

      <div className="grid min-w-0 gap-4">
      <div className="grid gap-3">
        <p className="text-sm font-medium text-[#676a70]">
          {visible.length === 1 ? "1 vehículo" : `${visible.length} vehículos`}
        </p>
        <label className="block text-sm text-[#676a70] lg:hidden">
          Buscar
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Marca, modelo o VIN"
            className={fieldClass}
            inputMode="search"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#e4e6ea] bg-white px-4 text-sm font-medium lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-12 rounded-full border border-[#e4e6ea] bg-white px-4 text-sm"
            aria-label="Ordenar"
          >
            <option value="recent">Más recientes</option>
            <option value="year">Año</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <div className="hidden lg:block">
            <CurrencySwitch tone="light" />
          </div>
        </div>
      </div>

      {chips.length ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              type="button"
              key={`${chip.key}-${chip.label}`}
              className="inline-flex min-h-11 items-center rounded-full border border-[#e4e6ea] px-3 text-xs text-[#0b0c0e]"
              onClick={() => {
                if (chip.key === "marca") {
                  setMarca("");
                  setModelo("");
                }
                if (chip.key === "modelo") setModelo("");
                if (chip.key === "ano") setAno("");
                if (chip.key === "search") setSearch("");
                if (chip.key === "precioMin") setPrecioMin("");
                if (chip.key === "precioMax") setPrecioMax("");
              }}
            >
              {chip.label} ×
            </button>
          ))}
        </div>
      ) : null}

      <div className="hidden border-y border-[#e5e5e5] bg-white py-5 lg:block">{filters}</div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Cerrar filtros" onClick={() => setFiltersOpen(false)} />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Filtros</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar" className="inline-flex h-11 w-11 items-center justify-center">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
            <button type="button" className="btn-primary mt-4 h-12 w-full" onClick={() => setFiltersOpen(false)}>
              Ver resultados
            </button>
          </div>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <InventoryEmptyState
          tone="light"
          title={emptyCatalog ? PUBLIC_INVENTORY_EMPTY.title : PUBLIC_INVENTORY_FILTER_EMPTY.title}
          copy={emptyCatalog ? PUBLIC_INVENTORY_EMPTY.copy : PUBLIC_INVENTORY_FILTER_EMPTY.copy}
          showRequest={emptyCatalog}
          onClear={emptyCatalog ? undefined : clearFilters}
        />
      ) : (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              tone="light"
              actionLabel={catalogKind === "auction" ? "Ver oportunidad" : "Ver detalles"}
            />
          ))}
        </div>
      )}
      {catalogKind === "local" ? (
        <p className="text-center text-sm text-[#676a70]">
          ¿Buscas opciones en subasta?{" "}
          <Link href="/subastas" className="font-semibold text-[#2b6cff]">
            Explorar oportunidades
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-[#676a70]">
          ¿Prefieres inventario local?{" "}
          <Link href="/inventario" className="font-semibold text-[#2b6cff]">
            Ver Inventario Valcron
          </Link>
        </p>
      )}
      </div>
    </div>
  );
}
