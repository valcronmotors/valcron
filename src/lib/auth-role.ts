export const WEBSITE_ADMIN_ROLE = "admin";

export function claimsAppRole(claims: unknown): string | null {
  if (!claims || typeof claims !== "object") {
    return null;
  }

  const appMetadata = (claims as Record<string, unknown>).app_metadata;
  if (!appMetadata || typeof appMetadata !== "object") {
    return null;
  }

  const role = (appMetadata as Record<string, unknown>).role;
  return typeof role === "string" ? role : null;
}

export function isWebsiteAdminClaims(claims: unknown): boolean {
  return claimsAppRole(claims) === WEBSITE_ADMIN_ROLE;
}
