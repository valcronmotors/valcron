import Link from "next/link";
import { AdminCopartAddButton } from "@/components/admin/AdminCopartAddButton";
import { AuctionBadge } from "@/components/admin/AdminBadges";
import { CopartPhoto } from "@/components/admin/CopartPhoto";
import { AdminNotice, adminFieldClass } from "@/components/admin/ui";
import type { AuctionProviderFacets, AuctionSearchVehicle } from "@/lib/auction-providers/types";
import { formatMoneyPlain } from "@/lib/admin-metrics";

function optionList(values: string[]) {
  return values.filter(Boolean);
}

export function AdminCopartSearch({
  items,
  total,
  page,
  pageSize,
  totalPages,
  facets,
  freshness,
  error,
  filters,
}: {
  items: AuctionSearchVehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: AuctionProviderFacets;
  freshness: { label: string; value: string; stale: boolean; warning: string | null };
  error: string | null;
  filters: {
    q?: string;
    make?: string;
    model?: string;
    yearMin?: string;
    yearMax?: string;
    state?: string;
    title?: string;
    damage?: string;
    run?: string;
    bin?: string;
    mileageMin?: string;
    mileageMax?: string;
  };
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }

  function hrefFor(nextPage: number) {
    const params = new URLSearchParams(query);
    params.set("page", String(nextPage));
    return `/admin/subastas/copart?${params.toString()}`;
  }

  return (
    <div className="grid gap-5">
      <p className="text-sm text-[var(--admin-text-secondary)]">
        {freshness.label}: <span className="font-medium text-[var(--admin-text)]">{freshness.value}</span>
      </p>
      {freshness.warning ? <AdminNotice tone="warning">{freshness.warning}</AdminNotice> : null}
      {error ? <AdminNotice tone="warning">{error}</AdminNotice> : null}

      <form className="grid gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4" method="get">
        <label className="block">
          <span className="sr-only">Buscar inventario Copart</span>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Buscar marca, modelo, VIN o lote"
            className={`${adminFieldClass} mt-0`}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select name="make" defaultValue={filters.make ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Marca">
            <option value="">Marca</option>
            {optionList(facets.makes).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <input
            name="model"
            defaultValue={filters.model}
            placeholder="Modelo"
            className={`${adminFieldClass} mt-0`}
            aria-label="Modelo"
          />
          <input
            name="yearMin"
            defaultValue={filters.yearMin}
            placeholder="Año min"
            inputMode="numeric"
            className={`${adminFieldClass} mt-0`}
            aria-label="Año mínimo"
          />
          <input
            name="yearMax"
            defaultValue={filters.yearMax}
            placeholder="Año max"
            inputMode="numeric"
            className={`${adminFieldClass} mt-0`}
            aria-label="Año máximo"
          />
          <select name="state" defaultValue={filters.state ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Estado">
            <option value="">Ubicación</option>
            {optionList(facets.locationStates).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select name="title" defaultValue={filters.title ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Tipo de título">
            <option value="">Tipo de título</option>
            {optionList(facets.titleTypes).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select name="damage" defaultValue={filters.damage ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Daño principal">
            <option value="">Daño principal</option>
            {optionList(facets.primaryDamages).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select name="run" defaultValue={filters.run ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Condición de marcha">
            <option value="">Condición de marcha</option>
            {optionList(facets.runConditions).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select name="bin" defaultValue={filters.bin ?? ""} className={`${adminFieldClass} mt-0`} aria-label="Buy It Now">
            <option value="">Buy It Now</option>
            <option value="si">Con Buy It Now</option>
            <option value="no">Sin Buy It Now</option>
          </select>
          <input
            name="mileageMin"
            defaultValue={filters.mileageMin}
            placeholder="Millas min"
            inputMode="numeric"
            className={`${adminFieldClass} mt-0`}
            aria-label="Millas mínimas"
          />
          <input
            name="mileageMax"
            defaultValue={filters.mileageMax}
            placeholder="Millas max"
            inputMode="numeric"
            className={`${adminFieldClass} mt-0`}
            aria-label="Millas máximas"
          />
          <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--admin-text)] px-4 text-sm font-medium text-white">
            Buscar inventario Copart
          </button>
        </div>
      </form>

      <p className="text-sm text-[var(--admin-text-muted)]">
        {total} resultados · página {page} de {totalPages} · {pageSize} por página
      </p>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((vehicle) => {
          return (
            <article
              key={vehicle.lotNumber}
              className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]"
            >
              <CopartPhoto
                thumbnailUrl={vehicle.thumbnailUrl}
                imageReference={vehicle.imageReference}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="h-40 w-full object-cover"
              />
              <div className="grid gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium text-[var(--admin-text)]">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                    {vehicle.trim ? ` ${vehicle.trim}` : ""}
                  </h2>
                  <AuctionBadge source="copart" />
                </div>
                <p className="text-xs text-[var(--admin-text-muted)]">Lote {vehicle.lotNumber}</p>
                <dl className="grid grid-cols-2 gap-2 text-xs text-[var(--admin-text-secondary)]">
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Millas</dt>
                    <dd>{vehicle.mileage != null ? vehicle.mileage.toLocaleString("en-US") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Título</dt>
                    <dd>{[vehicle.titleState, vehicle.titleType].filter(Boolean).join(" ") || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Daño</dt>
                    <dd>{vehicle.primaryDamage || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Ubicación</dt>
                    <dd>{vehicle.location || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Marcha</dt>
                    <dd>{vehicle.runCondition || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Buy It Now</dt>
                    <dd>
                      {vehicle.buyItNowPrice
                        ? formatMoneyPlain(vehicle.buyItNowPrice, vehicle.currency === "DOP" ? "DOP" : "USD")
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Subasta</dt>
                    <dd>{vehicle.saleDate || "—"}</dd>
                  </div>
                </dl>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/subastas/copart/${vehicle.lotNumber}`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                  >
                    Ver detalles
                  </Link>
                  {vehicle.sourceUrl ? (
                    <a
                      href={vehicle.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                    >
                      Abrir en Copart
                    </a>
                  ) : null}
                </div>
                <AdminCopartAddButton lotNumber={vehicle.lotNumber} />
              </div>
            </article>
          );
        })}
      </section>

      {items.length === 0 && !error ? (
        <p className="text-sm text-[var(--admin-text-muted)]">No hay lotes Copart para estos filtros.</p>
      ) : null}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className="text-sm font-medium text-[var(--admin-text)]">
              Anterior
            </Link>
          ) : (
            <span />
          )}
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} className="text-sm font-medium text-[var(--admin-text)]">
              Siguiente
            </Link>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </div>
  );
}
