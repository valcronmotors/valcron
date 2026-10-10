import type { VehicleRow } from "@/lib/website-schema";

export const INVENTORY_ACTION_IDS = [
  "edit",
  "photos",
  "preview",
  "publish",
  "unpublish",
  "available",
  "reserve",
  "sold",
  "hide",
  "delete",
] as const;

export type InventoryActionId = (typeof INVENTORY_ACTION_IDS)[number];

export const INVENTORY_ACTION_LABEL: Record<InventoryActionId, string> = {
  edit: "Editar vehículo",
  photos: "Administrar fotos",
  preview: "Vista previa",
  publish: "Publicar en website",
  unpublish: "Retirar del website",
  available: "Marcar disponible",
  reserve: "Reservar",
  sold: "Marcar vendido",
  hide: "Ocultar",
  delete: "Eliminar vehículo",
};

export function inventoryRowActions(
  vehicle: Pick<VehicleRow, "status" | "published">,
): InventoryActionId[] {
  const actions: InventoryActionId[] = ["edit", "photos", "preview"];
  const { status, published } = vehicle;

  if (published) {
    actions.push("unpublish");
  } else if (status === "available" || status === "reserved" || status === "sold") {
    actions.push("publish");
  }

  if (status !== "available") {
    actions.push("available");
  }

  if (status === "available" || (published && status !== "reserved" && status !== "sold")) {
    actions.push("reserve");
  }

  if (status !== "sold" && status !== "draft" && status !== "hidden") {
    actions.push("sold");
  }

  if (status !== "hidden" && status !== "draft") {
    actions.push("hide");
  }

  actions.push("delete");
  return unique(actions);
}

function unique(ids: InventoryActionId[]) {
  return [...new Set(ids)];
}

export function inventoryActionHref(id: InventoryActionId, vehicleId: string) {
  if (id === "edit") return `/admin/inventario/${vehicleId}`;
  if (id === "photos") return `/admin/inventario/${vehicleId}?paso=1`;
  if (id === "preview") return `/admin/inventario/${vehicleId}/vista-previa`;
  return null;
}

export function isDestructiveInventoryAction(id: InventoryActionId) {
  return id === "delete";
}

export const INVENTORY_DELETE_CONFIRMATION =
  "Se eliminará el vehículo y sus fotos. Esta acción no se puede deshacer.";
