"use client";

import { useMemo, useState } from "react";
import {
  AdminCard,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTextArea,
} from "@/components/admin/ui";
import {
  parseAuctionPasteText,
  type ParseAuctionPasteResult,
  type ParsedAuctionField,
} from "@/lib/auctions/paste-parser";

export type PasteApplyDecision = Record<string, { apply: boolean; value: string }>;

const FORM_KEYS: Array<{ fieldKey: ParsedAuctionField["key"]; formKey: string }> = [
  { fieldKey: "year", formKey: "year" },
  { fieldKey: "make", formKey: "make" },
  { fieldKey: "model", formKey: "model" },
  { fieldKey: "trim", formKey: "trim" },
  { fieldKey: "provider_lot_id", formKey: "provider_lot_id" },
  { fieldKey: "vin", formKey: "vin" },
  { fieldKey: "location", formKey: "location" },
  { fieldKey: "auction_date", formKey: "auction_date" },
  { fieldKey: "auction_sale_status", formKey: "auction_sale_status" },
  { fieldKey: "seller_type", formKey: "seller_type" },
  { fieldKey: "body_style", formKey: "body_style" },
  { fieldKey: "fuel", formKey: "fuel" },
  { fieldKey: "engine", formKey: "engine" },
  { fieldKey: "transmission", formKey: "transmission" },
  { fieldKey: "drivetrain", formKey: "drivetrain" },
  { fieldKey: "exterior_color", formKey: "exterior_color" },
  { fieldKey: "mileage", formKey: "mileage" },
  { fieldKey: "mileage_unit", formKey: "mileage_unit" },
  { fieldKey: "odometer_status", formKey: "odometer_status" },
  { fieldKey: "primary_damage", formKey: "primary_damage" },
  { fieldKey: "secondary_damage", formKey: "secondary_damage" },
  { fieldKey: "keys", formKey: "keys" },
  { fieldKey: "run_and_drive", formKey: "run_and_drive" },
  { fieldKey: "title_status", formKey: "title_status" },
  { fieldKey: "notes", formKey: "internal_notes" },
  { fieldKey: "source_url", formKey: "source_url" },
  { fieldKey: "price_mode", formKey: "price_mode" },
  { fieldKey: "buy_now_usd", formKey: "buy_now_usd" },
  { fieldKey: "highlights", formKey: "description" },
];

