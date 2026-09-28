"use client";

import Link from "next/link";
import { BrandMark } from "@/components/home/BrandMark";
import { inventorySearchHref } from "@/lib/public-filters";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";

export function HomeBrandCarousel() {
  return (
    <section className="section-light bg-[#f7f8fa]" aria-label="Marcas populares">
      <div
        className="mx-auto w-full max-w-[var(--content-max)] py-5 md:py-6"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3">
          {VEHICLE_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={inventorySearchHref({ marca: brand.name })}
              className="flex w-[4.5rem] shrink-0 snap-start flex-col items-center gap-2 sm:w-[5.25rem]"
            >
              <span
                className="flex h-[4.25rem] w-[4.25rem] items-center justify-center border border-[#e4e6ea] bg-white text-[#08090b] shadow-[0_4px_14px_rgba(8,9,11,0.04)] sm:h-[4.75rem] sm:w-[4.75rem]"
                style={{ borderRadius: "1.1rem" }}
                aria-hidden="true"
              >
                <BrandMark name={brand.name} className="h-8 w-8 sm:h-9 sm:w-9" />
              </span>
              <span className="text-center text-[11px] font-medium text-[#676a70]">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
