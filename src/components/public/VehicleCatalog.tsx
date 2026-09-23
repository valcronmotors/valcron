"use client";

import { useEffect, useMemo, useState } from "react";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { VehicleCard } from "@/components/public/VehicleCard";
import {
  catalogMake,
  catalogModel,
  catalogUsdPrice,
  catalogYear,
  uniqueAnos,
  uniqueMarcas,
  uniqueModelos,
} from "@/lib/public-filters";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

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
}: {
  initialFilters: CatalogFilters;
  initialVehicles?: PublicVehicle[];
  initialError?: string | null;
}) {
  const [vehicles, setVehicles] = useState<PublicVehicle[]>(initialVehicles);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(initialVehicles.length === 0 && !initialError);
  const [listing, setListing] = useState(initialFilters.listing);
  const [marca, setMarca] = useState(initialFilters.marca);
  const [modelo, setModelo] = useState(initialFilters.modelo);
  const [ano, setAno] = useState(initialFilters.ano);
  const [precioMin, setPrecioMin] = useState(initialFilters.precioMin);
  const [precioMax, setPrecioMax] = useState(initialFilters.precioMax);
  const [search, setSearch] = useState(initialFilters.search);

  useEffect(() => {
    let cancelled = false;

    async function load(showSpinner: boolean) {
      if (showSpinner) {
        setLoading(true);
      }
      try {
        const response = await fetch("/api/public/vehicles", { cache: "no-store" });
        const payload = (await response.json()) as {
          data?: PublicVehicle[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudo cargar el inventario.");
        }
        if (!cancelled) {
          setVehicles(payload.data ?? []);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo sincronizar el catálogo.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load(initialVehicles.length === 0);

    const supabase = createClient();
    const channel = supabase
      .channel("inventario-vehiculos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehiculos" },
        () => {
          void load(false);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [initialVehicles.length]);

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

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const minUsd = Number(precioMin);
    const maxUsd = Number(precioMax);

    return vehicles.filter((vehicle) => {
      if (listing === "dealer" && vehicle.listingKind !== "dealer") {
        return false;
      }
      if (listing === "auction" && vehicle.listingKind !== "auction") {
        return false;
      }
      if (marca && catalogMake(vehicle) !== marca) {
        return false;
      }
      if (modelo && catalogModel(vehicle) !== modelo) {
        return false;
      }
      if (ano && String(catalogYear(vehicle)) !== ano) {
        return false;
      }
      const usdPrice = catalogUsdPrice(vehicle);
      if (Number.isFinite(minUsd) && minUsd > 0 && usdPrice < minUsd) {
        return false;
      }
      if (Number.isFinite(maxUsd) && maxUsd > 0 && usdPrice > maxUsd) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [
        catalogMake(vehicle),
        catalogModel(vehicle),
        vehicle.trim ?? "",
        vehicle.vin ?? "",
        String(catalogYear(vehicle)),
        vehicle.location ?? vehicle.ubicacion ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [ano, listing, marca, modelo, precioMax, precioMin, search, vehicles]);

  return (
    <div className="grid min-w-0 gap-8">
      {error ? (
        <p className="rounded-2xl border border-[#ececea] bg-white px-5 py-4 text-sm text-[#525252]">{error}</p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#525252]">
          {loading
            ? "Cargando inventario..."
            : `${visible.length} unidad${visible.length === 1 ? "" : "es"}`}
        </p>
        <CurrencySwitch tone="light" />
      </div>

      <div className="grid min-w-0 gap-4 rounded-[1.15rem] border border-[#ececea] bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] md:grid-cols-2 xl:grid-cols-3">
        <label className="block min-w-0 text-sm text-[#525252] md:col-span-2 xl:col-span-3">
          Búsqueda por palabra clave o VIN
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Marca, modelo o VIN de 17 caracteres"
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0 text-sm text-[#525252]">
          Tipo de listado
          <select
            value={listing}
            onChange={(event) => setListing(event.target.value)}
            className={fieldClass}
          >
            <option value="">Todos</option>
            <option value="dealer">Disponible en RD</option>
            <option value="auction">En subasta / importación</option>
          </select>
        </label>
        <label className="block min-w-0 text-sm text-[#525252]">
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
        <label className="block min-w-0 text-sm text-[#525252]">
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
        <label className="block min-w-0 text-sm text-[#525252]">
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
        <label className="block min-w-0 text-sm text-[#525252]">
          Precio mínimo (USD)
          <input
            type="number"
            min={0}
            value={precioMin}
            onChange={(event) => setPrecioMin(event.target.value)}
            placeholder="0"
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0 text-sm text-[#525252]">
          Precio máximo (USD)
          <input
            type="number"
            min={0}
            value={precioMax}
            onChange={(event) => setPrecioMax(event.target.value)}
            placeholder="Sin límite"
            className={fieldClass}
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setListing("");
              setMarca("");
              setModelo("");
              setAno("");
              setPrecioMin("");
              setPrecioMax("");
              setSearch("");
            }}
            className="h-11 w-full rounded-lg border border-[#ececea] text-sm text-[#111] transition hover:border-[#111]"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading ? (
        <p className="rounded-[1.15rem] border border-[#ececea] bg-white px-6 py-12 text-center text-sm text-[#525252]">
          Cargando inventario...
        </p>
      ) : visible.length === 0 ? (
        <InventoryEmptyState
          tone="light"
          title="Sin coincidencias"
          copy="Ajusta los filtros o escríbenos por WhatsApp. Te ayudamos a encontrar el vehículo que buscas."
        />
      ) : (
        <div className="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
          ))}
        </div>
      )}
    </div>
  );
}
