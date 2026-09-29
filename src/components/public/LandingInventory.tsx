import Link from "next/link";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { SITE, whatsappHref } from "@/lib/site";

export function InventoryEmptyState({
  title = PUBLIC_INVENTORY_EMPTY.title,
  copy = PUBLIC_INVENTORY_EMPTY.copy,
  tone = "light",
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
          ? "flex flex-col items-start justify-between gap-5 border border-[#e4e6ea] bg-[#f7f8fa] px-5 py-6 text-left sm:px-7 sm:py-7 md:flex-row md:items-center md:px-8 md:py-8"
          : "gloss-panel flex flex-col items-start justify-between gap-5 px-5 py-6 text-left sm:px-7 sm:py-7 md:flex-row md:items-center md:px-8 md:py-8"
      }
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <div>
        <p
          className={`font-display text-lg font-semibold md:text-xl ${
            light ? "text-[#08090b]" : "text-white"
          }`}
        >
          {title}
        </p>
        {copy ? (
          <p
            className={`mt-2 max-w-md text-sm leading-relaxed ${
              light ? "text-[#676a70]" : "text-[#d4d4d4]"
            }`}
          >
            {copy}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
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
  );
}

export { PUBLIC_INVENTORY_EMPTY };
