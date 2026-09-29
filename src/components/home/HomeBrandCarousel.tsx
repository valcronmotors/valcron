import Image from "next/image";
import Link from "next/link";
import { inventorySearchHref } from "@/lib/public-filters";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";

function BrandTile({
  name,
  logoSrc,
  duplicate,
}: {
  name: string;
  logoSrc: string;
  duplicate?: boolean;
}) {
  return (
    <Link
      href={inventorySearchHref({ marca: name })}
      className="brand-marquee-item flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 sm:w-[5.5rem] lg:w-[6.25rem] min-[1600px]:w-[7.5rem]"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? true : undefined}
    >
      <span
        className="flex h-[3.85rem] w-[3.85rem] items-center justify-center bg-white/90 p-2 sm:h-[4.35rem] sm:w-[4.35rem] sm:p-2.5 lg:h-[4.75rem] lg:w-[4.75rem] lg:p-3 min-[1600px]:h-[5.25rem] min-[1600px]:w-[5.25rem]"
        style={{ borderRadius: "1rem" }}
      >
        <Image
          src={logoSrc}
          alt=""
          width={96}
          height={64}
          unoptimized
          className="h-auto max-h-9 w-auto max-w-full object-contain sm:max-h-11 lg:max-h-[3.25rem]"
        />
      </span>
      <span className="text-center text-[11px] font-medium text-[#676a70] lg:text-xs">{name}</span>
    </Link>
  );
}

/**
 * Continuous infinite brand marquee (CSS transform).
 * Each group repeats the brand set so 1920/2560 never shows a trailing empty gap.
 */
export function HomeBrandCarousel() {
  const sequence = [...VEHICLE_BRANDS, ...VEHICLE_BRANDS, ...VEHICLE_BRANDS];

  return (
    <section className="brand-marquee section-light bg-[#f7f8fa]" aria-label="Marcas para buscar">
      <div className="brand-marquee-viewport relative w-full overflow-hidden py-5 md:py-6">
        <div className="brand-marquee-track">
          <div className="brand-marquee-group">
            {sequence.map((brand, index) => (
              <BrandTile key={`${brand.slug}-${index}`} {...brand} />
            ))}
          </div>
          <div className="brand-marquee-group" aria-hidden="true">
            {sequence.map((brand, index) => (
              <BrandTile key={`dup-${brand.slug}-${index}`} {...brand} duplicate />
            ))}
          </div>
        </div>

        <div className="brand-marquee-static">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-5">
            {VEHICLE_BRANDS.map((brand) => (
              <BrandTile key={`static-${brand.slug}`} {...brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
