"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCopartLotToOpportunities } from "@/app/actions/copart";
import { COPART_DUPLICATE_LOT_MESSAGE } from "@/lib/auction-providers/copart/opportunity";

export function AdminCopartAddButton({ lotNumber }: { lotNumber: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  async function add() {
    setPending(true);
    setMessage(null);
    setDuplicateId(null);
    const result = await addCopartLotToOpportunities(lotNumber);
    setPending(false);
    if (result.duplicate && result.id) {
      setMessage(COPART_DUPLICATE_LOT_MESSAGE);
      setDuplicateId(result.id);
      return;
    }
    if (result.error) {
      setMessage(result.error);
      return;
    }
    if (result.id) {
      router.push(`/admin/subastas/${result.id}`);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => void add()}
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--admin-text)] px-4 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Agregar a oportunidades"}
      </button>
      {message ? (
        <p className="text-sm text-[var(--admin-text-secondary)]" role="status">
          {message}{" "}
          {duplicateId ? (
            <a href={`/admin/subastas/${duplicateId}`} className="font-medium text-[var(--admin-text)] underline-offset-2 hover:underline">
              Ver oportunidad
            </a>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
