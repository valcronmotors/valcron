"use client";

import { useState } from "react";
import { Field, FormError, TextArea, TextInput } from "@/components/form-fields";
import { SITE } from "@/lib/site";

export function QuoteForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          telefono: formData.get("telefono"),
          email: formData.get("email"),
          vin: formData.get("vin"),
          mensaje: formData.get("mensaje"),
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
      className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#12141C]/80 p-6 backdrop-blur-xl"
    >
      <FormError message={error} />
      {sent ? (
        <p className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#FFD700]">
          Recibimos tu solicitud. Un asesor de {SITE.shortName} te contactará en breve.
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre">
              <TextInput name="nombre" required placeholder="Tu nombre" />
            </Field>
            <Field label="Teléfono">
              <TextInput name="telefono" placeholder={SITE.phoneOffice} />
            </Field>
            <Field label="Correo">
              <TextInput name="email" type="email" placeholder={SITE.email} />
            </Field>
            <Field label="VIN (opcional)">
              <TextInput name="vin" maxLength={17} placeholder="17 caracteres" />
            </Field>
          </div>
          <Field label="Mensaje">
            <TextArea
              name="mensaje"
              placeholder="Cuéntanos si buscas venta local, financiamiento o importación por encargo"
            />
          </Field>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF5500] px-6 text-sm font-semibold text-white transition hover:bg-[#ff6a1a] disabled:opacity-60"
          >
            {pending ? "Enviando..." : "Solicitar asesoría"}
          </button>
        </>
      )}
    </form>
  );
}
