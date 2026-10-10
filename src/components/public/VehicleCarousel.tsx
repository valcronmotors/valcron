"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ADVANCE_MS = 4200;
const RESUME_MS = 2800;

/**
 * Horizontal vehicle rail: native scroll-snap (iOS swipe) + gentle auto-advance.
 * Autoplay only with 3+ unique cards. Reduced-motion and offscreen → no autoplay.
 * Does not duplicate vehicles to fake inventory.
 */
export function VehicleCarousel({
  children,
  speedSeconds = 56,
  className = "",
}: {
  children: ReactNode;
  /** Kept for call-site compatibility; autoplay uses a fixed card cadence. */
  speedSeconds?: number;
  className?: string;
}) {
  void speedSeconds;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactingRef = useRef(false);
  const visibleRef = useRef(false);

  const items = Array.isArray(children) ? children : [children];
  const count = items.filter(Boolean).length;
  const canAutoplay = count >= 3;

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
    const card = root.querySelector<HTMLElement>(".vehicle-carousel-item");
    const width = card?.getBoundingClientRect().width ?? 280;
    const styles = getComputedStyle(root);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "12") || 12;
    return width + gap;
  }

  function advance() {
    const root = scrollerRef.current;
    if (!root || interactingRef.current || !visibleRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const step = cardStep(root);
    const maxScroll = root.scrollWidth - root.clientWidth;
    if (maxScroll <= 4) return;

    if (root.scrollLeft + step >= maxScroll - 4) {
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
    root.scrollBy({ left: direction * cardStep(root), behavior: "smooth" });
    resumeAfterInteraction();
  }

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
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
      reduced.removeEventListener("change", onReducedChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- timers bind to this scroller instance
  }, [canAutoplay, count]);

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return (
      <div className={`mx-auto max-w-md ${className}`}>
        <div className="vehicle-carousel-item">{items[0]}</div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div
        ref={scrollerRef}
        className={`vehicle-carousel-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:snap-none ${className}`}
      >
        {items.map((child, index) => (
          <div
            key={index}
            className="vehicle-carousel-item w-[min(86vw,21rem)] shrink-0 snap-center sm:w-auto sm:max-w-none sm:snap-start"
          >
            {child}
          </div>
        ))}
      </div>
    );
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
      <div
        ref={scrollerRef}
        className="vehicle-carousel-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
      >
        {items.map((child, index) => (
          <div
            key={index}
            className="vehicle-carousel-item w-[min(86vw,21.5rem)] shrink-0 snap-center sm:w-[min(46vw,22rem)] sm:snap-start md:w-[min(42vw,22.5rem)] lg:w-[min(31vw,23rem)] xl:w-[22.75rem] min-[1600px]:w-[22rem]"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
