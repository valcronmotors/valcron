import { formatDop, formatUsd } from "@/lib/money";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";

export function VehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const cover = vehicle.fotosUrls[0];
  const whatsapp = catalogWhatsappHref(vehicle);
  const locationBadge = vehicle.listingKind === "auction" ? "Subasta USA" : "Santo Domingo";
  const inspectionBadge =
    vehicle.listingKind === "auction" ? "CARFAX · Inspección" : "Inspección certificada";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_40px_rgba(11,12,16,0.05)] transition hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(11,12,16,0.08)]">
      <div className="relative aspect-[16/10] bg-surface-2">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={publicVehicleTitle(vehicle)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-muted">
            Imagen por confirmar
          </span>
        )}
        <span className="badge-status absolute left-4 top-4">{locationBadge}</span>
        <span className="kicker absolute right-4 top-4 rounded-full bg-foreground/82 px-3 py-1 text-white!">
          {inspectionBadge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <p className="kicker">{vehicle.marca}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
            {vehicle.modelo} {vehicle.ano}
          </h3>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Marca</dt>
            <dd className="mt-1 text-foreground">{vehicle.marca}</dd>
          </div>
          <div>
            <dt className="text-muted">Modelo</dt>
            <dd className="mt-1 text-foreground">{vehicle.modelo}</dd>
          </div>
          <div>
            <dt className="text-muted">Año</dt>
            <dd className="mt-1 text-foreground">{vehicle.ano}</dd>
          </div>
          <div>
            <dt className="text-muted">Ubicación</dt>
            <dd className="mt-1 text-foreground">{locationBadge}</dd>
          </div>
        </dl>
        <div>
          <p className="text-lg font-semibold text-foreground">{formatUsd(vehicle.precioVentaUsd)}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{formatDop(vehicle.precioVentaDop)}</p>
        </div>
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp mt-auto w-full">
            Consultar por WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}
