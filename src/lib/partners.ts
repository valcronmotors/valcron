/** Secondary footer partnership / platform presence — Valcron remains primary brand. */

export const FOOTER_PARTNERS = [
  {
    id: "adeci",
    name: "ADECI",
    label: "Dealer asociado",
    description: "Asociación de Dealers del Cibao Inc.",
    href: "https://www.adeci.com.do/",
    src: "/partners/adeci.webp",
    width: 360,
    height: 359,
    /** Intrinsic display target — circular mark */
    imageClass: "h-[4.75rem] w-[4.75rem] sm:h-[5.25rem] sm:w-[5.25rem] md:h-[5.5rem] md:w-[5.5rem]",
  },
  {
    id: "supercarros",
    name: "SuperCarros.com",
    label: "Presencia en plataforma automotriz",
    description: "Marketplace automotriz",
    href: "https://www.supercarros.com/",
    src: "/partners/supercarros.webp",
    width: 429,
    height: 97,
    /** Horizontal lockup — width-led; source is low-res, keep display modest */
    imageClass: "h-auto w-[8.5rem] sm:w-[9.5rem] md:w-[10.5rem] max-w-full",
  },
] as const;
