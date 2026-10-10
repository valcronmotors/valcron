import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ALLOWED_PHOTO_MIME_TYPES,
  PHOTO_FILE_ACCEPT,
  PHOTO_FORMAT_HINT,
  validatePhotoFile,
} from "@/lib/storage";

describe("admin media picker upload policy", () => {
  it("accepts common camera formats, extension-only PNGs, and 50 MB inputs", () => {
    for (const type of ALLOWED_PHOTO_MIME_TYPES) {
      expect(validatePhotoFile({ type, size: 1024 })).toBeNull();
    }
    expect(PHOTO_FILE_ACCEPT).toContain(".png");
    expect(PHOTO_FILE_ACCEPT).toContain(".heic");
    expect(PHOTO_FORMAT_HINT).toMatch(/50 MB.*40 fotos/);
    expect(validatePhotoFile({ type: "", name: "Photo.PNG", size: 12 * 1024 * 1024 })).toBeNull();
    expect(validatePhotoFile({ type: "application/octet-stream", name: "Photo.jpg", size: 1024 })).toBeNull();
    expect(validatePhotoFile({ type: "image/jpg", size: 1024 })).toBeNull();
    expect(validatePhotoFile({ type: "image/png", size: 50 * 1024 * 1024 })).toBeNull();
    expect(validatePhotoFile({ type: "image/png", size: 51 * 1024 * 1024 })).toMatch(/50 MB/);
    expect(validatePhotoFile({ type: "image/png", size: 0 })).toMatch(/vacía/);
    expect(validatePhotoFile({ type: "application/pdf", name: "photo.png", size: 1024 })).toBeTruthy();
  });

  it("keeps capture only on the camera input, not gallery or files", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/admin/AdminMediaPicker.tsx"),
      "utf8",
    );
    expect(source).toContain('data-testid="photo-gallery-input"');
    expect(source).toContain('data-testid="photo-files-input"');
    expect(source).toContain('data-testid="photo-camera-input"');
    expect(source).toContain('capture="environment"');
    expect(source).toMatch(/Galería de fotos/);
    expect(source).toMatch(/Seleccionar archivos/);
    expect(source).toMatch(/Tomar foto/);

    const galleryBlock = source.slice(
      source.indexOf('data-testid="photo-gallery-input"') - 180,
      source.indexOf('data-testid="photo-gallery-input"') + 80,
    );
    const filesBlock = source.slice(
      source.indexOf('data-testid="photo-files-input"') - 180,
      source.indexOf('data-testid="photo-files-input"') + 80,
    );
    expect(galleryBlock).not.toMatch(/capture=/);
    expect(filesBlock).not.toMatch(/capture=/);

    const editor = readFileSync(
      join(process.cwd(), "src/components/admin/AdminVehicleEditor.tsx"),
      "utf8",
    );
    expect(editor).toContain("AdminMediaPicker");
    expect(editor).not.toMatch(/capture="environment"/);
  });
});
