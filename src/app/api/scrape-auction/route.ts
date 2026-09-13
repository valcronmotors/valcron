import { extractAuctionListing } from "@/lib/extract-auction";
import { getAdminClaims } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const claims = await getAdminClaims();
  if (!claims) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  let query = "";

  try {
    const body = (await request.json()) as { query?: unknown };
    query = String(body.query ?? "").trim();
  } catch {
    return Response.json(
      { error: "No se pudo leer la solicitud. Intenta de nuevo." },
      { status: 400 },
    );
  }

  if (!query) {
    return Response.json(
      {
        error:
          "Ingresa una URL o un número de lote de Copart, IAAI o Manheim.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await extractAuctionListing(query);
    if (result.error) {
      return Response.json({ error: result.error }, { status: 422 });
    }

    return Response.json({ data: result.data });
  } catch {
    return Response.json(
      {
        error:
          "No se pudo consultar la subasta. Verifica el lote o pega la URL completa.",
      },
      { status: 502 },
    );
  }
}
