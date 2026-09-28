import Image from "next/image";
import { PageContainer } from "@/components/public/layout";

/**
 * Editorial page header.
 * Default tone is light (V11). Dark photo heroes remain available when needed.
 */
export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
  tone = "light",
  className = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image?: string;
  imageAlt?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (tone === "light" || !image) {
    return (
      <section className={`relative bg-white ${className}`}>
        <PageContainer className="pb-8 pt-10 md:pb-10 md:pt-14">
          <div className="max-w-[36rem]">
            <p
              className="inline-flex min-h-9 items-center border border-[#e4e6ea] bg-white px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3a3d42]"
              style={{ borderRadius: "9999px" }}
            >
              {kicker}
            </p>
            <h1 className="display-xl mt-5 text-balance text-[#08090b]">{title}</h1>
            <p className="mt-4 max-w-[32rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70]">
              {subtitle}
            </p>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <section
      className={`section-dark relative isolate min-h-[36vh] overflow-hidden md:min-h-[42vh] ${className}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        fetchPriority="high"
        quality={70}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/92 via-[#08090b]/62 to-[#08090b]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
      <PageContainer className="relative flex min-h-[36vh] items-end pb-10 pt-16 md:min-h-[42vh] md:pb-12 md:pt-20">
        <div className="max-w-[40rem]">
          <p className="kicker">{kicker}</p>
          <h1 className="display-xl mt-4 text-balance text-white">{title}</h1>
          <p className="mt-4 max-w-[36rem] text-[length:var(--text-body-lg)] leading-[1.55] text-white/75">
            {subtitle}
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
