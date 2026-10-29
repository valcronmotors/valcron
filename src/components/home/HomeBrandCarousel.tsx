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
      className="brand-marquee-item flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-1.5 sm:w-[5.5rem] lg:w-[6.25rem] min-[1600px]:w-[7.5rem]"
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
          className="h-auto grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100 max-h-9 w-auto max-w-full object-contain sm:max-h-11 lg:max-h-[3.25rem]"
        />
      </span>
      <span className="text-center text-[11px] font-medium text-[#676a70] lg:text-xs">{name}</span>
    </Link>
  );
}

/** Static brand rail keeps the home calm and keyboard navigation concise. */
export function HomeBrandCarousel() {
  return (
    <section className="section-light border-b border-[#eceef1] bg-white px-[var(--page-gutter)] py-4 md:py-5" aria-label="Marcas para buscar">
      <div className="mx-auto flex max-w-[var(--content-wide)] snap-x snap-mandatory items-center gap-4 overflow-x-auto pb-2 sm:gap-7 [scrollbar-width:thin]">
        {VEHICLE_BRANDS.map(brand => <BrandTile key={brand.slug} {...brand} />)}
      </div>
    </section>
  );
}
