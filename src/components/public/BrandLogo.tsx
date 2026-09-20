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
        isHeader
          ? "h-9 w-[168px] sm:h-10 sm:w-[188px] min-[1440px]:h-11 min-[1440px]:w-[210px]"
          : "h-12 w-[232px]"
      }`}
    >
      <Image
        src="/logo-mark.png"
        alt={SITE.brand}
        fill
        priority={isHeader}
        sizes={isHeader ? "210px" : "232px"}
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
