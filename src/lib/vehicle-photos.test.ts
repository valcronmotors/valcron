import { beforeEach, describe, expect, it, vi } from "vitest";

const { upload, prepare } = vi.hoisted(() => ({ upload: vi.fn(), prepare: vi.fn() }));
vi.mock("@/utils/supabase/client", () => ({ createClient: () => ({ storage: { from: () => ({ upload }) } }) }));
vi.mock("@/lib/prepare-photo", () => ({ preparePhoto: prepare }));
import { uploadVehiclePhotos } from "./vehicle-photos";

const vehicleId = "11111111-1111-4111-8111-111111111111";
const file = (name = "photo.png") => new File(["image"], name, { type: "image/png" });

describe("multi-photo upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prepare.mockImplementation(async (input: File) => input);
    upload.mockResolvedValue({ error: null });
  });
  it("uploads ten files individually with their normalized content types", async () => {
    const files = Array.from({ length: 10 }, (_, i) => file(`${i}.png`));
    const result = await uploadVehiclePhotos(files, { vehicleId, currentCount: 0 });
    expect(result.error).toBeNull();
    expect(result.paths).toHaveLength(10);
    expect(result.fileIndexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(upload).toHaveBeenCalledTimes(10);
    expect(upload.mock.calls.every((call) => call[2].contentType === "image/png")).toBe(true);
  });
  it("stores converted HEIC as JPEG with the matching filename and MIME", async () => {
    prepare.mockResolvedValue(new File(["jpeg"], "converted.jpg", { type: "image/jpeg" }));
    await uploadVehiclePhotos([file("camera.heic")], { vehicleId, currentCount: 0 });
    expect(upload.mock.calls[0][0]).toMatch(/\.jpg$/);
    expect(upload.mock.calls[0][2].contentType).toBe("image/jpeg");
  });
  it("continues after errors and identifies exactly which files succeeded for retries", async () => {
    prepare.mockRejectedValueOnce(new Error("decode"));
    upload.mockResolvedValueOnce({ error: { message: "network" } });
    const result = await uploadVehiclePhotos([file("bad.png"), file("retry.png"), file("good.png")], { vehicleId, currentCount: 0 });
    expect(result.paths).toHaveLength(1);
    expect(result.fileIndexes).toEqual([2]);
    expect(result.error).toContain("bad.png");
    expect(result.error).toContain("retry.png");
  });
  it("returns an actionable result for a thrown storage request", async () => {
    upload.mockRejectedValue(new Error("offline"));
    const result = await uploadVehiclePhotos([file()], { vehicleId, currentCount: 0 });
    expect(result.error).toContain("photo.png");
    expect(result.paths).toEqual([]);
  });
});
