import { EDITORIAL } from "@/lib/editorial-media";
import type { ContentArticle } from "@/lib/content/types";

export const GUIDE_ARTICLES: ContentArticle[] = [
  {
    kind: "guide",
    slug: "importar-vehiculo-estados-unidos-republica-dominicana",
    title: "Guía completa para importar un vehículo desde Estados Unidos a República Dominicana",
    seoTitle: "Guía para importar un vehículo de EE. UU. a RD",
    description:
      "Pasos para importar un vehículo desde Estados Unidos a República Dominicana: selección, título, transporte, Bill of Lading, despacho y primera placa, sin tasas inventadas.",
    publishedAt: "2026-06-20",
    updatedAt: "2026-09-14",
    category: "Importación",
    excerpt:
      "Una importación ordenada es una secuencia: elegir bien, documentar, mover, despachar y registrar. Esta guía recorre esa secuencia sin vender milagros.",
    hero: {
      src: EDITORIAL.carrier.src,
      alt: "Imagen ilustrativa de transporte terrestre de vehículos",
    },
    blocks: [
      {
        type: "p",
        text: "Esta guía evergreen describe el proceso habitual para importar un vehículo desde Estados Unidos a República Dominicana. No sustituye a DGA, DGII ni INTRANT. Los requisitos pueden cambiar. Confirma la información vigente con la autoridad correspondiente antes de realizar la operación.",
      },
      { type: "h2", id: "para-quien", text: "Para quién es esta guía" },
      {
        type: "p",
        text: "Para quien vive en RD —por ejemplo en Santo Domingo Este— y quiere entender el camino completo antes de pujar o firmar. Si solo necesitas el panorama general, lee el [artículo introductorio](/blog/comprar-vehiculo-estados-unidos-republica-dominicana).",
      },
      { type: "h2", id: "paso-1", text: "1. Define uso, presupuesto y plazo" },
      {
        type: "ul",
        items: [
          "Uso: diario, familiar, comercial o proyecto.",
          "Presupuesto: no solo el vehículo, el total aproximado de llegada.",
          "Plazo: si lo necesitas ya, prioriza [inventario local](/inventario).",
        ],
      },
      { type: "h2", id: "paso-2", text: "2. Selecciona la unidad con criterio de importación" },
      {
        type: "p",
        text: "Año, versión, título, daños y fotos deben aguantar una importación, no solo una captura de pantalla. Usa el método de [evaluación de subasta](/blog/evaluar-vehiculo-subasta-antes-de-ofertar) y, si aplica, la [lectura de ficha Copart/IAA](/guias/leer-publicacion-copart-iaa).",
      },
      { type: "h2", id: "paso-3", text: "3. Título y propiedad en Estados Unidos" },
      {
        type: "p",
        text: "El título estadounidense acredita propiedad y marcas legales del estado emisor. Hay que entender si es clean, salvage o rebuilt. El título no es la matrícula dominicana. Ver [diferencias de título](/blog/clean-title-salvage-rebuilt-diferencias).",
      },
      { type: "h2", id: "paso-4", text: "4. Compra y salida del yard" },
      {
        type: "p",
        text: "En subasta hay liquidación, fees y ventanas para retirar. El transporte interno en EE. UU. lleva la unidad al puerto o al consolidado. Sin esta etapa no hay embarque.",
      },
      { type: "h2", id: "paso-5", text: "5. Transporte marítimo y Bill of Lading" },
      {
        type: "p",
        text: "El Bill of Lading (conocimiento de embarque) documenta que la carga fue recibida para transporte marítimo y bajo qué condiciones. Es pieza del expediente, no un trámite simbólico. Guarda copia. El booking y el tránsito dependen de ruta y naviera; no hay un plazo único publicable con honestidad.",
      },
      { type: "h2", id: "paso-6", text: "6. Arribo y despacho en República Dominicana" },
      {
        type: "p",
        text: "El despacho de un vehículo importado se gestiona ante la Dirección General de Aduanas (DGA), con implicaciones tributarias que también involucran a la DGII según el caso. La clasificación, el valor y los documentos exigidos son materia oficial. Esta guía no publica tasas ni exenciones. Pide la lista vigente para ese vehículo.",
      },
      { type: "h2", id: "paso-7", text: "7. Primera placa e INTRANT" },
      {
        type: "p",
        text: "La primera placa de un vehículo importado sigue el procedimiento de registro en República Dominicana, en el que interviene INTRANT y las oficinas competentes. Requisitos de inspección, seguros y documentos pueden actualizarse. No uses un checklist de redes como fuente legal.",
      },
      { type: "h2", id: "paso-8", text: "8. Entrega y revisión en destino" },
      {
        type: "p",
        text: "Al recibir, compara VIN, título y estado físico con lo pactado. Un [checklist de vehículo usado](/guias/checklist-vehiculo-usado-antes-de-comprar) sigue siendo útil el día de la entrega.",
      },
      {
        type: "callout",
        title: "Dónde entra Valcron Motors",
        text: "Como dealer en Av Principal 20, Santo Domingo Este, orientamos búsqueda, costos documentados e importación. No somos Aduanas ni el banco. Para iniciar el flujo, visita [Importación](/importacion) o [solicita un vehículo](/solicitar-vehiculo).",
      },
    ],
    faq: [
      {
        question: "¿Qué es el Bill of Lading?",
        answer:
          "Es el documento de transporte marítimo que respalda el embarque de la carga. Forma parte del expediente de importación.",
      },
      {
        question: "¿Puedo calcular impuestos exactos en esta página?",
        answer:
          "No. Los gravámenes dependen de la norma y del caso. Usa estimaciones solo como brújula y confirma con DGA/DGII o tu gestor.",
      },
      {
        question: "¿Necesito siempre una subasta?",
        answer:
          "No. Puedes importar otras compras en EE. UU. o elegir stock ya en RD. La subasta es un canal, no un requisito.",
      },
    ],
    related: [
      { kind: "guide", slug: "calcular-costo-total-importar-vehiculo" },
      { kind: "guide", slug: "comprar-vehiculos-subastas-estados-unidos-desde-rd" },
      { kind: "blog", slug: "errores-comunes-importar-vehiculo-estados-unidos" },
    ],
    cta: { href: "/importacion", label: "Conocer importación" },
  },
  {
    kind: "guide",
    slug: "comprar-vehiculos-subastas-estados-unidos-desde-rd",
    title: "Guía para comprar vehículos en subastas de Estados Unidos desde República Dominicana",
    seoTitle: "Comprar en subastas de EE. UU. desde República Dominicana",
    description:
      "Cómo funciona la compra en subastas de Estados Unidos desde RD: plataformas, pujas, retiro, transporte e importación, con Copart e IAA como fuentes —no como socios.",
    publishedAt: "2026-06-28",
    updatedAt: "2026-09-11",
    category: "Subastas",
    excerpt:
      "Comprar en subasta desde RD es un encadenamiento de cuenta, puja, yard y puerto. Esta guía ordena ese encadenamiento.",
    hero: {
      src: EDITORIAL.yard.src,
      alt: "Imagen ilustrativa de patio de inspección de vehículos",
    },
    blocks: [
      {
        type: "p",
        text: "Las subastas de vehículos en Estados Unidos permiten pujar o, cuando existe, comprar ahora. Desde República Dominicana el comprador rara vez está en el yard. Por eso el proceso se apoya en cuentas, representantes y un dealer que sepa leer costos. Copart, IAA/IAAI y Manheim son plataformas o canales; no son socios de Valcron Motors.",
      },
      { type: "h2", id: "como-funciona", text: "Cómo funciona una subasta, en corto" },
      {
        type: "ol",
        items: [
          "Se publica el lote con fotos, título reportado y daños.",
          "Hay subasta en vivo, puja anticipada o buy now, según el lote.",
          "Si ganas, liquidas en los plazos de la plataforma.",
          "Retiras o autorizas el transporte hacia el puerto.",
          "Empieza la importación a RD, que es otro proceso.",
        ],
      },
      { type: "h2", id: "plataformas", text: "Plataformas que verás con más frecuencia" },
      {
        type: "p",
        text: "Copart e IAA concentran mucho inventario de seguro. Manheim opera otro tipo de subasta, más cercana al canal dealer. Elige por la unidad, no por el logo. Contrasta con [Copart vs IAA](/blog/copart-vs-iaa-subastas-vehiculos-estados-unidos).",
      },
      { type: "h2", id: "desde-rd", text: "Qué cambia cuando compras desde RD" },
      {
        type: "ul",
        items: [
          "Depósitos y comisiones de plataforma se pagan en el esquema de EE. UU.",
          "El flete interno depende del estado del yard.",
          "Nadie te entrega el carro en Santo Domingo Este el mismo día de la puja.",
          "El precio de cierre no incluye DGA ni primera placa.",
        ],
      },
      { type: "h2", id: "antes-de-pujar", text: "Antes de pujar" },
      {
        type: "p",
        text: "Lee la ficha completa. Fija un techo con costo total aproximado. Si no entiendes un campo, no lo rellenes con esperanza. La [lectura paso a paso de Copart o IAA](/guias/leer-publicacion-copart-iaa) está hecha para eso.",
      },
      {
        type: "callout",
        title: "Oferta actual, compra ahora y precio de venta",
        text: "Oferta actual es la puja vigente. Compra ahora es un precio de cierre inmediato cuando existe. Precio de venta en RD es otra cosa, de un vehículo ya ofrecido localmente. No los mezcles.",
      },
      { type: "h2", id: "despues", text: "Después de ganar" },
      {
        type: "p",
        text: "Documenta el lote, el pago y el transporte. Enlaza el caso con la [guía de importación](/guias/importar-vehiculo-estados-unidos-republica-dominicana). Si prefieres que Valcron Motors busque por ti, usa [Subastas](/subastas) o WhatsApp.",
      },
    ],
    faq: [
      {
        question: "¿Qué significa Run and Drive?",
        answer:
          "Que en la inspección el vehículo arrancó y se desplazó según el criterio de esa plataforma. No es un peritaje completo.",
      },
      {
        question: "¿Puedo ir yo al yard en Estados Unidos?",
        answer:
          "A veces, con las reglas de cada plataforma y yard. Desde RD lo habitual es operar a distancia con fotos oficiales y un proceso de retiro autorizado.",
      },
    ],
    related: [
      { kind: "guide", slug: "leer-publicacion-copart-iaa" },
      { kind: "blog", slug: "evaluar-vehiculo-subasta-antes-de-ofertar" },
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
    ],
    cta: { href: "/subastas", label: "Ver subastas" },
  },
  {
    kind: "guide",
    slug: "leer-publicacion-copart-iaa",
    title: "Cómo leer una publicación de Copart o IAA paso a paso",
    seoTitle: "Cómo leer una publicación de Copart o IAA",
    description:
      "Guía para leer un listado de Copart o IAA: VIN, título, daños, Run and Drive, llaves, odómetro y fotos, pensada para compradores en República Dominicana.",
    publishedAt: "2026-07-05",
    updatedAt: "2026-09-09",
    category: "Subastas",
    excerpt:
      "Una ficha de subasta se lee de arriba hacia abajo, campo por campo. Esta guía te da ese recorrido.",
    hero: {
      src: EDITORIAL.headlights.src,
      alt: "Imagen ilustrativa de faros y frente de un vehículo",
    },
    blocks: [
      {
        type: "p",
        text: "Copart e IAA/IAAI organizan la información con campos parecidos, no idénticos. El hábito útil es el mismo: no saltar a las fotos bonitas. Esta guía es un recorrido. El criterio de oferta está en [cómo evaluar antes de ofertar](/blog/evaluar-vehiculo-subasta-antes-de-ofertar).",
      },
      { type: "h2", id: "identidad", text: "1. Identidad del lote" },
      {
        type: "ul",
        items: [
          "Número de lote (lot).",
          "Año, marca, modelo y versión si aparece.",
          "VIN: contrastar con la [guía del VIN](/guias/guia-vin-identificar-verificar-vehiculo).",
          "Ubicación del yard: impacta el flete interno en EE. UU.",
        ],
      },
      { type: "h2", id: "titulo", text: "2. Título" },
      {
        type: "p",
        text: "Busca el tipo de título y el estado emisor. Clean, salvage, rebuilt u otras marcas no son intercambiables. Si el campo está vacío o es ambiguo, detente. Ver [Clean, Salvage y Rebuilt](/blog/clean-title-salvage-rebuilt-diferencias).",
      },
      { type: "h2", id: "danos", text: "3. Primary damage y secondary damage" },
      {
        type: "p",
        text: "Primary damage es el daño principal reportado en la inspección (frente, trasera, costado, inundación, vandalismo, etc., según el catálogo de esa plataforma). Secondary damage es un daño adicional anotado. Ninguno describe el 100 % de la unidad. Cruza siempre con fotos.",
      },
      { type: "h2", id: "condicion", text: "4. Condición operativa" },
      {
        type: "ul",
        items: [
          "Run and Drive: arrancó y se movió en la inspección.",
          "Starts: a veces aparece como que enciende, sin afirmar desplazamiento.",
          "Keys: si hay llaves reportadas.",
          "Odometer: valor y, cuando existe, calificación de exactitud.",
        ],
      },
      { type: "h2", id: "fotos-guia", text: "5. Recorrido de fotos" },
      {
        type: "ol",
        items: [
          "Cuatro costados y techo, si existen.",
          "Zona del daño declarado, de cerca y de lejos.",
          "Interior: asientos, tablero, testigos.",
          "Compartimento de motor y bajos cuando hay imagen.",
          "Documentos fotografiados, si la plataforma los muestra.",
        ],
      },
      { type: "h2", id: "precio-ficha", text: "6. Precio en la ficha" },
      {
        type: "p",
        text: "Current bid es oferta actual. Buy now es compra inmediata si está activa. Un estimado de la plataforma no es tu costo en RD. Anótalo y pásalo a la [guía de costo total](/guias/calcular-costo-total-importar-vehiculo).",
      },
      {
        type: "callout",
        title: "No hay campo de “socio Valcron”",
        text: "La ficha es de la plataforma. Valcron Motors puede ayudarte a interpretarla y a gestionar la compra, sin presentar a Copart o IAA como aliados comerciales.",
      },
    ],
    faq: [
      {
        question: "¿Primary damage es lo único que debo reparar?",
        answer:
          "No. Es lo que el inspector anotó como daño principal. Puede haber más. Las fotos y una inspección posterior completan el cuadro.",
      },
      {
        question: "¿Si hay llaves ya está resuelto el arranque?",
        answer:
          "No. Keys indica presencia de llave reportada, no el estado del inmovilizador ni de la batería el día que retires.",
      },
    ],
    related: [
      { kind: "blog", slug: "evaluar-vehiculo-subasta-antes-de-ofertar" },
      { kind: "guide", slug: "comprar-vehiculos-subastas-estados-unidos-desde-rd" },
      { kind: "blog", slug: "copart-vs-iaa-subastas-vehiculos-estados-unidos" },
    ],
    cta: { href: "/subastas", label: "Ver subastas" },
  },
  {
    kind: "guide",
    slug: "calcular-costo-total-importar-vehiculo",
    title: "Guía para calcular el costo total aproximado de importar un vehículo",
    seoTitle: "Calcular el costo aproximado de importar un vehículo a RD",
    description:
      "Partidas que intervienen al importar un vehículo de Estados Unidos a República Dominicana y cómo armar un estimado sin inventar impuestos ni tasas.",
    publishedAt: "2026-07-12",
    updatedAt: "2026-09-13",
    category: "Importación",
    excerpt:
      "El costo total no es un número mágico. Es una suma de partidas. Esta guía nombra las partidas y deja los gravámenes a la autoridad vigente.",
    hero: {
      src: EDITORIAL.documents.src,
      alt: "Imagen ilustrativa de planificación de costos sobre escritorio",
    },
    blocks: [
      {
        type: "p",
        text: "Calcular el costo aproximado de importar un vehículo a República Dominicana sirve para no ofertar por encima de tu realidad. Un estimado no es una factura de Aduanas. Usa esta guía como estructura y confirma gravámenes con DGA y DGII.",
      },
      { type: "h2", id: "partidas", text: "Partidas que suelen intervenir" },
      {
        type: "ol",
        items: [
          "Precio del vehículo o cierre de subasta.",
          "Fees de plataforma y pagos asociados a la compra en EE. UU.",
          "Transporte terrestre hasta el puerto o consolidado.",
          "Flete marítimo y recargos de la ruta.",
          "Seguro de tránsito, cuando se contrata.",
          "Despacho en República Dominicana (criterio oficial, no un porcentaje de blog).",
          "Gastos locales: manejo, inspección, primera placa y trámites de registro.",
          "Reparación o acondicionamiento, si la condición lo exige.",
        ],
      },
      { type: "h2", id: "cif", text: "Qué es el valor CIF (y qué no es)" },
      {
        type: "p",
        text: "CIF agrupa, en comercio internacional, valor de la mercancía más flete y seguro hasta el destino convenido. Es una base de referencia de llegada, no “el impuesto”. Los tributos se determinan según la normativa aduanera y tributaria vigente.",
      },
      { type: "h2", id: "no-inventar", text: "Lo que esta guía no va a hacer" },
      {
        type: "ul",
        items: [
          "No publica un arancel vigente ni una exención de Ley 103-13.",
          "No convierte una oferta actual de subasta en precio de venta en Santo Domingo.",
          "No usa la tasa interna de un dealer como tipo de cambio oficial.",
        ],
      },
      {
        type: "callout",
        title: "Herramienta del sitio",
        text: "Puedes simular escenarios en las [calculadoras](/calculadoras) y en la [calculadora de importación](/calculadoras/importacion). El resultado es una estimación de trabajo, no un cobro de DGA.",
      },
      { type: "h2", id: "metodo", text: "Método corto para un techo de compra" },
      {
        type: "p",
        text: "Suma las partidas que ya conoces. Deja un colchón para las que no conoces. Resta ese total del máximo que puedes destinar. Lo que queda es tu techo de puja, no al revés. Los [errores comunes de importación](/blog/errores-comunes-importar-vehiculo-estados-unidos) empiezan cuando se invierte ese orden.",
      },
      {
        type: "p",
        text: "Cuando quieras un estimado sobre una unidad concreta, habla con Valcron Motors desde [Importación](/importacion) o WhatsApp, con link de lote o año/marca/modelo.",
      },
    ],
    faq: [
      {
        question: "¿El precio publicado en inventario ya es el costo total importado?",
        answer:
          "Si la unidad está disponible en RD, el precio de venta es el de esa publicación, no un bid de subasta. Si está en subasta, el precio publicado no es la entrega final.",
      },
      {
        question: "¿Puedo usar cualquier tipo de cambio?",
        answer:
          "Para tu presupuesto personal usa una referencia actual de mercado. El tipo que aplique en un cobro oficial o bancario lo define esa operación, no este artículo.",
      },
    ],
    related: [
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
      { kind: "blog", slug: "errores-comunes-importar-vehiculo-estados-unidos" },
      { kind: "guide", slug: "comprar-vehiculos-subastas-estados-unidos-desde-rd" },
    ],
    cta: { href: "/calculadoras", label: "Ver calculadoras" },
  },
  {
    kind: "guide",
    slug: "checklist-vehiculo-usado-antes-de-comprar",
    title: "Checklist para revisar un vehículo usado antes de comprarlo",
    seoTitle: "Checklist para comprar un vehículo usado en RD",
    description:
      "Lista práctica para revisar un vehículo usado en República Dominicana: documentos, VIN, carrocería, mecánica e historial, útil en compra local o tras importar.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-09-07",
    category: "Compra en RD",
    excerpt:
      "Una compra usada se sostiene con lista, no con emoción. Este checklist cubre papeles, identidad y estado físico.",
    hero: {
      src: EDITORIAL.cabin.src,
      alt: "Imagen ilustrativa del interior de un vehículo contemporáneo",
    },
    blocks: [
      {
        type: "p",
        text: "Este checklist sirve para un usado en República Dominicana: stock de dealer, particular o unidad recién importada. No reemplaza un taller de tu confianza. Complementa el [VIN](/guias/guia-vin-identificar-verificar-vehiculo) y, si viene de subasta, la [evaluación de lote](/blog/evaluar-vehiculo-subasta-antes-de-ofertar).",
      },
      { type: "h2", id: "papeles", text: "Documentos" },
      {
        type: "ul",
        items: [
          "Identidad del vendedor y coincidencia con el documento del vehículo.",
          "Matrícula o expediente de importación, según el caso.",
          "Historial de mantenimiento si existe, sin inventar servicios no mostrados.",
          "Cualquier gravamen o limitación que el vendedor declare.",
        ],
      },
      { type: "h2", id: "identidad", text: "Identidad de la unidad" },
      {
        type: "ul",
        items: [
          "VIN en tablero, chapa y documentos: deben coincidir.",
          "Año, marca, modelo y versión iguales en ficha y en el auto.",
          "Kilometraje: coherencia entre tablero, desgaste y servicios. Millas vs kilómetros: confirma la unidad.",
        ],
      },
      { type: "h2", id: "carroceria", text: "Carrocería y estructura" },
      {
        type: "ul",
        items: [
          "Holguras de paneles, tono de pintura y sellos.",
          "Pisos, gomas de puertas y olores a humedad.",
          "Cristales, techo y puntos de impacto.",
        ],
      },
      { type: "h2", id: "mecanica", text: "Mecánica y prueba de ruta" },
      {
        type: "ul",
        items: [
          "Arranque en frío, ruidos, fugas visibles.",
          "Transmisión: cambios, patinaje, comportamiento en pendiente (incluye CVT si aplica).",
          "Frenos, dirección y tren delantero.",
          "Aire, electrónicos y testigos del tablero.",
        ],
      },
      { type: "h2", id: "preguntas", text: "Preguntas que debes hacer" },
      {
        type: "ol",
        items: [
          "¿Por qué se vende?",
          "¿Hubo reparación estructural o de airbags?",
          "¿El kilometraje está en millas o kilómetros y se documentó la conversión?",
          "¿Qué queda pendiente de taller?",
          "Si es importado: ¿qué título tenía en EE. UU.?",
        ],
      },
      {
        type: "callout",
        title: "Compra local vs importar",
        text: "Localmente ves el auto ya. Importar añade tiempo y partidas. Ninguna es “mejor” en abstracto: depende de stock, plazo y tolerancia a incertidumbre. Compara con el [inventario](/inventario).",
      },
    ],
    faq: [
      {
        question: "¿AWD y 4WD se revisan igual?",
        answer:
          "No exactamente. Ambos implican más tren de fuerza que un tracción delantera. En prueba de ruta y en inspección de bajos hay que prestar atención a ruidos y fugas específicas.",
      },
      {
        question: "¿Este checklist vale para un híbrido?",
        answer:
          "Sí como base. Suma batería, conectores y, si es enchufable o eléctrico, hábito de carga. Ver el artículo de [híbridos en RD](/blog/vehiculos-hibridos-republica-dominicana).",
      },
    ],
    related: [
      { kind: "guide", slug: "guia-vin-identificar-verificar-vehiculo" },
      { kind: "blog", slug: "vehiculos-hibridos-republica-dominicana" },
      { kind: "guide", slug: "importar-vehiculo-estados-unidos-republica-dominicana" },
    ],
    cta: { href: "/inventario", label: "Explorar vehículos" },
  },
  {
    kind: "guide",
    slug: "guia-vin-identificar-verificar-vehiculo",
    title: "Guía del VIN: cómo identificar y verificar un vehículo",
    seoTitle: "Guía del VIN: identificar y verificar un vehículo",
    description:
      "Qué es el VIN, dónde encontrarlo y cómo usarlo para identificar un vehículo en subasta o en una compra usada en República Dominicana.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-09-06",
    category: "Educación",
    excerpt:
      "El VIN es el identificador del vehículo. Leer y contrastar ese código evita comprar una ficha que no coincide con el metal.",
    hero: {
      src: EDITORIAL.interiorLeather.src,
      alt: "Imagen ilustrativa del tablero de un vehículo",
    },
    blocks: [
      {
        type: "p",
        text: "El VIN (Vehicle Identification Number) es un código de 17 caracteres que identifica un vehículo en particular. No es el número de placa. En subastas de Estados Unidos y en compras en República Dominicana es la llave para cruzar documentos, historial y la unidad física.",
      },
      { type: "h2", id: "donde", text: "Dónde suele estar" },
      {
        type: "ul",
        items: [
          "Placa visible en el tablero, lado del conductor, vista desde el parabrisas.",
          "Etiqueta en marco de puerta.",
          "Documentos: título de EE. UU., ficha de subasta, matrícula o expediente local.",
        ],
      },
      { type: "h2", id: "como-se-lee", text: "Cómo se lee, sin mitología" },
      {
        type: "p",
        text: "Los 17 caracteres siguen un estándar: información de fabricante, atributos del modelo y un identificador secuencial. No hace falta memorizar cada posición para usarlo bien. Lo crítico es que el VIN de la ficha, el del metal y el del título sean el mismo, sin caracteres alterados. El VIN no usa las letras I, O y Q para evitar confusión con números.",
      },
      { type: "h2", id: "verificar", text: "Cómo verificarlo en la práctica" },
      {
        type: "ol",
        items: [
          "Cópialo de la ficha de Copart, IAA o del anuncio local.",
          "Compáralo carácter a carácter con fotos del tablero si existen.",
          "Úsalo en un reporte de historial de EE. UU. cuando esté disponible y sea pertinente.",
          "En RD, contrastarlo con los documentos de importación o registro.",
        ],
      },
      { type: "h2", id: "historial", text: "Historial: qué esperar y qué no" },
      {
        type: "p",
        text: "Un reporte puede mostrar registros de seguro, odómetro o títulos en EE. UU. No cubre necesariamente talleres de República Dominicana ni “deja el auto perfecto”. Ausencia de evento en un reporte no es prueba de ausencia de daño.",
      },
      {
        type: "callout",
        title: "Si el VIN no coincide",
        text: "Detén la compra. Un desajuste entre ficha, título y chapa no se resuelve con un descuento improvisado.",
      },
      {
        type: "p",
        text: "En una publicación de subasta, el VIN es el primer ancla de la [lectura de ficha](/guias/leer-publicacion-copart-iaa). En una compra presencial, entra en el [checklist de usado](/guias/checklist-vehiculo-usado-antes-de-comprar).",
      },
    ],
    faq: [
      {
        question: "¿El VIN dice si el título es salvage?",
        answer:
          "El VIN identifica la unidad. El estatus de título aparece en documentos y reportes, no “dentro” del código como una etiqueta mágica.",
      },
      {
        question: "¿Debo publicar el VIN completo en redes?",
        answer:
          "Para una consulta privada con el dealer puede ser útil. No es necesario exponerlo en comentarios públicos.",
      },
    ],
    related: [
      { kind: "guide", slug: "leer-publicacion-copart-iaa" },
      { kind: "guide", slug: "checklist-vehiculo-usado-antes-de-comprar" },
      { kind: "blog", slug: "clean-title-salvage-rebuilt-diferencias" },
    ],
    cta: { href: "/inventario", label: "Ver inventario" },
  },
];
