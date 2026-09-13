import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminHostname } from "@/lib/hosts";
import { isAdminPublicPath, isPublicPath, safeNextPath } from "@/lib/site";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const pathname = request.nextUrl.pathname;
  const adminHost = isAdminHostname(request.headers.get("host"));
  const effectivePath = adminHost && pathname === "/" ? "/admin" : pathname;
  const allowedWithoutAuth = adminHost
    ? isAdminPublicPath(effectivePath)
    : isPublicPath(pathname);

  if (!claims && !allowedWithoutAuth) {
    if (pathname.startsWith("/api/")) {
      return copyCookies(
        NextResponse.json({ error: "No autorizado." }, { status: 401 }),
        supabaseResponse,
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (effectivePath !== "/login") {
      url.searchParams.set("next", `${effectivePath}${request.nextUrl.search}`);
    }
    return copyCookies(NextResponse.redirect(url), supabaseResponse);
  }

  if (claims && pathname === "/login") {
    const url = request.nextUrl.clone();
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    url.pathname = next;
    url.search = "";
    return copyCookies(NextResponse.redirect(url), supabaseResponse);
  }

  if (adminHost && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return copyCookies(NextResponse.rewrite(url), supabaseResponse);
  }

  return supabaseResponse;
}

function copyCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
  return target;
}
