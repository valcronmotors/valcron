import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/branding";
import { SITE } from "@/lib/site";

type BrandLogoSize = "header" | "footer" | "auth" | "admin";
type BrandLogoTone = "onLight" | "onDark";
type BrandLogoVariant = "full" | "mark";

/**
 * Official Valcron Motors Group logo.
 * Header always shows the complete stacked lockup (symbol + VALCRON + MOTORS GROUP).
 * Orange appears only inside the artwork — never restyled via CSS filters.
 */
export function BrandLogo({
  size = "header",
  tone = "onLight",
  variant,
}: {
  size?: BrandLogoSize;
  tone?: BrandLogoTone;
  /** Override auto variant (admin mark when collapsed; header/footer/auth → full). */
  variant?: BrandLogoVariant;
}) {
  const resolved: BrandLogoVariant =
    variant ?? (size === "admin" ? "mark" : "full");
  const isMark = resolved === "mark";
  const src = isMark
    ? BRAND_ASSETS.symbol
    : tone === "onDark"
      ? BRAND_ASSETS.logoDark
      : BRAND_ASSETS.logoLight;

  const box = isMark
    ? "h-8 w-[2.95rem]"
    : size === "header"
      ? // Dimensions live in globals.css (.brand-logo--header) for reliable breakpoints
        "brand-logo--header"
      : size === "footer"
        ? "h-[7.5rem] w-[7.4rem] sm:h-[8.25rem] sm:w-[8.15rem] lg:h-[9rem] lg:w-[8.9rem]"
        : size === "admin"
          ? "h-[5.75rem] w-[5.7rem]"
          : // auth / login
            "h-[8.5rem] w-[8.4rem] sm:h-[9.5rem] sm:w-[9.4rem]";

  const sizesAttr = isMark
    ? "48px"
    : size === "header"
      ? "(max-width: 639px) 110px, (max-width: 767px) 130px, (max-width: 1023px) 140px, (max-width: 1279px) 165px, (max-width: 1535px) 175px, (max-width: 1919px) 195px, 220px"
      : size === "footer"
        ? "(max-width: 640px) 120px, 145px"
        : size === "admin"
          ? "96px"
          : "160px";

  return (
    <span
      className={`brand-logo relative inline-flex shrink-0 items-center justify-center overflow-visible bg-transparent ${box}`}
    >
      <Image
        src={src}
        alt={SITE.brand}
        fill
        priority={size === "header" || size === "auth"}
        sizes={sizesAttr}
        className="object-contain object-center"
      />
    </span>
  );
}
