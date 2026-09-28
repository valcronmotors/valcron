"use client";

import Link from "next/link";
import { inventorySearchHref } from "@/lib/public-filters";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";

export function HomeBrandCarousel() {
  return (
    <section className="section-light bg-[#f7f8fa]" aria-label="Marcas populares">
      <div
        className="mx-auto w-full max-w-[var(--content-max)] py-5 md:py-6"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {VEHICLE_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={inventorySearchHref({ marca: brand.name })}
              className="flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 sm:w-[5.25rem]"
            >
              <span
                className="flex h-14 w-14 items-center justify-center border border-[#e4e6ea] bg-white text-sm font-bold tracking-tight text-[#08090b] sm:h-16 sm:w-16"
                style={{ borderRadius: "9999px" }}
                aria-hidden="true"
              >
                {brand.mark}
              </span>
              <span className="text-center text-[11px] font-medium text-[#676a70]">{brand.name}</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-[#a3a3a3]">
          Marcas que puedes buscar · Sin implicar franquicia ni alianza
        </p>
      </div>
    </section>
  );
}
