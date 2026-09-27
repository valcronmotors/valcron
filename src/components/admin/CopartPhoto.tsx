"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { copartAdminMediaSrc, copartCardImageUrl } from "@/lib/auction-providers/copart/images";

export function CopartPhoto({
  thumbnailUrl,
  imageReference,
  src,
  alt = "",
  className,
  placeholder = "text",
}: {
  thumbnailUrl?: string | null;
  imageReference?: string | null;
  src?: string | null;
  alt?: string;
  className?: string;
  placeholder?: "text" | "quiet";
}) {
  const [failed, setFailed] = useState(false);
  const direct = src ? copartCardImageUrl(src) : copartCardImageUrl(thumbnailUrl ?? null, imageReference ?? null);
  const proxied = copartAdminMediaSrc(direct);

  if (!proxied || failed) {
    if (placeholder === "quiet") {
      return (
        <div
          className={`flex items-center justify-center bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)] ${className ?? "h-40 w-full"}`}
          aria-hidden={alt ? undefined : true}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
        >
          <Car className="h-5 w-5" strokeWidth={1.5} />
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center bg-[var(--admin-surface-muted)] ${className ?? "h-40 w-full"}`}>
        <p className="px-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
          Imagen no disponible
        </p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxied}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className ?? "h-40 w-full object-cover"}
    />
  );
}
