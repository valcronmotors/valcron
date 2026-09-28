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
    <section className={`relative isolate min-h-[34vh] overflow-hidden md:min-h-[48vh] ${className}`}>
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />
      <div className="relative mx-auto flex min-h-[34vh] max-w-7xl items-end px-4 py-10 md:min-h-[48vh] md:px-8 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="kicker text-[#C7A96B]">{kicker}</p>
          <h1 className="mt-3 text-balance font-display text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#d4d4d4] sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
