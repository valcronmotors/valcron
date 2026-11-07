// Warnings remain in the stored description for the admin. Only the public
// projection omits diagnostic sentences, including legacy auction templates.
const internalNotice = /\b(?:advertencias?|warnings?|daños?|damage|condici[oó]n|run\s+(?:and|&)\s+drive)\b|tipo\s+de\s+t[ií]tulo\s+por\s+confirmar|\bvin\b[^.!?]*\b(?:no\s+(?:legible|confirmad[oa]|verificad[oa]|disponible)|incompleto)|(?:airbags?|bolsas?\s+de\s+aire)[^.!?]*(?:desplegad|activad|deployed|detonad|disparad|dañad|no\s+funcion)/i;
const sentences = new Intl.Segmenter("es", { granularity: "sentence" });

export function publicVehicleDescription(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text) return null;
  return [...sentences.segment(text)]
    .map(({ segment }) => segment)
    .filter((segment) => !internalNotice.test(segment))
    .join("")
    .trim() || null;
}
