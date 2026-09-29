import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CompactTone = "light" | "blue" | "dark";

const TONE: Record<
  CompactTone,
  {
    shell: string;
    kicker: string;
    title: string;
    body: string;
    step: string;
    mediaBg: string;
  }
> = {
  light: {
    shell: "border border-[#e4e6ea] bg-white",
    kicker: "text-[#676a70]",
    title: "text-[#08090b]",
    body: "text-[#676a70]",
    step: "text-[#08090b]",
    mediaBg: "bg-[#f3f4f6]",
  },
  blue: {
    shell: "border border-transparent bg-[#2b6cff]",
    kicker: "text-white/75",
    title: "text-white",
    body: "text-white/85",
    step: "text-white",
    mediaBg: "bg-white/15",
  },
  dark: {
    shell: "border border-white/10 bg-[#08090b]",
    kicker: "text-white/50",
    title: "text-white",
    body: "text-white/70",
    step: "text-white",
    mediaBg: "bg-white/8",
  },
};

/** Compact VETTX-rhythm feature card — content-driven height, not full-viewport. */
export function CompactFeatureCard({
  tone = "light",
  kicker,
  title,
  copy,
  steps,
  href,
  cta,
  image,
  className = "",
}: {
  tone?: CompactTone;
  kicker?: string;
  title: string;
  copy?: string;
  steps?: readonly string[];
  href: string;
  cta: string;
  image?: { src: string; alt: string };
  className?: string;
}) {
  const t = TONE[tone];
  const ctaClass =
    tone === "blue"
      ? "inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[#08090b] transition-colors hover:bg-[#f3f4f6]"
      : tone === "dark"
        ? "inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[#08090b] transition-colors hover:bg-[#f3f4f6]"
        : "btn-primary";

  return (
    <article
      className={`overflow-hidden ${t.shell} ${className}`}
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <div
        className={
          image
            ? "grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            : "flex flex-col md:flex-row md:items-center md:justify-between"
        }
      >
        <div className="flex flex-col p-5 sm:p-6 md:p-7 lg:max-w-[42rem] lg:p-8">
          {kicker ? (
            <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${t.kicker}`}>
              {kicker}
            </p>
          ) : null}
          <h3
            className={`font-display text-xl font-bold tracking-tight sm:text-2xl ${kicker ? "mt-2" : ""} ${t.title}`}
          >
            {title}
          </h3>
          {copy ? <p className={`mt-2 text-sm leading-relaxed ${t.body}`}>{copy}</p> : null}
          {steps?.length ? (
            <ol className={`mt-4 grid gap-1.5 text-sm ${t.step}`}>
              {steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="tabular-nums font-semibold opacity-70">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {image ? (
            <div className="mt-5">
              <Link href={href} className={ctaClass}>
                {cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
        {image ? (
          <div className={`relative min-h-[9.5rem] ${t.mediaBg} md:min-h-0`}>
            <div className="relative aspect-[16/11] md:absolute md:inset-0 md:aspect-auto">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 42vw, 520px"
                className="object-cover object-center"
              />
            </div>
          </div>
        ) : (
          <div className="px-5 pb-5 md:px-8 md:py-8">
            <Link href={href} className={ctaClass}>
              {cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export function CompactPathTile({
  title,
  copy,
  href,
  cta,
  image,
}: {
  title: string;
  copy: string;
  href: string;
  cta: string;
  image: { src: string; alt: string };
}) {
  return (
    <article
      className="flex flex-col overflow-hidden border border-[#e4e6ea] bg-white"
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-[#f3f4f6]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 32vw, 420px"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold tracking-tight text-[#08090b]">{title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#676a70]">{copy}</p>
        <Link
          href={href}
          className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#2b6cff]"
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
