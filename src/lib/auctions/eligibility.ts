/**
 * Valcron internal commercial eligibility rules for auction opportunities.
 * Not customs clearance, DR-CAFTA certification, or a mechanical inspection.
 */

export type EligibilityVerdict = "approved" | "blocked" | "review";

export type EligibilityOverall = "eligible" | "blocked" | "review_required";

export type EligibilityCheckId =
  | "vin"
  | "title"
  | "odometer"
  | "primary_damage"
  | "secondary_damage"
  | "run_and_drive";

export type EligibilityCheckResult = {
  id: EligibilityCheckId;
  label: string;
  verdict: EligibilityVerdict;
  reason: string | null;
  detected?: string | null;
};

export type AuctionEligibilityInput = {
  vin?: string | null;
  title_status?: string | null;
  odometer_status?: string | null;
  primary_damage?: string | null;
  secondary_damage?: string | null;
  run_and_drive?: string | null;
};

export type AuctionEligibilityResult = {
  overall: EligibilityOverall;
  overallLabel: string;
  checks: EligibilityCheckResult[];
  canPublish: boolean;
  blockedReasons: string[];
  reviewReasons: string[];
};

const VIN_ALLOWED_PREFIXES = new Set(["1", "4", "5", "7"]);
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

const TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

export function normalizeEligibilityText(value: string | null | undefined) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeVin(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "");
}

export function vinCheckDigitValid(vin: string) {
  if (!VIN_RE.test(vin)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i += 1) {
    const char = vin[i]!;
    const value = /\d/.test(char) ? Number(char) : TRANSLITERATION[char];
    if (value == null || !Number.isFinite(value)) return false;
    sum += value * WEIGHTS[i]!;
  }
  const remainder = sum % 11;
  const expected = remainder === 10 ? "X" : String(remainder);
  return vin[8] === expected;
}

export function evaluateVinEligibility(raw: string | null | undefined): EligibilityCheckResult {
  const label = "VIN";
  const original = String(raw ?? "");
  const vin = normalizeVin(raw);
  if (!vin) {
    return {
      id: "vin",
      label,
      verdict: "review",
      reason: "VIN incompleto. Introduce y verifica el VIN completo para continuar.",
    };
  }
  // Masked / placeholder characters must never pass (e.g. 7FARS6H97TE******).
  if (/[*_?]/.test(original) || /\*{2,}|\.{3,}|_{2,}/.test(original) || /[*_?]/.test(vin)) {
    return {
      id: "vin",
      label,
      verdict: "review",
      reason: "VIN incompleto. Introduce y verifica el VIN completo para continuar.",
      detected: vin,
    };
  }
  if (vin.length !== 17 || !VIN_RE.test(vin)) {
    return {
      id: "vin",
      label,
      verdict: "review",
      reason: "VIN incompleto. Introduce y verifica el VIN completo para continuar.",
      detected: vin,
    };
  }
  if (!VIN_ALLOWED_PREFIXES.has(vin[0]!)) {
    return {
      id: "vin",
      label,
      verdict: "blocked",
      reason: "Bloqueado por política Valcron: el VIN no comienza con 1, 4, 5 o 7.",
      detected: vin,
    };
  }
  if (!vinCheckDigitValid(vin)) {
    return {
      id: "vin",
      label,
      verdict: "review",
      reason: "VIN incompleto. Introduce y verifica el VIN completo para continuar.",
      detected: vin,
    };
  }
  return { id: "vin", label, verdict: "approved", reason: null, detected: vin };
}

type PhraseRule = { id: string; phrases: string[] };

const PROHIBITED_TITLE_RULES: PhraseRule[] = [
  { id: "certificate_of_destruction", phrases: ["certificate of destruction", "cert of destruction", "cod"] },
  { id: "junk", phrases: ["junk title", "junk"] },
  { id: "parts_only", phrases: ["parts only", "parts only title"] },
  { id: "non_repairable", phrases: ["non repairable", "nonrepairable", "not repairable"] },
  { id: "bill_of_sale", phrases: ["bill of sale", "bills of sale"] },
];

function matchesPhrase(normalized: string, phrase: string) {
  if (!normalized || !phrase) return false;
  if (phrase === "cod") {
    return /(^|\s)cod(\s|$)/.test(normalized);
  }
  if (phrase === "junk") {
    return /(^|\s)junk(\s|$)/.test(normalized) || normalized.includes("junk title");
  }
  return normalized.includes(phrase);
}

