"use client";

import {
  type AuctionEligibilityResult,
  type EligibilityCheckId,
  verdictLabel,
} from "@/lib/auctions/eligibility";

const FIELD_ANCHORS: Record<EligibilityCheckId, EditorStepHint> = {
  vin: { step: 1, anchor: "vin" },
  title: { step: 2, anchor: "title_status" },
  odometer: { step: 2, anchor: "odometer_status" },
  primary_damage: { step: 2, anchor: "primary_damage" },
  secondary_damage: { step: 2, anchor: "secondary_damage" },
  run_and_drive: { step: 2, anchor: "run_and_drive" },
};

type EditorStepHint = { step: 0 | 1 | 2 | 3 | 4; anchor: string };

function verdictClass(verdict: "approved" | "blocked" | "review") {
  if (verdict === "approved") {
    return "border-[var(--admin-success)]/20 bg-[var(--admin-success-bg)] text-[var(--admin-success)]";
  }
  if (verdict === "blocked") {
    return "border-[var(--admin-danger)]/20 bg-[var(--admin-danger-bg)] text-[var(--admin-danger)]";
  }
  return "border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]";
}

function overallClass(overall: AuctionEligibilityResult["overall"]) {
  if (overall === "eligible") {
    return "border-[var(--admin-success)]/25 bg-[var(--admin-success-bg)] text-[var(--admin-success)]";
  }
  if (overall === "blocked") {
    return "border-[var(--admin-danger)]/25 bg-[var(--admin-danger-bg)] text-[var(--admin-danger)]";
  }
  return "border-[var(--admin-warning)]/25 bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]";
}

export function AdminAuctionEligibilityPanel({
  result,
  onJump,
  compact = false,
}: {
  result: AuctionEligibilityResult;
  onJump?: (step: 0 | 1 | 2 | 3 | 4, anchor: string) => void;
  compact?: boolean;
}) {
  return (
    <section
      aria-labelledby="verificacion-valcron"
      className={`rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] ${
        compact ? "p-3" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="verificacion-valcron"
            className="font-display text-base font-semibold tracking-tight text-[var(--admin-text)] sm:text-lg"
          >
            Verificación Valcron
          </h2>
          <p className="mt-1 text-xs leading-5 text-[var(--admin-text-muted)]">
            Criterios internos de selección comercial. No certifica aduana, DR-CAFTA ni inspección mecánica.
          </p>
        </div>
        <span
          className={`inline-flex min-h-8 items-center rounded-lg border px-3 text-xs font-semibold tracking-wide ${overallClass(
            result.overall,
          )}`}
        >
          {result.overallLabel}
        </span>
      </div>

      <ul className={`mt-3 grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        {result.checks.map((check) => {
          const hint = FIELD_ANCHORS[check.id];
          return (
            <li
              key={check.id}
              className={`rounded-lg border px-3 py-2.5 ${verdictClass(check.verdict)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--admin-text)]">
                    {check.label}: {verdictLabel(check.verdict)}
                  </p>
                  {check.reason ? (
                    <p className="mt-1 text-xs leading-5 text-current/90">{check.reason}</p>
                  ) : null}
                </div>
                {onJump && check.verdict !== "approved" ? (
                  <button
                    type="button"
                    className="shrink-0 text-xs font-medium underline underline-offset-2"
                    onClick={() => onJump(hint.step, hint.anchor)}
                  >
                    Corregir
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
