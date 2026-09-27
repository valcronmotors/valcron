type DbErrorLike = {
  code?: string | null;
  message?: string | null;
} | string | null | undefined;

export function publicActionError(error: DbErrorLike, fallback: string) {
  const code = typeof error === "object" && error ? error.code : null;
  const message =
    typeof error === "string" ? error : typeof error === "object" && error ? error.message ?? "" : "";
  const lower = message.toLowerCase();

  if (code === "23505" || lower.includes("duplicate key") || lower.includes("unique constraint")) {
    if (lower.includes("vin") || lower.includes("vehicles_vin")) {
      return "Ya existe un vehículo con ese VIN.";
    }
    if (lower.includes("provider_lot") || lower.includes("auction_opportunities_provider_lot")) {
      return "Este lote ya está en tus oportunidades.";
    }
    return "Ese registro ya existe.";
  }

  if (code === "23503") {
    return "No se pudo guardar porque falta un dato relacionado.";
  }

  if (lower.includes("already exists") || lower.includes("duplicateobject")) {
    return "Esa foto ya está guardada. Elige otro archivo.";
  }

  if (lower.includes("row-level security") || lower.includes("permission denied")) {
    return "No tienes permiso para completar esta acción.";
  }

  if (lower.includes("jwt") || lower.includes("invalid api key") || lower.includes("service_role")) {
    return fallback;
  }

  if (message && !looksTechnical(message)) {
    return message;
  }

  return fallback;
}

function looksTechnical(message: string) {
  return /postgres|supabase|pgrst|stack|constraint|sqlstate|auth\.|schema|bucket|storage/i.test(message);
}
