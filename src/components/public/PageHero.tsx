import Image from "next/image";

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
  className = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <section className={`relative isolate min-h-[36vh] overflow-hidden md:min-h-[48vh] ${className}`}>
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/88 via-[#08090b]/55 to-[#08090b]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[36vh] max-w-7xl items-end px-4 py-10 md:min-h-[48vh] md:px-8 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="kicker text-[#2b6cff]">{kicker}</p>
          <h1 className="mt-3 text-balance font-display text-[2.125rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4d4d4]">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
