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
      className={`relative inline-block overflow-hidden bg-transparent ${
        isHeader ? "h-10 w-[196px] sm:h-11 sm:w-[214px]" : "h-12 w-[232px]"
      }`}
    >
      <Image
        src="/logo.png"
        alt={SITE.brand}
        fill
        priority={isHeader}
        sizes={isHeader ? "214px" : "232px"}
        className={
          tone === "onLight"
            ? "object-cover object-center invert"
            : "object-cover object-center"
        }
      />
    </span>
  );
}
