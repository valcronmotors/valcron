import { formatDop, formatUsd } from "@/lib/money";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";

export function VehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const cover = vehicle.fotosUrls[0];
  const whatsapp = catalogWhatsappHref(vehicle);
  const badge =
    vehicle.listingKind === "auction" ? "Importación por encargo" : "Stock en RD";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12141C]/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-[#D4AF37]/50">
      <div className="relative aspect-[16/10] bg-[#0B0C10]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={publicVehicleTitle(vehicle)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-[#8A909A]">
            Imagen por confirmar
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[#FF5500] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
            {vehicle.marca}
          </p>
          <h3 className="mt-1 font-display text-2xl text-[#F4F5F7]">
            {vehicle.modelo} {vehicle.ano}
          </h3>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[#8A909A]">Marca</dt>
            <dd className="text-[#F4F5F7]">{vehicle.marca}</dd>
          </div>
          <div>
            <dt className="text-[#8A909A]">Modelo</dt>
            <dd className="text-[#F4F5F7]">{vehicle.modelo}</dd>
          </div>
          <div>
            <dt className="text-[#8A909A]">Año</dt>
            <dd className="text-[#F4F5F7]">{vehicle.ano}</dd>
          </div>
          <div>
            <dt className="text-[#8A909A]">Ubicación</dt>
            <dd className="text-[#F4F5F7]">{vehicle.ubicacion}</dd>
          </div>
        </dl>
        <div>
          <p className="text-xl font-semibold text-[#FFD700]">{formatUsd(vehicle.precioVentaUsd)}</p>
          <p className="mt-1 text-sm text-[#8A909A]">{formatDop(vehicle.precioVentaDop)}</p>
        </div>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-[#FF5500] px-4 text-sm font-semibold text-white transition hover:bg-[#ff6a1a]"
          >
            Consultar por WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}
