# Calculadora única Valcron

Shared client component for `/importacion` and `/calculadoras/importacion`. No backend, database writes or customer-data persistence. VIN requests go directly to NHTSA vPIC over HTTPS on explicit lookup; customer names stay local and are used only for the downloaded PDF. Existing delegated WhatsApp tracking handles the CTA.

## Editable configuration

`src/lib/import-cost-config.ts` contains Gabriel's commercial assumptions: fee tiers, default freight US$1,150, inland US$250, FX60.81, 2% CIF valuation insurance, taxes, marbete, management, dealer tiers, sweet spot and validity. These are estimated business parameters, not verified account-specific auction charges. Decimal-price fee bands use exclusive upper bounds (e.g. 999.99 remains in the under-1000 band). High-price management surcharge applies to the whole purchase price only when purchase exceeds US$60,000. Dealer tiers use inclusive upper bounds, calculated on the complete subtotal before Valcron honorarios, including repair and converted marbete. All intermediate calculations retain precision; presentation rounds to cents.

CIF = selected FOB + freight + 2% FOB insurance. Following Gabriel’s final correction, insurance is both a CIF valuation basis and an actual cost charged once in the total. Screen lines separate maritime freight, 2% insurance and US$140 unloading/HIT; the PDF groups these three transport items. Actual purchase remains the purchase line even when table FOB differs. No old fuel surcharge, hybrid discount or previous fees are retained.

USA simulates 0% tariff; other countries simulate 20%. DGA requires documentary origin compliance, so the UI/PDF do not represent VIN/manufacturing country alone as a guarantee of DR-CAFTA entitlement. The minimum 2021 is the requested calculator eligibility policy; legal admissibility must be checked for the actual import date and title.

## Vehicle data and optional specification catalogue

`src/lib/import-vehicle-catalog.ts` contains all 10 requested makes and 39 pool models, plus `DGA_SPECIFICATIONS`. The optional reference catalogue starts empty; the calculator does not depend on ADECI or any external document. Table FOB is editable, defaulting to purchase. Do not invent trim combinations or FOB values. Each optional documented row must include `id`, `make`, `model`, `country`, `year`, `series`, `fuel`, `cylinders`, `cc`, `passengers`, `doors`, `drive`, `fobUsd`, `source`, `effectiveDate`, optionally `co2Percent`. Matching make/model/country/year rows populate the specification selector and table FOB. Example schema (illustrative keys only, no fabricated official prices):

```ts
type DgaSpecification = VehicleSpecification & {
  id: string; make: string; model: string; country: string; year: number;
  fobUsd: number; co2Percent?: number; source: string; effectiveDate: string;
};
```

Specifications can always be entered manually or filled by a valid 17-character NHTSA VIN response. Missing vPIC fields stay empty. Errors/timeouts preserve the manual route. Manual make/model/country/year changes clear dependent specifications/FOB. VIN change cancels the prior request and clears prior identification. Year suggestions are 2021–2025; later valid model years can be entered.

CO2 suggestions are transparent **budget heuristics**, not a DGII emissions determination: electricity-only0%, up to2000CC1%, up to3500CC2%, above3500CC3%, missing engine1%. Editable in config and by the visitor. The actual rate requires certified emissions; displacement cannot establish it.

## Comparison and PDF

Up to3 independently editable candidates. Invalid candidates are excluded. Best option = cheapest valid candidate in the US$25,000–45,000 sweet spot, else cheapest valid candidate. Ties retain input order; this is a cost comparison only.

PDF code is dynamically imported on download. Browser fetches the existing website logo plus locally bundled SIL-OFL Valcron Quote Sans regular/bold, a Latin subset of Liberation Sans (license in `public/fonts/quote/`), embeds them, generates the grouped client quote, then downloads a PDF Blob. No Auto Hall/dealer/repair/custom fee components are disclosed separately. Long descriptions paginate. Quote issue date is displayed in Santo Domingo time, validity7days, with the required DGA note and WhatsApp. No PDF library or fonts load on the initial calculator visit.

## Verification

Financial tests cover independent hand-calculated totals, invoice vs table valuation, decimal auction boundaries, IAAI cap, repair and high-price charges, FX/marbete, CAFTA savings, ranking and invalid years/numbers. PDF generated with the same renderer was parsed and rendered locally to check text, totals, logo and layout. Production build and browser checks are recorded in the PR.

Reference method: https://campobroker.com/calculadora-impuestos-vehiculos/ (invoice/table and specification structure only; no Campo commercial charges copied).

Sources: NHTSA API documentation https://vpic.nhtsa.dot.gov/api/ ; DGA origin requirements https://www.aduanas.gob.do/media/05xjgcn2/instructivo-y-formulario-certificado-de-origen-cafta-dr-10-3-22-v4.pdf ; DGA vehicle restrictions https://www.aduanas.gob.do/preguntas-frecuentes/ .