export function evaluateTitleEligibility(raw: string | null | undefined): EligibilityCheckResult {
  const label = "Title";
  const normalized = normalizeEligibilityText(raw);
  if (!normalized || normalized === "unknown" || normalized === "otro" || normalized === "other") {
    return {
      id: "title",
      label,
      verdict: "review",
      reason: "Tipo de documento ausente o poco claro. Verifica el título antes de publicar.",
      detected: raw?.trim() || null,
    };
  }
  for (const rule of PROHIBITED_TITLE_RULES) {
    if (rule.phrases.some((phrase) => matchesPhrase(normalized, phrase))) {
      return {
        id: "title",
        label,
        verdict: "blocked",
        reason: "Bloqueado: tipo de documento no permitido por la política de Valcron.",
        detected: raw?.trim() || rule.id,
      };
    }
  }
  // Unknown document types require explicit review. Do not infer approval merely
  // because the text is absent from the prohibited list.
  const recognized = /^(?:(?:[a-z]{2}) )?(?:(?:clean|clear|salvage|rebuilt|reconstructed)(?: vehicle)?(?: title)?|(?:vehicle )?certificate of title|title clean|title salvage)$/;
  if (!recognized.test(normalized)) {
    return {
      id: "title",
      label,
      verdict: "review",
      reason: "Tipo de documento no reconocido. Verifica el título antes de publicar.",
      detected: raw?.trim() || null,
    };
  }
  return { id: "title", label, verdict: "approved", reason: null, detected: raw?.trim() || null };
}

export function evaluateOdometerEligibility(raw: string | null | undefined): EligibilityCheckResult {
  const label = "Odometer";
  const normalized = normalizeEligibilityText(raw);
  if (!normalized) {
    return {
      id: "odometer",
      label,
      verdict: "review",
      reason: "Bloqueado: el odómetro debe estar verificado como Actual.",
    };
  }
  if (
    normalized === "actual" ||
    normalized === "actual mileage" ||
    normalized === "odometer actual" ||
    normalized === "mileage actual"
  ) {
    return { id: "odometer", label, verdict: "approved", reason: null, detected: raw?.trim() || "Actual" };
  }
  return {
    id: "odometer",
    label,
    verdict: "blocked",
    reason: "Bloqueado: el odómetro debe estar verificado como Actual.",
    detected: raw?.trim() || normalized,
  };
}

const PROHIBITED_DAMAGE_RULES: Array<{ id: string; phrases: string[]; display: string }> = [
  { id: "water_flood", phrases: ["water flood", "flood water", "flood", "water damage", "water"], display: "Water / Flood" },
  { id: "burn", phrases: ["burn engine", "burn interior", "burn"], display: "Burn" },
  {
    id: "partial_incomplete_repair",
    phrases: ["partial incomplete repair", "incomplete repair", "partial repair"],
    display: "Partial / Incomplete Repair",
  },
  { id: "rejected_repair", phrases: ["rejected repair"], display: "Rejected Repair" },
];

function matchProhibitedDamage(raw: string | null | undefined) {
  const normalized = normalizeEligibilityText(raw);
  if (!normalized || normalized === "none" || normalized === "not reported" || normalized === "no visible damage") {
    return null;
  }
  for (const rule of PROHIBITED_DAMAGE_RULES) {
    for (const phrase of rule.phrases) {
      if (phrase === "water") {
        // Avoid matching unrelated words; require water as a damage token.
        if (/(^|\s)water(\s|$)/.test(normalized) || normalized.includes("water damage")) {
          return rule;
        }
        continue;
      }
      if (phrase === "burn") {
        if (/(^|\s)burn(\s|$)/.test(normalized) || normalized.startsWith("burn ")) {
          return rule;
        }
        continue;
      }
      if (phrase === "flood") {
        if (/(^|\s)flood(\s|$)/.test(normalized) || normalized.includes("flood")) {
          return rule;
        }
        continue;
      }
      if (normalized.includes(phrase)) return rule;
    }
  }
  return null;
}

