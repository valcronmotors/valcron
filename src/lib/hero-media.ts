const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=70`;

export const HOME_HERO_SLIDES = [
  {
    src: unsplash("photo-1519641471654-76ce0107ad1b"),
    alt: "SUV familiar contemporáneo, fotografía ilustrativa",
  },
] as const;

export const PAGE_HERO_IMAGES = {
  inventario: unsplash("photo-1492144534655-ae79c964c9d7"),
  importacion: unsplash("photo-1601584115197-04ecc0da31d7"),
  financiamiento: unsplash("photo-1449965408869-eaa3f722e40d"),
  nosotros: unsplash("photo-1541899481282-d53bffcf8837"),
  contacto: unsplash("photo-1489824904134-891ab64532f1"),
  subastas: unsplash("photo-1549317661-bd32c8ce0db2"),
  servicios: unsplash("photo-1533473359331-0135ef1b58bf"),
} as const;

export const PAGE_HERO_ALTS = {
  inventario: "Vehículos disponibles para compra en República Dominicana",
  importacion: "Transporte terrestre de un vehículo hacia su destino",
  financiamiento: "Conducir en ciudad, contexto de compra y financiamiento",
  nosotros: "Vehículo contemporáneo en entorno abierto",
  contacto: "Detalle automotriz para atención al cliente",
  subastas: "Sedán contemporáneo, fotografía ilustrativa",
  servicios: "SUV contemporáneo, fotografía ilustrativa de servicios",
} as const;

export const IMPORT_SCENE_IMAGE = unsplash("photo-1578575437130-527eed3abbec");
export const IMPORT_SCENE_ALT =
  "Transporte marítimo de carga hacia destino internacional";

export const NOSOTROS_GALLERY_IMAGE = unsplash("photo-1519641471654-76ce0107ad1b");
