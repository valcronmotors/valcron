import Image from "next/image";

export function PageHero({
  kicker,
  title,
  subtitle,
  image = "/hero-luxury.png",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image?: string;
}) {
  return (
    <section className="relative isolate min-h-[48vh] overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,12,16,0.78)_0%,rgba(11,12,16,0.38)_58%,rgba(11,12,16,0.16)_100%),linear-gradient(to_top,rgba(11,12,16,0.55),transparent_48%)]" />
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
