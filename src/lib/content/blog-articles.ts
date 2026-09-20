import { EDITORIAL } from "@/lib/editorial-media";
import type { ContentArticle } from "@/lib/content/types";

export const BLOG_ARTICLES: ContentArticle[] = [
  {
    kind: "blog",
    slug: "comprar-vehiculo-estados-unidos-republica-dominicana",
    title: "Comprar un vehículo en Estados Unidos para República Dominicana: qué debes saber antes de comenzar",
    seoTitle: "Comprar un vehículo en EE. UU. para República Dominicana",
    description:
      "Qué implica comprar un vehículo en Estados Unidos para traerlo a República Dominicana: título, transporte, costos y decisiones que conviene tomar antes de ofertar.",
    publishedAt: "2026-07-14",
    updatedAt: "2026-09-12",
    category: "Importación",
    excerpt:
      "Importar no empieza en el puerto. Empieza en entender título, condición, presupuesto real y el rol de cada costo antes de pujar o comprar.",
    hero: {
      src: EDITORIAL.ship.src,
      alt: "Imagen ilustrativa de transporte marítimo de carga",
    },
    blocks: [
      {
        type: "p",
        text: "Comprar un vehículo en Estados Unidos para usarlo en República Dominicana no es lo mismo que comprar uno ya nacionalizado en Santo Domingo Este. Cambia el papelerío, el calendario, el riesgo de condición y la forma en que se arma el presupuesto. Este artículo resume el panorama para quien está empezando. Si buscas el procedimiento paso a paso, usa la [guía completa de importación](/guias/importar-vehiculo-estados-unidos-republica-dominicana).",
      },
      { type: "h2", id: "dos-caminos", text: "Dos caminos distintos" },
      {
        type: "p",
        text: "Hay quien compra una unidad ya disponible en un dealer local y hay quien adquiere en Estados Unidos —en subasta o por otro canal— para importar. El segundo camino puede abrir más opciones de año, versión y precio de partida, pero también suma transporte terrestre, marítimo, despacho y tiempos que no controla un solo actor.",
      },
      {
        type: "p",
        text: "Valcron Motors, dealer en Santo Domingo Este, trabaja ambos escenarios: inventario local e importación. La decisión correcta depende del uso, el plazo y la tolerancia a incertidumbre, no de una frase de marketing.",
      },
      { type: "h2", id: "antes-de-ofertar", text: "Antes de ofertar o pagar" },
      {
        type: "ul",
        items: [
          "Define uso real: diario, familiar, trabajo o proyecto de reparación.",
          "Separa el precio del vehículo del costo total aproximado de traerlo a RD.",
          "Revisa el tipo de título y lo que eso implica para registro e inspección.",
          "Lee fotos, daños reportados y si la unidad figura como Run and Drive.",
          "Confirma con Aduanas (DGA) e Impuestos Internos (DGII) los requisitos vigentes. Pueden cambiar.",
        ],
      },
      {
        type: "callout",
        title: "No confundas precio de subasta con precio en RD",
        text: "Una oferta actual, un buy now o un precio publicado en plataforma no es el costo de entrega en República Dominicana. Faltan flete, seguro, despacho y gastos locales.",
      },
      { type: "h2", id: "documentos-clave", text: "Documentos que suelen entrar en juego" },
      {
        type: "p",
        text: "En Estados Unidos el título acredita la propiedad y el estatus legal del vehículo (clean, salvage, rebuilt u otras marcas, según el estado). El Bill of Lading documenta el embarque. En República Dominicana el despacho y la primera placa siguen normas de DGA, DGII e INTRANT. No copies un checklist de internet como si fuera ley: confirma la lista vigente con la autoridad o con quien gestione el expediente.",
      },
      { type: "h2", id: "tiempo-y-expectativa", text: "Tiempo y expectativa" },
      {
        type: "p",
        text: "El plazo depende de la subasta, el yard, el booking marítimo y la aduana. No hay un número único honesto para “cuánto tarda”. Un dealer serio te da un rango para ese caso, no una promesa genérica.",
      },
      { type: "h2", id: "siguiente-paso", text: "Siguiente paso" },
      {
        type: "p",
        text: "Si ya tienes una unidad en mente, revísala con el mismo criterio de [evaluar un vehículo de subasta](/blog/evaluar-vehiculo-subasta-antes-de-ofertar). Si quieres ver stock ya en el país, entra al [inventario](/inventario). Para el flujo de importación con Valcron Motors, visita [Importación](/importacion).",
      },
    ],
    faq: [
      {
        question: "¿Puedo importar cualquier vehículo de una subasta de EE. UU.?",
        answer:
          "No automáticamente. Depende del título, la condición, las reglas de la plataforma y los requisitos dominicanos vigentes. Hay que evaluar cada unidad.",
      },
      {
        question: "¿Valcron Motors es socio de Copart o IAA?",
        answer:
          "No. Copart, IAA/IAAI y Manheim son plataformas o fuentes de mercado. Valcron Motors las usa como referencia de búsqueda, no como alianza comercial.",
      },
    ],
    related: [
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
      { kind: "blog", slug: "errores-comunes-importar-vehiculo-estados-unidos" },
      { kind: "guide", slug: "calcular-costo-total-importar-vehiculo" },
    ],
    cta: { href: "/importacion", label: "Conocer importación" },
  },
  {
    kind: "blog",
    slug: "copart-vs-iaa-subastas-vehiculos-estados-unidos",
    title: "Copart vs IAA: cómo entender las subastas de vehículos en Estados Unidos",
    seoTitle: "Copart vs IAA: subastas de vehículos en Estados Unidos",
    description:
      "Diferencias prácticas entre Copart e IAA/IAAI para quien compra desde República Dominicana: inventario, condición, lectura de listados y lo que no deben prometerte.",
    publishedAt: "2026-07-28",
    updatedAt: "2026-09-08",
    category: "Subastas",
    excerpt:
      "Copart e IAA no son “el mismo patio con otro logo”. Entender cómo publica cada plataforma evita ofertar a ciegas desde República Dominicana.",
    hero: {
      src: EDITORIAL.yard.src,
      alt: "Imagen ilustrativa de un patio de vehículos",
    },
    blocks: [
      {
        type: "p",
        text: "Quien busca vehículos de Estados Unidos desde República Dominicana se encuentra pronto con dos nombres: Copart e IAA (Insurance Auto Auctions, también IAAI). Ambas publican inventario de subasta, muchas veces con origen de seguro, y ambas exigen leer el listado con calma. No son socias de Valcron Motors; son plataformas de mercado.",
      },
      { type: "h2", id: "que-comparten", text: "Qué suelen compartir" },
      {
        type: "ul",
        items: [
          "Fichas con fotos, odometer, título reportado y daños primarios o secundarios.",
          "Estados como Run and Drive, starts, o unidades que no se desplazan.",
          "Formatos de puja y, en algunos lotes, compra inmediata cuando existe.",
          "Ubicación en un yard de Estados Unidos, no en Santo Domingo.",
        ],
      },
      { type: "h2", id: "como-distinguirlas", text: "Cómo distinguirlas en la práctica" },
      {
        type: "p",
        text: "Copart concentra un volumen alto de unidades de seguro y salvage, con un lenguaje de listado que hay que aprender (damage, keys, runs). IAA/IAAI opera un modelo comparable de subasta de seguros, con su propia ficha, fotos y reglas de yard. Manheim, en cambio, es un canal distinto, más asociado a dealer-to-dealer; no lo mezcles en la misma frase como si fuera el mismo producto.",
      },
      {
        type: "p",
        text: "La pregunta útil no es “cuál es mejor”, sino: ¿esta unidad concreta tiene fotos suficientes, título claro y un costo total que todavía tiene sentido en RD? Para leer una ficha línea por línea, usa la [guía para leer una publicación de Copart o IAA](/guias/leer-publicacion-copart-iaa).",
      },
      { type: "h2", id: "desde-rd", text: "Comprar desde República Dominicana" },
      {
        type: "p",
        text: "Desde RD no “entras al yard” como un comprador local. Hay cuentas, depósitos, transporte hasta puerto y reglas de cada plataforma. Un dealer puede localizar opciones, estimar costos y acompañar la compra; no puede inventar que el lote ya está en Av Principal 20.",
      },
      {
        type: "callout",
        title: "Oferta actual no es precio de venta en RD",
        text: "Si ves current bid o buy now, son referencias de la subasta. El costo en República Dominicana se arma después, con flete, despacho y gastos locales.",
      },
      { type: "h2", id: "errores-frecuentes", text: "Errores frecuentes al comparar plataformas" },
      {
        type: "ol",
        items: [
          "Elegir solo porque un lote “se ve barato” en dólares de puja.",
          "Ignorar el tipo de título porque la foto del exterior está limpia.",
          "Asumir que Copart e IAA publican la misma información con los mismos campos.",
          "Tratar a Manheim, Copart e IAA como un único “socio de Valcron”.",
        ],
      },
      {
        type: "p",
        text: "Si quieres el flujo completo de compra en subasta desde RD, abre la [guía para comprar en subastas de Estados Unidos](/guias/comprar-vehiculos-subastas-estados-unidos-desde-rd). Para ver cómo Valcron Motors orienta ese proceso, visita [Subastas](/subastas).",
      },
    ],
    faq: [
      {
        question: "¿Copart e IAA venden solo salvage?",
        answer:
          "No. Hay de todo, incluyendo unidades con título limpio. Hay que leer el campo de título de esa publicación, no generalizar la plataforma.",
      },
      {
        question: "¿Cuál debo usar si vivo en Santo Domingo?",
        answer:
          "La que tenga la unidad correcta para tu uso y presupuesto, después de sumar importación. La plataforma no sustituye el criterio sobre el vehículo.",
      },
    ],
    related: [
      { kind: "guide", slug: "leer-publicacion-copart-iaa" },
      { kind: "blog", slug: "clean-title-salvage-rebuilt-diferencias" },
      { kind: "guide", slug: "comprar-vehiculos-subastas-estados-unidos-desde-rd" },
    ],
    cta: { href: "/subastas", label: "Ver subastas" },
  },
  {
    kind: "blog",
    slug: "clean-title-salvage-rebuilt-diferencias",
    title: "Clean Title, Salvage y Rebuilt: diferencias que debes conocer",
    seoTitle: "Clean Title, Salvage y Rebuilt: diferencias clave",
    description:
      "Qué significan Clean Title, Salvage Title y Rebuilt Title en vehículos de Estados Unidos y por qué importan al importar o comprar en República Dominicana.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-09-10",
    category: "Educación",
    excerpt:
      "El título no es un adorno del anuncio. Define historial legal en EE. UU. y condiciona lo que puedes esperar al nacionalizar o registrar en RD.",
    hero: {
      src: EDITORIAL.documents.src,
      alt: "Imagen ilustrativa de documentación sobre un escritorio",
    },
    blocks: [
      {
        type: "p",
        text: "En las subastas de vehículos de Estados Unidos el campo de título resume un hecho legal del estado emisor: si la unidad se considera limpia, salvage, rebuilt u otra marca. No es un juicio de “bonito o feo”. Tampoco es, por sí solo, un permiso de circular en República Dominicana.",
      },
      { type: "h2", id: "clean", text: "Clean Title" },
      {
        type: "p",
        text: "Un título limpio indica, en el estado que lo emitió, que no consta la marca de pérdida total o salvamento asociada a un evento de seguro de ese tipo. No garantiza que el vehículo esté perfecto, ni que el odómetro sea honesto, ni que no haya daños estéticos. Significa que, en ese registro, no lleva esa marca.",
      },
      { type: "h2", id: "salvage", text: "Salvage Title" },
      {
        type: "p",
        text: "Salvage suele indicar que una aseguradora u otra autoridad consideró que el vehículo tuvo un evento relevante —a menudo pérdida total económica o daño suficiente para esa calificación—. El umbral varía por estado. Un salvage de inundación no es el mismo riesgo que un salvage de daño trasero reparable. Por eso las fotos y el daño primario importan tanto como la palabra salvage.",
      },
      { type: "h2", id: "rebuilt", text: "Rebuilt Title" },
      {
        type: "p",
        text: "Rebuilt (o restored, según el estado) suele significar que un salvage posterior fue reparado e inspeccionado para volver a titularse. Otra vez: las reglas son estatales. Rebuilt no equivale a “como nuevo” ni a “listo para RD sin más trámites”.",
      },
      {
        type: "callout",
        title: "Registro en República Dominicana",
        text: "Los requisitos de importación, inspección y primera placa los definen autoridades dominicanas (DGA, DGII, INTRANT). Un título de EE. UU. no se traduce automáticamente. Confirma la información vigente antes de comprar.",
      },
      { type: "h2", id: "como-usarlo", text: "Cómo usar esta información al comprar" },
      {
        type: "ul",
        items: [
          "Lee el título reportado en la ficha, no el comentario de un video genérico.",
          "Cruza título con daño primario, secundario y Run and Drive.",
          "Si el título no está claro, no ofertes “por si acaso”.",
          "Pregunta cómo se documentará esa unidad en el expediente de importación.",
        ],
      },
      {
        type: "p",
        text: "Para el vocabulario de daños y fotos, continúa con [cómo evaluar un vehículo de subasta](/blog/evaluar-vehiculo-subasta-antes-de-ofertar). El [VIN](/guias/guia-vin-identificar-verificar-vehiculo) ayuda a contrastar historial cuando existe reporte disponible.",
      },
    ],
    faq: [
      {
        question: "¿Salvage significa que el carro no corre?",
        answer:
          "No. Salvage describe una marca de título. Puede haber unidades salvage que figuran como Run and Drive y otras que no se desplazan.",
      },
      {
        question: "¿Un Clean Title elimina la necesidad de inspección?",
        answer:
          "No. Título limpio no sustituye revisión mecánica, de carrocería ni de documentos en República Dominicana.",
      },
    ],
    related: [
      { kind: "blog", slug: "evaluar-vehiculo-subasta-antes-de-ofertar" },
      { kind: "guide", slug: "guia-vin-identificar-verificar-vehiculo" },
      { kind: "blog", slug: "copart-vs-iaa-subastas-vehiculos-estados-unidos" },
    ],
    cta: { href: "/subastas", label: "Ver subastas" },
  },
  {
    kind: "blog",
    slug: "evaluar-vehiculo-subasta-antes-de-ofertar",
    title: "Cómo evaluar un vehículo de subasta antes de ofertar",
    seoTitle: "Cómo evaluar un vehículo de subasta antes de ofertar",
    description:
      "Método práctico para revisar fotos, título, daños y Run and Drive antes de ofertar en una subasta de vehículos de Estados Unidos desde República Dominicana.",
    publishedAt: "2026-08-18",
    updatedAt: "2026-09-15",
    category: "Subastas",
    excerpt:
      "Ofertar sin método es adivinar. Un orden simple —ficha, fotos, título, costos— reduce sorpresas al importar a República Dominicana.",
    hero: {
      src: EDITORIAL.wheels.src,
      alt: "Imagen ilustrativa de detalle de carrocería y rueda",
    },
    blocks: [
      {
        type: "p",
        text: "Una publicación de subasta es un expediente incompleto: fotos de un día, campos que llena un inspector y un precio que todavía no incluye República Dominicana. Evaluar es decidir si esa incertidumbre cabe en tu presupuesto. No es predecir el futuro del taller.",
      },
      { type: "h2", id: "orden", text: "Un orden que funciona" },
      {
        type: "ol",
        items: [
          "Identidad: año, marca, modelo, versión y VIN, si está publicado.",
          "Título y marcas: clean, salvage, rebuilt u otra.",
          "Daño primario y secundario, en el idioma de la ficha.",
          "Run and Drive, llaves y odómetro.",
          "Fotos en secuencia: exterior, interior, motor, daños.",
          "Ubicación del yard y lo que eso implica para el flete interno en EE. UU.",
          "Techo de oferta solo después de un costo total aproximado.",
        ],
      },
      { type: "h2", id: "fotos", text: "Qué buscar en las fotos" },
      {
        type: "p",
        text: "Las fotos no son un catálogo de showroom. Busca consistencia: paneles que no coinciden, holguras, óxido en puntos de agua, tapicería hundida, testigos en el tablero, daños no mencionados en el texto. Si faltan ángulos clave —bajos, motor, interior— el silencio también es información. Amplía este punto en la [guía para leer una publicación](/guias/leer-publicacion-copart-iaa).",
      },
      { type: "h2", id: "run-and-drive", text: "Run and Drive no es un diagnóstico" },
      {
        type: "p",
        text: "Run and Drive indica que, en el momento de la inspección, el vehículo arrancó y se desplazó según el criterio de esa plataforma. No certifica transmisión, aire, electrónica ni ausencia de daño estructural. Trátalo como un dato, no como garantía.",
      },
      { type: "h2", id: "techo", text: "El techo de oferta" },
      {
        type: "p",
        text: "El techo no es “lo máximo que me emociona”. Es el número que todavía deja margen para transporte, despacho, imprevistos de condición y, si aplica, reparación. La [guía para calcular el costo total aproximado](/guias/calcular-costo-total-importar-vehiculo) ayuda a armar esa cuenta sin fingir tasas de impuesto.",
      },
      {
        type: "callout",
        title: "Si no puedes explicarlo, no ofertes",
        text: "Si no puedes decir en una frase qué título tiene, qué daño reporta y cuánto te queda para traerlo a RD, la unidad todavía no está lista para puja.",
      },
      {
        type: "p",
        text: "Cuando quieras pasar de la teoría a una búsqueda concreta, usa [Subastas](/subastas) o el [inventario](/inventario) si prefieres unidades ya publicadas por Valcron Motors.",
      },
    ],
    faq: [
      {
        question: "¿Cuántas fotos son suficientes?",
        answer:
          "No hay un número mágico. Importa que cubran daños, interior, motor y costados. Un lote con 40 fotos irrelevantes informa menos que 15 ángulos útiles.",
      },
      {
        question: "¿Debo ofertar si el VIN no aparece?",
        answer:
          "Es una señal para frenar. Sin VIN es más difícil contrastar historial y documentos. Pide la ficha completa antes de comprometerte.",
      },
    ],
    related: [
      { kind: "guide", slug: "leer-publicacion-copart-iaa" },
      { kind: "blog", slug: "clean-title-salvage-rebuilt-diferencias" },
      { kind: "guide", slug: "calcular-costo-total-importar-vehiculo" },
    ],
    cta: { href: "/subastas", label: "Ver subastas" },
  },
  {
    kind: "blog",
    slug: "vehiculos-hibridos-republica-dominicana",
    title: "Vehículos híbridos en República Dominicana: qué debes considerar",
    seoTitle: "Vehículos híbridos en República Dominicana",
    description:
      "Qué revisar al comprar o importar un híbrido en República Dominicana: uso, batería, servicio y el cuidado de no inventar beneficios fiscales.",
    publishedAt: "2026-08-26",
    updatedAt: "2026-09-16",
    category: "Híbridos y eléctricos",
    excerpt:
      "Un híbrido puede encajar en Santo Domingo. También puede salir caro si ignoras batería, piezas y reglas fiscales vigentes.",
    hero: {
      src: EDITORIAL.hybridEv.src,
      alt: "Imagen ilustrativa de un vehículo electrificado",
    },
    blocks: [
      {
        type: "p",
        text: "Los vehículos híbridos ya forman parte de la conversación de compra en República Dominicana: menor consumo en ciudad, menos visitas a la bomba, y un perfil distinto al de un motor solo gasolina. Eso no los convierte en una categoría mágica ni en un atajo fiscal automático.",
      },
      { type: "h2", id: "tipos", text: "Híbrido, enchufable y eléctrico no son lo mismo" },
      {
        type: "p",
        text: "Un híbrido convencional recarga en marcha y frenado; no se enchufa. Un híbrido enchufable (PHEV) sí admite carga externa y suele tener más autonomía eléctrica. Un eléctrico de batería (BEV) no usa motor de gasolina. El servicio, el cableado y el uso diario cambian en cada caso. No importes “un eléctrico” si en realidad viste un híbrido en la ficha.",
      },
      { type: "h2", id: "uso-en-rd", text: "Uso real en RD" },
      {
        type: "ul",
        items: [
          "Tráfico de Santo Domingo favorece a muchos híbridos de ciudad, no a todos los PHEV si no hay hábito de carga.",
          "Viajes largos por el país exigen entender autonomía, puntos de carga y respaldo de gasolina.",
          "El taller debe poder diagnosticar el sistema híbrido; no basta un cambio de aceite genérico.",
          "Piezas de batería y electrónica pueden tener plazos y costos distintos a un vehículo convencional.",
        ],
      },
      { type: "h2", id: "ley", text: "Ley 103-13 y beneficios fiscales" },
      {
        type: "p",
        text: "En República Dominicana existe la Ley 103-13, asociada a incentivos para el uso de energía no convencional y eficiencia. Los detalles de exenciones, porcentajes y vehículos que califican dependen de la norma vigente y de cómo la aplican DGA y DGII en el momento del despacho. No vamos a publicar aquí un porcentaje, una lista de marcas “exentas” ni una interpretación legal. Si el incentivo es parte de tu cuenta, confírmalo con la autoridad o con un profesional del despacho antes de comprar.",
      },
      {
        type: "callout",
        title: "Los requisitos pueden cambiar",
        text: "Confirma la información vigente con DGA, DGII o el profesional que gestione tu importación. Un artículo web no sustituye el criterio oficial del expediente.",
      },
      { type: "h2", id: "importar-hibrido", text: "Si el híbrido viene de subasta" },
      {
        type: "p",
        text: "Revisa historial de batería cuando exista, códigos de daño eléctrico, fotos del compartimento y si el listado menciona problemas de high voltage. Un salvage por inundación en un híbrido merece más respeto que en un vehículo sin paquete de batería. El método de [evaluación de subasta](/blog/evaluar-vehiculo-subasta-antes-de-ofertar) aplica, con más peso en sistema eléctrico.",
      },
      {
        type: "p",
        text: "Para ver unidades publicadas, abre el [inventario](/inventario). Para el proceso de traer una unidad desde Estados Unidos, sigue la [guía de importación](/guias/importar-vehiculo-estados-unidos-republica-dominicana).",
      },
    ],
    faq: [
      {
        question: "¿Todo híbrido paga menos impuestos al importar?",
        answer:
          "No lo afirmamos. Cualquier beneficio depende de la normativa vigente y de la calificación del vehículo en el despacho. Hay que verificarlo caso por caso.",
      },
      {
        question: "¿Un híbrido usado de subasta es mala idea?",
        answer:
          "No necesariamente. Es una idea que exige más revisión de batería, daños y título que un eslogan de “ahorro de gasolina”.",
      },
    ],
    related: [
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
      { kind: "blog", slug: "errores-comunes-importar-vehiculo-estados-unidos" },
      { kind: "guide", slug: "checklist-vehiculo-usado-antes-de-comprar" },
    ],
    cta: { href: "/inventario", label: "Ver inventario" },
  },
  {
    kind: "blog",
    slug: "errores-comunes-importar-vehiculo-estados-unidos",
    title: "Errores comunes al importar un vehículo desde Estados Unidos",
    seoTitle: "Errores comunes al importar un vehículo desde EE. UU.",
    description:
      "Errores frecuentes al importar un vehículo de Estados Unidos a República Dominicana: presupuesto incompleto, título ignorado y plazos irreales.",
    publishedAt: "2026-09-02",
    updatedAt: "2026-09-18",
    category: "Importación",
    excerpt:
      "La mayoría de los disgustos de importación no nacen en el buque. Nacen en una decisión tomada con información a medias.",
    hero: {
      src: EDITORIAL.port.src,
      alt: "Imagen ilustrativa de logística portuaria",
    },
    blocks: [
      {
        type: "p",
        text: "Importar un vehículo desde Estados Unidos a República Dominicana es un proceso con etapas claras y con lugares donde la gente se tropieza siempre igual. Esta lista no es un recetario de aduanas; es un mapa de decisiones mal tomadas.",
      },
      { type: "h2", id: "presupuesto-corto", text: "1. Presupuestar solo la puja" },
      {
        type: "p",
        text: "El error más caro es tratar el current bid como precio final. Faltan fees de plataforma, transporte interno en EE. UU., flete marítimo, seguro, despacho y gastos en RD. Arma la cuenta con la [guía de costo total aproximado](/guias/calcular-costo-total-importar-vehiculo) antes de enamorarte del lote.",
      },
      { type: "h2", id: "titulo", text: "2. Ignorar el título porque “se ve limpio”" },
      {
        type: "p",
        text: "La carrocería de las fotos no anula un salvage. El tipo de título condiciona expectativas de registro y de valor de reventa. Repasa [Clean, Salvage y Rebuilt](/blog/clean-title-salvage-rebuilt-diferencias).",
      },
      { type: "h2", id: "plazos", text: "3. Comprar con un plazo de película" },
      {
        type: "p",
        text: "Yard, booking, tránsito y aduana no caminan al ritmo de un anuncio de Instagram. Si necesitas el vehículo la semana próxima, el camino correcto puede ser el [inventario local](/inventario), no una subasta.",
      },
      { type: "h2", id: "fotos", text: "4. No leer las fotos con malicia útil" },
      {
        type: "p",
        text: "Zoom al daño, a los bajos, al motor y al tablero. Si la publicación oculta lo que más te importa, no completes el hueco con imaginación.",
      },
      { type: "h2", id: "normas", text: "5. Copiar requisitos de un foro de hace tres años" },
      {
        type: "p",
        text: "Documentos de DGA, DGII e INTRANT se actualizan. Un PDF viejo no es fuente. Los requisitos pueden cambiar. Confirma la información vigente con la autoridad correspondiente antes de realizar la operación.",
      },
      { type: "h2", id: "interlocutor", text: "6. Demasiados interlocutores y ningún expediente" },
      {
        type: "p",
        text: "Cuando la puja, el flete y el despacho viven en chats distintos, se pierde el hilo. Un dealer como Valcron Motors centraliza el caso; aun así, tú debes guardar copias de título, BL y estimaciones.",
      },
      {
        type: "callout",
        title: "El atajo más seguro",
        text: "Si el proceso entero te resulta opaco, no improvises una cuenta de subasta el mismo día. Pide una orientación en [Importación](/importacion) o escribe por WhatsApp con año, marca y presupuesto.",
      },
    ],
    faq: [
      {
        question: "¿Importar siempre sale más barato que comprar en RD?",
        answer:
          "No. A veces sí, a veces el costo total y el tiempo no compensan. Hay que comparar con unidades ya disponibles y con el uso que le darás.",
      },
      {
        question: "¿Puedo saltarme el Bill of Lading?",
        answer:
          "El BL es el documento de transporte marítimo. Forma parte del expediente de embarque. No es un trámite decorativo.",
      },
    ],
    related: [
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
      { kind: "blog", slug: "comprar-vehiculo-estados-unidos-republica-dominicana" },
      { kind: "guide", slug: "calcular-costo-total-importar-vehiculo" },
    ],
    cta: { href: "/importacion", label: "Conocer importación" },
  },
];
