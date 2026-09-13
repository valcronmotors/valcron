import Link from "next/link";
import { AdminCard } from "@/components/admin/ui";

export function AdminPlaceholder({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <AdminCard className="max-w-3xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C5A059]">
        Módulo operativo
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-[#0B0C10]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
        {description} El flujo queda integrado al ERP de Valcron Motors Group SRL
        y se irá conectando a documentos, banca y DGII sin salir de este panel.
      </p>
      {actionHref && actionLabel ? (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0B0C10] px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </AdminCard>
  );
}
