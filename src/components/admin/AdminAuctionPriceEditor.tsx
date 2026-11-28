"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveVehicleAuctionPurchaseEstimate } from "@/app/actions/vehicles";
import {
  AUCTION_PROFIT_USD,
  auctionFeesTotalUsd,
  auctionPublicPriceUsd,
  type AuctionFeeProvider,
} from "@/lib/auction-price";
import { formatDecimal } from "@/lib/money";
import { AdminField, AdminInput, AdminPrimaryButton, AdminSelect } from "@/components/admin/ui";

/**
 * Precio público de subasta (fórmula de Gabriel, 2026-11-27): el admin registra
 * la compra estimada del lote y el website publica compra + fees + US$1,500.
 * Sustituye al estimado «puesto en RD» como precio publicado.
 */
export function AdminAuctionPriceEditor({
  vehicleId,
  amount,
}: {
  vehicleId?: string | null;
  amount?: number | null;
}) {
  const [value, setValue] = useState(amount != null ? String(amount) : "");
  const [provider, setProvider] = useState<AuctionFeeProvider>("copart");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const purchase = Number(value);
  const publicPrice = auctionPublicPriceUsd(purchase, provider);
  const fees = Number.isFinite(purchase) && purchase > 0 ? auctionFeesTotalUsd(purchase, provider) : null;

  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-[var(--admin-border)] p-4">
      <AdminField label="Compra estimada en subasta (US$)">
        <AdminInput type="number" inputMode="decimal" min="0.01" step="0.01" value={value} onChange={(event) => { setValue(event.target.value); setNotice(null); }} />
      </AdminField>
      <AdminField label="Plataforma (para los fees)">
        <AdminSelect value={provider} onChange={(event) => setProvider(event.target.value as AuctionFeeProvider)}>
          <option value="copart">Copart</option>
          <option value="iaai">IAAI</option>
        </AdminSelect>
      </AdminField>
      <p className="text-xs text-[var(--admin-text-muted)]">
        Precio público = compra estimada + fees de subasta + US${formatDecimal(AUCTION_PROFIT_USD, 0)} de ganancia.
        {publicPrice != null && fees != null
          ? <> Con esta compra, el website publicará <strong>US${formatDecimal(publicPrice, 0)}</strong> (fees estimados: US${formatDecimal(fees, 0)}).</>
          : " Sin compra estimada, la ficha mantiene el precio anterior."}
        {" "}El precio publicado ya no incluye flete, impuestos ni placa: se cotizan aparte.
      </p>
      {!vehicleId ? <p className="text-xs text-[var(--admin-text-muted)]">Guarda primero el vehículo y sus fotos para habilitar este precio.</p> : null}
      {notice ? <p role="status" className="text-sm text-[var(--admin-text)]">{notice}</p> : null}
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <AdminPrimaryButton type="button" disabled={pending || !vehicleId} onClick={() => startTransition(async () => {
        setError(null); setNotice(null);
        try {
          const form = new FormData(); form.set("id", vehicleId!); form.set("auction_purchase_estimate_usd", value);
          const result = await saveVehicleAuctionPurchaseEstimate(form);
          if (result.error) setError(result.error); else { setNotice(result.success ?? "Guardado."); router.refresh(); }
        } catch { setError("No se pudo guardar la compra estimada. Intenta de nuevo."); }
      })}>{pending ? "Guardando…" : "Guardar compra estimada"}</AdminPrimaryButton>
    </div>
  );
}
