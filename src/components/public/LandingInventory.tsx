import Link from "next/link";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { SITE, whatsappHref } from "@/lib/site";

export function InventoryEmptyState({
  title = PUBLIC_INVENTORY_EMPTY.title,
  copy = PUBLIC_INVENTORY_EMPTY.copy,
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
          ? "rounded-2xl border border-[#e4e6ea] bg-white px-6 py-12 text-center"
          : "gloss-panel px-6 py-12 text-center"
      }
    >
      <p className={`font-display text-2xl ${light ? "text-[#0b0c0e]" : "text-white"}`}>{title}</p>
      <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${light ? "text-[#5c5c5c]" : "text-[#d4d4d4]"}`}>
        {copy}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onClear ? (
          <button type="button" onClick={onClear} className="btn-secondary">
            Limpiar filtros
          </button>
        ) : null}
        {showRequest ? (
          <Link href="/contacto" className="btn-primary">
            Solicitar vehículo
          </Link>
        ) : null}
        {showRequest ? (
          <a
            href={whatsappHref(`Hola, quiero que ${SITE.shortName} me ayude a encontrar un vehículo.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}

export { PUBLIC_INVENTORY_EMPTY };
