import Image from "next/image";
import Link from "next/link";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { EDITORIAL } from "@/lib/editorial-media";
import { SITE, whatsappHref } from "@/lib/site";

export function InventoryEmptyState({
  title = "Nuevas unidades en camino",
  copy = "¿Buscas algo específico? Dinos marca, modelo y presupuesto. Revisamos opciones a tu medida.",
  tone = "dark",
  showRequest = false,
  onClear,
}: {
  title?: string;
  copy?: string;
  tone?: "dark" | "light";
  showRequest?: boolean;
  onClear?: () => void;
}) {
  const light = tone === "light";

  return (
    <div
      className={
        light
          ? "overflow-hidden border border-[#e4e6ea] bg-[#f5f6f7]"
          : "gloss-panel overflow-hidden"
      }
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <div className="relative aspect-[16/9] bg-[#12141a] sm:aspect-[21/9]">
        <Image
          src={EDITORIAL.crossover.src}
          alt={EDITORIAL.crossover.alt}
          fill
          sizes="(max-width: 768px) 92vw, 72rem"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/70 via-[#08090b]/20 to-transparent" />
      </div>
      <div className="px-6 py-8 text-center md:px-10 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
          Inventario
        </p>
        <p
          className={`mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl ${
            light ? "text-[#08090b]" : "text-white"
          }`}
        >
          {title}
        </p>
        <p
          className={`mx-auto mt-3 max-w-lg text-base leading-relaxed ${
            light ? "text-[#676a70]" : "text-[#d4d4d4]"
          }`}
        >
          {copy}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onClear ? (
            <button type="button" onClick={onClear} className="btn-secondary">
              Limpiar filtros
            </button>
          ) : null}
          {showRequest ? (
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
          ) : null}
          {showRequest ? (
            <a
              href={whatsappHref(
                `Hola, quiero que ${SITE.shortName} me ayude a encontrar un vehículo.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { PUBLIC_INVENTORY_EMPTY };
