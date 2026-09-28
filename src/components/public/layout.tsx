import type { ReactNode } from "react";

export function PageContainer({
  children,
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${narrow ? "max-w-[42rem]" : "max-w-[var(--content-max)]"} ${className}`}
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
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark" | "accent";
}) {
  const titleColor =
    tone === "light" ? "text-[#08090b]" : tone === "accent" ? "text-white" : "text-white";
  const subColor =
    tone === "light" ? "text-[#676a70]" : tone === "accent" ? "text-white/85" : "text-white/70";

  return (
    <div className={align === "center" ? "mx-auto max-w-[40rem] text-center" : "max-w-[40rem]"}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 className={`display-lg mt-3 text-balance ${titleColor}`}>{title}</h2>
      {subtitle ? (
        <p className={`mt-4 text-[length:var(--text-body-lg)] leading-[1.55] ${subColor}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
