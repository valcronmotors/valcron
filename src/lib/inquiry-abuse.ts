const WINDOW_MS = 60_000;
const IP_LIMIT = 8;
const recent = new Map<string, number>();
const ipHits = new Map<string, number[]>();

export function inquiryFingerprint(input: {
  name: string;
  phone: string | null;
  email: string | null;
  vehicleId: string | null;
}) {
  return [input.name.toLowerCase(), input.phone ?? "", input.email ?? "", input.vehicleId ?? ""].join("|");
}

export function isInquiryHoneypot(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

export function inquiryAbuseGuard(fingerprint: string, now = Date.now()) {
  prune(now);
  const last = recent.get(fingerprint);
  if (last && now - last < WINDOW_MS) {
    return {
      ok: false as const,
      error: "Ya recibimos una solicitud similar. Espera un momento antes de enviar otra.",
    };
  }
  recent.set(fingerprint, now);
  return { ok: true as const };
}

function prune(now: number) {
  for (const [key, time] of recent) {
    if (now - time > WINDOW_MS * 5) {
      recent.delete(key);
    }
  }
  for (const [key, hits] of ipHits) {
    const next = hits.filter((time) => now - time < WINDOW_MS * 5);
    if (next.length === 0) {
      ipHits.delete(key);
    } else {
      ipHits.set(key, next);
    }
  }
}

export function clientIpFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return request.headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}

export function inquiryIpGuard(ip: string, now = Date.now()) {
  prune(now);
  const hits = (ipHits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.length >= IP_LIMIT) {
    return {
      ok: false as const,
      error: "Demasiadas solicitudes. Espera un momento antes de enviar otra.",
    };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return { ok: true as const };
}

export function resetInquiryAbuseGuard() {
  recent.clear();
  ipHits.clear();
}
