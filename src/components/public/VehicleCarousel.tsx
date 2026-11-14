"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ADVANCE_MS = 4200;
const RESUME_MS = 2800;

/** Mobile: one full-width card. sm+: ~2. lg+: ~3 with capped max width. */
const ITEM_CLASS =
  "vehicle-carousel-item w-[calc(100vw-2*var(--page-gutter))] max-w-none shrink-0 snap-center sm:w-[min(46vw,22rem)] sm:snap-start md:w-[min(42vw,22.5rem)] lg:w-[min(31vw,23rem)] xl:w-[22.75rem] min-[1600px]:w-[22rem]";

/**
 * Horizontal vehicle rail: native scroll-snap (iOS swipe) + gentle auto-advance.
 * Autoplay only with 3+ unique cards. Reduced-motion and offscreen → no autoplay.
 * Does not duplicate vehicles to fake inventory.
 */
export function VehicleCarousel({
  children,
  speedSeconds = 56,
  className = "",
  autoplay = true,
  variant = "vehicles",
}: {
  children: ReactNode;
  /** Kept for call-site compatibility; autoplay uses a fixed card cadence. */
  speedSeconds?: number;
  className?: string;
  autoplay?: boolean;
  variant?: "vehicles" | "brands";
}) {
  void speedSeconds;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactingRef = useRef(false);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(0);

  const items = Array.isArray(children) ? children : [children];
  const count = items.filter(Boolean).length;
  const canAutoplay = autoplay && count >= 3;
  const brandRail = variant === "brands";
  const itemClass = brandRail ? "brand-carousel-item w-36 shrink-0 snap-start" : ITEM_CLASS;

  function clearAdvance() {
    if (advanceTimer.current != null) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function clearResume() {
    if (resumeTimer.current != null) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }

  function cardStep(root: HTMLElement) {
    const card = root.querySelector<HTMLElement>(".vehicle-carousel-item, .brand-carousel-item");
    const width = card?.getBoundingClientRect().width ?? 280;
    const styles = getComputedStyle(root);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "12") || 12;
    return width + gap;
  }

  function syncActiveFromScroll() {
    const root = scrollerRef.current;
    if (!root) return;
    const step = cardStep(root);
    if (step <= 0) return;
    const next = Math.round(root.scrollLeft / step);
    setActive(Math.max(0, Math.min(count - 1, next)));
  }

  function brandInteraction(root: HTMLElement) {
    return brandRail && (root.contains(document.activeElement) ||
      (window.matchMedia("(hover: hover)").matches && root.matches(":hover")));
  }

  function advance() {
    const root = scrollerRef.current;
    if (!root || interactingRef.current || !visibleRef.current || brandInteraction(root)) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const step = cardStep(root);
    const maxScroll = root.scrollWidth - root.clientWidth;
    if (maxScroll <= 4) return;

    if (brandRail ? root.scrollLeft >= maxScroll - 4 : root.scrollLeft + step >= maxScroll - 4) {
      root.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      root.scrollBy({ left: step, behavior: "smooth" });
    }

    clearAdvance();
    advanceTimer.current = setTimeout(advance, ADVANCE_MS);
  }

  function scheduleAdvance() {
    clearAdvance();
    if (!canAutoplay || interactingRef.current || !visibleRef.current) return;
    if (scrollerRef.current && brandInteraction(scrollerRef.current)) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    advanceTimer.current = setTimeout(advance, ADVANCE_MS);
  }

  function pauseForInteraction() {
    interactingRef.current = true;
    clearAdvance();
    clearResume();
  }

  function resumeAfterInteraction() {
    interactingRef.current = false;
    clearResume();
    resumeTimer.current = setTimeout(() => {
      scheduleAdvance();
    }, RESUME_MS);
  }

  function scrollByCard(direction: -1 | 1) {
    const root = scrollerRef.current;
    if (!root) return;
    pauseForInteraction();
    root.scrollBy({ left: direction * cardStep(root), behavior: brandRail && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    resumeAfterInteraction();
  }

  function scrollToIndex(index: number) {
    const root = scrollerRef.current;
    if (!root) return;
    pauseForInteraction();
    root.scrollTo({ left: index * cardStep(root), behavior: "smooth" });
    setActive(index);
    resumeAfterInteraction();
  }

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const onScroll = () => syncActiveFromScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    syncActiveFromScroll();

    return () => root.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bind to this scroller
  }, [count]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !canAutoplay) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (visibleRef.current && !interactingRef.current && !reduced.matches) {
          scheduleAdvance();
        } else {
          clearAdvance();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(root);

    const onPointerDown = () => pauseForInteraction();
    const onPointerUp = () => resumeAfterInteraction();
    const onPointerCancel = () => resumeAfterInteraction();
    const onTouchStart = () => pauseForInteraction();
    const onTouchEnd = () => resumeAfterInteraction();
    const onReducedChange = () => {
      if (reduced.matches) {
        clearAdvance();
        clearResume();
      } else if (visibleRef.current && !interactingRef.current) {
        scheduleAdvance();
      }
    };

    const onFocusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) resumeAfterInteraction();
    };
    if (brandRail) {
      root.addEventListener("pointerenter", pauseForInteraction, { passive: true });
      root.addEventListener("pointerleave", resumeAfterInteraction, { passive: true });
      root.addEventListener("focusin", pauseForInteraction);
      root.addEventListener("focusout", onFocusOut);
    }
    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    root.addEventListener("pointerup", onPointerUp, { passive: true });
    root.addEventListener("pointercancel", onPointerCancel, { passive: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    reduced.addEventListener("change", onReducedChange);

    return () => {
      io.disconnect();
      clearAdvance();
      clearResume();
      if (brandRail) {
        root.removeEventListener("pointerenter", pauseForInteraction);
        root.removeEventListener("pointerleave", resumeAfterInteraction);
        root.removeEventListener("focusin", pauseForInteraction);
        root.removeEventListener("focusout", onFocusOut);
      }
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
      reduced.removeEventListener("change", onReducedChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- timers bind to this scroller instance
  }, [canAutoplay, count, brandRail]);

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return (
      <div className={`mx-auto w-full max-w-[34rem] ${className}`}>
        <div className="vehicle-carousel-item vehicle-carousel-item--solo">{items[0]}</div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className={className}>
        <div
          ref={scrollerRef}
          className="vehicle-carousel-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-auto overscroll-y-auto touch-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:snap-none md:gap-5"
        >
          {items.map((child, index) => (
            <div key={index} className={itemClass}>
              {child}
            </div>
          ))}
        </div>
        {!brandRail ? <CarouselDots count={count} active={active} onSelect={scrollToIndex} /> : null}
      </div>
    );
  }

  return (
    <div className={`${brandRail ? "brand-carousel relative px-10" : "vehicle-carousel has-controls relative"} ${className}`}>
      <div className={`${brandRail ? "brand-carousel-controls flex" : "vehicle-carousel-controls"} pointer-events-none absolute inset-y-0 -left-1 -right-1 z-10 items-center justify-between`}>
        <button
          type="button"
          className="pointer-events-auto ml-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white/95 text-[#08090b] shadow-[0_8px_20px_rgba(8,9,11,0.08)]"
          aria-label={brandRail ? "Marca anterior" : "Anterior"}
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pointer-events-auto mr-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white/95 text-[#08090b] shadow-[0_8px_20px_rgba(8,9,11,0.08)]"
          aria-label={brandRail ? "Marca siguiente" : "Siguiente"}
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={scrollerRef}
        className="vehicle-carousel-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-auto overscroll-y-auto touch-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
      >
        {items.map((child, index) => (
          <div key={index} className={itemClass}>
            {child}
          </div>
        ))}
      </div>
      {!brandRail ? <CarouselDots count={count} active={active} onSelect={scrollToIndex} /> : null}
    </div>
  );
}

function CarouselDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  if (count < 2) return null;
  return (
    <div
      className="mt-4 flex items-center justify-center gap-2 sm:hidden"
      role="tablist"
      aria-label="Paginación del carrusel"
    >
      {Array.from({ length: count }, (_, index) => {
        const current = index === active;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={current}
            aria-label={`Vehículo ${index + 1}`}
            onClick={() => onSelect(index)}
            className={`h-2 rounded-full transition-all ${
              current ? "w-6 bg-[#08090b]" : "w-2 bg-[#c9ccd1]"
            }`}
          />
        );
      })}
    </div>
  );
}
