import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { publicPageMetadata } from "@/lib/seo";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Cómo funciona Valcron Motors",
  description: `Cómo funciona ${SITE.shortName}: del primer mensaje a tu próximo vehículo en República Dominicana.`,
  path: "/como-funciona",
});

const STEPS = [
  {
    step: "01",
    title: "Encuentra tu vehículo",
    copy: "Explora el inventario o indícanos marca, modelo, año y presupuesto.",
  },
  {
    step: "02",
    title: "Revisa las opciones",
    copy: "Comparamos estado, precio, kilometraje y lo que realmente encaja contigo.",
  },
  {
    step: "03",
    title: "Planifica tu compra",
    copy: "Definimos el escenario de inicial, plazo y cuota estimada con bancos locales.",
  },
  {
    step: "04",
    title: "Gestiona financiamiento y protección",
    copy: "Te orientamos con opciones de cobertura y de garantía o protección para vehículos elegibles.",
  },
  {
    step: "05",
    title: "Completa el proceso",
    copy: "Coordinamos la documentación y los siguientes pasos de la compra.",
  },
  {
    step: "06",
    title: "Recibe tu vehículo",
    copy: "Cierre y entrega en el proceso acordado, con un interlocutor claro.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <main>
      <PageHero
        kicker="Proceso"
        title="Cómo funciona Valcron Motors"
        subtitle="Encuentra, evalúa y completa la compra de tu próximo vehículo en República Dominicana."
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <p className="kicker">Pasos</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            Un proceso ordenado, sin promesas vacías
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {STEPS.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.15rem] border border-black/10 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.04)]"
              >
                <p className="kicker">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#111]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#525252]">{item.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
            <Link href="/contacto" className="btn-secondary">
              Solicitar vehículo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
