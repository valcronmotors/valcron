"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import {
  createActividad,
  listActividades,
  updateProspectoInteres,
} from "@/app/actions/crm";
import { QuoteGeneratorModal } from "@/components/crm/QuoteGeneratorModal";
import {
  Field,
  FormError,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/utils/supabase/client";
import { uploadCrmAudio } from "@/lib/crm-audio";
import {
  CRM_ACTIVITY_TYPES,
  companySlugFromNombre,
  interestLabel,
  whatsappHref,
  type CrmActividad,
  type ProspectoRow,
} from "@/lib/crm";
import type { PartRow, VehicleRow } from "@/lib/inventory";

export function LeadDetailModal({
  lead,
  vehiculos,
  repuestos,
  onClose,
  onUpdated,
}: {
  lead: ProspectoRow | null;
  vehiculos: VehicleRow[];
  repuestos: PartRow[];
  onClose: () => void;
  onUpdated: (record: ProspectoRow) => void;
}) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activities, setActivities] = useState<CrmActividad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [partId, setPartId] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setError(null);
    setQuoteOpen(false);
    setQuery("");
    setVehicleId(lead?.vehiculo_interes_id ?? "");
    setPartId(lead?.repuesto_interes_id ?? "");
  }, [lead]);

  useEffect(() => {
    if (!lead) {
      setActivities([]);
      return;
    }

    let cancelled = false;
    void listActividades(lead.id).then((result) => {
      if (cancelled) {
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      setActivities(result.data);
    });

    const supabase = createClient();
    const channel = supabase
      .channel(`crm-actividades-${lead.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_actividades",
          filter: `prospecto_id=eq.${lead.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const next = payload.new as CrmActividad;
            setActivities((current) => {
              if (current.some((row) => row.id === next.id)) {
                return current;
              }
              return [next, ...current];
            });
          }
          if (payload.eventType === "DELETE") {
            const id = (payload.old as { id?: string }).id;
            setActivities((current) => current.filter((row) => row.id !== id));
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [lead]);

  if (!lead) {
    return null;
  }

  const currentLead = lead;
  const slug = companySlugFromNombre(currentLead.empresa?.nombre);
  const isVehicles = slug !== "108-parts-direct-llc";
  const whatsapp = whatsappHref(currentLead.telefono);
  const needle = query.trim().toLowerCase();
  const filteredVehicles = vehiculos.filter((vehiculo) => {
    if (vehiculo.estado === "Vendido") {
      return false;
    }
    if (!needle) {
      return true;
    }
    return `${vehiculo.vin} ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.trim ?? ""}`
      .toLowerCase()
      .includes(needle);
  });
  const filteredParts = repuestos.filter((repuesto) => {
    if (Number(repuesto.cantidad ?? 0) <= 0) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return `${repuesto.codigo_pieza} ${repuesto.nombre}`
      .toLowerCase()
      .includes(needle);
  });

  function saveInterest() {
    const prospectoId = currentLead.id;
    startTransition(async () => {
      const result = await updateProspectoInteres(
        prospectoId,
        isVehicles ? vehicleId || null : null,
        isVehicles ? null : partId || null,
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.record) {
        onUpdated(result.record);
      }
    });
  }

  return (
    <>
      <Modal
        open
        size="xl"
        closeOnEscape={!quoteOpen}
        title={lead.nombre}
        subtitle={`${lead.empresa?.nombre ?? "Empresa"} · ${lead.origen_lead} · ${lead.estado_crm}`}
        onClose={onClose}
      >
        <div className="grid gap-6">
          <FormError message={error} />
          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-3">
            <ContactBlock label="Nombre" value={lead.nombre} />
            <ContactBlock
              label="Teléfono"
              value={lead.telefono || "Sin teléfono"}
              action={
                whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center rounded-full bg-emerald-500/15 px-3 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30"
                  >
                    Abrir WhatsApp
                  </a>
                ) : null
              }
            />
            <ContactBlock
              label="Email"
              value={lead.email || "Sin correo"}
              action={
                lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex h-9 items-center rounded-full bg-white/5 px-3 text-xs font-semibold text-slate-100 ring-1 ring-white/10"
                  >
                    Enviar correo
                  </a>
                ) : null
              }
            />
          </section>

          <section className="grid gap-4 rounded-2xl border border-white/10 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Inventario vinculado
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {interestLabel(lead)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="inline-flex h-10 items-center rounded-full bg-cyan-400 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Generar cotización
              </button>
            </div>
            <Field
              label={
                isVehicles
                  ? "Buscar vehículo por VIN"
                  : "Buscar repuesto por código de pieza"
              }
            >
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  isVehicles ? "VIN, marca o modelo" : "Código o nombre"
                }
              />
            </Field>
            {isVehicles ? (
              <Field label="Vehículo">
                <SelectInput
                  value={vehicleId}
                  onChange={(event) => setVehicleId(event.target.value)}
                >
                  <option value="">Sin vehículo asignado</option>
                  {filteredVehicles.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.vin} · {vehiculo.marca} {vehiculo.modelo}{" "}
                      {vehiculo.ano}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            ) : (
              <Field label="Repuesto">
                <SelectInput
                  value={partId}
                  onChange={(event) => setPartId(event.target.value)}
                >
                  <option value="">Sin repuesto asignado</option>
                  {filteredParts.map((repuesto) => (
                    <option key={repuesto.id} value={repuesto.id}>
                      {repuesto.codigo_pieza} · {repuesto.nombre}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={pending}
                onClick={saveInterest}
                className="inline-flex h-10 items-center rounded-full bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-60"
              >
                {pending ? "Vinculando..." : "Guardar vínculo"}
              </button>
            </div>
          </section>

          <ActivityPanel
            leadId={lead.id}
            activities={activities}
            onCreated={(record) =>
              setActivities((current) => [record, ...current.filter((row) => row.id !== record.id)])
            }
            onError={setError}
          />
        </div>
      </Modal>
      <QuoteGeneratorModal
        open={quoteOpen}
        lead={lead}
        vehiculos={vehiculos}
        repuestos={repuestos}
        onClose={() => setQuoteOpen(false)}
      />
    </>
  );
}

function ContactBlock({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-white">{value}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

function ActivityPanel({
  leadId,
  activities,
  onCreated,
  onError,
}: {
  leadId: string;
  activities: CrmActividad[];
  onCreated: (record: CrmActividad) => void;
  onError: (message: string | null) => void;
}) {
  const [tipo, setTipo] = useState<(typeof CRM_ACTIVITY_TYPES)[number]>("Llamada");
  const [descripcion, setDescripcion] = useState("");
  const [programada, setProgramada] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const upcoming = useMemo(
    () =>
      activities.filter(
        (row) =>
          row.tipo === "Recordatorio" &&
          row.programada_para &&
          new Date(row.programada_para).getTime() > Date.now(),
      ),
    [activities],
  );

  async function persistAudio(file: File) {
    const uploaded = await uploadCrmAudio(file, leadId);
    if (uploaded.error || !uploaded.url) {
      onError(uploaded.error ?? "No se pudo guardar la nota de voz.");
      return;
    }
    setAudioUrl(uploaded.url);
    onError(null);
  }

  async function toggleRecording() {
    if (recording && recorderRef.current) {
      recorderRef.current.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const file = new File([blob], `nota-voz-${Date.now()}.webm`, {
          type: blob.type,
        });
        void persistAudio(file);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      onError(null);
    } catch {
      onError("No se pudo acceder al micrófono. Sube un archivo de audio.");
    }
  }

  function handleSubmit() {
    const formData = new FormData();
    formData.set("prospecto_id", leadId);
    formData.set("tipo", tipo);
    formData.set("descripcion", descripcion);
    if (programada) {
      formData.set("programada_para", new Date(programada).toISOString());
    }
    if (audioUrl) {
      formData.set("audio_url", audioUrl);
    }

    startTransition(async () => {
      const result = await createActividad(formData);
      if (result.error) {
        onError(result.error);
        return;
      }
      if (result.record) {
        onCreated(result.record);
      }
      setDescripcion("");
      setProgramada("");
      setAudioUrl(null);
      onError(null);
    });
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-white/10 p-5">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Historial de actividades
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Llamadas, notas de voz, visitas al dealer y recordatorios.
          {upcoming.length > 0
            ? ` ${upcoming.length} recordatorio${upcoming.length === 1 ? "" : "s"} pendiente${upcoming.length === 1 ? "" : "s"}.`
            : ""}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tipo">
          <SelectInput
            value={tipo}
            onChange={(event) =>
              setTipo(event.target.value as (typeof CRM_ACTIVITY_TYPES)[number])
            }
          >
            {CRM_ACTIVITY_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
        {tipo === "Recordatorio" ? (
          <Field label="Fecha y hora">
            <TextInput
              type="datetime-local"
              value={programada}
              onChange={(event) => setProgramada(event.target.value)}
            />
          </Field>
        ) : (
          <div />
        )}
      </div>
      <Field label="Detalle">
        <TextArea
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
          placeholder="Resumen de la llamada, visita o recordatorio"
        />
      </Field>
      {tipo === "Nota de voz" ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void toggleRecording()}
            className="inline-flex h-10 items-center rounded-full bg-rose-500/15 px-4 text-sm font-semibold text-rose-100 ring-1 ring-rose-400/30"
          >
            {recording ? "Detener grabación" : "Grabar nota de voz"}
          </button>
          <label className="inline-flex h-10 cursor-pointer items-center rounded-full bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10">
            Subir audio
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void persistAudio(file);
                }
              }}
            />
          </label>
          {audioUrl ? (
            <audio controls src={audioUrl} className="h-10 max-w-xs" />
          ) : null}
        </div>
      ) : null}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={pending}
          onClick={handleSubmit}
          className="inline-flex h-10 items-center rounded-full bg-cyan-400 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
        >
          {pending ? "Registrando..." : "Registrar actividad"}
        </button>
      </div>
      <div className="grid gap-3">
        {activities.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-400">
            Aún no hay actividades en esta ficha.
          </p>
        ) : (
          activities.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-white/10 bg-[#07111f] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{row.tipo}</p>
                <p className="text-xs text-slate-500">
                  {new Date(row.created_at).toLocaleString("es-DO")}
                </p>
              </div>
              {row.programada_para ? (
                <p className="mt-1 text-xs text-amber-200">
                  Programada:{" "}
                  {new Date(row.programada_para).toLocaleString("es-DO")}
                </p>
              ) : null}
              {row.descripcion ? (
                <p className="mt-2 text-sm text-slate-300">{row.descripcion}</p>
              ) : null}
              {row.audio_url ? (
                <audio controls src={row.audio_url} className="mt-3 w-full" />
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
