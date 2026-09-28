import Link from "next/link";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Nosotros | Dealer en Santo Domingo Este",
  description:
    "Valcron Motors Group en Av Principal 20, Santo Domingo Este. Inventario local, búsqueda personalizada y orientación de financiamiento con bancos locales.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <main>
      <PageHero
        kicker="Nosotros"
        title="Un dealer claro, con proceso serio."
        subtitle={`${SITE.shortName} ayuda a clientes en República Dominicana a encontrar y obtener el vehículo correcto — sin rodeos.`}
        image={PAGE_HERO_IMAGES.nosotros}
        imageAlt={PAGE_HERO_ALTS.nosotros}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-20">
          <p className="kicker">Quiénes somos</p>
          <h2 className="display-section mt-3 text-[#08090b]">
            Atención personalizada en Santo Domingo Este.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#676a70] md:text-lg">
            <p>
              Somos un dealer automotriz enfocado en lo que el cliente necesita: ver unidades
              reales, entender opciones de pago y, cuando hace falta, buscar un vehículo fuera del
              inventario publicado.
            </p>
            <p>
              Trabajamos con inventario local y, cuando conviene, con vehículos disponibles
              mediante plataformas de subasta como Copart e IAA. Esas plataformas son fuentes de
              mercado, no socios.
            </p>
            <p>
              Nuestro compromiso es un proceso claro: consulta directa, información útil y
              acompañamiento hasta el cierre — sin promesas vacías.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
            </Link>
            <Link href="/contacto" className="btn-secondary">
              Contactarnos
            </Link>
          </div>
        </div>
      </section>

      <BusinessLocation variant="full" heading="Nuestra ubicación" />
    </main>
  );
}
