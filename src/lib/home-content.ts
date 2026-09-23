export const HOME_FAQS = [
  {
    q: "¿Tienen vehículos disponibles en República Dominicana?",
    a: "Sí, cuando hay unidades publicadas en inventario como disponibles para compra local. El catálogo indica el estado de cada vehículo. Si no ves la unidad que buscas, podemos explorar otras opciones.",
  },
  {
    q: "¿Puedo financiar mi vehículo?",
    a: "Puedes explorar escenarios de inicial, plazo y cuota estimada. Las opciones, tasas, requisitos y aprobaciones las define cada banco local según el perfil del solicitante. Valcron Motors no es un banco.",
  },
  {
    q: "¿Cómo funciona la inicial?",
    a: "La inicial es el pago inicial sobre el precio del vehículo. El resto puede evaluarse para financiamiento con bancos locales. El porcentaje y las condiciones dependen de cada institución y del caso.",
  },
  {
    q: "¿Pueden orientarme con el seguro del vehículo?",
    a: "Sí. Te orientamos para gestionar opciones de cobertura disponibles, incluida full cover cuando corresponda. No somos aseguradora ni intermediario autorizado; la cobertura la define cada aseguradora.",
  },
  {
    q: "¿Los vehículos tienen garantía?",
    a: "Algunos vehículos elegibles pueden tener opciones de garantía o protección. No todas las unidades incluyen cobertura. Consulta condiciones caso por caso antes de comprar.",
  },
  {
    q: "¿Pueden buscar un vehículo específico para mí?",
    a: "Sí. Indica marca, modelo, año, presupuesto y preferencias. Exploramos inventario y otras fuentes adecuadas para encontrar el vehículo que buscas.",
  },
  {
    q: "¿Cómo funcionan las subastas?",
    a: "Las plataformas publican vehículos con fotos, lote, daños y tipo de título. Te ayudamos a evaluar la unidad y el proceso de compra. Copart, IAAI y Manheim son plataformas; no somos socios oficiales de esas compañías.",
  },
] as const;

export const PAGE_FAQS = [
  ...HOME_FAQS,
  {
    q: "¿Cuánto tarda una importación?",
    a: "El tiempo depende del vehículo, el transporte, el embarque y el proceso en República Dominicana. Te orientamos con un cronograma estimado para cada caso, no con una promesa genérica.",
  },
] as const;

export const HOME_ARTICLES = [
  {
    href: "/guias/checklist-vehiculo-usado-antes-de-comprar",
    category: "Guías",
    title: "Cómo comprar un vehículo usado",
    excerpt: "Una lista práctica para revisar unidad, historial y costos antes de decidir.",
    image: {
      src: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=75",
      alt: "Fotografía ilustrativa de un vehículo listo para inspección",
    },
  },
  {
    href: "/guias/comprar-vehiculos-subastas-estados-unidos-desde-rd",
    category: "Guías",
    title: "Cómo funcionan las subastas",
    excerpt: "Plataformas, lote, pujas y lo que conviene revisar antes de ofertar.",
    image: {
      src: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=75",
      alt: "SUV compacto contemporáneo, fotografía ilustrativa",
    },
  },
  {
    href: "/blog/clean-title-salvage-rebuilt-diferencias",
    category: "Blog",
    title: "Clean Title vs Salvage",
    excerpt: "Qué indica cada tipo de título y por qué importa antes de comprar.",
    image: {
      src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=75",
      alt: "Interior automotriz ilustrativo",
    },
  },
] as const;
