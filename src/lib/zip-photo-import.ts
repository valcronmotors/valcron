import { unzipSync } from "fflate";
const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;
const MAX_EXTRACTED_BYTES = 200 * 1024 * 1024;
const MAX_ARCHIVE_IMAGES = 40;
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif|bmp|heic|heif|tiff?)$/i;
function mimeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = { jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp",avif:"image/avif",gif:"image/gif",bmp:"image/bmp",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff" };
  return types[ext ?? ""] ?? "";
}
export async function extractImageFilesFromZip(archive: File): Promise<File[]> {
  if (!archive.size || archive.size > MAX_ARCHIVE_BYTES) throw new Error("El ZIP está vacío o supera el límite de 100 MB.");
  let entries: Record<string, Uint8Array>;
  try { entries = unzipSync(new Uint8Array(await archive.arrayBuffer()), { filter: (entry) => !entry.name.endsWith("/") && IMAGE_EXTENSIONS.test(entry.name) }); }
  catch { throw new Error("El ZIP está dañado o usa un formato no compatible."); }
  const images = Object.entries(entries).filter(([name,data]) => IMAGE_EXTENSIONS.test(name) && data.byteLength > 0).sort(([a],[b]) => a.localeCompare(b,undefined,{numeric:true}));
  if (!images.length) throw new Error("El ZIP no contiene fotos compatibles.");
  if (images.length > MAX_ARCHIVE_IMAGES) throw new Error(`El ZIP contiene más de ${MAX_ARCHIVE_IMAGES} fotos. Divide el archivo y vuelve a intentarlo.`);
  if (images.reduce((sum,[,data]) => sum + data.byteLength,0) > MAX_EXTRACTED_BYTES) throw new Error("Las fotos descomprimidas superan el límite de 200 MB.");
  return images.map(([path,data]) => { const name = path.split(/[\\/]/).pop() || "copart-photo.jpg"; return new File([data],name,{type:mimeFromName(name),lastModified:archive.lastModified}); });
}
