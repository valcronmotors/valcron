import Link from "next/link";
import { BookOpen, Calculator, CircleHelp, Mail } from "lucide-react";

const ITEMS = [
  { href: "/contacto", title: "Escríbenos", copy: "Cuéntanos qué buscas.", icon: Mail },
  { href: "/blog", title: "Guías y recursos", copy: "Información antes de comprar.", icon: BookOpen },
  { href: "/calculadoras", title: "Calculadoras", copy: "Explora costos y cuotas.", icon: Calculator },
  { href: "/preguntas-frecuentes", title: "Preguntas frecuentes", copy: "Respuestas claras al proceso.", icon: CircleHelp },
];

export function HomeHelp() {
  return (
    <section className="section-light bg-[#f5f5f3]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Ayuda</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          ¿Necesitas ayuda?
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525252]">
          Estamos aquí para orientarte durante tu proceso. Explora nuestras herramientas, recursos o
          comunícate con nosotros.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.25rem] border border-[#ececea] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
            >
              <item.icon className="h-5 w-5 text-[#C7A96B]" strokeWidth={1.7} />
              <h3 className="mt-5 font-display text-xl font-semibold text-[#111]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#525252]">{item.copy}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
