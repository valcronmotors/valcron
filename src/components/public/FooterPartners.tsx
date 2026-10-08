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
          const card = (
            <>
              <span className="flex h-[5.75rem] w-full items-center justify-center sm:h-[6.25rem] md:h-[6.5rem]">
                <Image
                  src={partner.src}
                  alt=""
                  width={partner.width}
                  height={partner.height}
                  className={`object-contain object-center ${partner.imageClass}`}
                  sizes="(max-width: 640px) 160px, 200px"
                />
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
            <li key={partner.id}>
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} — ${partner.label}`}
                  className="footer-partner-card flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-[#e4e6ea] bg-[#f7f8fa] px-4 py-4 transition duration-200 hover:border-[#cfd3da] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff] sm:px-5 sm:py-5"
                >
                  {card}
                </a>
              ) : (
                <div className="footer-partner-card flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-[#e4e6ea] bg-[#f7f8fa] px-4 py-4 sm:px-5 sm:py-5">
                  {card}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