export function evaluateDamageEligibility(
  raw: string | null | undefined,
  id: "primary_damage" | "secondary_damage",
): EligibilityCheckResult {
  const label = id === "primary_damage" ? "Primary Damage" : "Secondary Damage";
  const normalized = normalizeEligibilityText(raw);
  if (!normalized || normalized === "unknown" || normalized === "uncertain") {
    return {
      id,
      label,
      verdict: "review",
      reason: "Información de daño ausente o incierta. Verifica el daño antes de publicar.",
    };
  }
  if (
    id === "secondary_damage" &&
    (normalized === "none" || normalized === "not reported" || normalized === "no visible damage")
  ) {
    return { id, label, verdict: "approved", reason: null, detected: raw?.trim() || null };
  }
  if (id === "primary_damage" && (normalized === "not reported" || normalized === "none")) {
    return {
      id,
      label,
      verdict: "review",
      reason: "Información de daño ausente o incierta. Verifica el daño antes de publicar.",
      detected: raw?.trim() || null,
    };
  }
  const hit = matchProhibitedDamage(raw);
  if (hit) {
    return {
      id,
      label,
      verdict: "blocked",
      reason: `Bloqueado: el vehículo presenta un tipo de daño excluido por Valcron (${hit.display}).`,
      detected: raw?.trim() || hit.display,
    };
  }
  return { id, label, verdict: "approved", reason: null, detected: raw?.trim() || null };
}

export function evaluateRunAndDriveEligibility(raw: string | null | undefined): EligibilityCheckResult {
  const label = "Run and Drive";
  const normalized = normalizeEligibilityText(raw);
  if (!normalized || normalized === "not reported" || normalized === "unknown" || normalized === "other") {
    return {
      id: "run_and_drive",
      label,
      verdict: "blocked",
      reason: "Bloqueado: Valcron solo publica oportunidades identificadas como Run and Drive.",
      detected: raw?.trim() || null,
    };
  }
  if (
    normalized.includes("not running") ||
    normalized === "starts" ||
    normalized === "engine starts" ||
    normalized === "transmission engages" ||
    normalized === "enhanced vehicle"
  ) {
    return {
      id: "run_and_drive",
      label,
      verdict: "blocked",
      reason: "Bloqueado: Valcron solo publica oportunidades identificadas como Run and Drive.",
      detected: raw?.trim() || normalized,
    };
  }
  // Accept only affirmative provider-reported labels. Free-text substring
  // matching could approve "Not Run and Drive" or "Run and Drive: No".
  if (normalized === "run and drive" || normalized === "reported run and drive") {
    return {
      id: "run_and_drive",
      label,
      verdict: "approved",
      reason: null,
      detected: raw?.trim() || "Run and Drive",
    };
  }
  return {
    id: "run_and_drive",
    label,
    verdict: "blocked",
    reason: "Bloqueado: Valcron solo publica oportunidades identificadas como Run and Drive.",
    detected: raw?.trim() || normalized,
  };
}

export function evaluateAuctionEligibility(input: AuctionEligibilityInput): AuctionEligibilityResult {
  const checks: EligibilityCheckResult[] = [
    evaluateVinEligibility(input.vin),
    evaluateTitleEligibility(input.title_status),
    evaluateOdometerEligibility(input.odometer_status),
    evaluateDamageEligibility(input.primary_damage, "primary_damage"),
    evaluateDamageEligibility(input.secondary_damage, "secondary_damage"),
    evaluateRunAndDriveEligibility(input.run_and_drive),
  ];

  const blockedReasons = checks
    .filter((check) => check.verdict === "blocked")
    .map((check) => check.reason)
    .filter((reason): reason is string => Boolean(reason));
  const reviewReasons = checks
    .filter((check) => check.verdict === "review")
    .map((check) => check.reason)
    .filter((reason): reason is string => Boolean(reason));

  let overall: EligibilityOverall = "eligible";
  let overallLabel = "APROBADO";
  if (blockedReasons.length) {
    overall = "blocked";
    overallLabel = "BLOQUEADO";
  } else if (reviewReasons.length) {
    overall = "review_required";
    overallLabel = "REQUIERE REVISIÓN";
  }

  return {
    overall,
    overallLabel,
    checks,
    canPublish: overall === "eligible",
    blockedReasons,
    reviewReasons,
  };
}

export function eligibilityPublicationBlockMessage(result: AuctionEligibilityResult) {
  if (result.canPublish) return null;
  if (result.overall === "blocked") {
    return `Publicación bloqueada. ${result.blockedReasons.join(" ")}`;
  }
  return `Completar revisión. ${result.reviewReasons.join(" ")}`;
}

export function verdictLabel(verdict: EligibilityVerdict) {
  if (verdict === "approved") return "Approved";
  if (verdict === "blocked") return "Blocked";
  return "Review Required";
}
