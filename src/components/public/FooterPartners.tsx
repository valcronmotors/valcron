import Image from "next/image";
import { FOOTER_PARTNERS } from "@/lib/partners";

/**
 * Secondary corporate associations / platform presence in the gloss-black footer.
 * Equal visual containers; logo artwork keeps natural proportions (object-fit: contain).
 */
export function FooterPartners() {
  return (
    <section
      aria-labelledby="footer-partners-heading"
      className="mt-12 border-t border-white/10 pt-10 md:mt-14"
    >
      <div className="max-w-2xl">
        <h2
          id="footer-partners-heading"
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/50"
        >
          Dealer asociado
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/60">
          Presencia en asociaciones y plataformas del sector automotriz.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:max-w-3xl">
        {FOOTER_PARTNERS.map((partner) => {
          const isAdeci = partner.id === "adeci";
          const cardClass =
            "footer-partner-card flex h-full min-h-[10.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-[#e4e6ea] bg-[#f7f8fa] px-4 py-4 transition duration-200 hover:border-[#cfd3da] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff] sm:min-h-[11.25rem] sm:px-5 sm:py-5 md:min-h-[11.5rem]";

          const media = (
            <>
              <span className="flex h-24 w-full max-w-[12.5rem] items-center justify-center sm:h-[6.5rem]">
                {isAdeci ? (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-[4.75rem] w-[4.75rem] object-contain object-center sm:h-[5.25rem] sm:w-[5.25rem] md:h-[5.5rem] md:w-[5.5rem]"
                    sizes="96px"
                  />
                ) : (
                  <Image
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                    className="h-auto w-[8.5rem] max-w-full object-contain object-center sm:w-[9.5rem] md:w-[10.5rem]"
                    sizes="(max-width: 640px) 136px, 168px"
                  />
                )}
              </span>
              <span className="mt-1 block text-center">
                <span className="block text-sm font-semibold text-[#08090b]">{partner.name}</span>
                <span className="mt-0.5 block text-xs leading-snug text-[#676a70]">
                  {partner.label}
                </span>
              </span>
            </>
          );

          return (
            <li key={partner.id} className="min-w-0">
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} — ${partner.label}`}
                  className={cardClass}
                >
                  {media}
                </a>
              ) : (
                <div className={cardClass}>{media}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
