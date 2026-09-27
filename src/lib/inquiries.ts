export type PublicInquiryInput = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  vehicleId?: unknown;
  auctionOpportunityId?: unknown;
  source?: unknown;
};

export type ValidatedPublicInquiry = {
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  vehicle_id: string | null;
  auction_opportunity_id: null;
  source: "web" | "whatsapp" | "other";
  status: "new";
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  const trimmed = String(value ?? "").trim();
  return trimmed.slice(0, max);
}

export function validatePublicInquiry(input: PublicInquiryInput): {
  data: ValidatedPublicInquiry | null;
  error: string | null;
} {
  const name = text(input.name, 120);
  const phone = text(input.phone, 40) || null;
  const emailRaw = text(input.email, 160).toLowerCase();
  const email = emailRaw || null;
  const message = text(input.message, 4000) || null;
  const vehicleId = text(input.vehicleId, 36);
  const sourceRaw = text(input.source, 20) || "web";
  const source =
    sourceRaw === "whatsapp" || sourceRaw === "other" || sourceRaw === "web" ? sourceRaw : "web";

  if (!name) {
    return { data: null, error: "El nombre es obligatorio." };
  }
  if (!phone && !email) {
    return { data: null, error: "Indica un teléfono o un correo para contactarte." };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { data: null, error: "El correo electrónico no es válido." };
  }
  if (name.length < 2) {
    return { data: null, error: "Indica un nombre válido." };
  }
  if (input.auctionOpportunityId) {
    return { data: null, error: "La solicitud pública no puede vincular una oportunidad interna." };
  }

  return {
    data: {
      name,
      phone,
      email,
      message,
      vehicle_id: UUID_RE.test(vehicleId) ? vehicleId : null,
      auction_opportunity_id: null,
      source,
      status: "new",
    },
    error: null,
  };
}

export function canPublicReadInquiry() {
  return false;
}

export function publicInquiryInsertReturnsRow() {
  return false;
}

export function canAdminAccessInquiry(isAdmin: boolean) {
  return isAdmin;
}
