import Image from "next/image";
import Link from "next/link";
import { EDITORIAL } from "@/lib/editorial-media";

/** Full-width editorial close. Licensed photography, not a Valcron facility. */
export function HomeLineup() {
  return (
    <section className="relative isolate min-h-[22rem] overflow-hidden md:min-h-[32rem] lg:min-h-[36rem]">
      <Image
        src={EDITORIAL.sunsetSuv.src}
        alt={EDITORIAL.sunsetSuv.alt}
        fill
        quality={72}
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/75 via-[#08090b]/40 to-[#08090b]/20" />
      <div className="relative flex min-h-[22rem] flex-col justify-end px-[var(--page-gutter)] py-12 md:min-h-[32rem] md:justify-center lg:min-h-[36rem] lg:py-20">
        <div className="mx-auto w-full max-w-[var(--content-wide)]">
          <h2 className="max-w-[16ch] font-display text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Tu próximo vehículo comienza con una buena decisión.
          </h2>
          <Link
            href="/nosotros"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-[#08090b] transition-colors hover:bg-[#f3f4f6]"
          >
            Conoce Valcron
          </Link>
        </div>
      </div>
    </section>
  );
}
