import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { ingestCopartCsv } from "../src/lib/auction-providers/copart/ingest";
import { createSupabaseCopartWriter } from "../src/lib/auction-providers/copart/supabase-writer";

function loadLocalEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = resolve(process.cwd(), name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index <= 0) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

async function main() {
  loadLocalEnv();
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const write = args.includes("--write");
  const filePath = args.find((arg) => !arg.startsWith("--"));

  if (!filePath) {
    console.error("Uso: npm run copart:import -- <ruta-salesdata.csv> [--write]");
    console.error("Sin --write corre en dry-run y no toca Supabase.");
    process.exit(1);
  }

  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    console.error(`No existe el archivo: ${resolved}`);
    process.exit(1);
  }

  console.log(`Importando CSV oficial de Copart: ${resolved}`);
  if (!write) {
    console.log("Modo dry-run: no se escribe en Supabase. Pasa --write para persistir un snapshot local.");
  }

  const result = await ingestCopartCsv({
    filePath: resolved,
    writer: write ? createSupabaseCopartWriter() : undefined,
    onProgress({ rowsRead, valid, rejected }) {
      console.log(`Progreso: leídas=${rowsRead} válidas=${valid} rechazadas=${rejected}`);
    },
  });

  const stats = result.stats;
  console.log(
    JSON.stringify(
      {
        ok: result.ok,
        error: "error" in result ? result.error : null,
        rowsRead: stats.rowsRead,
        valid: stats.valid,
        rejected: stats.rejected,
        duplicates: stats.duplicates,
        inserted: stats.inserted,
        durationMs: stats.durationMs,
        feedTimestamp: stats.feedTimestamp,
      },
      null,
      2,
    ),
  );

  if (!result.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
