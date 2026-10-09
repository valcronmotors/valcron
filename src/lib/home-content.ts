export const HOME_FAQS = [
  {
    q: "¿Dónde están ubicados?",
    a: "En Av Principal 20, Santo Domingo Este, República Dominicana. Puedes visitarnos, llamar al (809) 623-9381 o escribir por WhatsApp al (829) 321-1271.",
  },
  {
    q: "¿Tienen vehículos disponibles en República Dominicana?",
    a: "Sí, cuando hay unidades publicadas en inventario. Cada ficha indica el estado. Si no ves lo que buscas, podemos explorar otras opciones.",
  },
  {
    q: "¿Puedo financiar mi vehículo?",
    a: "Puedes explorar escenarios de inicial, plazo y cuota estimada. Las opciones, tasas y aprobaciones las define cada banco local según tu perfil. Valcron no es un banco.",
  },
  {
    q: "¿Trabajan con bancos locales?",
    a: "Te orientamos para presentar tu caso ante instituciones financieras locales. La decisión final es del banco.",
  },
  {
    q: "¿Pueden buscar un vehículo para mí?",
    a: "Sí. Indica marca, modelo, año, presupuesto y preferencias. Revisamos inventario y otras fuentes adecuadas.",
  },
  {
    q: "¿Cómo funcionan las subastas?",
    a: "Plataformas como Copart e IAA publican vehículos con fotos y datos de lote. Te ayudamos a evaluar y cotizar el proceso. Son plataformas, no socios de Valcron.",
  },
  {
    q: "¿Puedo entregar mi vehículo?",
    a: "Sí, podemos evaluar tu unidad como parte de la compra. El valor se confirma después de revisar la unidad.",
  },
  {
    q: "¿Cómo funciona una importación?",
    a: "Cuando aplica, te orientamos en selección, compra, transporte y proceso de llegada a República Dominicana. Los tiempos y costos dependen de cada caso.",
  },
] as const;

export const PAGE_FAQS = [
  ...HOME_FAQS,
  {
    q: "¿Cuánto tarda una importación?",
    a: "Depende del vehículo, el transporte y el proceso en República Dominicana. Te damos un cronograma estimado para tu caso, no una promesa genérica.",
  },
] as const;

export const HOME_ARTICLES = [
  {
    href: "/guias/checklist-vehiculo-usado-antes-de-comprar",
    category: "Guías",
    title: "Checklist antes de comprar un usado",
    excerpt: "Qué revisar en la unidad, el historial y los costos antes de decidir.",
    image: {
      src: "/marketing/detalle-carroceria.jpg",
      alt: "Detalle de carrocería de un vehículo, fotografía ilustrativa de inspección",
    },
  },
  {
    href: "/guias/comprar-vehiculos-subastas-estados-unidos-desde-rd",
    category: "Guías",
    title: "Subastas desde República Dominicana",
    excerpt: "Cómo leer opciones en plataformas como Copart e IAA antes de ofertar.",
    image: {
      src: "/marketing/seleccion-vehiculos.jpg",
      alt: "Grupo de vehículos, fotografía ilustrativa de búsqueda de opciones",
    },
  },
  {
    href: "/blog/clean-title-salvage-rebuilt-diferencias",
    category: "Blog",
    title: "Clean Title vs Salvage",
    excerpt: "Qué indica cada tipo de título y por qué importa antes de comprar.",
    image: {
      src: "/marketing/planificacion-documentos.jpg",
      alt: "Documentos sobre un escritorio, fotografía ilustrativa de revisión de título",
    },
  },
] as const;
