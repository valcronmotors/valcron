/** Self-hosted Unsplash License photography. See public/marketing/IMAGE-LICENSES.md. */
const photo = (file: string) => `/marketing/${file}`;

export const EDITORIAL = {
  suvNight: {
    src: photo("suv-entorno-abierto.jpg"),
    alt: "SUV en entorno abierto, fotografía ilustrativa de opciones de vehículos",
  },
  sedan: {
    src: photo("sedan-familiar-compra.jpg"),
    alt: "Sedán familiar en un entorno urbano, fotografía ilustrativa",
  },
  mustang: {
    src: photo("suv-contemporaneo-servicios.jpg"),
    alt: "SUV contemporáneo, fotografía ilustrativa de opciones de vehículos",
  },
  muscle: {
    src: photo("suv-entorno-abierto.jpg"),
    alt: "SUV en un entorno abierto, fotografía ilustrativa",
  },
  cabin: {
    src: photo("detalle-carroceria.jpg"),
    alt: "Detalle de carrocería de un vehículo, fotografía ilustrativa de inspección",
  },
  wheels: {
    src: photo("detalle-rueda-vehiculo.jpg"),
    alt: "Detalle de rueda y carrocería, fotografía ilustrativa",
  },
  headlights: {
    src: photo("detalle-faro-vehiculo.jpg"),
    alt: "Faros de un vehículo, fotografía ilustrativa",
  },
  pickup: {
    src: photo("pickup-entorno-abierto.jpg"),
    alt: "Pickup en un entorno abierto, fotografía ilustrativa",
  },
  highway: {
    src: photo("conduccion-urbana.jpg"),
    alt: "Vehículo en tránsito urbano, fotografía ilustrativa",
  },
  carrier: {
    src: photo("transporte-terrestre-vehiculo.jpg"),
    alt: "Camión de carga en carretera, fotografía ilustrativa de transporte terrestre",
  },
  port: {
    src: photo("logistica-maritima-puerto.jpg"),
    alt: "Buque de carga, fotografía ilustrativa de logística marítima",
  },
  ship: {
    src: photo("contenedores-transporte-maritimo.jpg"),
    alt: "Contenedores de transporte marítimo, fotografía ilustrativa",
  },
  yard: {
    src: photo("patio-vehiculos-inspeccion.jpg"),
    alt: "Patio de vehículos en revisión, fotografía ilustrativa",
  },
  coastal: {
    src: photo("carretera-destino.jpg"),
    alt: "Carretera en un entorno abierto, fotografía ilustrativa",
  },
  documents: {
    src: photo("planificacion-documentos.jpg"),
    alt: "Documentos y calculadora sobre un escritorio, fotografía ilustrativa",
  },
  interiorLeather: {
    src: photo("interior-tablero-vehiculo.jpg"),
    alt: "Volante y tablero de un vehículo, fotografía ilustrativa",
  },
  sunsetSuv: {
    src: photo("suv-entorno-abierto.jpg"),
    alt: "SUV en un entorno abierto al atardecer, fotografía ilustrativa",
  },
  cityDrive: {
    src: photo("conduccion-urbana.jpg"),
    alt: "Conducción en un entorno urbano, fotografía ilustrativa",
  },
  hybridEv: {
    src: photo("vehiculo-electrico-carga.jpg"),
    alt: "Vehículo electrificado en una estación de carga, fotografía ilustrativa",
  },
  crossover: {
    src: photo("crossover-compacto-inventario.jpg"),
    alt: "Crossover compacto, fotografía ilustrativa",
  },
  familySedan: {
    src: photo("sedan-familiar-compra.jpg"),
    alt: "Sedán familiar, fotografía ilustrativa de compra de vehículos",
  },
  compactSuv: {
    src: photo("crossover-compacto-inventario.jpg"),
    alt: "Crossover compacto, fotografía ilustrativa de selección de vehículos",
  },
  citySuv: {
    src: photo("suv-urbano-compra-vehiculos.jpg"),
    alt: "SUV en un entorno urbano, fotografía ilustrativa. No representa instalaciones de Valcron.",
  },
  silverSedan: {
    src: photo("sedan-familiar-compra.jpg"),
    alt: "Sedán familiar, fotografía ilustrativa",
  },
  /** Process storytelling — editorial, not Valcron inventory, staff, or premises. */
  processSearch: {
    src: photo("seleccion-vehiculos.jpg"),
    alt: "Grupo de vehículos, fotografía ilustrativa de búsqueda de opciones",
    caption: "Proceso de búsqueda personalizada",
  },
  processBrowse: {
    src: photo("patio-vehiculos-inspeccion.jpg"),
    alt: "Patio de vehículos para revisión de opciones, fotografía ilustrativa",
    caption: "Opciones mediante plataformas de subasta",
  },
  processQuote: {
    src: photo("planificacion-documentos.jpg"),
    alt: "Documentación y planificación de costos, fotografía ilustrativa",
    caption: "Preparación de cotización",
  },
  processSelect: {
    src: photo("suv-contemporaneo-servicios.jpg"),
    alt: "SUV contemporáneo, fotografía ilustrativa de selección de unidad",
    caption: "Selección de unidad",
  },
  processLogistics: {
    src: photo("transporte-terrestre-vehiculo.jpg"),
    alt: "Transporte terrestre de carga, fotografía ilustrativa",
    caption: "Coordinación del proceso contratado",
  },
  processFinance: {
    src: photo("planificacion-escritorio.jpg"),
    alt: "Escritorio de trabajo, fotografía ilustrativa de planificación financiera",
    caption: "Orientación para financiamiento",
  },
  processImport: {
    src: photo("logistica-maritima-puerto.jpg"),
    alt: "Logística marítima, fotografía ilustrativa de importación",
    caption: "Coordinación del proceso de importación",
  },
  processTradeIn: {
    src: photo("pickup-entorno-abierto.jpg"),
    alt: "Pickup en un entorno abierto, fotografía ilustrativa de evaluación",
    caption: "Evaluación de trade-in",
  },
  processDelivery: {
    src: photo("carretera-destino.jpg"),
    alt: "Carretera en un entorno abierto, fotografía ilustrativa",
    caption: "Coordinación de entrega",
  },
} as const;
