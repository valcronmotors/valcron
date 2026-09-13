import { createClient } from "@/utils/supabase/client";

export const CRM_AUDIO_BUCKET = "crm-audio";
export const MAX_CRM_AUDIO_BYTES = 10 * 1024 * 1024;

const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
  "audio/x-m4a",
] as const;

export function validateCrmAudioFile(file: File) {
  if (
    file.type &&
    !ALLOWED_AUDIO_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_AUDIO_MIME_TYPES)[number],
    )
  ) {
    return "Solo se permiten notas de voz en WebM, MP3, MP4, OGG o WAV.";
  }
  if (file.size > MAX_CRM_AUDIO_BYTES) {
    return "La nota de voz debe pesar menos de 10 MB.";
  }
  return null;
}

function audioExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["webm", "mp3", "mp4", "m4a", "ogg", "wav"].includes(fromName)) {
    return fromName;
  }
  if (file.type.includes("mpeg")) return "mp3";
  if (file.type.includes("mp4")) return "m4a";
  if (file.type.includes("ogg")) return "ogg";
  if (file.type.includes("wav")) return "wav";
  return "webm";
}

export async function uploadCrmAudio(file: File, prospectoId: string) {
  const invalid = validateCrmAudioFile(file);
  if (invalid) {
    return { url: null as string | null, error: invalid };
  }

  const supabase = createClient();
  const path = `${prospectoId}/${Date.now()}-${crypto.randomUUID()}.${audioExtension(file)}`;
  const { error } = await supabase.storage.from(CRM_AUDIO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "audio/webm",
  });

  if (error) {
    return {
      url: null as string | null,
      error: error.message || "No se pudo subir la nota de voz.",
    };
  }

  const { data } = supabase.storage.from(CRM_AUDIO_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null as string | null };
}
