"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { inventorySearchHref } from "@/lib/public-filters";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";

export function HomeBrandCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByTile(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    const tile = node.querySelector<HTMLElement>("[data-brand-tile]");
    const step = tile ? tile.offsetWidth + 12 : 96;
    node.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  return (
    <section className="section-light bg-[#f7f8fa]" aria-label="Marcas para buscar">
      <div
        className="relative mx-auto w-full max-w-[var(--content-max)] py-5 md:py-6"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="relative">
          <div
            ref={scrollerRef}
            className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3"
          >
            {VEHICLE_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                data-brand-tile
                href={inventorySearchHref({ marca: brand.name })}
                className="flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 sm:w-[5.5rem]"
              >
                <span
                  className="flex h-[4.5rem] w-[4.5rem] items-center justify-center border border-[#e4e6ea] bg-white p-2.5 shadow-[0_4px_14px_rgba(8,9,11,0.04)] sm:h-[5rem] sm:w-[5rem] sm:p-3"
                  style={{ borderRadius: "1.1rem" }}
                >
                  <Image
                    src={brand.logoSrc}
                    alt=""
                    width={96}
                    height={64}
                    unoptimized
                    className="h-auto max-h-10 w-auto max-w-full object-contain sm:max-h-11"
                  />
                </span>
                <span className="text-center text-[11px] font-medium text-[#676a70]">{brand.name}</span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Marcas anteriores"
            className="absolute -left-1 top-[1.65rem] hidden h-9 w-9 items-center justify-center rounded-full border border-[#e4e6ea] bg-white text-[#08090b] shadow-sm md:inline-flex"
            onClick={() => scrollByTile(-1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Marcas siguientes"
            className="absolute -right-1 top-[1.65rem] hidden h-9 w-9 items-center justify-center rounded-full border border-[#e4e6ea] bg-white text-[#08090b] shadow-sm md:inline-flex"
            onClick={() => scrollByTile(1)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
