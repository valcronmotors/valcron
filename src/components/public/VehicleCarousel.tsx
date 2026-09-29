"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Premium horizontal vehicle rail.
 * CSS transform loop on fine pointers; touch + reduced-motion → native snap.
 * Desktop (xl+) with pointer: native scroller + previous/next.
 */
export function VehicleCarousel({
  children,
  speedSeconds = 56,
  className = "",
}: {
  children: ReactNode;
  speedSeconds?: number;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(children) ? children : [children];
  const count = items.filter(Boolean).length;
  const canLoop = count >= 4;
  const few = count > 0 && count <= 3;

  function scrollByCard(direction: -1 | 1) {
    const root = scrollerRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>(".vehicle-carousel-item");
    const width = card?.getBoundingClientRect().width ?? 360;
    root.scrollBy({ left: direction * (width + 16), behavior: "smooth" });
  }

  if (few) {
    return (
      <div
        className={`grid gap-4 ${
          count === 1 ? "max-w-md" : count === 2 ? "max-w-4xl sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        } ${className}`}
      >
        {items.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  const rail = (
    <div
      ref={scrollerRef}
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4"
    >
      {items.map((child, index) => (
        <div
          key={`s-${index}`}
          className="vehicle-carousel-item w-[min(78vw,19rem)] shrink-0 snap-start sm:w-[min(46vw,20.5rem)] md:w-[min(44vw,21.25rem)] lg:w-[min(31vw,22rem)] xl:w-[22.5rem] min-[1600px]:w-[21.25rem]"
        >
          {child}
        </div>
      ))}
    </div>
  );

  if (!canLoop) {
    return <div className={`vehicle-carousel-static ${className}`}>{rail}</div>;
  }

  return (
    <div className={`vehicle-carousel has-controls relative ${className}`}>
      <div className="vehicle-carousel-controls pointer-events-none absolute inset-y-0 -left-1 -right-1 z-10 items-center justify-between">
        <button
          type="button"
          className="pointer-events-auto ml-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white/95 text-[#08090b] shadow-[0_8px_20px_rgba(8,9,11,0.08)]"
          aria-label="Anterior"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pointer-events-auto mr-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white/95 text-[#08090b] shadow-[0_8px_20px_rgba(8,9,11,0.08)]"
          aria-label="Siguiente"
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="vehicle-carousel-viewport">
        <div className="vehicle-carousel-track" style={{ animationDuration: `${speedSeconds}s` }}>
          <div className="vehicle-carousel-group">
            {items.map((child, index) => (
              <div key={`a-${index}`} className="vehicle-carousel-item">
                {child}
              </div>
            ))}
          </div>
          <div className="vehicle-carousel-group" aria-hidden="true">
            {items.map((child, index) => (
              <div key={`b-${index}`} className="vehicle-carousel-item">
                {child}
              </div>
            ))}
          </div>
        </div>
        <div className="vehicle-carousel-static">{rail}</div>
      </div>
    </div>
  );
}
