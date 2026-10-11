import type { ReactNode } from "react";

export function PageContainer({
  children,
  className = "",
  narrow = false,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  wide?: boolean;
}) {
  const maxWidth = narrow
    ? "max-w-[var(--content-reading)]"
    : wide
      ? "max-w-[var(--content-wide)]"
      : "max-w-[var(--content-max)]";

  return (
    <div
      className={`mx-auto w-full ${maxWidth} ${className}`}
      style={{ paddingInline: "var(--page-gutter)" }}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  tight = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        paddingBlock: tight ? "var(--section-space-tight)" : "var(--section-space)",
      }}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "left",
  tone = "light",
  as: Heading = "h2",
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark" | "accent";
  as?: "h1" | "h2";
}) {
  const titleColor =
    tone === "light" ? "text-[#08090b]" : tone === "accent" ? "text-white" : "text-white";
  const subColor =
    tone === "light" ? "text-[#676a70]" : tone === "accent" ? "text-white/85" : "text-white/70";

  return (
    <div className={align === "center" ? "mx-auto max-w-[40rem] text-center" : "max-w-[40rem]"}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <Heading className={`display-lg mt-3 text-balance ${titleColor}`}>{title}</Heading>
      {subtitle ? (
        <p className={`mt-4 text-[length:var(--text-body-lg)] leading-[1.55] ${subColor}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
