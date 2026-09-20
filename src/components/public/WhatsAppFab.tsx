"use client";

import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SITE, whatsappHref } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref(
        "Hola, quiero atención sobre inventario, importación o una búsqueda personalizada con Valcron Motors.",
      )}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
      aria-label={`WhatsApp ${SITE.whatsappDisplay}`}
    >
      <span className="hidden max-w-[11rem] rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-3 py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md xl:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
          Asesoría
        </span>
        <span className="mt-0.5 block text-xs text-white/45">{SITE.whatsappDisplay}</span>
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition duration-200 group-hover:scale-[1.03] group-hover:bg-[#1ebe5d]">
        <WhatsAppIcon className="h-6 w-6" />
      </span>
    </a>
  );
}
