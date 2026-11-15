# CSV-backed Valcron import calculator

## Data and loading

`tabla-impuestos-placa.csv` (source commit7dd5df6) is the supplied15-field, semicolon-separated tax/first-plate table. `ImpuestoPlaca` is a USD payable amount, **not FOB**. Rebuild after CSV changes with `python scripts/build-import-tax-table.py` and commit the generated manifest/data asset together. The generator validates the schema, preserves all fields and removes only rows identical in all15 fields.

Current counts:9067 source rows,9053 unique rows,14 exact duplicates,13 makes,2021–2025. The generated dictionary-encoded JSON is400503bytes (~80485gzip bytes). It is a separate content-addressed file in `public/data`, not a JavaScript import or part of the principal bundle. Only the calculator component mounts its fetch (on /importacion and the existing /calculadoras/importacion calculator route); no other page fetches it. All3 candidates share one cached request. The asset has a long-lived immutable cache header, and the proxy excludes only the versioned public asset pattern. Fetch failure is visible, retryable, and leaves an explicit manual fallback available.

## Selection

The primary flow has exactly3 vehicle selects: Marca→Modelo→Año. It then lists **all** matching unique rows as touchable radio cards in a bounded scrolling list. Each card includes the full series/country/fuel/cylinders/CC/passengers/doors/drive and any cabins/load-weight/axles, plus IMPUESTO & PLACA inUSD. No separate country/specification menus exist. Selected details and the tax amount appear inUSD andDOP. Changing upstream identity clears the selected row; changing monetary inputs preserves it. NHTSA remains a direct browser request on explicit VIN lookup, normalizes make/model/country aliases (e.g.CR-V→CRV), but never guesses a tax-row specification. The user must confirm the exact card.

An explicit “Mi especificación no aparece” checkbox enables the manual formula fallback; missing/unselected table rows never silently use a formula. VIN values outside the table can still be entered through this fallback, with country/specification text fields and the existing invoice/reference-FOB/CO2 selectors. Models before2021 remain blocked.

## Calculation and contract charges

The fee schedules, financial defaults and contract rates remain in `src/lib/import-cost-config.ts`. Source CSV taxes are used exactly once: the selected amount **replaces** the formula DGA+DGII tax/plate group. No additional formula tariff/ITBIS/plate/CO2/marbete is appended to that selected-table amount. The manual fallback preserves the formula calculation and editable referenceFOB.

Maritime insurance is now always2% of **purchase**, including when manual referenceFOB differs. Freight is editable, with no fuel surcharge. Contenedor adds unloading/HIT US$140; RoRo omits it. Auto Hall purchase management remains unchanged ($325+$75;0.5% of purchase only above$60000;+$375 when repair>0).

Valcron charges are distinct from Auto Hall:
- One “Gestión de compra USA (Valcron)” charge based on the tax-inclusive subtotal **before honorarios**: ≤25000=$1000;≤40000=$1500;≤70000=$2000;higher=$3000. No duplicate Dealer Fee line.
- Repair Fee=$400 only when repair>0 **and** `rebuiltManagement` is checked; otherwise0.
- Custom Fee=$100 always.
- Dealer service RD=RD$30000 always, converted with the visitor's FX (default60.81).

Known cost lines are shown before tax selection. While tax is unresolved, the USA management tier is clearly provisional and no complete “TOTAL PUESTO EN RD” or PDF is enabled. Once the exact row or complete manual fallback is available, the tier and finalUSD/DOP total resolve. Both displayed breakdown and total use the same pure calculation. Comparison excludes incomplete scenarios and retains the prior sweet-spot priority.

Honda reference: HONDA/CRV/2023/ESTADOS UNIDOS/LX/1500CC/AWD=$6708. At purchase11500, Copart fee1409, Auto Hall400, inland250, freight1150, insurance230, Contenedor140, no repair: subtotal21787; Valcron USA1000+Custom100+RDservice30000/60.81 → totalUS$23380.3399111988. DODGE/DURANGO/2025/SRT HELLCAT has tax$38851.

## PDF and verification

PDF remains fully client-side and loaded on demand: site logo, embedded font, date/7day validity, client name, full selected specification and grouped client lines. Table quotes use “Impuestos y primera placa (tabla oficial)” and explain the DGA table provenance. Formula quotes are explicitly manual estimates. Quote line sums equal the screen total. Internal Auto Hall components are not itemized separately in the client PDF.

Tests compare every generated row against the original15 CSV fields; verify unique-row counts, both supplied tax examples, no duplicate formula taxes, invalidated/stale selections, insurance from purchase, each repair/check combination, fee boundaries, exchange rates, and grouping/total consistency. Routing tests protect unrelated admin/private paths. Browser tests verify the primary three-select/card flow and downloads before final delivery. No database, inventory, advertising tag, robot or sitemap changes.
