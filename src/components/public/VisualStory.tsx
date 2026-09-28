import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

export type VisualAsset = {
  src: string;
  alt: string;
  caption?: string;
};

export function VisualCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#676a70]">
      {children}
    </p>
  );
}

export function VisualMedia({
  asset,
  aspect = "16/10",
  priority = false,
  sizes = "(max-width: 768px) 92vw, 40vw",
  className = "",
}: {
  asset: VisualAsset;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="relative overflow-hidden bg-[#eef0f3]"
        style={{ borderRadius: "var(--radius-card)", aspectRatio: aspect }}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-center"
        />
      </div>
      {asset.caption ? <VisualCaption>{asset.caption}</VisualCaption> : null}
    </figure>
  );
}

export function VisualStepSequence({
  steps,
  tone = "light",
}: {
  steps: readonly {
    step: string;
    title: string;
    copy?: string;
    image: VisualAsset;
  }[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <ol className="mt-10 grid gap-8">
      {steps.map((item, index) => (
        <li key={item.step} className="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-8">
          <div className={index % 2 === 1 ? "md:order-2" : undefined}>
            <VisualMedia
              asset={item.image}
              aspect="16/10"
              sizes="(max-width: 768px) 92vw, 44vw"
            />
          </div>
          <div className={index % 2 === 1 ? "md:order-1" : undefined}>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                dark ? "text-[#2b6cff]" : "text-[#676a70]"
              }`}
            >
              {item.step}
            </p>
            <h3
              className={`mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl ${
                dark ? "text-white" : "text-[#08090b]"
              }`}
            >
              {item.title}
            </h3>
            {item.copy ? (
              <p className={`mt-3 max-w-[28rem] text-base leading-relaxed ${dark ? "text-white/70" : "text-[#676a70]"}`}>
                {item.copy}
              </p>
            ) : null}
          </div>
          {index < steps.length - 1 ? (
            <div className="flex justify-center md:col-span-2" aria-hidden="true">
              <ArrowDown className={`h-5 w-5 ${dark ? "text-white/35" : "text-[#a3a3a3]"}`} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function VisualFlowDiagram({
  nodes,
  label,
}: {
  nodes: readonly string[];
  label?: string;
}) {
  return (
    <div
      className="border border-[#e4e6ea] bg-white px-4 py-5 md:px-6 md:py-6"
      style={{ borderRadius: "var(--radius-card)" }}
      aria-label={label}
    >
      {label ? (
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#676a70]">
          {label}
        </p>
      ) : null}
      <ol className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
        {nodes.map((node, index) => (
          <li key={node} className="flex flex-1 flex-col items-center gap-3 md:flex-row md:gap-2">
            <span className="flex min-h-12 w-full items-center justify-center bg-[#08090b] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white md:min-h-14 md:text-[11px]"
              style={{ borderRadius: "9999px" }}
            >
              {node}
            </span>
            {index < nodes.length - 1 ? (
              <>
                <ArrowDown className="h-4 w-4 text-[#2b6cff] md:hidden" aria-hidden="true" />
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#2b6cff] md:block" aria-hidden="true" />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function VisualPathCard({
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
  image: VisualAsset;
}) {
  return (
    <article
      className="flex flex-col overflow-hidden border border-[#e4e6ea] bg-white"
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-[#eef0f3]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 92vw, 45vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {image.caption ? <VisualCaption>{image.caption}</VisualCaption> : null}
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-[#08090b] md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#676a70] md:text-base">{copy}</p>
        <Link href={href} className="btn-primary mt-5 w-full sm:w-auto">
          {cta}
        </Link>
      </div>
    </article>
  );
}

export function VisualRequestBand({
  image,
}: {
  image: VisualAsset;
}) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10">
      <VisualMedia asset={image} aspect="4/3" sizes="(max-width: 768px) 92vw, 46vw" />
      <div>
        <h2 className="display-lg text-balance text-[#08090b]">
          ¿No ves el vehículo
          <span className="block">que buscas?</span>
        </h2>
        <p className="mt-4 text-[length:var(--text-body-lg)] text-[#676a70]">
          Dinos cuál necesitas.
        </p>
        <Link href="/solicitar-vehiculo" className="btn-primary mt-7">
          Solicitar vehículo
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
