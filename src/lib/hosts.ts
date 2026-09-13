export const ADMIN_HOST = "admin.valcronmotors.com";
export const PUBLIC_HOST = "valcronmotors.com";

export function hostnameFromHeader(hostHeader: string | null | undefined) {
  return (hostHeader ?? "").split(":")[0].toLowerCase();
}

export function isAdminHostname(hostHeader: string | null | undefined) {
  const host = hostnameFromHeader(hostHeader);
  return (
    host === ADMIN_HOST ||
    host === "admin.localhost" ||
    host === "admin.127.0.0.1"
  );
}

export function adminOrigin() {
  return `https://${ADMIN_HOST}`;
}

export function publicOrigin() {
  return `https://${PUBLIC_HOST}`;
}
