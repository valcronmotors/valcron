export function isSafeHttpUrl(value: string | null | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return false;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
