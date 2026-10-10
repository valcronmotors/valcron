import { photoMimeType, validatePhotoFile } from "./storage";

const MAX_PIXELS = 80_000_000;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function checkDimensions(width: number, height: number) {
  if (!width || !height || width * height > MAX_PIXELS) {
    throw new Error("La imagen es demasiado grande para procesarla. Exporta una versión de menor resolución.");
  }
}

async function loadPhoto(blob: Blob) {
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    checkDimensions(image.naturalWidth, image.naturalHeight);
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Decode before upload; store only formats already supported by the image proxy. */
export async function preparePhoto(file: File): Promise<File> {
  const invalid = validatePhotoFile(file);
  if (invalid) throw new Error(invalid);
  const type = photoMimeType(file);
  let blob: Blob = new Blob([file], { type });
  let source: CanvasImageSource;
  let width: number;
  let height: number;
  if (type === "image/tiff") {
    const UTIF = await import("utif");
    const buffer = await file.arrayBuffer();
    const ifd = UTIF.decode(buffer)[0];
    if (!ifd) throw new Error("No se pudo leer la foto TIFF.");
    checkDimensions(ifd.t256?.[0] ?? 0, ifd.t257?.[0] ?? 0);
    UTIF.decodeImage(buffer, ifd);
    width = ifd.width;
    height = ifd.height;
    checkDimensions(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la foto.");
    context.putImageData(new ImageData(new Uint8ClampedArray(UTIF.toRGBA8(ifd)), width, height), 0, 0);
    source = canvas;
  } else {
    let image: HTMLImageElement;
    try {
      image = await loadPhoto(blob);
    } catch (error) {
      if (type !== "image/heic" && type !== "image/heif") throw error;
      const { default: heic2any } = await import("heic2any");
      const converted = await heic2any({ blob, toType: "image/jpeg", quality: 0.9 });
      blob = Array.isArray(converted) ? converted[0] : converted;
      image = await loadPhoto(blob);
    }
    source = image;
    width = image.naturalWidth;
    height = image.naturalHeight;
    if (["image/jpeg", "image/png", "image/webp"].includes(type) && file.size <= MAX_UPLOAD_BYTES && Math.max(width, height) <= 2560) {
      return new File([file], file.name, { type, lastModified: file.lastModified });
    }
  }
  const scale = Math.min(1, 2560 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la foto.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.9, 0.75, 0.6]) {
    const output = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (output && output.size <= MAX_UPLOAD_BYTES) {
      return new File([output], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
    }
  }
  throw new Error("No se pudo reducir la foto. Exporta una versión de menor resolución.");
}
