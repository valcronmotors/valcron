export type VehicleRow = {
  id: string;
  vin: string;
  marca: string;
  modelo: string;
  trim: string | null;
  ano: number;
  costo_subasta_usd: number | null;
  gastos_taller_usa_usd: number | null;
  gastos_grua_usd: number | null;
  gastos_titulacion_usd: number | null;
  fees_adicionales_usd: number | null;
  flete_usd: number | null;
  costo_total_usd: number | null;
  tasa_usd_dop: number | null;
  costo_taller_dop: number | null;
  impuestos_dga_dop: number | null;
  costo_total_dop: number | null;
  precio_venta_dop: number | null;
  estado: string | null;
  fotos_urls: string[] | null;
  ubicacion_lote: string | null;
  lote_numero: string | null;
  fuente_subasta: string | null;
};

export type PartRow = {
  id: string;
  codigo_pieza: string;
  nombre: string;
  cantidad: number | null;
  precio_costo: number | null;
  envio_usd: number | null;
  comisiones_usd: number | null;
  precio_venta: number | null;
  canales_venta: string[] | null;
};

export const VEHICLE_INVENTORY_SELECT =
  "id, vin, marca, modelo, trim, ano, costo_subasta_usd, gastos_taller_usa_usd, gastos_grua_usd, gastos_titulacion_usd, fees_adicionales_usd, flete_usd, costo_total_usd, tasa_usd_dop, costo_taller_dop, impuestos_dga_dop, costo_total_dop, precio_venta_dop, estado, fotos_urls, ubicacion_lote, lote_numero, fuente_subasta";

export const PART_INVENTORY_SELECT =
  "id, codigo_pieza, nombre, cantidad, precio_costo, envio_usd, comisiones_usd, precio_venta, canales_venta";
