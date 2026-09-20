const unsplash = (id: string, width = 1920) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;

export const EDITORIAL = {
  suvNight: {
    src: unsplash("photo-1519641471654-76ce0107ad1b"),
    alt: "SUV premium en iluminación nocturna",
  },
  sedan: {
    src: unsplash("photo-1503376780353-7e6692767b70"),
    alt: "Sedán de alta gama en fotografía cinematográfica",
  },
  mustang: {
    src: unsplash("photo-1494976388531-d1058494cdd8"),
    alt: "Vehículo deportivo en carretera",
  },
  muscle: {
    src: unsplash("photo-1552519507-da3b142c6e3d"),
    alt: "Vehículo de alto contraste en estudio",
  },
  cabin: {
    src: unsplash("photo-1542362567-b07e54358753"),
    alt: "Detalle editorial de un vehículo contemporáneo",
  },
  wheels: {
    src: unsplash("photo-1617531653332-bd46c24f2068"),
    alt: "Detalle de rueda y carrocería automotriz",
  },
  headlights: {
    src: unsplash("photo-1489824904134-891ab64532f1"),
    alt: "Faros de un vehículo en contraluz",
  },
  pickup: {
    src: unsplash("photo-1559416523-140ddc3d238c"),
    alt: "Pickup contemporánea en entorno abierto",
  },
  highway: {
    src: unsplash("photo-1449965408869-eaa3f722e40d"),
    alt: "Tránsito en un entorno urbano",
  },
  carrier: {
    src: unsplash("photo-1601584115197-04ecc0da31d7"),
    alt: "Transporte terrestre de carga sobre carretera",
  },
  port: {
    src: unsplash("photo-1578575437130-527eed3abbec"),
    alt: "Buque de carga y logística marítima",
  },
  ship: {
    src: unsplash("photo-1605745341112-85968b19335b"),
    alt: "Transporte marítimo de contenedores",
  },
  yard: {
    src: unsplash("photo-1486262715619-67b85e0b08d3"),
    alt: "Patio de vehículos e inspección",
  },
  coastal: {
    src: unsplash("photo-1469854523086-cc02fe5d8800"),
    alt: "Carretera costera como contexto de destino en el Caribe",
  },
  documents: {
    src: unsplash("photo-1554224155-6726b3ff858f"),
    alt: "Documentación y planificación sobre escritorio",
  },
  interiorLeather: {
    src: unsplash("photo-1549317661-bd32c8ce0db2"),
    alt: "Interior automotriz con detalle de volante y tablero",
  },
  sunsetSuv: {
    src: unsplash("photo-1533473359331-0135ef1b58bf"),
    alt: "SUV premium en un entorno abierto al atardecer",
  },
  cityDrive: {
    src: unsplash("photo-1449965408869-eaa3f722e40d"),
    alt: "Vehículo en entorno urbano contemporáneo",
  },
  hybridEv: {
    src: unsplash("photo-1593941707882-a5bba14938c7"),
    alt: "Vehículo eléctrico en estación de carga",
  },
} as const;