export function AdminAuctionPastePanel({
  currentValues,
  onApply,
}: {
  currentValues: Record<string, string>;
  onApply: (patch: Record<string, string>, meta: { providerHint: ParseAuctionPasteResult["providerHint"] }) => void;
}) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ParseAuctionPasteResult | null>(null);
  const [decisions, setDecisions] = useState<PasteApplyDecision>({});
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!parsed) return [];
    return FORM_KEYS.map(({ fieldKey, formKey }) => {
      const field = parsed.byKey[fieldKey];
      if (!field) return null;
      const current = (currentValues[formKey] ?? "").trim();
      const incoming = field.value;
      const conflict = Boolean(current && current !== incoming);
      return { fieldKey, formKey, field, current, incoming, conflict };
    }).filter(Boolean) as Array<{
      fieldKey: ParsedAuctionField["key"];
      formKey: string;
      field: ParsedAuctionField;
      current: string;
      incoming: string;
      conflict: boolean;
    }>;
  }, [parsed, currentValues]);

  function handleParse() {
    setError(null);
    if (!text.trim()) {
      setError("Pega el texto del lote antes de completar los campos.");
      return;
    }
    const result = parseAuctionPasteText(text);
    if (!result.fields.length) {
      setError("No detectamos campos reconocibles. Revisa el texto o completa manualmente.");
      setParsed(null);
      return;
    }
    const next: PasteApplyDecision = {};
    for (const { fieldKey, formKey } of FORM_KEYS) {
      const field = result.byKey[fieldKey];
      if (!field) continue;
      const current = (currentValues[formKey] ?? "").trim();
      next[formKey] = {
        apply: !current || current === field.value,
        value: field.value,
      };
      // Conflicts default to keep existing unless user opts in.
      if (current && current !== field.value) {
        next[formKey] = { apply: false, value: field.value };
      }
    }
    setDecisions(next);
    setParsed(result);
  }

  function apply() {
    if (!parsed) return;
    const patch: Record<string, string> = {};
    for (const [formKey, decision] of Object.entries(decisions)) {
      if (decision.apply && decision.value) {
        patch[formKey] = decision.value;
      }
    }
    // Description: use highlights if description empty / selected
    if (parsed.byKey.highlights && decisions.description?.apply) {
      const parts = [
        parsed.byKey.highlights.value,
        parsed.byKey.engine_starts?.value,
        parsed.byKey.transmission_engages?.value,
      ].filter(Boolean);
      patch.description = parts.join(". ");
    }
    onApply(patch, { providerHint: parsed.providerHint });
    setParsed(null);
  }

  return (
    <AdminCard>
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">
          Completar datos desde texto
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">
          Copia la información del vehículo desde Copart, IAA o Manheim. Pégala aquí y completaremos los
          campos automáticamente.
        </p>
      </div>

      <AdminTextArea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Pega aquí el texto del lote (Copart, IAA o Manheim)…"
        className="font-mono text-[13px]"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <AdminPrimaryButton type="button" onClick={handleParse}>
          Completar campos automáticamente
        </AdminPrimaryButton>
        <AdminSecondaryButton
          type="button"
          onClick={() => {
            setText("");
            setParsed(null);
            setDecisions({});
            setError(null);
          }}
        >
          Limpiar texto
        </AdminSecondaryButton>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] px-3 py-2 text-sm text-[var(--admin-warning)]">
          {error}
        </p>
      ) : null}

      {parsed ? (
        <div className="mt-5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
          <h3 className="font-display text-base font-semibold text-[var(--admin-text)]">Datos detectados</h3>
          {parsed.warnings.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[var(--admin-warning)]">
              {parsed.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 grid gap-3">
            {rows.map((row) => (
              <label
                key={row.formKey}
                className="grid gap-1 rounded-lg border border-[var(--admin-border)] bg-white p-3 text-sm"
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-[var(--admin-text)]">{row.field.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      row.field.confidence === "high"
                        ? "bg-[var(--admin-success-bg)] text-[var(--admin-success)]"
                        : row.field.confidence === "review"
                          ? "bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]"
                          : "bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]"
                    }`}
                  >
                    {row.field.confidence === "high"
                      ? "Alta"
                      : row.field.confidence === "review"
                        ? "Revisar"
                        : "Media"}
                  </span>
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text)]"
                  value={decisions[row.formKey]?.value ?? row.incoming}
                  onChange={(event) =>
                    setDecisions((current) => ({
                      ...current,
                      [row.formKey]: {
                        apply: current[row.formKey]?.apply ?? true,
                        value: event.target.value,
                      },
                    }))
                  }
                />
                {row.conflict ? (
                  <span className="text-xs text-[var(--admin-warning)]">
                    Actual: {row.current}. Marca para reemplazar.
                  </span>
                ) : null}
                <span className="mt-1 inline-flex items-center gap-2 text-xs text-[var(--admin-text-secondary)]">
                  <input
                    type="checkbox"
                    checked={Boolean(decisions[row.formKey]?.apply)}
                    onChange={(event) =>
                      setDecisions((current) => ({
                        ...current,
                        [row.formKey]: {
                          apply: event.target.checked,
                          value: current[row.formKey]?.value ?? row.incoming,
                        },
                      }))
                    }
                  />
                  Aplicar este campo
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <AdminPrimaryButton type="button" onClick={apply}>
              Aplicar datos al formulario
            </AdminPrimaryButton>
            <AdminSecondaryButton type="button" onClick={() => setParsed(null)}>
              Cancelar
            </AdminSecondaryButton>
          </div>
        </div>
      ) : null}
    </AdminCard>
  );
}
