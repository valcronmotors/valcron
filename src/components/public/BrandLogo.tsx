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
        isHeader ? "h-11 w-[210px]" : "h-12 w-[232px]"
      }`}
    >
      <Image
        src="/logo.png"
        alt={SITE.name}
        fill
        priority={isHeader}
        sizes={isHeader ? "210px" : "232px"}
        className={
          tone === "onLight"
            ? "object-cover object-center invert"
            : "object-cover object-center mix-blend-screen"
        }
      />
    </span>
  );
}
