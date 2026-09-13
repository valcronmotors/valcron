import { loadPublicParts } from "@/lib/public-inventory";
import { publicJson, publicOptions } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const result = await loadPublicParts(query);

  if (result.error) {
    return publicJson(request, { error: result.error }, 500);
  }

  return publicJson(
    request,
    { data: result.data, vinSearch: result.vinSearch },
    200,
  );
}
