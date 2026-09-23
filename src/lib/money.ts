/**
 * Locale-stable grouping for public prices.
 * Intl.NumberFormat("en-US") can differ between Node ICU and the browser,
 * which hydrates VehicleCard with a mismatched first paint.
 */
export function formatDecimal(value: number, fractionDigits: 0 | 1 | 2) {
  const numeric = Number(value);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  const factor = 10 ** fractionDigits;
  const rounded = Math.round(safe * factor) / factor;
  const sign = rounded < 0 ? "-" : "";
  const [intPart, fracPart] = Math.abs(rounded).toFixed(fractionDigits).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionDigits === 0 ? `${sign}${grouped}` : `${sign}${grouped}.${fracPart}`;
}

export function formatUsd(value: number) {
  return `$${formatDecimal(value, 2)} USD`;
}

export function formatPercent(value: number) {
  return `${formatDecimal(value, 1)}%`;
}

export function formatDop(value: number) {
  return `DOP$ ${formatDecimal(value, 2)}`;
}

export const USD_MONEY_COLUMNS = new Set([
  "costo_subasta_usd",
  "flete_usd",
  "gastos_taller_usa_usd",
  "gastos_grua_usd",
  "gastos_titulacion_usd",
  "fees_adicionales_usd",
  "costo_total_usd",
  "precio_costo",
  "precio_venta",
  "envio_usd",
  "comisiones_usd",
]);

export const DOP_MONEY_COLUMNS = new Set([
  "costo_taller_dop",
  "impuestos_dga_dop",
  "precio_venta_dop",
  "costo_total_dop",
  "precio_estimado_dop",
]);

export function formatMoneyColumn(column: string, value: unknown) {
  const amount = Number(value ?? 0);
  if (USD_MONEY_COLUMNS.has(column)) {
    return formatUsd(amount);
  }
  if (DOP_MONEY_COLUMNS.has(column)) {
    return formatDop(amount);
  }
  return null;
}
