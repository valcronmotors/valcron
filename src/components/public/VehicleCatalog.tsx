"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { VehicleCard } from "@/components/public/VehicleCard";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

const fieldClass = "field-input";

export function VehicleCatalog() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(searchParams.get("listing") ?? "");
  const [marca, setMarca] = useState(searchParams.get("marca") ?? "");
  const [ano, setAno] = useState(searchParams.get("ano") ?? "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
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

    void load();

    const supabase = createClient();
    const channel = supabase
      .channel("inventario-vehiculos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehiculos" },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setListing(searchParams.get("listing") ?? "");
    setMarca(searchParams.get("marca") ?? "");
    setAno(searchParams.get("ano") ?? "");
    setPrecioMin(searchParams.get("precioMin") ?? "");
    setPrecioMax(searchParams.get("precioMax") ?? "");
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const marcas = useMemo(() => {
    const values = new Set(vehicles.map((vehicle) => vehicle.marca));
    if (marca) {
      values.add(marca);
    }
    return [...values].sort();
  }, [marca, vehicles]);
  const anos = useMemo(() => {
    const values = new Set(vehicles.map((vehicle) => vehicle.ano));
    if (ano) {
      values.add(Number(ano));
    }
    return [...values].filter((value) => Number.isFinite(value)).sort((a, b) => b - a);
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
      if (marca && vehicle.marca !== marca) {
        return false;
      }
      if (ano && String(vehicle.ano) !== ano) {
        return false;
      }
      if (Number.isFinite(minUsd) && minUsd > 0 && vehicle.precioVentaUsd < minUsd) {
        return false;
      }
      if (Number.isFinite(maxUsd) && maxUsd > 0 && vehicle.precioVentaUsd > maxUsd) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [vehicle.marca, vehicle.modelo, vehicle.trim ?? "", vehicle.vin, String(vehicle.ano)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [ano, listing, marca, precioMax, precioMin, search, vehicles]);

  return (
    <div className="grid gap-8">
      {error ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-4 text-sm text-muted">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="block text-sm text-muted md:col-span-2 xl:col-span-3">
          Búsqueda por palabra clave o VIN
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Marca, modelo o VIN de 17 caracteres"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-muted">
          Estado
          <select
            value={listing}
            onChange={(event) => setListing(event.target.value)}
            className={fieldClass}
          >
            <option value="">Todos</option>
            <option value="dealer">Disponible en RD</option>
            <option value="auction">En Subasta Copart / Manheim</option>
          </select>
        </label>
        <label className="block text-sm text-muted">
          Marca
          <select value={marca} onChange={(event) => setMarca(event.target.value)} className={fieldClass}>
            <option value="">Todas</option>
            {marcas.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-muted">
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
        <label className="block text-sm text-muted">
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
        <label className="block text-sm text-muted">
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
              setAno("");
              setPrecioMin("");
              setPrecioMax("");
              setSearch("");
            }}
            className="h-11 w-full rounded-lg border border-line text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <p className="text-sm text-muted">
        {loading ? "Sincronizando inventario..." : `${visible.length} unidad${visible.length === 1 ? "" : "es"}`}
      </p>

      {loading ? (
        <p className="rounded-2xl border border-line px-6 py-12 text-center text-sm text-muted">
          Sincronizando inventario...
        </p>
      ) : visible.length === 0 ? (
        <InventoryEmptyState
          title="Sin coincidencias"
          copy="Ajusta los filtros o escríbenos por WhatsApp para localizar o importar la unidad que buscas."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
