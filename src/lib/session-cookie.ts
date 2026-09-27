export function isSupabaseAuthCookieName(name: string) {
  return name.includes("-auth-token");
}

export function hasSupabaseSessionCookie(
  cookies: Iterable<{ name: string; value?: string }>,
) {
  for (const cookie of cookies) {
    if (isSupabaseAuthCookieName(cookie.name) && Boolean(cookie.value)) {
      return true;
    }
  }
  return false;
}
