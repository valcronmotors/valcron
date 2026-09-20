const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const HOME_HERO_SLIDES = [
  {
    src: "/hero-luxury.png",
    alt: "Sedán premium con iluminación cinematográfica",
  },
  {
    src: "/hero-coast.png",
    alt: "SUV premium en carretera costera al atardecer",
  },
  {
    src: "/hero-showroom.png",
    alt: "Showroom automotriz con sedán de alta gama",
  },
] as const;

export const PAGE_HERO_IMAGES = {
  inventario: "/hero-showroom.png",
  importacion: "/hero-coast.png",
  financiamiento: "/hero-luxury.png",
  nosotros: "/hero-showroom.png",
  contacto: "/hero-luxury.png",
  subastas: "/hero-luxury.png",
  servicios: "/hero-coast.png",
} as const;

export const PAGE_HERO_ALTS = {
  inventario: "Inventario premium de Valcron Motors en showroom",
  importacion: "SUV listo para importación hacia República Dominicana",
  financiamiento: "Sedán premium para compra y financiamiento en RD",
  nosotros: "Imagen ilustrativa de un showroom automotriz contemporáneo",
  contacto: "Atención comercial con vehículo de alta gama",
  subastas: "Vehículo premium disponible para búsqueda en subastas",
  servicios: "Proceso de importación y acompañamiento automotriz",
} as const;

export const IMPORT_SCENE_IMAGE = unsplash("photo-1578575437130-527eed3abbec");
export const IMPORT_SCENE_ALT =
  "Transporte marítimo de carga hacia destino internacional";

export const NOSOTROS_GALLERY_IMAGE = "/hero-showroom.png";
