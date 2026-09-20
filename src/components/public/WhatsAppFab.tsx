"use client";

import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SITE, whatsappHref } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 right-4 z-50 flex items-center gap-3 sm:bottom-8 sm:right-7"
      aria-label="WhatsApp de Valcron Motors"
    >
      <span className="hidden max-w-[12rem] rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-3 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md xl:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          WhatsApp
        </span>
        <span className="mt-0.5 block text-xs text-[#d4d4d4]">{SITE.whatsappDisplay}</span>
      </span>
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition duration-200 group-hover:scale-[1.03] group-hover:bg-[#1ebe5d] motion-reduce:transform-none sm:h-14 sm:w-14">
        <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
    </a>
  );
}
