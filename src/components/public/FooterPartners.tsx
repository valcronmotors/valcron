import Image from "next/image";
import { FOOTER_PARTNERS } from "@/lib/partners";

/**
 * Compact associations / platforms strip — secondary to Valcron branding.
 * Transparent logo surfaces on the gloss-black footer.
 */
export function FooterPartners() {
  return (
    <section aria-labelledby="footer-partners-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h2
          id="footer-partners-heading"
          className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#b8bdc7]"
        >
          Asociaciones y plataformas
        </h2>

        <ul className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-stretch sm:justify-end">
          {FOOTER_PARTNERS.map((partner) => {
            const isAdeci = partner.id === "adeci";
            const surface = (
              <span className="footer-partner-card flex h-[4.25rem] w-full flex-col items-center justify-center gap-1 bg-transparent px-2.5 py-1.5 transition duration-200 hover:opacity-80 sm:h-[4.5rem] sm:w-[11.5rem]">
                {isAdeci ? (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-10 w-10 object-contain object-center"
                    sizes="40px"
                  />
                ) : (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-auto w-[8rem] max-w-full object-contain object-center brightness-0 invert"
                    sizes="128px"
                  />
                )}
                <span className="text-center text-[0.625rem] leading-tight text-[#d4d7de]">
                  <span className="sr-only">{partner.name} — </span>
                  {partner.label}
                </span>
              </span>
            );

            return (
              <li key={partner.id} className="relative min-w-0">
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} — ${partner.label}`}
                    className="block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
