const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const HOME_HERO_SLIDES = [
  {
    src: unsplash("photo-1759782178739-0c8298937711"),
    alt: "Porsche Cayenne de lujo en entorno urbano",
  },
  {
    src: unsplash("photo-1635990215241-4d2805d729bb"),
    alt: "BMW X5 de lujo",
  },
  {
    src: unsplash("photo-1758743460496-54bb89dbee8a"),
    alt: "Audi e-tron Q8 en showroom ejecutivo",
  },
  {
    src: unsplash("photo-1618843479313-40f8afb4b4d8"),
    alt: "Mercedes-Benz de alta gama al atardecer",
  },
  {
    src: unsplash("photo-1621007947382-bb3c3994e3fb"),
    alt: "Lexus de lujo en exhibición",
  },
] as const;

export const PAGE_HERO_IMAGES = {
  inventario: unsplash("photo-1744921761306-b1ea64e5babf"),
  importacion: unsplash("photo-1639104087848-f5b1b4b6598d"),
  financiamiento: unsplash("photo-1485291571150-772bcfc10da5"),
  nosotros: unsplash("photo-1716702528916-18c7a8c1ecde"),
  contacto: unsplash("photo-1741087583560-30705d5b2fa4"),
} as const;

export const PAGE_HERO_ALTS = {
  inventario:
    "Exhibición de vehículos de alta gama BMW, Audi, Porsche y Mercedes-Benz en showroom ejecutivo",
  importacion:
    "Land Rover Defender y SUVs de lujo listos para importación y despacho",
  financiamiento: "Interior ejecutivo de un sedán premium listo para entrega",
  nosotros: "Instalaciones modernas de dealer con vehículos multimarca en exposición",
  contacto: "Atención ejecutiva con vehículo de lujo en primer plano",
} as const;

export const NOSOTROS_GALLERY_IMAGE = unsplash("photo-1713387918387-d2d75ab2fa21");
