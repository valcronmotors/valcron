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
  it("accepts only pipeline-supported image types (no HEIC)", () => {
    expect(ALLOWED_PHOTO_MIME_TYPES).toEqual(["image/jpeg", "image/png", "image/webp"]);
    expect(PHOTO_FILE_ACCEPT).toBe("image/jpeg,image/png,image/webp");
    expect(PHOTO_FORMAT_HINT).toMatch(/HEIC/i);
    expect(validatePhotoFile({ type: "image/jpeg", size: 1024 })).toBeNull();
    expect(validatePhotoFile({ type: "image/heic", size: 1024 })).toMatch(/JPEG|PNG|WebP/i);
    expect(validatePhotoFile({ type: "image/heif", size: 1024 })).toMatch(/JPEG|PNG|WebP/i);
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
