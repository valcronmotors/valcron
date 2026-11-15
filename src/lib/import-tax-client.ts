import { IMPORT_TAX_TABLE_URL } from "./import-tax-manifest";
import { decodeImportTaxTable, type ImportTaxRow } from "./import-tax-table";
let pending: Promise<ImportTaxRow[]> | undefined;
/** Called from the calculator effect only. Three candidates share one request. */
export function loadImportTaxTable() {
  if (!pending)
    pending = fetch(IMPORT_TAX_TABLE_URL)
      .then(async (r) => {
        if (!r.ok || !r.headers.get("content-type")?.includes("json"))
          throw new Error(
            "No se pudo cargar la tabla. Intenta nuevamente o utiliza el modo manual.",
          );
        return decodeImportTaxTable(await r.json());
      })
      .catch((e) => {
        pending = undefined;
        throw e;
      });
  return pending;
}
