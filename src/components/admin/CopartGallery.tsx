"use client";

import { useState } from "react";
import { CopartPhoto } from "@/components/admin/CopartPhoto";

export function CopartGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const unique = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const current = unique[Math.min(index, Math.max(unique.length - 1, 0))] ?? null;

  if (!unique.length) {
    return <CopartPhoto alt={alt} className="max-h-96 w-full rounded-xl object-cover" />;
  }

  return (
    <div className="grid gap-3">
      <CopartPhoto src={current} alt={alt} className="max-h-96 w-full rounded-xl object-cover" />
      {unique.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {unique.map((url, itemIndex) => (
            <button
              key={`${url}-${itemIndex}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`overflow-hidden rounded-lg border ${
                itemIndex === index ? "border-[var(--admin-text)]" : "border-[var(--admin-border)]"
              }`}
            >
              <CopartPhoto src={url} alt="" className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
