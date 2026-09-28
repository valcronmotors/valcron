import Image from "next/image";
import { shouldUseNextImageOptimizer } from "@/lib/vehicle-image-delivery";

export function VehiclePhoto({
  src,
  alt,
  className,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <span className="absolute inset-0 flex h-full w-full min-h-[13rem] flex-col items-center justify-center bg-[#111] px-4 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2B6CFF]">
          Imagen no disponible
        </span>
      </span>
    );
  }

  const local = src.startsWith("/");
  const optimize = shouldUseNextImageOptimizer(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={70}
      unoptimized={!local || !optimize}
      className={className}
    />
  );
}
