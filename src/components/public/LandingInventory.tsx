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
          ? "border border-[#e4e6ea] bg-[#f7f8fa] px-5 py-8 text-center"
          : "gloss-panel px-5 py-8 text-center"
      }
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <p
        className={`font-display text-lg font-semibold md:text-xl ${
          light ? "text-[#08090b]" : "text-white"
        }`}
      >
        {title}
      </p>
      {copy ? (
        <p className={`mx-auto mt-2 max-w-md text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>
          {copy}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
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
