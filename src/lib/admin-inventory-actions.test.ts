import { describe, expect, it } from "vitest";
import {
  INVENTORY_ACTION_LABEL,
  INVENTORY_DELETE_CONFIRMATION,
  inventoryActionHref,
  inventoryRowActions,
  isDestructiveInventoryAction,
} from "@/lib/admin-inventory-actions";
import { ADMIN_ACTION_MENU_A11Y, positionAdminMenu } from "@/lib/admin-action-menu";

describe("inventory row actions", () => {
  it("keeps draft actions limited and dealer-facing", () => {
    expect(inventoryRowActions({ status: "draft", published: false })).toEqual([
      "edit",
      "photos",
      "preview",
      "available",
      "delete",
    ]);
    expect(INVENTORY_ACTION_LABEL.available).toBe("Marcar disponible");
    expect(INVENTORY_ACTION_LABEL.delete).toBe("Eliminar vehículo");
  });

  it("offers unpublish, reserve, sold, and hide for a published available unit", () => {
    expect(inventoryRowActions({ status: "available", published: true })).toEqual([
      "edit",
      "photos",
      "preview",
      "unpublish",
      "reserve",
      "sold",
      "hide",
      "delete",
    ]);
  });

  it("offers publish instead of unpublish when the unit is ready but unpublished", () => {
    const actions = inventoryRowActions({ status: "available", published: false });
    expect(actions).toContain("publish");
    expect(actions).not.toContain("unpublish");
    expect(INVENTORY_ACTION_LABEL.publish).toBe("Publicar en website");
  });

  it("lets a reserved unit return to available, sell, hide, or unpublish", () => {
    expect(inventoryRowActions({ status: "reserved", published: true })).toEqual([
      "edit",
      "photos",
      "preview",
      "unpublish",
      "available",
      "sold",
      "hide",
      "delete",
    ]);
  });

  it("lets a sold unit return to available or leave the website", () => {
    const actions = inventoryRowActions({ status: "sold", published: true });
    expect(actions).toEqual([
      "edit",
      "photos",
      "preview",
      "unpublish",
      "available",
      "hide",
      "delete",
    ]);
    expect(actions.at(-1)).toBe("delete");
  });

  it("keeps hidden units out of sell/hide/publish until they are available again", () => {
    expect(inventoryRowActions({ status: "hidden", published: false })).toEqual([
      "edit",
      "photos",
      "preview",
      "available",
      "delete",
    ]);
  });

  it("does not expose raw enum names", () => {
    expect(Object.values(INVENTORY_ACTION_LABEL).join(" ")).not.toMatch(/available_rd|valcron_stock|draft/i);
  });

  it("marks delete as destructive and routes edit, photos, and preview", () => {
    expect(isDestructiveInventoryAction("delete")).toBe(true);
    expect(isDestructiveInventoryAction("hide")).toBe(false);
    expect(inventoryActionHref("edit", "abc")).toBe("/admin/inventario/abc");
    expect(inventoryActionHref("photos", "abc")).toBe("/admin/inventario/abc#fotos");
    expect(inventoryActionHref("preview", "abc")).toBe("/admin/inventario/abc/vista-previa");
    expect(INVENTORY_DELETE_CONFIRMATION).toBe(
      "Se eliminará el vehículo y sus fotos. Esta acción no se puede deshacer.",
    );
    expect(ADMIN_ACTION_MENU_A11Y).toEqual({
      triggerHaspopup: "menu",
      menuRole: "menu",
      itemRole: "menuitem",
    });
  });
});

describe("admin action menu positioning", () => {
  it("opens downward when there is room and aligns to the trigger right edge", () => {
    const placed = positionAdminMenu({
      trigger: { top: 80, right: 900, bottom: 120, left: 860 },
      menu: { width: 240, height: 280 },
      viewport: { width: 1280, height: 800 },
    });
    expect(placed.mode).toBe("menu");
    expect(placed.top).toBeGreaterThan(120);
    expect(placed.left + placed.width).toBeLessThanOrEqual(900 + 8);
  });

  it("opens upward near the viewport bottom and stays on screen", () => {
    const placed = positionAdminMenu({
      trigger: { top: 720, right: 1240, bottom: 760, left: 1200 },
      menu: { width: 240, height: 280 },
      viewport: { width: 1280, height: 800 },
    });
    expect(placed.mode).toBe("menu");
    expect(placed.top).toBeLessThan(720);
    expect(placed.left).toBeGreaterThanOrEqual(8);
    expect(placed.left + placed.width).toBeLessThanOrEqual(1272);
  });

  it("uses a sheet on a cramped mobile viewport", () => {
    const placed = positionAdminMenu({
      trigger: { top: 400, right: 370, bottom: 440, left: 330 },
      menu: { width: 240, height: 360 },
      viewport: { width: 390, height: 844 },
    });
    expect(placed.mode).toBe("sheet");
  });

  it("keeps a dropdown inside a 1440 desktop viewport", () => {
    const placed = positionAdminMenu({
      trigger: { top: 40, right: 1420, bottom: 84, left: 1380 },
      menu: { width: 240, height: 320 },
      viewport: { width: 1440, height: 900 },
    });
    expect(placed.mode).toBe("menu");
    expect(placed.left).toBeGreaterThanOrEqual(8);
    expect(placed.left + placed.width).toBeLessThanOrEqual(1432);
  });
});
