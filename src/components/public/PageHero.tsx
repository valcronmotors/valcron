import Image from "next/image";

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate min-h-[48vh] overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center contrast-[1.05]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
      <div className="relative mx-auto flex min-h-[48vh] max-w-7xl items-end px-5 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="kicker text-accent!">{kicker}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
