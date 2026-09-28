"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { setInquiryStatus } from "@/app/actions/inquiries";
import { AdminEmptyState, AdminNotice, AdminPageHeader } from "@/components/admin/ui";
import { INQUIRY_SOURCE_LABEL, INQUIRY_STATUS_LABEL, formatAdminDate } from "@/lib/admin-copy";
import type { AdminInquiryView } from "@/lib/admin-data";
import { inquiryCatalogLabel } from "@/lib/catalogs";
import type { InquiryStatus } from "@/lib/website-schema";

const FILTERS: { id: InquiryStatus | "all"; label: string }[] = [
  { id: "new", label: "Nuevas" },
  { id: "in_progress", label: "En seguimiento" },
  { id: "closed", label: "Cerradas" },
  { id: "all", label: "Todas" },
];

function digits(value: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

export function AdminInquiriesList({
  inquiries,
  error,
  initialStatus,
}: {
  inquiries: AdminInquiryView[];
  error: string | null;
  initialStatus?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<InquiryStatus | "all">(
    initialStatus === "new" || initialStatus === "in_progress" || initialStatus === "closed"
      ? initialStatus
      : "new",
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? inquiries : inquiries.filter((row) => row.status === filter)),
    [filter, inquiries],
  );

  function updateStatus(id: string, status: InquiryStatus) {
    setNotice(null);
    setActionError(null);
    startTransition(async () => {
      const result = await setInquiryStatus(id, status);
      if (result.error) {
        setActionError(result.error);
        return;
      }
      setNotice(
        status === "in_progress"
          ? "Solicitud en seguimiento."
          : status === "closed"
            ? "Solicitud cerrada."
            : "Solicitud reabierta.",
      );
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Solicitudes"
        subtitle="Mensajes y cotizaciones del website. Marca en seguimiento o cierra cuando hayas respondido."
        count={`${filtered.length} en esta vista`}
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Estado de solicitudes">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`min-h-10 rounded-lg px-3 text-sm font-medium transition duration-200 ${
              filter === item.id
                ? "bg-[var(--admin-text)] text-white"
                : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
            }`}
          >
            {item.label}
            {item.id !== "all" ? (
              <span className="ml-2 tabular-nums text-xs opacity-70">
                {inquiries.filter((row) => row.status === item.id).length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {error ? <AdminNotice tone="warning">No pudimos cargar las solicitudes.</AdminNotice> : null}
      {actionError ? <AdminNotice tone="warning">{actionError}</AdminNotice> : null}
      {notice ? <AdminNotice>{notice}</AdminNotice> : null}

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Inbox}
          title={inquiries.length === 0 ? "No hay solicitudes." : "Nada en esta vista"}
          copy={
            inquiries.length === 0
              ? "Las nuevas solicitudes aparecerán aquí."
              : "Cambia de pestaña para ver otras solicitudes."
          }
        />
      ) : (
        <section className="grid gap-3">
          {filtered.map((inquiry) => {
            const phone = digits(inquiry.phone);
            const open = openId === inquiry.id;
            const tel = phone ? `+${phone.startsWith("1") ? phone : `1${phone}`}` : null;
            return (
              <article
                key={inquiry.id}
                className={`rounded-xl border bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)] ${
                  inquiry.status === "new"
                    ? "border-[var(--admin-brand)]/35"
                    : "border-[var(--admin-border)]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    className="min-w-0 text-left"
                    onClick={() => setOpenId(open ? null : inquiry.id)}
                  >
                    <p className="font-medium text-[var(--admin-text)]">{inquiry.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">
                      {formatAdminDate(inquiry.created_at)} · {INQUIRY_SOURCE_LABEL[inquiry.source]}
                    </p>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        inquiry.catalogKind === "auction"
                          ? "bg-[var(--admin-brand)]/10 text-[var(--admin-brand)]"
                          : inquiry.catalogKind === "local"
                            ? "bg-[var(--admin-success)]/12 text-[var(--admin-success)]"
                            : "border border-[var(--admin-border)] text-[var(--admin-text-secondary)]"
                      }`}
                    >
                      {inquiryCatalogLabel(inquiry.catalogKind)}
                    </span>
                    <span className="rounded-full border border-[var(--admin-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--admin-text-secondary)]">
                      {INQUIRY_STATUS_LABEL[inquiry.status]}
                    </span>
                  </div>
                </div>
                <p className={`mt-3 text-sm leading-6 text-[var(--admin-text-secondary)] ${open ? "whitespace-pre-wrap" : "line-clamp-2"}`}>
                  {inquiry.message || "Sin mensaje."}
                </p>
                <dl className="mt-4 grid gap-2 text-xs text-[var(--admin-text-secondary)] sm:grid-cols-3">
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Teléfono</dt>
                    <dd>{inquiry.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Correo</dt>
                    <dd className="break-all">{inquiry.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)]">Vehículo</dt>
                    <dd>
                      {inquiry.vehicle_id ? (
                        <Link
                          href={`/admin/inventario/${inquiry.vehicle_id}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {inquiry.vehicleTitle || "Ver unidad"}
                        </Link>
                      ) : inquiry.auction_opportunity_id ? (
                        <Link
                          href={`/admin/subastas/${inquiry.auction_opportunity_id}`}
                          className="underline-offset-2 hover:underline"
                        >
                          Ver oportunidad
                        </Link>
                      ) : (
                        "Consulta general"
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tel ? (
                    <a
                      href={`https://wa.me/${tel.replace("+", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                  {tel ? (
                    <a
                      href={`tel:${tel}`}
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                    >
                      Llamar
                    </a>
                  ) : null}
                  {inquiry.email ? (
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                    >
                      Email
                    </a>
                  ) : null}
                  {inquiry.status !== "in_progress" ? (
                    <button
                      type="button"
                      disabled={pending}
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                      onClick={() => updateStatus(inquiry.id, "in_progress")}
                    >
                      En seguimiento
                    </button>
                  ) : null}
                  {inquiry.status !== "closed" ? (
                    <button
                      type="button"
                      disabled={pending}
                      className="inline-flex min-h-10 items-center rounded-lg bg-[var(--admin-text)] px-3 text-sm text-white"
                      onClick={() => updateStatus(inquiry.id, "closed")}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--admin-border)] px-3 text-sm"
                      onClick={() => updateStatus(inquiry.id, "new")}
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
