export function copartFeedIsStale(importedAt: string | null | undefined, now = Date.now(), maxAgeMs = 24 * 60 * 60 * 1000) {
  if (!importedAt) return true;
  const time = new Date(importedAt).getTime();
  if (Number.isNaN(time)) return true;
  return now - time > maxAgeMs;
}

export function copartFreshnessCopy(importedAt: string | null | undefined, now = Date.now()) {
  if (!importedAt) {
    return {
      label: "Última actualización del inventario Copart",
      value: "sin carga",
      stale: true,
      warning: "Todavía no hay un inventario Copart cargado. Importa el CSV oficial.",
    };
  }

  const stale = copartFeedIsStale(importedAt, now);
  const formatted = new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(importedAt));

  return {
    label: "Última actualización del inventario Copart",
    value: formatted,
    stale,
    warning: stale
      ? "Estos datos no son en tiempo real. El inventario Copart puede estar desactualizado."
      : null,
  };
}
