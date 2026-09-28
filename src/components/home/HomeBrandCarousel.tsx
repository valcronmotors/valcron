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
      className="brand-marquee-item flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5 sm:w-[5rem]"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? true : undefined}
    >
      <span className="flex h-[3.75rem] w-[3.75rem] items-center justify-center bg-white/90 p-2 sm:h-16 sm:w-16 sm:p-2.5"
        style={{ borderRadius: "1rem" }}
      >
        <Image
          src={logoSrc}
          alt=""
          width={80}
          height={52}
          unoptimized
          className="h-auto max-h-9 w-auto max-w-full object-contain sm:max-h-10"
        />
      </span>
      <span className="text-center text-[11px] font-medium text-[#676a70]">{name}</span>
    </Link>
  );
}

/**
 * Continuous infinite brand marquee (CSS transform).
 * Reduced-motion: static horizontal scroll rail.
 * Brands = searchable makes, not partnerships.
 */
export function HomeBrandCarousel() {
  const sequence = VEHICLE_BRANDS;

  return (
    <section className="brand-marquee section-light bg-[#f7f8fa]" aria-label="Marcas para buscar">
      <div className="brand-marquee-viewport relative overflow-hidden py-4 md:py-5">
        {/* Animated track — duplicated for seamless CSS loop */}
        <div className="brand-marquee-track">
          <div className="brand-marquee-group">
            {sequence.map((brand) => (
              <BrandTile key={brand.slug} {...brand} />
            ))}
          </div>
          <div className="brand-marquee-group" aria-hidden="true">
            {sequence.map((brand) => (
              <BrandTile key={`dup-${brand.slug}`} {...brand} duplicate />
            ))}
          </div>
        </div>

        {/* Reduced-motion fallback scroll rail (shown via CSS only) */}
        <div className="brand-marquee-static">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sequence.map((brand) => (
              <BrandTile key={`static-${brand.slug}`} {...brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
