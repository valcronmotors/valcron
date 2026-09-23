const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const HOME_HERO_SLIDES = [
  {
    src: unsplash("photo-1632137924251-fcea5ff46035"),
    alt: "SUV compacto contemporáneo, fotografía ilustrativa de vehículo",
  },
  {
    src: unsplash("photo-1707070182914-fb69f596c98e"),
    alt: "Crossover compacto contemporáneo, fotografía ilustrativa de vehículo",
  },
  {
    src: unsplash("photo-1649921777129-a28a26031a03"),
    alt: "SUV familiar contemporáneo, fotografía ilustrativa de vehículo",
  },
] as const;

export const PAGE_HERO_IMAGES = {
  inventario: unsplash("photo-1632137924251-fcea5ff46035"),
  importacion: unsplash("photo-1606016159991-dfe4f2746ad5"),
  financiamiento: unsplash("photo-1619767886558-efdc259cde1a"),
  nosotros: unsplash("photo-1707070182914-fb69f596c98e"),
  contacto: unsplash("photo-1549317661-bd32c8ce0db2"),
  subastas: unsplash("photo-1619767886558-efdc259cde1a"),
  servicios: unsplash("photo-1704940225548-1420f7fed72f"),
} as const;

export const PAGE_HERO_ALTS = {
  inventario: "Inventario ilustrativo de vehículos para compra en República Dominicana",
  importacion: "Vehículo contemporáneo, contexto visual del proceso de importación",
  financiamiento: "Sedán contemporáneo para planificar una compra con bancos locales",
  nosotros: "Crossover compacto contemporáneo, fotografía ilustrativa",
  contacto: "Interior automotriz ilustrativo para atención al cliente",
  subastas: "Sedán contemporáneo, fotografía ilustrativa de opciones de compra",
  servicios: "SUV contemporáneo, fotografía ilustrativa de servicios de dealer",
} as const;

export const IMPORT_SCENE_IMAGE = unsplash("photo-1578575437130-527eed3abbec");
export const IMPORT_SCENE_ALT =
  "Transporte marítimo de carga hacia destino internacional";

export const NOSOTROS_GALLERY_IMAGE = unsplash("photo-1632137924251-fcea5ff46035");
