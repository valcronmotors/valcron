import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { preparePhoto } from "./prepare-photo";

const drawImage = vi.fn();
const canvas = { width: 0, height: 0, getContext: () => ({ fillRect: vi.fn(), fillStyle: "", drawImage }), toBlob: (fn: (blob: Blob) => void) => fn(new Blob(["jpeg"], { type: "image/jpeg" })) };
describe("photo preparation", () => {
  beforeEach(() => {
    vi.stubGlobal("Image", class { src = ""; naturalWidth = 1280; naturalHeight = 960; async decode() {} });
    vi.stubGlobal("document", { createElement: () => canvas });
    vi.clearAllMocks();
  });
  afterEach(() => vi.unstubAllGlobals());
  it("normalizes a PNG whose device supplied no MIME", async () => {
    const result = await preparePhoto(new File(["png"], "photo.PNG", { type: "" }));
    expect(result.type).toBe("image/png");
    expect(drawImage).not.toHaveBeenCalled();
  });
  it("optimizes an input larger than the old 8 MB limit", async () => {
    const result = await preparePhoto(new File([new Uint8Array(12 * 1024 * 1024)], "large.png", { type: "image/png" }));
    expect(result.type).toBe("image/jpeg");
    expect(result.size).toBeLessThan(5 * 1024 * 1024);
    expect(drawImage).toHaveBeenCalled();
  });
  it("converts browser-decodable alternate formats to a proxy-compatible JPEG", async () => {
    for (const type of ["image/gif", "image/bmp", "image/avif", "image/heic"]) {
      expect((await preparePhoto(new File(["image"], "photo", { type }))).type).toBe("image/jpeg");
    }
  });
  it("rejects undecodable files before they reach storage", async () => {
    vi.stubGlobal("Image", class { src = ""; async decode() { throw new Error("invalid image"); } });
    await expect(preparePhoto(new File(["broken"], "photo.png", { type: "image/png" }))).rejects.toThrow();
  });
});
