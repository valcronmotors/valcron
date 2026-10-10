import { describe, expect, it, vi } from "vitest";
import { publishAuctionDraft } from "./publish-draft";

const eligible = {
  provider: "copart", provider_lot_id: "60659246", year: 2026,
  make: "Honda", model: "CR-V", price_mode: "contact", hasCoverPhoto: true,
  vin: "1HGCM82633A004352", title_status: "Salvage Title", odometer_status: "Actual",
  primary_damage: "Normal Wear", secondary_damage: "None", run_and_drive: "Run and Drive",
};

describe("admin auction publication workflow", () => {
  it("publishes an eligible record only after the current draft is saved", async () => {
    let saved = false;
    const save = vi.fn(async () => { saved = true; return { error: null, id: "current-draft" }; });
    const publish = vi.fn(async (id: string) => {
      expect(saved).toBe(true);
      expect(id).toBe("current-draft");
      return { error: null, publicPath: "/subastas/current-draft" };
    });
    const result = await publishAuctionDraft(eligible, save, publish);
    expect(result.error).toBeNull();
    expect(result.id).toBe("current-draft");
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it.each(["1", "4T1***", "5FNRL", "7FARS6H97TE******"])("publishes allowed incomplete VIN %s", async (vin) => {
    const publish = vi.fn(async () => ({ error: null }));
    const result = await publishAuctionDraft({ ...eligible, vin }, async () => ({ error: null, id: "draft" }), publish);
    expect(result.error).toBeNull();
    expect(publish).toHaveBeenCalledWith("draft");
  });

  it.each(["2HG***", "JHM", ""])("blocks VIN %s before saving", async (vin) => {
    const save = vi.fn();
    const publish = vi.fn();
    const result = await publishAuctionDraft({ ...eligible, vin }, save, publish);
    expect(result.error).toMatch(/no comienza con 1, 4, 5 o 7/i);
    expect(save).not.toHaveBeenCalled();
    expect(publish).not.toHaveBeenCalled();
  });

  it("never publishes stale data when saving fails", async () => {
    const publish = vi.fn();
    const result = await publishAuctionDraft(eligible, async () => ({ error: "Falló el guardado", id: "old-record" }), publish);
    expect(result.error).toBe("Falló el guardado");
    expect(publish).not.toHaveBeenCalled();
  });

  it("requires a persisted id even when save returns no error", async () => {
    const publish = vi.fn();
    expect((await publishAuctionDraft(eligible, async () => ({ error: null }), publish)).error).toMatch(/guardar/);
    expect(publish).not.toHaveBeenCalled();
  });

  it("blocks missing eligibility fields before any write", async () => {
    const save = vi.fn();
    const publish = vi.fn();
    const result = await publishAuctionDraft({ ...eligible, vin: "", run_and_drive: "" }, save, publish);
    expect(result.error).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
    expect(publish).not.toHaveBeenCalled();
  });

  it("does not report success when the publication action rejects the record", async () => {
    const result = await publishAuctionDraft(eligible, async () => ({ error: null, id: "draft" }), async () => ({ error: "Verificación requerida" }));
    expect(result.error).toBe("Verificación requerida");
  });
});
