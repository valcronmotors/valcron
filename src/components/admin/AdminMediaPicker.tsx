"use client";

import { useRef } from "react";
import { Camera, FolderOpen, Images } from "lucide-react";
import { PHOTO_FILE_ACCEPT, PHOTO_FORMAT_HINT } from "@/lib/storage";

/**
 * Three explicit media sources.
 * Gallery and Files never set `capture` (that forces the iOS camera).
 * Camera uses a separate input with capture="environment".
 */
export function AdminMediaPicker({
  onFiles,
  disabled = false,
  uploading = false,
  id = "admin-media-picker",
  tone = "light",
  showDragHint = true,
}: {
  onFiles: (files: FileList | File[]) => void;
  disabled?: boolean;
  uploading?: boolean;
  id?: string;
  tone?: "light" | "dark";
  showDragHint?: boolean;
}) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const busy = disabled || uploading;

  const light = tone === "light";
  const buttonClass = light
    ? "inline-flex min-h-12 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-3 text-center text-xs font-semibold text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-muted)] disabled:opacity-50 sm:min-h-14 sm:text-sm"
    : "inline-flex min-h-12 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs font-semibold text-slate-100 transition hover:bg-white/10 disabled:opacity-50 sm:min-h-14 sm:text-sm";
  const iconClass = light ? "h-5 w-5 text-[var(--admin-text-secondary)]" : "h-5 w-5 text-slate-300";
  const hintClass = light ? "text-[var(--admin-text-muted)]" : "text-slate-500";

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      onFiles(Array.from(event.target.files));
    }
    event.target.value = "";
  }

  return (
    <div id={id} className="grid gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          className={buttonClass}
          disabled={busy}
          onClick={() => galleryRef.current?.click()}
        >
          <Images className={iconClass} strokeWidth={1.75} aria-hidden="true" />
          Galería de fotos
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={busy}
          onClick={() => filesRef.current?.click()}
        >
          <FolderOpen className={iconClass} strokeWidth={1.75} aria-hidden="true" />
          Seleccionar archivos
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={busy}
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className={iconClass} strokeWidth={1.75} aria-hidden="true" />
          Tomar foto
        </button>
      </div>

      <p className={`text-center text-xs ${hintClass}`}>
        {uploading ? "Subiendo fotos…" : PHOTO_FORMAT_HINT}
        {showDragHint ? " · En escritorio también puedes arrastrar imágenes." : null}
      </p>

      {/* Gallery / library — never use capture */}
      <input
        ref={galleryRef}
        type="file"
        accept={PHOTO_FILE_ACCEPT}
        multiple
        className="hidden"
        onChange={handleChange}
        data-testid="photo-gallery-input"
      />

      {/* Native file picker — kept visible so desktop/browser upload tools can target it directly. Never use capture. */}
      <div className={`rounded-xl border border-dashed ${light ? "border-[var(--admin-border)] bg-[var(--admin-surface)]" : "border-white/15 bg-white/5"} p-3`}>
        <label className={`mb-2 block text-xs font-semibold ${light ? "text-[var(--admin-text-secondary)]" : "text-slate-300"}`} htmlFor={`${id}-files-input`}>
          Seleccionar archivos JPG u otras imágenes
        </label>
        <input
          ref={filesRef}
          id={`${id}-files-input`}
          type="file"
          accept={PHOTO_FILE_ACCEPT}
          multiple
          disabled={busy}
          className={`block min-h-11 w-full cursor-pointer rounded-lg text-sm file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:px-4 file:font-semibold ${light ? "text-[var(--admin-text)] file:bg-[var(--admin-surface-muted)] file:text-[var(--admin-text)]" : "text-slate-200 file:bg-white/10 file:text-white"} disabled:cursor-not-allowed disabled:opacity-50`}
          onChange={handleChange}
          data-testid="photo-files-input"
          aria-describedby={`${id}-file-hint`}
        />
        <p id={`${id}-file-hint`} className={`mt-2 text-xs ${hintClass}`}>Selecciona hasta 5 imágenes. El orden de selección se conserva; la primera se usa como portada.</p>
      </div>

      {/* Camera only — separate input */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
        data-testid="photo-camera-input"
      />
    </div>
  );
}
