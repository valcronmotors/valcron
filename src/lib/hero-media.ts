/**
 * V19 home uses a typographic (image-free) hero.
 * HOME_BANNER_IMAGE remains for Open Graph / social previews and editorial cards.
 */
export const HOME_BANNER_IMAGE = {
  src: "/marketing/banner-suv-tropical.jpg",
  alt: "SUV Mazda blanco en un entorno tropical, fotografía ilustrativa. No representa las instalaciones de Valcron.",
} as const;

/** Illustrative stock consultation. Not Valcron staff, customers, or a financing decision. */
export const HOME_CONSULT_IMAGE = {
  src: "/marketing/consulta-compra-vehiculo.jpg",
  alt: "Asesor y cliente revisando documentos junto a un vehículo, fotografía de stock ilustrativa. No son personas de Valcron.",
} as const;

/** Vehicle carrier. Not a Valcron shipment. */
export const HOME_CARRIER_IMAGE = {
  src: "/marketing/portavehiculos-logistica.jpg",
  alt: "Camión portavehículos con automóviles en tránsito, fotografía ilustrativa de logística. No es un embarque de Valcron.",
} as const;

/** Page heroes — editorial marketing photography, not inventory or premises. */
export const PAGE_HERO_IMAGES = {
  inventario: "/marketing/seleccion-vehiculos.jpg",
  importacion: "/marketing/transporte-terrestre-vehiculo.jpg",
  financiamiento: "/marketing/planificacion-escritorio.jpg",
  nosotros: "/marketing/suv-entorno-abierto.jpg",
  contacto: "/marketing/detalle-faro-vehiculo.jpg",
  subastas: "/marketing/patio-vehiculos-inspeccion.jpg",
  servicios: "/marketing/suv-urbano-compra-vehiculos.jpg",
} as const;

export const PAGE_HERO_ALTS = {
  inventario: "Grupo de vehículos, fotografía ilustrativa de selección. No es el inventario publicado.",
  importacion: "Camión de carga en carretera, fotografía ilustrativa de transporte terrestre",
  financiamiento: "Escritorio de trabajo, fotografía ilustrativa de planificación financiera",
  nosotros: "SUV en un entorno abierto, fotografía ilustrativa. No representa las instalaciones de Valcron.",
  contacto: "Detalle de faros de un vehículo, fotografía ilustrativa",
  subastas: "Patio de vehículos en revisión, fotografía ilustrativa de búsqueda y subasta",
  servicios: "SUV en un entorno urbano, fotografía ilustrativa de servicios automotrices",
} as const;

export const IMPORT_SCENE_IMAGE = "/marketing/logistica-maritima-puerto.jpg";
export const IMPORT_SCENE_ALT = "Buque de carga, fotografía ilustrativa de logística marítima";

export const NOSOTROS_GALLERY_IMAGE = "/marketing/suv-entorno-abierto.jpg";
