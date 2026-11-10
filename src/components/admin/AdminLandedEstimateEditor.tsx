"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveVehicleLandedEstimate } from "@/app/actions/vehicles";
import { AdminField, AdminInput, AdminPrimaryButton } from "@/components/admin/ui";

export function AdminLandedEstimateEditor({ vehicleId, amount, validated }: { vehicleId?: string | null; amount?: number | null; validated?: boolean }) {
  const [value, setValue] = useState(amount != null ? String(amount) : "");
  const [confirmed, setConfirmed] = useState(Boolean(validated));
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-[var(--admin-border)] p-4">
      <AdminField label="Estimado puesto en RD (US$)">
        <AdminInput type="number" inputMode="decimal" min="0.01" step="0.01" value={value} onChange={(event) => { setValue(event.target.value); setConfirmed(false); setNotice(null); }} />
      </AdminField>
      <label className="flex items-start gap-2 text-sm text-[var(--admin-text)]"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1" />Confirmo que este estimado está validado por Valcron para este lote y coincide con el publicado en redes.</label>
      <p className="text-xs text-[var(--admin-text-muted)]">Incluye el total estimado puesto en RD. No es el Buy Now ni la oferta de compra en subasta. Sin validar, el website mantiene «Precio a consultar». Guarda este campo con su propio botón.</p>
      {!vehicleId ? <p className="text-xs text-[var(--admin-text-muted)]">Guarda primero el vehículo y sus fotos para habilitar el estimado.</p> : null}
      {notice ? <p role="status" className="text-sm text-[var(--admin-text)]">{notice}</p> : null}
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <AdminPrimaryButton type="button" disabled={pending || !vehicleId} onClick={() => startTransition(async () => {
        setError(null); setNotice(null);
        try {
          const form = new FormData(); form.set("id", vehicleId!); form.set("landed_estimate_usd", value); form.set("validated", String(confirmed));
          const result = await saveVehicleLandedEstimate(form);
          if (result.error) setError(result.error); else { setNotice(result.success ?? "Guardado."); router.refresh(); }
        } catch { setError("No se pudo guardar el estimado. Intenta de nuevo."); }
      })}>{pending ? "Guardando…" : "Guardar estimado puesto en RD"}</AdminPrimaryButton>
    </div>
  );
}
