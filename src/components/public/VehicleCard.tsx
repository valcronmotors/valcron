"use client";

import Link from "next/link";
import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  Images,
  MessageCircle,
  X,
} from "lucide-react";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { monthlyPayment } from "@/lib/public-filters";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";
import { publicListingBadge } from "@/lib/public-status";
import { formatDop, formatUsd } from "@/lib/money";

export function VehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const { formatAmount, formatSecondary } = useDisplayCurrency();
  const photos = vehicle.fotosUrls;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const cover = photos[photoIndex] ?? photos[0];
  const whatsapp = catalogWhatsappHref(vehicle);
  const badge = publicListingBadge(vehicle);
  const title = publicVehicleTitle(vehicle);

  function handlePhotoMove(event: MouseEvent<HTMLDivElement>) {
    if (photos.length < 2) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const next = Math.min(photos.length - 1, Math.max(0, Math.floor(ratio * photos.length)));
    setPhotoIndex(next);
  }

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_40px_rgba(11,12,16,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_22px_60px_rgba(11,12,16,0.12)]">
        <div
          className="relative aspect-[16/10] overflow-hidden bg-surface-2"
          onMouseMove={handlePhotoMove}
          onMouseLeave={() => setPhotoIndex(0)}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-muted">
              Imagen por confirmar
            </span>
          )}

          <span
            className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
            <div className="pointer-events-auto flex flex-col gap-2 px-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm"
              >
                <Images className="h-3.5 w-3.5 text-blue-500" />
                Ver Galería
              </button>
              <button
                type="button"
                onClick={() => setQuotaOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm"
              >
                <Calculator className="h-3.5 w-3.5 text-purple-500" />
                Calculadora de Cuota
              </button>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Consultar
                </a>
              ) : null}
            </div>
          </div>

          {photos.length > 1 ? (
            <div className="absolute inset-x-3 bottom-3 flex gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
              {photos.slice(0, 5).map((src, thumbIndex) => (
                <button
                  key={src}
                  type="button"
                  onMouseEnter={() => setPhotoIndex(thumbIndex)}
                  className={`h-10 flex-1 overflow-hidden rounded-md border ${
                    photoIndex === thumbIndex
                      ? "border-white"
                      : "border-white/40 opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
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
              <dd className="mt-1 text-foreground">
                {vehicle.listingKind === "auction" ? "Subasta USA" : "Santo Domingo"}
              </dd>
            </div>
          </dl>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {formatAmount(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {formatSecondary(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
            </p>
          </div>
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp mt-auto w-full">
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>
      </article>

      <AnimatePresence>
        {galleryOpen ? (
          <Overlay onClose={() => setGalleryOpen(false)}>
            <h3 className="font-display text-2xl text-foreground">{title}</h3>
            <div className="mt-4 overflow-hidden rounded-2xl bg-surface-2">
              {photos[photoIndex] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[photoIndex]}
                  alt={title}
                  className="max-h-[60vh] w-full object-contain"
                />
              ) : null}
            </div>
            {photos.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {photos.map((src, thumbIndex) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setPhotoIndex(thumbIndex)}
                    className={`overflow-hidden rounded-lg border ${
                      photoIndex === thumbIndex ? "border-accent" : "border-line"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </Overlay>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {quotaOpen ? (
          <QuotaDialog vehicle={vehicle} onClose={() => setQuotaOpen(false)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function QuotaDialog({
  vehicle,
  onClose,
}: {
  vehicle: PublicVehicle;
  onClose: () => void;
}) {
  const [downPct, setDownPct] = useState(20);
  const [plazo, setPlazo] = useState(48);
  const amount = vehicle.precioVentaUsd;
  const down = Math.round(amount * (downPct / 100));
  const financed = Math.max(amount - down, 0);
  const cuota = monthlyPayment(financed, plazo);
  const cuotaDop = cuota * vehicle.tasaUsdDop;
  const whatsapp = catalogWhatsappHref(vehicle);

  return (
    <Overlay onClose={onClose}>
      <p className="kicker">Calculadora de cuota</p>
      <h3 className="mt-2 font-display text-2xl text-foreground">
        {publicVehicleTitle(vehicle)}
      </h3>
      <label className="mt-6 block text-sm text-muted">
        Inicial {downPct}% · {formatUsd(down)}
        <input
          type="range"
          min={20}
          max={60}
          value={downPct}
          onChange={(event) => setDownPct(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <label className="mt-5 block text-sm text-muted">
        Plazo {plazo} meses
        <input
          type="range"
          min={24}
          max={72}
          step={12}
          value={plazo}
          onChange={(event) => setPlazo(Number(event.target.value))}
          className="luxury-range mt-4 w-full"
        />
      </label>
      <div className="mt-6 grid gap-3 rounded-2xl border border-accent/30 bg-surface p-4 sm:grid-cols-2">
        <div>
          <p className="kicker">Cuota USD</p>
          <p className="mt-1 font-display text-2xl text-foreground">{formatUsd(cuota)}</p>
        </div>
        <div>
          <p className="kicker">Cuota DOP</p>
          <p className="mt-1 font-display text-2xl text-accent">{formatDop(cuotaDop)}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/financiamiento?monto=${Math.round(amount)}`} className="btn-primary">
          Ir a financiamiento
        </Link>
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
            Consultar por WhatsApp
          </a>
        ) : null}
      </div>
    </Overlay>
  );
}
