export function isUnavailableInventoryError(message: string | null | undefined) {
  if (!message) return false;
  return /no pudimos cargar|does not exist|schema cache|relation|inventory/i.test(message);
}

export function publicInventoryDisplayError(message: string | null | undefined) {
  if (!message) return null;
  if (isUnavailableInventoryError(message)) {
    return null;
  }
  return message;
}
