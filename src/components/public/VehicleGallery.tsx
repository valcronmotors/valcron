"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";

type GalleryPhoto = { url: string; alt: string };

export function VehicleGallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const count = photos.length;
  const safeIndex = count ? Math.min(index, count - 1) : 0;
  const cover = photos[safeIndex];

  const go = useCallback(
    (direction: -1 | 1) => {
      if (!count) return;
      setIndex((current) => (current + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, open]);

  function onTouchEnd(endX: number) {
    if (touchStart == null) return;
    const delta = endX - touchStart;
    if (delta > 40) go(-1);
    if (delta < -40) go(1);
    setTouchStart(null);
  }

  if (!cover) {
    return (
      <div
        className="relative aspect-[16/10] min-h-[13rem] overflow-hidden bg-[#1b1d20]"
        style={{ borderRadius: "var(--radius-panel)" }}
      >
        <VehiclePhoto src={null} alt={title} className="object-cover" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div
        className="relative aspect-[16/10] min-h-[13rem] overflow-hidden bg-[#1b1d20]"
        style={{ borderRadius: "var(--radius-panel)" }}
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <VehiclePhoto
          src={cover.url}
          alt={cover.alt}
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 rounded-lg bg-black/65 px-3 py-2 text-xs font-semibold text-white"
        >
          Ampliar
        </button>
      </div>

      {count > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((photo, photoIndex) => (
            <button
              key={`${photo.url}-${photoIndex}`}
              type="button"
              onClick={() => setIndex(photoIndex)}
              aria-label={`Ver foto ${photoIndex + 1}`}
              aria-current={safeIndex === photoIndex}
              className={`relative aspect-[4/3] min-h-[4.5rem] overflow-hidden ${
                safeIndex === photoIndex ? "ring-2 ring-[#111214]" : "opacity-80"
              }`}
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <VehiclePhoto src={photo.url} alt="" className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${title}`}
          className="fixed inset-0 z-[95] flex flex-col bg-black/92"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm">
              {safeIndex + 1} / {count}
            </p>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Cerrar galería">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            className="relative min-h-[60vh] flex-1"
            onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <VehiclePhoto
              src={cover.url}
              alt={cover.alt}
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {count > 1 ? (
            <div className="flex justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button type="button" onClick={() => go(-1)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#111]">
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button type="button" onClick={() => go(1)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#111]">
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
