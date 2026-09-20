"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const fieldClass = "field-input";

const SUBJECTS = [
  "Comprar vehículo",
  "Importar vehículo",
  "Subasta USA",
  "Financiamiento",
  "Solicitar vehículo",
  "Otro",
] as const;

export function QuoteForm({
  submitLabel = "Solicitar asesoría",
  showVehicleInterest = false,
  showSubject = false,
}: {
  submitLabel?: string;
  showVehicleInterest?: boolean;
  showSubject?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const asunto = String(formData.get("asunto") ?? "").trim();
      const vehiculoInteres = String(formData.get("vehiculoInteres") ?? "").trim();
      const mensajeBase = String(formData.get("mensaje") ?? "").trim();
      const mensaje = [
        asunto ? `Asunto: ${asunto}` : null,
        vehiculoInteres ? `Vehículo de interés: ${vehiculoInteres}` : null,
        mensajeBase,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          telefono: formData.get("telefono"),
          email: formData.get("email"),
          vin: formData.get("vin"),
          mensaje,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "No se pudo enviar la solicitud.");
        return;
      }
      setSent(true);
    } catch {
      setError("No se pudo enviar la solicitud. Intenta de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4 rounded-[1.35rem] border border-[#ececea] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
      {error ? (
        <p className="rounded-lg border border-[#ececea] px-4 py-3 text-sm text-[#525252]">{error}</p>
      ) : null}
      {sent ? (
        <p className="rounded-lg border border-[#C7A96B]/40 px-4 py-3 text-sm text-[#111]">
          Recibimos tu solicitud. Un asesor de {SITE.shortName} te contactará en breve.
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-[#525252]">
              Nombre
              <input name="nombre" required placeholder="Tu nombre" className={fieldClass} />
            </label>
            <label className="block text-sm text-[#525252]">
              Teléfono
              <input name="telefono" placeholder={SITE.officePhoneDisplay} className={fieldClass} />
            </label>
            {showSubject ? (
              <label className="block text-sm text-[#525252] md:col-span-2">
                ¿En qué podemos ayudarte?
                <select name="asunto" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="block text-sm text-[#525252] md:col-span-2">
              Correo
              <input name="email" type="email" placeholder="Tu correo electrónico" className={fieldClass} />
            </label>
            {showVehicleInterest ? (
              <label className="block text-sm text-[#525252] md:col-span-2">
                Vehículo de interés
                <input
                  name="vehiculoInteres"
                  placeholder="Marca, modelo, año o VIN"
                  className={fieldClass}
                />
              </label>
            ) : (
              <label className="block text-sm text-[#525252] md:col-span-2">
                VIN (opcional)
                <input name="vin" maxLength={17} placeholder="17 caracteres" className={fieldClass} />
              </label>
            )}
          </div>
          <label className="block text-sm text-[#525252]">
            Mensaje
            <textarea
              name="mensaje"
              placeholder="Cuéntanos marca, modelo, año o el tipo de proceso que te interesa"
              className="field-input mt-2 h-auto min-h-24 py-2"
            />
          </label>
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
            {pending ? "Enviando..." : submitLabel}
          </button>
        </>
      )}
    </form>
  );
}
