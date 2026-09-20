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
      <span className="flex h-full items-center justify-center text-sm text-muted">
        Imagen por confirmar
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
