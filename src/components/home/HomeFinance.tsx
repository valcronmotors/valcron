import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeFinance() {
  return (
    <section className="section-dark bg-[#111214]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="kicker text-[#c7a96b]">Financiamiento</p>
          <h2 className="display-section mt-4 text-white">
            Financiamiento
            <span className="block">con bancos locales</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#a8abb0] md:text-lg">
            Te orientamos durante el proceso con instituciones financieras locales. La aprobación y
            las condiciones las define cada banco según el perfil del solicitante.
          </p>
          <p className="mt-4 text-sm text-[#a8abb0]">
            Valcron Motors no es un banco. No prometemos aprobación.
          </p>
          <div className="mt-8">
            <Link href="/financiamiento" className="btn-primary">
              Conocer opciones
            </Link>
          </div>
        </div>
        <div
          className="relative hidden min-h-[28rem] overflow-hidden bg-[#1b1d20] lg:block"
          style={{ borderRadius: "var(--radius-panel)" }}
        >
          <EditorialImage
            src={EDITORIAL.cityDrive.src}
            alt={EDITORIAL.cityDrive.alt}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
