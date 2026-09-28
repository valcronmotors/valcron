const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=72`;

/** Marketing photography — illustrative, not inventory. */
export const HOME_HERO_SLIDES = [
  {
    src: unsplash("photo-1707070182914-fb69f596c98e"),
    alt: "Crossover SUV contemporáneo en iluminación natural, fotografía ilustrativa de Valcron Motors",
    mobileSrc: unsplash("photo-1707070182914-fb69f596c98e", 900),
  },
] as const;

export const PAGE_HERO_IMAGES = {
  inventario: unsplash("photo-1492144534655-ae79c964c9d7"),
  importacion: unsplash("photo-1601584115197-04ecc0da31d7"),
  financiamiento: unsplash("photo-1449965408869-eaa3f722e40d"),
  nosotros: unsplash("photo-1541899481282-d53bffcf8837"),
  contacto: unsplash("photo-1489824904134-891ab64532f1"),
  subastas: unsplash("photo-1617469767053-d3b523a0b982"),
  servicios: unsplash("photo-1533473359331-0135ef1b58bf"),
} as const;

export const PAGE_HERO_ALTS = {
  inventario: "Vehículos disponibles para compra en República Dominicana",
  importacion: "Transporte terrestre de un vehículo hacia su destino",
  financiamiento: "Conducir en ciudad, contexto de compra y financiamiento",
  nosotros: "Vehículo contemporáneo en entorno abierto",
  contacto: "Detalle automotriz para atención al cliente",
  subastas: "SUV contemporáneo, fotografía ilustrativa de búsqueda y subasta",
  servicios: "SUV contemporáneo, fotografía ilustrativa de servicios",
} as const;

export const IMPORT_SCENE_IMAGE = unsplash("photo-1578575437130-527eed3abbec");
export const IMPORT_SCENE_ALT =
  "Transporte marítimo de carga hacia destino internacional";

export const NOSOTROS_GALLERY_IMAGE = unsplash("photo-1519641471654-76ce0107ad1b");
