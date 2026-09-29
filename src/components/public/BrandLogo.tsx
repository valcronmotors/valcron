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
          ? "h-10 w-[188px] sm:h-11 sm:w-[210px] lg:h-12 lg:w-[228px] xl:h-[3.25rem] xl:w-[248px]"
          : "h-12 w-[232px]"
      }`}
    >
      <Image
        src="/logo-mark.png"
        alt={SITE.brand}
        fill
        priority={isHeader}
        sizes={isHeader ? "248px" : "232px"}
        className="object-contain object-left"
        style={
          tone === "onLight"
            ? { filter: "brightness(0)", mixBlendMode: "normal" }
            : { filter: "none", mixBlendMode: "normal" }
        }
      />
    </span>
  );
}
