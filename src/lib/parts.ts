export const SALE_CHANNELS = [
  "eBay",
  "Amazon",
  "Walmart",
  "Venta Directa",
] as const;

export type SaleChannel = (typeof SALE_CHANNELS)[number];

const CHANNEL_ALIASES: Record<string, SaleChannel> = {
  "Venta Directa / Web": "Venta Directa",
};

export function isSaleChannel(value: string): value is SaleChannel {
  return SALE_CHANNELS.includes(value as SaleChannel);
}

export function normalizeSaleChannel(value: string): SaleChannel | null {
  const normalized = CHANNEL_ALIASES[value] ?? value;
  return isSaleChannel(normalized) ? normalized : null;
}

export function parseSaleChannels(values: FormDataEntryValue[]) {
  return values
    .map((value) => normalizeSaleChannel(String(value)))
    .filter((value): value is SaleChannel => value !== null);
}

export function normalizeSaleChannels(values: string[] | null | undefined) {
  return (values ?? [])
    .map((value) => normalizeSaleChannel(value))
    .filter((value): value is SaleChannel => value !== null);
}
