import Image from "next/image";
import { SITE } from "@/lib/site";

export function BrandLogo({
  size = "header",
  tone = "onLight",
}: {
  size?: "header" | "footer";
  tone?: "onLight" | "onDark";
}) {
  const isHeader = size === "header";

  return (
    <span
      className={`brand-logo relative inline-flex items-center overflow-visible bg-transparent ${
        isHeader ? "h-10 w-[196px] sm:h-11 sm:w-[214px]" : "h-12 w-[232px]"
      }`}
    >
      <Image
        src="/logo-mark.png"
        alt={SITE.brand}
        fill
        priority={isHeader}
        sizes={isHeader ? "214px" : "232px"}
        className={
          tone === "onLight"
            ? "object-contain object-left invert"
            : "object-contain object-left"
        }
        style={tone === "onDark" ? { filter: "none", mixBlendMode: "normal" } : undefined}
      />
    </span>
  );
}
