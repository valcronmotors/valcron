export function NumberedSteps({
  steps,
  tone = "light",
  className = "",
}: {
  steps: readonly { step: string; title: string; copy: string }[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <ol className={`mt-10 grid gap-4 md:grid-cols-2 ${className}`}>
      {steps.map((item) => (
        <li
          key={item.step}
          className={
            dark
              ? "border border-white/12 bg-white/[0.04] p-6 md:p-8"
              : "border border-[#e4e6ea] bg-white p-6 md:p-8"
          }
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
              dark ? "text-white/50" : "text-[#676a70]"
            }`}
          >
            Paso {item.step}
          </p>
          <h3
            className={`mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl ${
              dark ? "text-white" : "text-[#08090b]"
            }`}
          >
            {item.title}
          </h3>
          <p className={`mt-2 text-base leading-relaxed ${dark ? "text-white/65" : "text-[#676a70]"}`}>
            {item.copy}
          </p>
        </li>
      ))}
    </ol>
  );
}
