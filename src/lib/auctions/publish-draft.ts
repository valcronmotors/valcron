import { auctionPublicationBlockMessage, type AuctionPublicationInput } from "./auction-publication";

type PublicationResult = {
  error: string | null;
  id?: string;
  success?: string | null;
  publicPath?: string | null;
};

/** Validate current edits and persist them before publishing the saved record. */
export async function publishAuctionDraft(
  input: AuctionPublicationInput,
  save: () => Promise<PublicationResult>,
  publish: (id: string) => Promise<PublicationResult>,
): Promise<PublicationResult> {
  const blocked = auctionPublicationBlockMessage(input);
  if (blocked) return { error: blocked };

  const saved = await save();
  if (saved.error || !saved.id) {
    return { error: saved.error ?? "No se pudo guardar el borrador. Reintenta antes de publicar." };
  }

  const result = await publish(saved.id);
  return { ...result, id: saved.id };
}
