"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const fieldClass = "field-input";

export function QuoteForm({
  submitLabel = "Solicitar asesoría",
  showVehicleInterest = false,
}: {
  submitLabel?: string;
  showVehicleInterest?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const vehiculoInteres = String(formData.get("vehiculoInteres") ?? "").trim();
      const mensajeBase = String(formData.get("mensaje") ?? "").trim();
      const mensaje = [vehiculoInteres ? `Vehículo de interés: ${vehiculoInteres}` : null, mensajeBase]
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
    <form
      action={handleSubmit}
      className="grid gap-4 rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(11,12,16,0.06)]"
    >
      {error ? (
        <p className="rounded-lg border border-line px-4 py-3 text-sm text-muted">
          {error}
        </p>
      ) : null}
      {sent ? (
        <p className="rounded-lg border border-accent/40 px-4 py-3 text-sm text-accent">
          Recibimos tu solicitud. Un asesor de {SITE.shortName} te contactará en breve.
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-muted">
              Nombre
              <input name="nombre" required placeholder="Tu nombre" className={fieldClass} />
            </label>
            <label className="block text-sm text-muted">
              Teléfono
              <input name="telefono" placeholder={SITE.phoneOffice} className={fieldClass} />
            </label>
            <label className="block text-sm text-muted md:col-span-2">
              Correo
              <input
                name="email"
                type="email"
                placeholder={SITE.email}
                className={fieldClass}
              />
            </label>
            {showVehicleInterest ? (
              <label className="block text-sm text-muted md:col-span-2">
                Vehículo de interés
                <input
                  name="vehiculoInteres"
                  placeholder="Marca, modelo, año o VIN"
                  className={fieldClass}
                />
              </label>
            ) : (
              <label className="block text-sm text-muted md:col-span-2">
                VIN (opcional)
                <input name="vin" maxLength={17} placeholder="17 caracteres" className={fieldClass} />
              </label>
            )}
          </div>
          <label className="block text-sm text-muted">
            Mensaje
            <textarea
              name="mensaje"
              placeholder="Cuéntanos si buscas venta local, financiamiento o importación por encargo"
              className="mt-2 min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary disabled:opacity-60"
          >
            {pending ? "Enviando..." : submitLabel}
          </button>
        </>
      )}
    </form>
  );
}
