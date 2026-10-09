import Image from "next/image";
import { FOOTER_PARTNERS } from "@/lib/partners";

/**
 * Compact associations / platforms strip — secondary to Valcron branding.
 * Small light logo surfaces only (no oversized partner cards).
 */
export function FooterPartners() {
  return (
    <section
      aria-labelledby="footer-partners-heading"
      className="border-t border-white/10 pt-7 md:pt-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h2
          id="footer-partners-heading"
          className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/45"
        >
          Asociaciones y plataformas
        </h2>

        <ul className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-stretch sm:justify-end sm:gap-2.5 lg:max-w-lg">
          {FOOTER_PARTNERS.map((partner, index) => {
            const isAdeci = partner.id === "adeci";
            const surface = (
              <span className="footer-partner-card flex h-[4.75rem] w-full flex-col items-center justify-center gap-1 rounded-md border border-white/[0.08] bg-[#eceef1] px-2 py-1.5 transition duration-200 hover:bg-[#f5f6f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff] sm:h-[5rem] sm:w-[9.75rem] sm:px-2.5 md:w-[10.25rem]">
                {isAdeci ? (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-11 w-11 object-contain object-center sm:h-12 sm:w-12"
                    sizes="48px"
                  />
                ) : (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-auto w-[6.75rem] max-w-full object-contain object-center sm:w-[7.5rem]"
                    sizes="120px"
                  />
                )}
                <span className="text-center text-[0.625rem] leading-tight text-[#5c6068]">
                  <span className="sr-only">{partner.name} — </span>
                  {partner.label}
                </span>
              </span>
            );

            return (
              <li key={partner.id} className="relative min-w-0">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1.5 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-white/15 sm:block"
                  />
                ) : null}
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} — ${partner.label}`}
                    className="block"
                  >
                    {surface}
                  </a>
                ) : (
                  surface
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
