import { isSafeHttpUrl } from "../../safe-url";

const COPART_LOT_PATTERN = /^\d{5,12}$/;
const COPART_SOURCE_HOSTS = new Set(["www.copart.com", "copart.com"]);

export function normalizeCopartLotNumber(value: string | null | undefined) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!COPART_LOT_PATTERN.test(digits)) return null;
  return digits;
}

export function copartLotSourceUrl(lotNumber: string | null | undefined) {
  const lot = normalizeCopartLotNumber(lotNumber);
  if (!lot) return null;
  return validateCopartSourceUrl(`https://www.copart.com/lot/${lot}`);
}

export function validateCopartSourceUrl(value: string | null | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  if (!isSafeHttpUrl(raw)) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (!COPART_SOURCE_HOSTS.has(url.hostname.toLowerCase())) return null;
  if (!/\/lot\/\d{5,12}\/?$/i.test(url.pathname)) return null;
  return url.toString();
}
