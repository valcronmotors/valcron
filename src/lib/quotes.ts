import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";
import type { CotizacionItem, ProspectoRow } from "@/lib/crm";
import type { PartRow, VehicleRow } from "@/lib/inventory";

export function roundMoney(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function safeTasa(value: number | null | undefined) {
  const parsed = Number(value ?? 0);
  return parsed > 0 ? parsed : DEFAULT_TASA_USD_DOP;
}

export function quoteTotals(items: CotizacionItem[]) {
  const subtotalUsd = roundMoney(
    items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario_usd, 0),
  );
  const totalDop = roundMoney(
    items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario_dop, 0),
  );

  return {
    subtotalUsd,
    totalUsd: subtotalUsd,
    totalDop,
  };
}

export function itemFromUsd(
  item: CotizacionItem,
  tasa: number,
): CotizacionItem {
  const usd = roundMoney(item.precio_unitario_usd);
  return {
    ...item,
    precio_unitario_usd: usd,
    precio_unitario_dop: roundMoney(usd * safeTasa(tasa)),
  };
}

export function itemFromDop(
  item: CotizacionItem,
  tasa: number,
): CotizacionItem {
  const dop = roundMoney(item.precio_unitario_dop);
  return {
    ...item,
    precio_unitario_dop: dop,
    precio_unitario_usd: roundMoney(dop / safeTasa(tasa)),
  };
}

export function defaultQuoteItems(
  lead: ProspectoRow,
  vehiculos: VehicleRow[],
  repuestos: PartRow[],
  tasa: number,
): CotizacionItem[] {
  const vehicle =
    vehiculos.find((row) => row.id === lead.vehiculo_interes_id) ?? null;
  const part = repuestos.find((row) => row.id === lead.repuesto_interes_id) ?? null;
  const fx = safeTasa(tasa);

  if (vehicle) {
    const trim = vehicle.trim ? ` ${vehicle.trim}` : "";
    const dop = roundMoney(Number(vehicle.precio_venta_dop ?? 0));
    return [
      itemFromDop(
        {
          descripcion: `${vehicle.marca} ${vehicle.modelo}${trim} ${vehicle.ano} · VIN ${vehicle.vin}`,
          cantidad: 1,
          precio_unitario_usd: 0,
          precio_unitario_dop: dop,
        },
        vehicle.tasa_usd_dop ?? fx,
      ),
    ];
  }

  if (part) {
    const items: CotizacionItem[] = [
      itemFromUsd(
        {
          descripcion: `${part.codigo_pieza} · ${part.nombre}`,
          cantidad: 1,
          precio_unitario_usd: roundMoney(Number(part.precio_venta ?? 0)),
          precio_unitario_dop: 0,
        },
        fx,
      ),
    ];
    if (Number(part.envio_usd ?? 0) > 0) {
      items.push(
        itemFromUsd(
          {
            descripcion: `Envío · ${part.codigo_pieza}`,
            cantidad: 1,
            precio_unitario_usd: roundMoney(Number(part.envio_usd ?? 0)),
            precio_unitario_dop: 0,
          },
          fx,
        ),
      );
    }
    return items;
  }

  return [
    {
      descripcion: "",
      cantidad: 1,
      precio_unitario_usd: 0,
      precio_unitario_dop: 0,
    },
  ];
}
