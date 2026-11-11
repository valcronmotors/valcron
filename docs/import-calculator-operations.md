# Estimador de importación Valcron

Todos los parámetros y fórmulas están en `src/lib/import-cost-config.ts`.
Se comparte el tipo de cambio del sitio desde `src/lib/fx.ts` (RD$62/US$1).
El mismo componente sirve `/importacion` y `/calculadoras/importacion`.

## Parámetros operativos del 10 de noviembre de 2026

- Transporte terrestre: US$400; rango US$250–900 según distancia.
- Flete base: US$1,075; combustible: US$500. Por defecto se suman: US$1,575.
  Si la cotización base ya contiene el recargo, activar
  `freight.baseIncludesFuelSurcharge` o la casilla equivalente del estimador.
- Arancel: 20% del CIF; 0% solo al seleccionar origen y elegibilidad DR-CAFTA
  confirmados. El sitio no determina preferencia arancelaria mediante el VIN.
- ITBIS: 18% de CIF más arancel.
- Primera placa: 17% del CIF. CO₂ seleccionable: 0%, 1%, 2%, 3%; predeterminado 1%.
- Marbete: RD$4,000 para año 2022 o posterior; RD$2,000 para 2021 o anterior.
- Puerto y gestión Valcron: US$450 combinados, sumados una sola vez.
- Incentivo híbrido/eléctrico: escenario explícitamente ilustrativo, factor 0.5
  sobre arancel, ITBIS y primera placa. No acredita elegibilidad.
- CIF de referencia: compra, comisiones, transporte terrestre, flete/recargo y
  seguro adicional indicado. Los interruptores `cif` permiten ajustar qué
  partidas se incluyen en la base. La valoración oficial puede diferir.

## Comisiones oficiales de subasta

Copart e IAA usan tarifas específicas por cuenta, licencia, pago y precio de
martillo. Sus páginas de tarifas US devolvieron restricciones de acceso en esta
sesión. No se copió una tabla canadiense ni se inventó un porcentaje.

La interfaz acepta la comisión oficial confirmada, incluido gate, y calcula el
total completo cuando existe ese dato. El CTA de WhatsApp funciona también sin
ese importe para pedir la cotización; jamás presenta un total incompleto como
si fuera completo.

Para automatizar la consulta, Gabriel/Muse deben colocar los tramos **US
verificados para la cuenta utilizada** en `auctionFees.copart.tiers` o
`auctionFees.iaai.tiers` del mismo archivo. Cada tramo contiene `upTo` inclusivo,
`buyerFeeUsd`, `buyerFeeRate` opcional y `gateFeeUsd`. Deben ordenarse por límite
ascendente. El importe se obtiene con buyer fijo + precio por tasa + gate.
Un precio sin tramo sigue exigiendo el cargo oficial confirmado; no hay una
tarifa de respaldo inventada. Registrar también `accountProfile` y `verifiedOn`.

Referencias de las tarifas:
- https://www.copart.com/content/us/en/member-fees-us-licensed
- https://www.iaai.com/Marketing/buyer-fees
- https://www.tropical.com/news/2026/tropical-shipping-announces-a-bunker-surcharge-increase-effective-november-08-2026-between-the-continental-u-s-or-canada-and-the-ports-of-the-british-virgin-islands-dominican-republ/
- https://dgii.gov.do/marbetes/preguntasFrecuentes.aspx

## Flujo diario de estimados de lotes

El estimador de importación es independiente del precio validado de cada lote.
En Admin → Subastas → Editar → Publicar oportunidad, llenar **Estimado puesto
en RD (US$)**, confirmar la validación del lote y pulsar **Guardar estimado
puesto en RD**. También aparece en el editor de vehículos de origen subasta.
Se guarda en `vehicles.landed_estimate_usd` y
`vehicles.landed_estimate_validated`; no sobrescribe el precio de compra.

Los 70 importes aprobados el 10 de noviembre se conservan en
`supabase/seed-data/2026-11-10-auction-landed-estimates.csv`. La migración se
alinea con la versión ya aplicada en Supabase; no debe aplicarse de nuevo.
