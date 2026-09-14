"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SITE, whatsappHref } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <motion.a
      href={whatsappHref(
        "Hola, quiero atención inmediata sobre inventario, importación o financiamiento con Valcron Motors.",
      )}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
      aria-label="WhatsApp, atención inmediata"
    >
      <span className="hidden max-w-[11rem] rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2 text-left shadow-[0_12px_40px_rgba(5,150,105,0.18)] backdrop-blur-md sm:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Atención inmediata
        </span>
        <span className="mt-0.5 block text-xs text-muted">
          Respuesta estimada · {SITE.whatsapp}
        </span>
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
        <span className="absolute inset-0 rounded-full bg-emerald-500/25" />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#059669] text-white shadow-[0_12px_32px_rgba(5,150,105,0.45)] transition duration-200 group-hover:bg-[#047857] group-hover:scale-105">
          <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
        </span>
      </span>
    </motion.a>
  );
}
