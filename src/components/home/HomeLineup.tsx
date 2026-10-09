import Image from "next/image";
import Link from "next/link";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeLineup() {
  return (
    <section className="relative isolate min-h-[22rem] overflow-hidden md:min-h-[28rem]">
      <Image
        src={EDITORIAL.sunsetSuv.src}
        alt={EDITORIAL.sunsetSuv.alt}
        fill
        quality={70}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#08090b]/45" />
      <div className="relative flex min-h-[22rem] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[28rem]">
        <h2 className="max-w-[18ch] font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          Una línea con más posibilidades.
        </h2>
        <Link
          href="/inventario"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#08090b] transition-colors hover:bg-[#f3f4f6]"
        >
          Explorar el inventario
        </Link>
      </div>
    </section>
  );
}
