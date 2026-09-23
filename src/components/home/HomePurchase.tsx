import { Car, MessageCircle, Shield, ShieldCheck, Wallet } from "lucide-react";

const PILLARS = [
  {
    title: "Vehículo",
    copy: "Encuentra una unidad disponible o dinos qué estás buscando.",
    icon: Car,
  },
  {
    title: "Financiamiento",
    copy: "Explora escenarios y opciones disponibles a través de bancos locales.",
    icon: Wallet,
  },
  {
    title: "Seguro",
    copy: "Te orientamos para gestionar la cobertura adecuada para tu vehículo.",
    icon: Shield,
  },
  {
    title: "Garantía / protección",
    copy: "Consulta las opciones disponibles para vehículos elegibles.",
    icon: ShieldCheck,
  },
  {
    title: "Asesoría",
    copy: "Acompañamiento durante el proceso de compra, con información clara.",
    icon: MessageCircle,
  },
];

export function HomePurchase() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Experiencia de compra</p>
        <h2 className="mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Todo para tu próximo vehículo.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525252]">
          Te ayudamos a completar el proceso: encontrar la unidad, planificar la compra y coordinar
          financiamiento, seguro y opciones de protección cuando aplique.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {PILLARS.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.25rem] border border-[#ececea] bg-white p-6"
            >
              <item.icon className="h-5 w-5 text-[#C7A96B]" strokeWidth={1.7} />
              <h3 className="mt-5 font-display text-xl font-semibold text-[#111]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525252]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
