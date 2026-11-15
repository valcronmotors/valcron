import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|data/import-tax-table-[a-f0-9]{12}\\.json$|fonts/quote/ValcronQuote-(?:Regular|Bold)\\.ttf$|api/public/vehicle-images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
