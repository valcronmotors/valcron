import type { ReactNode } from "react";

/**
 * Premium auto-advancing horizontal vehicle rail.
 * CSS transform loop on fine pointers; touch/coarse + reduced-motion → native snap scroll.
 */
export function VehicleCarousel({
  children,
  speedSeconds = 56,
  className = "",
}: {
  children: ReactNode;
  /** Full loop duration; auctions can use a slightly different cadence. */
  speedSeconds?: number;
  className?: string;
}) {
  const items = Array.isArray(children) ? children : [children];
  const count = items.filter(Boolean).length;
  const canLoop = count >= 3;

  if (!canLoop) {
    return (
      <div
        className={`vehicle-carousel-static flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {items.map((child, index) => (
          <div key={index} className="vehicle-carousel-item w-[min(78vw,19rem)] shrink-0 snap-start sm:w-[min(46vw,20.5rem)] xl:w-[min(22rem,100%)]">
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`vehicle-carousel ${className}`}>
      <div className="vehicle-carousel-viewport">
        <div
          className="vehicle-carousel-track"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
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
        <div className="vehicle-carousel-static">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((child, index) => (
              <div
                key={`s-${index}`}
                className="vehicle-carousel-item w-[min(78vw,19rem)] shrink-0 snap-start sm:w-[min(46vw,20.5rem)]"
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
