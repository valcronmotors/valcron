/** Editorial recommendations, separate from publication requirements. */
export function listingQualitySuggestions(listing: {
  description?: string | null;
  vehicle_photos?: Array<{ is_cover: boolean; storage_path?: string | null }> | null;
}) {
  const suggestions: string[] = [];
  const photos = (listing.vehicle_photos ?? []).filter((photo) => photo.storage_path?.trim());
  if (!photos.some((photo) => photo.is_cover)) suggestions.push("Elegir una foto de portada");
  if (photos.length < 4) suggestions.push("Completar la galería con exterior, interior y detalles reales");
  if ((listing.description?.trim().length ?? 0) < 80) suggestions.push("Ampliar la descripción con condición, equipamiento y disponibilidad");
  return suggestions;
}
