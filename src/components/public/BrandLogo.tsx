import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/branding";
import { SITE } from "@/lib/site";

type BrandLogoSize = "header" | "footer" | "auth" | "admin";
type BrandLogoTone = "onLight" | "onDark";
type BrandLogoVariant = "full" | "mark";

/**
 * Official Valcron Motors Group logo.
 * Header uses the VM symbol so the stacked corporate lockup stays legible elsewhere.
 * Orange appears only inside the artwork — never restyled via CSS filters.
 */
export function BrandLogo({
  size = "header",
  tone = "onLight",
  variant,
}: {
  size?: BrandLogoSize;
  tone?: BrandLogoTone;
  /** Override auto variant (header/admin → mark, footer/auth → full). */
  variant?: BrandLogoVariant;
}) {
  const resolved: BrandLogoVariant =
    variant ?? (size === "header" || size === "admin" ? "mark" : "full");
  const isMark = resolved === "mark";
  const src = isMark
    ? BRAND_ASSETS.symbol
    : tone === "onDark"
      ? BRAND_ASSETS.logoDark
      : BRAND_ASSETS.logoLight;

  const box =
    resolved === "mark"
      ? size === "admin"
        ? "h-8 w-[2.95rem]"
        : // Header mark — fits approved header height; width follows symbol aspect
          "h-9 w-[3.35rem] sm:h-10 sm:w-[3.7rem] lg:h-11 lg:w-[4.05rem] min-[1600px]:h-11 min-[1600px]:w-[4.15rem]"
      : size === "footer"
        ? "h-[7.5rem] w-[7.4rem] sm:h-[8.25rem] sm:w-[8.15rem] lg:h-[9rem] lg:w-[8.9rem]"
        : size === "admin"
          ? "h-[5.75rem] w-[5.7rem]"
          : // auth / login — full lockup with room to breathe
            "h-[8.5rem] w-[8.4rem] sm:h-[9.5rem] sm:w-[9.4rem]";

  const sizesAttr =
    resolved === "mark"
      ? size === "admin"
        ? "48px"
        : "66px"
      : size === "footer"
        ? "(max-width: 640px) 120px, 145px"
        : size === "admin"
          ? "96px"
          : "160px";

  return (
    <span className={`brand-logo relative inline-flex shrink-0 items-center justify-center overflow-visible bg-transparent ${box}`}>
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
