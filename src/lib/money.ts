export function formatUsd(value: number) {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

  return `$${amount} USD`;
}

export function formatPercent(value: number) {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

  return `${amount}%`;
}

export function formatDop(value: number) {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

  return `DOP$ ${amount}`;
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
