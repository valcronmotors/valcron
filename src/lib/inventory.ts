import type { VehicleRow as WebsiteVehicleRow } from "@/lib/website-schema";

export type VehicleRow = WebsiteVehicleRow;

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

/** Legacy ERP vehicle shape kept only so unused historical UI still typechecks. */
export type ErpVehicleRow = {
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

export const VEHICLE_INVENTORY_SELECT = `
  id, stock_number, vin, year, make, model, trim, mileage, mileage_unit,
  exterior_color, interior_color, engine, transmission, drivetrain, fuel,
  condition, title_status, description, price, currency, public_price_mode, location, source_type,
  status, featured, published, published_at, created_at, updated_at
`.replace(/\s+/g, " ").trim();

export const VEHICLE_ADMIN_SELECT = `
  ${VEHICLE_INVENTORY_SELECT},
  vehicle_photos ( id, vehicle_id, storage_path, sort_order, is_cover, alt_text, created_at )
`.replace(/\s+/g, " ").trim();

export const PART_INVENTORY_SELECT =
  "id, codigo_pieza, nombre, cantidad, precio_costo, envio_usd, comisiones_usd, precio_venta, canales_venta";
