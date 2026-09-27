"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

export function LazyMapEmbed({
  className,
  title = SITE.maps.embedTitle,
}: {
  className?: string;
  title?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || active) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={hostRef} className={className}>
      {active ? (
        <iframe
          title={title}
          src={SITE.maps.embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#111] text-xs uppercase tracking-[0.16em] text-[#C7A96B]">
          Mapa
        </div>
      )}
    </div>
  );
}
