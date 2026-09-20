import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const FRAMES = [
  { image: EDITORIAL.wheels, className: "md:col-span-2 md:row-span-2 min-h-[18rem]" },
  { image: EDITORIAL.headlights, className: "min-h-[12rem]" },
  { image: EDITORIAL.interiorLeather, className: "min-h-[12rem]" },
  { image: EDITORIAL.highway, className: "md:col-span-2 min-h-[14rem]" },
];

export function HomeGallery() {
  return (
    <section className="bg-[#111111]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Galería</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          El vehículo
          <span className="block">como protagonista.</span>
        </h2>
        <div className="mt-12 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {FRAMES.map((frame) => (
            <div
              key={frame.image.src}
              className={`relative overflow-hidden rounded-[1.15rem] bg-[#0a0a0a] ${frame.className}`}
            >
              <EditorialImage
                src={frame.image.src}
                alt={frame.image.alt}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
