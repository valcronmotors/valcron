import { publicJson, publicOptions } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

export async function GET(request: Request) {
  return publicJson(request, { error: "No disponible." }, 404);
}
