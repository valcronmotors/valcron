const SECRET_RE =
  /(service[_-]?role[^,\s]*|bearer\s+[a-z0-9._\-]+|eyJ[a-zA-Z0-9_-]{20,}|apikey|authorization|sb_secret_[a-z0-9]+)/gi;

export type CopartInsertBatchMeta = {
  batchNumber: number;
  csvRowsRead: number;
  rowCount: number;
  lotNumbers: string[];
};

export function redactIngestErrorText(value: string | null | undefined) {
  return String(value ?? "")
    .replace(SECRET_RE, "[redacted]")
    .replace(/https?:\/\/[^\s"'\\]+/gi, (url) => {
      try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname}`;
      } catch {
        return "[url]";
      }
    })
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

export function formatCopartInsertError(
  error: {
    code?: string | null;
    message?: string | null;
    details?: string | null;
    hint?: string | null;
  } | null,
  meta: CopartInsertBatchMeta,
) {
  const lots = meta.lotNumbers.filter(Boolean).slice(0, 3).join(", ");
  const db = [
    error?.code ? `code=${error.code}` : null,
    error?.message ? `message=${redactIngestErrorText(error.message)}` : null,
    error?.details ? `details=${redactIngestErrorText(error.details)}` : null,
    error?.hint ? `hint=${redactIngestErrorText(error.hint)}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return `No se pudo guardar el lote Copart #${meta.batchNumber} (CSV leídas=${meta.csvRowsRead}, filas=${meta.rowCount}${lots ? `, lotes ${lots}` : ""})${db ? `: ${db}` : "."}`;
}
