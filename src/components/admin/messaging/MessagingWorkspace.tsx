"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CarFront,
  Paperclip,
  Send,
  StickyNote,
  UserRound,
} from "lucide-react";
import {
  attachVehicleFicha,
  assignConversation,
  generateIaReply,
  sendInboxMessage,
  setIaPilot,
} from "@/app/actions/messaging";
import {
  AdminError,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSelect,
  AdminSuccess,
} from "@/components/admin/ui";
import type { VehicleMetrics } from "@/lib/admin-metrics";
import { formatUsdPlain, vehicleSaleUsd } from "@/lib/admin-metrics";
import {
  autorLabel,
  canalLabel,
  type InboxConversation,
  type InboxFilter,
  type InboxMessage,
  type MessageChannel,
} from "@/lib/messaging";
import type { StaffUser } from "@/lib/staff";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "VM";
}

function timeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ChannelMark({ canal }: { canal: MessageChannel }) {
  const styles = {
    whatsapp: "bg-[#059669] text-white",
    instagram: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
    facebook: "bg-[#1877F2] text-white",
  } as const;
  const letter = canal === "whatsapp" ? "WA" : canal === "instagram" ? "IG" : "FB";
  return (
    <span
      title={canalLabel(canal)}
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-semibold ${styles[canal]}`}
    >
      {letter}
    </span>
  );
}

export function MessagingWorkspace({
  conversations,
  messages,
  selectedId,
  vehicles,
  agents,
  error,
}: {
  conversations: InboxConversation[];
  messages: InboxMessage[];
  selectedId: string | null;
  vehicles: VehicleMetrics[];
  agents: StaffUser[];
  error: string | null;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<InboxFilter>("todos");
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"texto" | "nota">("texto");
  const [staffId, setStaffId] = useState(agents[0]?.id ?? "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const staffName = agents.find((agent) => agent.id === staffId)?.name ?? "";
  const [sendState, sendAction, sending] = useActionState(sendInboxMessage, {
    error: null,
  });
  const [fichaState, fichaAction, attaching] = useActionState(attachVehicleFicha, {
    error: null,
  });
  const [iaState, iaAction, generating] = useActionState(generateIaReply, {
    error: null,
  });
  const [pilotState, pilotAction, toggling] = useActionState(setIaPilot, {
    error: null,
  });
  const [assignState, assignAction, assigning] = useActionState(
    assignConversation,
    { error: null },
  );

  const filtered = useMemo(() => {
    if (filter === "todos") {
      return conversations;
    }
    return conversations.filter((row) => row.status === filter);
  }, [conversations, filter]);

  const selected = conversations.find((row) => row.id === selectedId) ?? null;

  useEffect(() => {
    setDraft("");
  }, [selected?.id]);

  const notice =
    sendState.success ??
    fichaState.success ??
    iaState.success ??
    pilotState.success ??
    assignState.success;
  const actionError =
    sendState.error ??
    fichaState.error ??
    iaState.error ??
    pilotState.error ??
    assignState.error;
  const stock = vehicles.filter(
    (row) => row.estado === "Disponible" || row.estado === "En Subasta",
  );

  return (
    <div className="grid h-full min-h-0 bg-[#F8F9FA] lg:grid-cols-[18.5rem_minmax(0,1fr)_19.5rem]">
      <section
        className={`flex min-h-0 flex-col border-r border-gray-200 bg-white ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="border-b border-gray-100 px-4 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Bandeja
          </p>
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-[#F8F9FA] p-1">
            {(
              [
                ["todos", "Todos"],
                ["ia", "Atendidos IA"],
                ["humano", "Vendedor"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-md px-2 py-1.5 text-[11px] font-medium ${
                  filter === value
                    ? "bg-white text-[#0B0C10] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {error ? (
            <p className="px-4 py-6 text-sm text-amber-800">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">
              No hay conversaciones en este filtro.
            </p>
          ) : (
            filtered.map((row) => {
              const active = selected?.id === row.id;
              return (
                <Link
                  key={row.id}
                  href={`/admin/mensajeria?c=${row.id}`}
                  className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition ${
                    active ? "bg-[#F8F9FA]" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0C10] text-[11px] font-semibold text-white">
                    {initials(row.leadNombre)}
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <ChannelMark canal={row.canal} />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-[#0B0C10]">
                        {row.leadNombre}
                      </span>
                      <span className="shrink-0 text-[11px] text-gray-400">
                        {timeLabel(row.lastMessageAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                      {row.lastMessage || "Sin mensajes"}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-400">
                      {row.iaPilot ? "IA Pilot" : row.asignadoNombre || "Asesor"}
                    </span>
                  </span>
                  {row.unreadCount > 0 ? (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C5A059]" />
                  ) : null}
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section
        className={`min-h-0 flex-col bg-[#F3F4F6] ${
          selectedId || selected ? "flex" : "hidden lg:flex"
        }`}
      >
        {selected ? (
          <>
            <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
              <button
                type="button"
                className="lg:hidden"
                onClick={() => router.push("/admin/mensajeria")}
                aria-label="Volver a la bandeja"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-display text-base font-semibold text-[#0B0C10]">
                    {selected.leadNombre}
                  </h2>
                  <ChannelMark canal={selected.canal} />
                </div>
                <p className="text-xs text-gray-400">
                  {canalLabel(selected.canal)} ·{" "}
                  {selected.iaPilot ? "Atendido por IA" : "Asignado a vendedor"}
                </p>
              </div>
            </header>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">Aún no hay mensajes en este hilo.</p>
              ) : (
                messages.map((message) => {
                  const outgoing = message.autor !== "cliente";
                  const internal = message.autor === "interno";
                  return (
                    <article
                      key={message.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        internal
                          ? "mx-auto border border-dashed border-amber-200 bg-amber-50 text-amber-900"
                          : outgoing
                            ? "ml-auto bg-[#0B0C10] text-white"
                            : "mr-auto border border-gray-200 bg-white text-[#0B0C10]"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-70">
                        <span>{autorLabel(message.autor)}</span>
                        {message.autor === "ia" ? <Bot className="h-3 w-3" /> : null}
                        {message.autor === "agente" ? (
                          <UserRound className="h-3 w-3" />
                        ) : null}
                        <span>{canalLabel(message.canal)}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.contenido}</p>
                      <p className="mt-2 text-right text-[10px] opacity-60">
                        {timeLabel(message.createdAt)}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
            <div className="border-t border-gray-200 bg-white p-4">
              <AdminError message={actionError} />
              <AdminSuccess show={Boolean(notice)}>{notice}</AdminSuccess>
              <form action={sendAction} className="mt-3">
                <input type="hidden" name="conversationId" value={selected.id} />
                <input type="hidden" name="mode" value={mode} />
                <textarea
                  name="contenido"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                  placeholder={
                    mode === "nota"
                      ? "Nota interna — no se envía al cliente"
                      : `Mensaje por ${canalLabel(selected.canal)}`
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("texto")}
                    className={`inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium ${
                      mode === "texto"
                        ? "bg-[#0B0C10] text-white"
                        : "border border-gray-200 text-gray-600"
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("nota")}
                    className={`inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium ${
                      mode === "nota"
                        ? "bg-[#0B0C10] text-white"
                        : "border border-gray-200 text-gray-600"
                    }`}
                  >
                    <StickyNote className="h-3.5 w-3.5" />
                    Nota interna
                  </button>
                  <AdminPrimaryButton
                    type="submit"
                    disabled={sending}
                    className="ml-auto h-9 px-4 text-xs"
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </AdminPrimaryButton>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={iaAction}>
                  <input type="hidden" name="conversationId" value={selected.id} />
                  <AdminSecondaryButton
                    type="submit"
                    disabled={generating}
                    className="h-9 px-3 text-xs"
                  >
                    <Bot className="mr-1.5 h-3.5 w-3.5" />
                    {generating ? "Redactando..." : "Responder con IA"}
                  </AdminSecondaryButton>
                </form>
                <form action={fichaAction} className="flex min-w-0 flex-1 items-center gap-2">
                  <input type="hidden" name="conversationId" value={selected.id} />
                  <AdminSelect
                    name="vehiculoId"
                    value={vehicleId}
                    onChange={(event) => setVehicleId(event.target.value)}
                    className="mt-0 h-9 flex-1 text-xs"
                  >
                    {stock.length === 0 ? (
                      <option value="">Sin stock publicable</option>
                    ) : (
                      stock.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.marca} {vehicle.modelo} {vehicle.ano} ·{" "}
                          {formatUsdPlain(vehicleSaleUsd(vehicle))}
                        </option>
                      ))
                    )}
                  </AdminSelect>
                  <AdminSecondaryButton
                    type="submit"
                    disabled={attaching || !vehicleId}
                    className="h-9 px-3 text-xs"
                  >
                    <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                    Ficha
                  </AdminSecondaryButton>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Selecciona una conversación
          </div>
        )}
      </section>

      <aside
        className={`min-h-0 flex-col overflow-y-auto border-l border-gray-200 bg-white ${
          selected ? "hidden lg:flex" : "hidden xl:flex"
        }`}
      >
        {selected ? (
          <div className="space-y-6 px-5 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                Control de IA
              </p>
              <form action={pilotAction} className="mt-3">
                <input type="hidden" name="conversationId" value={selected.id} />
                <input
                  type="hidden"
                  name="enabled"
                  value={selected.iaPilot ? "0" : "1"}
                />
                <button
                  type="submit"
                  disabled={toggling}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-left"
                >
                  <span>
                    <span className="block text-sm font-medium text-[#0B0C10]">
                      IA Pilot (Respuesta Automática)
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {selected.iaPilot ? "Activado" : "Desactivado"}
                    </span>
                  </span>
                  <span
                    className={`relative h-6 w-11 rounded-full transition ${
                      selected.iaPilot ? "bg-[#0B0C10]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                        selected.iaPilot ? "left-5" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              </form>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                Ficha del lead
              </p>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Nombre</dt>
                  <dd className="mt-0.5 font-medium text-[#0B0C10]">
                    {selected.leadNombre}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Teléfono</dt>
                  <dd className="mt-0.5 text-[#0B0C10]">
                    {selected.leadTelefono || "Sin teléfono"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Vehículo de interés</dt>
                  <dd className="mt-0.5 flex items-start gap-2 text-[#0B0C10]">
                    <CarFront className="mt-0.5 h-4 w-4 text-gray-400" />
                    {selected.vehiculoInteres || "Sin unidad asignada"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Etapa del embudo</dt>
                  <dd className="mt-1">
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {selected.leadEtapa || "Sin etapa"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <form action={assignAction} className="space-y-2">
              <input type="hidden" name="conversationId" value={selected.id} />
              <input type="hidden" name="staffName" value={staffName} />
              <AdminSelect
                name="staffId"
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
              >
                {agents.length === 0 ? (
                  <option value="">No hay vendedores listados</option>
                ) : (
                  agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))
                )}
              </AdminSelect>
              <AdminPrimaryButton
                type="submit"
                disabled={assigning || agents.length === 0}
                className="w-full"
              >
                {assigning ? "Asignando..." : "Asignar a Vendedor"}
              </AdminPrimaryButton>
            </form>

            <Link
              href={
                selected.prospectoId
                  ? `/admin/financiamiento/expedientes?prospecto=${selected.prospectoId}`
                  : "/admin/financiamiento/expedientes"
              }
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-[#0B0C10] hover:bg-gray-50"
            >
              Crear Expediente de Financiamiento
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
