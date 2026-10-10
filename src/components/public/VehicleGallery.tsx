"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
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
        className="relative aspect-[16/10] min-h-[14rem] overflow-hidden border border-[#e8eaed] bg-[#f3f4f6]"
        style={{ borderRadius: "1rem" }}
      >
        <VehiclePhoto src={null} alt={title} className="object-contain" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div
        className="relative aspect-[16/10] min-h-[14rem] overflow-hidden border border-[#e8eaed] bg-[#f3f4f6] sm:min-h-[18rem] lg:min-h-[22rem]"
        style={{ borderRadius: "1rem" }}
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <VehiclePhoto
          src={cover.url}
          alt={cover.alt}
          priority
          sizes="(min-width: 1600px) 900px, (min-width: 1024px) 58vw, 100vw"
          className="object-contain object-center"
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#08090b] shadow-sm ring-1 ring-black/5 sm:inline-flex"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#08090b] shadow-sm ring-1 ring-black/5 sm:inline-flex"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
          {count > 1 ? (
            <span className="rounded-md bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
              {safeIndex + 1} / {count}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-black/65 px-3 py-2 text-xs font-semibold text-white"
          >
            <Expand className="h-3.5 w-3.5" />
            Ampliar
          </button>
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-6 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, photoIndex) => (
            <button
              key={`${photo.url}-${photoIndex}`}
              type="button"
              onClick={() => setIndex(photoIndex)}
              aria-label={`Ver foto ${photoIndex + 1}`}
              aria-current={safeIndex === photoIndex}
              className={`relative aspect-[4/3] w-[4.75rem] shrink-0 overflow-hidden rounded-lg border sm:w-auto ${
                safeIndex === photoIndex
                  ? "border-[#08090b] ring-2 ring-[#08090b]/40"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <VehiclePhoto src={photo.url} alt="" className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${title}`}
          className="fixed inset-0 z-[95] flex flex-col bg-black/94"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm font-medium">
              {safeIndex + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center"
              aria-label="Cerrar galería"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            className="relative min-h-0 flex-1"
            onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <VehiclePhoto src={cover.url} alt={cover.alt} sizes="100vw" className="object-contain" />
          </div>
          {count > 1 ? (
            <div
              className="flex justify-center gap-3 pt-3"
              style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
            >
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#111]"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#111]"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
