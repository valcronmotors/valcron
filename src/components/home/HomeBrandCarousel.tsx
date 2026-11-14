import Image from "next/image";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
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
      className="brand-marquee-item flex w-36 shrink-0 snap-start flex-col items-center gap-1.5"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? true : undefined}
    >
      <span
        className="flex h-16 w-36 items-center justify-center bg-white/90 p-2"
        style={{ borderRadius: "1rem" }}
      >
        <Image
          src={logoSrc}
          alt=""
          width={128}
          height={48}
          unoptimized
          className="h-12 w-32 object-contain grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
        />
      </span>
      <span className="text-center text-[11px] font-medium text-[#676a70] lg:text-xs">{name}</span>
    </Link>
  );
}

/** Reuse the vehicle rail cadence, interaction pause and reduced-motion behavior. */
export function HomeBrandCarousel() {
  return (
    <section className="section-light border-b border-[#eceef1] bg-white px-[var(--page-gutter)] py-4 md:py-5" aria-label="Marcas para buscar">
      <div className="mx-auto max-w-[var(--content-wide)]">
        <VehicleCarousel variant="brands">
          {VEHICLE_BRANDS.map(brand => <BrandTile key={brand.slug} {...brand} />)}
        </VehicleCarousel>
      </div>
    </section>
  );
}
