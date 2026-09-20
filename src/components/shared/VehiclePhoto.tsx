import Image from "next/image";

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
      <span className="flex h-full w-full flex-col items-center justify-center bg-[#111] px-4 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C7A96B]">
          Imagen no disponible
        </span>
      </span>
    );
  }

  const local = src.startsWith("/");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={!local}
      className={className}
    />
  );
}
