"use client";

import { useMemo, useRef, useState } from "react";
import { FormError } from "@/components/form-fields";
import { isWorkshopPhoto } from "@/lib/storage";
import {
  removeStoredPhoto,
  uploadVehiclePhotos,
} from "@/lib/vehicle-photos";

export function VehicleGallery({
  urls,
  onChange,
  vehicleId,
  allowUpload = true,
  compact = false,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  vehicleId?: string;
  allowUpload?: boolean;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const draftId = useRef(crypto.randomUUID());
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photos = useMemo(
    () => urls.filter((url) => /^https?:\/\//i.test(url)),
    [urls],
  );
  const clampedIndex = photos.length === 0 ? 0 : Math.min(index, photos.length - 1);
  if (index !== clampedIndex) {
    setIndex(clampedIndex);
  }
  const current = photos[clampedIndex] ?? null;
  const auctionCount = photos.filter((url) => !isWorkshopPhoto(url)).length;
  const workshopCount = photos.length - auctionCount;

  function goTo(next: number) {
    if (photos.length === 0) {
      return;
    }
    setIndex((next + photos.length) % photos.length);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setError(null);
    setUploading(true);
    const result = await uploadVehiclePhotos(Array.from(fileList), {
      vehicleId,
      draftId: draftId.current,
      currentCount: photos.length,
    });
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (result.error) {
      setError(result.error);
    }
    if (result.urls.length > 0) {
      const next = [...photos, ...result.urls];
      onChange(next);
      setIndex(next.length - 1);
    }
  }

  async function handleRemove(url: string) {
    setError(null);
    const next = photos.filter((item) => item !== url);
    onChange(next);
    await removeStoredPhoto(url);
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Galería de fotos
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {photos.length === 0
              ? "Sin fotos todavía. Extrae un lote o sube fotos del taller."
              : `${photos.length} fotos · ${auctionCount} de subasta · ${workshopCount} del taller`}
          </p>
        </div>
        {allowUpload ? (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(event) => void handleFiles(event.target.files)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-60"
            >
              {uploading ? "Subiendo..." : "Subir fotos del taller"}
            </button>
          </div>
        ) : null}
      </div>

      <FormError message={error} />

      {current ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="relative">
            <img
              src={current}
              alt={`Foto ${clampedIndex + 1} del vehículo`}
              className={`w-full object-cover ${compact ? "h-56" : "h-80 sm:h-[28rem]"}`}
            />
            <span className="absolute left-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/10">
              {isWorkshopPhoto(current) ? "Taller" : "Subasta"}
            </span>
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => goTo(clampedIndex - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 px-3 py-2 text-sm text-white ring-1 ring-white/10"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Foto siguiente"
                  onClick={() => goTo(clampedIndex + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 px-3 py-2 text-sm text-white ring-1 ring-white/10"
                >
                  ›
                </button>
              </>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-slate-400">
            <span>
              {clampedIndex + 1} / {photos.length}
            </span>
            {allowUpload ? (
              <button
                type="button"
                onClick={() => void handleRemove(current)}
                className="font-medium text-amber-200 hover:text-amber-100"
              >
                Quitar foto
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-slate-500">
          No hay imágenes para mostrar.
        </div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {photos.map((url, photoIndex) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(photoIndex)}
              className={`overflow-hidden rounded-xl ring-2 ${
                photoIndex === clampedIndex ? "ring-cyan-400" : "ring-transparent"
              }`}
            >
              <img
                src={url}
                alt=""
                className="h-16 w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
