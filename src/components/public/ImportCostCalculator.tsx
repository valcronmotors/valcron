"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  AUCTION_FEE_NOTICE,
  IMPORT_ESTIMATE_NOTICE,
  OFFICIAL_TAX_NOTICE,
  importCostConfig as config,
} from "@/lib/import-cost-config";
import {
  bestCandidate,
  auctionFeesForPrice,
  previewImportCosts,
  estimateImport,
  newImportCandidate,
  suggestedCo2,
  vehicleDescription,
  clientQuoteLines,
  type ImportCandidate,
} from "@/lib/import-estimate";
import { IMPORT_VEHICLE_POOL } from "@/lib/import-vehicle-catalog";
import { loadImportTaxTable } from "@/lib/import-tax-client";
import {
  normalizeVehicleKey,
  preselectVin,
  specificationLabel,
  type ImportTaxRow,
} from "@/lib/import-tax-table";
import { decodeImportVin } from "@/lib/import-vin";
import { formatDecimal } from "@/lib/money";
import { whatsappHref } from "@/lib/site";

const inputClass =
  "mt-1 min-h-12 w-full min-w-0 rounded-xl border border-[#d8dbe0] bg-white px-3 py-2 text-base text-[#08090b] focus:border-[#ec752f] focus:outline-none focus:ring-2 focus:ring-[#ec752f]/20 disabled:bg-[#f3f4f5]";
const usd = (n: number) => `US$${formatDecimal(n, 2)}`;
const dop = (n: number) => `RD$${formatDecimal(n, 2)}`;
const emptySpec = {
  series: "",
  fuel: "",
  cylinders: "",
  cc: "",
  passengers: "",
  doors: "",
  drive: "",
  cabins: "",
  loadWeight: "",
  axles: "",
};
const sorted = (values: string[]) => {
  const unique = new Map<string, string>();
  for (const value of values)
    if (value && !unique.has(normalizeVehicleKey(value)))
      unique.set(normalizeVehicleKey(value), value);
  return [...unique.values()].sort((a, b) => a.localeCompare(b, "es"));
};
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function CandidateCard({
  v,
  index,
  best,
  client,
  rows,
  onChange,
  onRemove,
}: {
  v: ImportCandidate;
  index: number;
  best: boolean;
  client: string;
  rows: ImportTaxRow[];
  onChange: (patch: Partial<ImportCandidate>) => void;
  onRemove?: () => void;
}) {
  const [vinMessage, setVinMessage] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const result = estimateImport(v),
    preview = previewImportCosts(v),
    manual = v.taxMode === "manual";
  const previewFees =
    Number.isFinite(v.purchaseUsd) && v.purchaseUsd > 0 && v.purchaseUsd <= 1e7
      ? auctionFeesForPrice(v.purchaseUsd, v.provider)
      : null;
  const makeRows = useMemo(
    () => rows.filter((r) => r.make === v.make),
    [rows, v.make],
  );
  const modelRows = useMemo(
    () => makeRows.filter((r) => r.model === v.model),
    [makeRows, v.model],
  );
  const options = useMemo(
    () => modelRows.filter((r) => r.year === v.year),
    [modelRows, v.year],
  );
  const poolKey = Object.keys(IMPORT_VEHICLE_POOL).find(
    (m) => normalizeVehicleKey(m) === normalizeVehicleKey(v.make),
  );
  const makes = sorted([
    ...rows.map((r) => r.make),
    ...(manual ? Object.keys(IMPORT_VEHICLE_POOL) : []),
    v.make,
  ]);
  const models = sorted([
    ...makeRows.map((r) => r.model),
    ...(manual && poolKey ? IMPORT_VEHICLE_POOL[poolKey] : []),
    v.model,
  ]);
  const years = [
    ...new Set([
      ...modelRows.map((r) => r.year),
      ...(manual
        ? Array.from(
            { length: new Date().getUTCFullYear() + 3 - config.minimumYear },
            (_, i) => config.minimumYear + i,
          )
        : []),
      ...(v.year ? [v.year] : []),
    ]),
  ].sort((a, b) => b - a);
  function changeIdentity(patch: Partial<ImportCandidate>) {
    request.current?.abort();
    setDecoding(false);
    setVinMessage("");
    onChange({
      ...emptySpec,
      taxRow: null,
      tableFobUsd: null,
      vin: "",
      ...patch,
    });
  }
  const numeric = (
    key: "purchaseUsd" | "repairUsd" | "inlandUsd" | "freightUsd" | "fx",
    label: string,
    min = 0,
  ) => (
    <Field label={label}>
      <input
        className={inputClass}
        type="number"
        inputMode="decimal"
        min={min}
        max={10000000}
        step="0.01"
        value={Number.isNaN(v[key]) ? "" : v[key]}
        onChange={(e) =>
          onChange({
            [key]: e.target.value === "" ? NaN : Number(e.target.value),
          })
        }
      />
    </Field>
  );
  async function decode() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setDecoding(true);
    setVinMessage("");
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const patch = await decodeImportVin(v.vin, controller.signal);
      if (!controller.signal.aborted) {
        onChange({
          ...emptySpec,
          ...patch,
          ...preselectVin(rows, patch),
          taxRow: null,
        });
        setVinMessage(
          "Datos recibidos de NHTSA. Confirma una opción exacta de la tabla para fijar los impuestos; no se selecciona una versión automáticamente.",
        );
      }
    } catch (e) {
      if (request.current === controller)
        setVinMessage(
          controller.signal.aborted
            ? "Consulta cancelada o sin respuesta. Puedes seleccionar el vehículo manualmente."
            : e instanceof Error
              ? e.message
              : "No se pudo consultar NHTSA.",
        );
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) setDecoding(false);
    }
  }
  const message = [
    "Hola Valcron, quiero cotizar esta importación.",
    vehicleDescription(v),
    result
      ? `TOTAL ESTIMADO: ${usd(result.totalUsd)} / ${dop(result.totalDop)}`
      : "Quiero completar mi presupuesto.",
    ...clientQuoteLines(v).map((l) => `${l.label}: ${usd(l.usd)}`),
    `Cambio: RD$${v.fx}/US$1`,
    result?.officialTax ? OFFICIAL_TAX_NOTICE : IMPORT_ESTIMATE_NOTICE,
  ].join("\n");
  return (
    <article
      aria-label={`Vehículo ${index + 1}`}
      className={`min-w-0 rounded-2xl border bg-white p-4 text-[#08090b] sm:p-5 ${best ? "border-[#ec752f]" : "border-[#e4e6ea]"}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-lg font-bold">Vehículo {index + 1}</h4>
        {best ? (
          <span className="rounded-full bg-[#fff0e5] px-3 py-1 text-xs font-bold text-[#a54d1c]">
            Mejor opción
          </span>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            className="min-h-11 px-2 text-sm underline"
            onClick={onRemove}
          >
            Quitar vehículo {index + 1}
          </button>
        ) : null}
      </div>
      <section aria-label="Subasta" className="grid gap-3">
        <h5 className="font-bold">1. Subasta</h5>
        {numeric("purchaseUsd", "Precio de compra estimado (US$)", 0.01)}
        <Field label="Subasta">
          <select
            className={inputClass}
            value={v.provider}
            onChange={(e) =>
              onChange({
                provider: e.target.value as ImportCandidate["provider"],
              })
            }
          >
            <option value="copart">Copart</option>
            <option value="iaai">IAAI</option>
          </select>
        </Field>
        {previewFees ? (
          <div
            aria-live="polite"
            className="rounded-xl bg-[#fff7f0] p-3 text-sm"
          >
            <p className="font-bold">
              Fee de subasta estimado: {usd(previewFees.total)}
            </p>
            <p className="mt-1 text-xs text-[#676a70]">
              Buyer fee {usd(previewFees.buyer)} · Internet{" "}
              {usd(previewFees.internet)} · fijos {usd(previewFees.fixed)}.
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#676a70]">
            Introduce el precio para ver el fee automático.
          </p>
        )}
      </section>
      <section
        aria-label="Gastos variables"
        className="mt-5 grid gap-3 border-t border-[#e4e6ea] pt-4"
      >
        <h5 className="font-bold">2. Gastos variables</h5>
        {numeric("repairUsd", "Reparación estimada (US$)")}
        {numeric("inlandUsd", "Grúa USA (US$)")}
        {numeric("freightUsd", "Flete marítimo (US$)")}
        <Field label="Método de envío">
          <select
            className={inputClass}
            value={v.shippingMethod}
            onChange={(e) =>
              onChange({
                shippingMethod: e.target
                  .value as ImportCandidate["shippingMethod"],
              })
            }
          >
            <option value="container">Contenedor</option>
            <option value="roro">RoRo</option>
          </select>
        </Field>
        <p className="text-xs text-[#676a70]">
          {v.shippingMethod === "container"
            ? "Descarga + HIT: US$140.00 · solo en contenedor."
            : "RoRo: sin cargo de Descarga + HIT."}
        </p>
        {numeric("fx", "Tasa RD$/US$", 0.01)}
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e4e6ea] p-3 text-sm">
          <input
            type="checkbox"
            checked={v.rebuiltManagement}
            onChange={(e) => onChange({ rebuiltManagement: e.target.checked })}
          />
          Gestión de título salvage a rebuilt
        </label>
        <p className="text-xs text-[#676a70]">
          Repair Fee US$400 solo con reparación mayor que cero y gestión de
          título marcada.
        </p>
      </section>
      <section
        aria-label="Cobros de Valcron"
        className="mt-5 border-t border-[#e4e6ea] pt-4"
      >
        <h5 className="font-bold">3. Cobros automáticos</h5>
        <dl className="mt-3 space-y-2 text-sm">
          {preview?.lines
            .filter((l) =>
              [
                "usa-management",
                "repair-fee",
                "custom-fee",
                "rd-service",
              ].includes(l.key),
            )
            .map((l) => (
              <div key={l.key} className="flex flex-wrap justify-between gap-2">
                <dt>{l.label}</dt>
                <dd className="font-semibold">
                  {l.key === "rd-service"
                    ? dop(config.dealerServiceDop)
                    : usd(l.usd)}
                </dd>
              </div>
            )) ?? (
            <>
              <div>
                Gestión de compra USA: tramos US$1,000 / 1,500 / 2,000 / 3,000.
              </div>
              <div>
                Repair Fee:{" "}
                {usd(
                  v.repairUsd > 0 && v.rebuiltManagement
                    ? config.repairFeeUsd
                    : 0,
                )}
              </div>
              <div>Custom Fee: {usd(config.customFeeUsd)}</div>
              <div>
                Servicio del dealer en RD: {dop(config.dealerServiceDop)}
              </div>
            </>
          )}
        </dl>
        {preview && !result ? (
          <p className="mt-2 text-xs text-[#676a70]">
            Tramo provisional con los costos disponibles; se actualiza al
            seleccionar los impuestos.
          </p>
        ) : null}
      </section>
      <section
        aria-label="Selección del vehículo"
        className="mt-5 grid gap-3 border-t border-[#e4e6ea] pt-4"
      >
        <h5 className="font-bold">4. Elige tu vehículo</h5>
        <Field label="Buscar por VIN">
          <input
            className={inputClass}
            value={v.vin}
            maxLength={17}
            placeholder="VIN de 17 caracteres"
            autoCapitalize="characters"
            onChange={(e) => {
              request.current?.abort();
              setDecoding(false);
              setVinMessage("");
              onChange({
                ...emptySpec,
                vin: e.target.value.toUpperCase().replace(/\s/g, ""),
                make: "",
                model: "",
                country: "",
                taxRow: null,
                tableFobUsd: null,
              });
            }}
          />
        </Field>
        <button
          type="button"
          onClick={decode}
          disabled={decoding || !v.vin}
          className="min-h-11 rounded-xl border border-[#d8dbe0] px-3 text-sm font-semibold disabled:opacity-50"
        >
          {decoding ? "Consultando NHTSA…" : "Identificar vehículo"}
        </button>
        {vinMessage ? (
          <p role="status" className="text-xs leading-relaxed text-[#676a70]">
            {vinMessage}
          </p>
        ) : null}
        <Field label="Marca">
          <select
            className={inputClass}
            value={v.make}
            disabled={!rows.length && !manual}
            onChange={(e) =>
              changeIdentity({
                make: e.target.value,
                model: "",
                year: 0,
                country: "",
              })
            }
          >
            <option value="">Selecciona marca</option>
            {makes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Modelo">
          <select
            className={inputClass}
            value={v.model}
            disabled={!v.make}
            onChange={(e) =>
              changeIdentity({ model: e.target.value, year: 0, country: "" })
            }
          >
            <option value="">Selecciona modelo</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Año modelo">
          <select
            className={inputClass}
            value={v.year || ""}
            disabled={!v.model}
            onChange={(e) =>
              changeIdentity({ year: Number(e.target.value), country: "" })
            }
          >
            <option value="">Selecciona año</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
                {y < 2021 ? " · no admitido" : ""}
              </option>
            ))}
          </select>
        </Field>
        {!manual ? (
          <>
            <p className="text-sm font-semibold">
              {options.length} opciones disponibles · toca la especificación
              exacta
            </p>
            <div
              role="radiogroup"
              aria-label={`Opciones de vehículo ${index + 1}`}
              className="grid max-h-[32rem] gap-2 overflow-y-auto overscroll-contain rounded-xl focus-within:ring-2 focus-within:ring-[#ec752f]/20"
            >
              {options.map((r) => (
                <label
                  key={r.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${v.taxRow?.id === r.id ? "border-[#ec752f] bg-[#fff7f0]" : "border-[#e4e6ea]"}`}
                >
                  <input
                    type="radio"
                    name={`tax-option-${v.id}`}
                    value={r.id}
                    checked={v.taxRow?.id === r.id}
                    className="mt-1 shrink-0"
                    onChange={() =>
                      onChange({
                        ...r,
                        id: v.id,
                        taxRow: r,
                        taxMode: "official",
                      })
                    }
                  />
                  <span className="min-w-0">
                    <span className="block text-sm leading-relaxed">
                      {specificationLabel(r)}
                    </span>
                    <span className="mt-2 block text-sm font-bold text-[#a54d1c]">
                      IMPUESTO &amp; PLACA · {usd(r.taxUsd)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {v.taxRow ? (
              <p className="rounded-xl bg-[#fff7f0] p-3 text-sm leading-relaxed">
                Seleccionado: {specificationLabel(v.taxRow)}. Impuestos y
                primera placa (tabla oficial):{" "}
                <strong>
                  {usd(v.taxRow.taxUsd)} ·{" "}
                  {Number.isFinite(v.fx) && v.fx > 0
                    ? dop(v.taxRow.taxUsd * v.fx)
                    : "indica una tasa válida"}
                </strong>
                .
              </p>
            ) : (
              <p className="text-xs text-[#676a70]">
                {options.length
                  ? "Selecciona una opción de la lista para fijar el impuesto."
                  : "Selecciona marca, modelo y año. Si tu especificación no aparece, usa el respaldo manual."}
              </p>
            )}
          </>
        ) : null}
        <label className="flex min-h-12 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={manual}
            onChange={(e) =>
              onChange({
                taxMode: e.target.checked ? "manual" : "official",
                taxRow: null,
              })
            }
          />
          Mi especificación no aparece · usar cálculo manual por fórmula
        </label>
        {manual ? (
          <div className="grid gap-3 rounded-xl border border-[#e4e6ea] p-3">
            <p className="text-xs font-semibold text-[#a54d1c]">
              Respaldo manual · no usa el importe de tabla
            </p>
            <Field label="País de origen (manual)">
              <input
                className={inputClass}
                value={v.country}
                maxLength={80}
                placeholder="USA, México, Canadá, Japón…"
                onChange={(e) => onChange({ country: e.target.value })}
              />
            </Field>
            {(
              [
                ["series", "Serie / trim"],
                ["fuel", "Combustible"],
                ["cylinders", "Cilindros"],
                ["cc", "Cilindrada (CC)"],
                ["passengers", "Pasajeros"],
                ["doors", "Puertas"],
                ["drive", "Tracción"],
                ["cabins", "Cabinas"],
                ["loadWeight", "Peso de carga"],
                ["axles", "Ejes"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={inputClass}
                  maxLength={100}
                  value={v[key]}
                  onChange={(e) =>
                    onChange({
                      [key]: e.target.value,
                      ...(key === "cc"
                        ? { co2Percent: suggestedCo2(e.target.value, v.fuel) }
                        : key === "fuel"
                          ? { co2Percent: suggestedCo2(v.cc, e.target.value) }
                          : {}),
                    })
                  }
                />
              </Field>
            ))}
            <Field label="Método de valoración DGA">
              <select
                className={inputClass}
                value={v.valuation}
                onChange={(e) =>
                  onChange({
                    valuation: e.target.value as ImportCandidate["valuation"],
                  })
                }
              >
                <option value="invoice">Factura · FOB = compra</option>
                <option value="table">FOB de referencia editable</option>
              </select>
            </Field>
            {v.valuation === "table" ? (
              <Field label="FOB de referencia (US$)">
                <input
                  className={inputClass}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={v.tableFobUsd ?? v.purchaseUsd}
                  onChange={(e) =>
                    onChange({
                      tableFobUsd: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
              </Field>
            ) : null}
            <Field label="CO₂ estimado (manual)">
              <select
                className={inputClass}
                value={v.co2Percent}
                onChange={(e) =>
                  onChange({ co2Percent: Number(e.target.value) })
                }
              >
                {[0, 1, 2, 3].map((p) => (
                  <option key={p} value={p}>
                    {p}% del CIF
                  </option>
                ))}
              </select>
            </Field>
            <p className="text-xs text-[#676a70]">
              Respaldo estimado por fórmula. Origen USA simula DR-CAFTA sujeto a
              acreditación documental; el VIN no basta. CO₂ sujeto a emisiones
              certificadas.
            </p>
          </div>
        ) : null}
        <Field label="Tipo de título">
          <select
            className={inputClass}
            value={v.title}
            onChange={(e) =>
              onChange({ title: e.target.value as ImportCandidate["title"] })
            }
          >
            <option value="clean">Clean</option>
            <option value="rebuilt">Rebuilt / Salvage</option>
          </select>
        </Field>
        {v.year > 0 && v.year < 2021 ? (
          <p role="alert" className="text-sm font-bold text-red-800">
            Cálculo bloqueado: solo vehículos 2021 en adelante.
          </p>
        ) : null}
      </section>
      {preview ? (
        <section
          aria-label={`Resultado vehículo ${index + 1}`}
          className="mt-5 rounded-xl bg-[#fff7f0] p-4"
        >
          <h5 className="font-bold">5. Resultado detallado</h5>
          {result ? (
            <>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#a54d1c]">
                TOTAL PUESTO EN RD · ESTIMADO
              </p>
              <p className="mt-1 text-2xl font-bold">{usd(result.totalUsd)}</p>
              <p className="font-semibold">{dop(result.totalDop)}</p>
              {result.sweetSpot ? (
                <p className="mt-2 text-xs font-semibold text-[#a54d1c]">
                  Punto dulce · US$25,000–45,000
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-3 text-sm text-[#676a70]">
              Costos disponibles. Selecciona una opción exacta o completa el
              respaldo manual para incluir impuestos y cerrar el total.
            </p>
          )}
          <dl className="mt-4 divide-y divide-[#edddd1]">
            {preview.lines.map((l) => (
              <div
                key={l.key}
                className="flex flex-wrap justify-between gap-2 py-2 text-sm"
              >
                <dt>{l.label}</dt>
                <dd className="font-semibold">
                  {usd(l.usd)}
                  <span className="mt-0.5 block text-right text-xs font-normal text-[#676a70]">
                    {dop(l.usd * v.fx)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          {!result ? (
            <p className="mt-3 text-xs text-[#676a70]">
              El tramo de gestión USA es provisional mientras falte el impuesto.
            </p>
          ) : result.officialTax ? (
            <p className="mt-3 text-xs leading-relaxed text-[#676a70]">
              {OFFICIAL_TAX_NOTICE} No se suma nuevamente la fórmula DGA/DGII.
            </p>
          ) : (
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer font-semibold">
                Bases del respaldo por fórmula
              </summary>
              <p className="mt-2">
                FOB {usd(result.fob)} · CIF {usd(result.cif)} · arancel{" "}
                {usd(result.tariff)} · ITBIS {usd(result.itbis)} · primera placa{" "}
                {usd(result.plate)} · CO₂ {usd(result.co2)} · marbete{" "}
                {dop(result.marbeteDop)}.
              </p>
            </details>
          )}
        </section>
      ) : null}
      {!client.trim() ? (
        <p className="mt-4 text-sm text-[#676a70]">
          Escribe el nombre del cliente en los datos de la cotización para
          habilitar la descarga del PDF.
        </p>
      ) : null}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={!result || !client.trim() || pdfBusy}
          className="min-h-12 rounded-xl bg-[#08090b] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
          onClick={async () => {
            setPdfBusy(true);
            setPdfError("");
            try {
              const { downloadImportQuote } = await import(
                "@/lib/import-quote-pdf"
              );
              await downloadImportQuote(v, client);
            } catch (e) {
              setPdfError(
                e instanceof Error ? e.message : "No se pudo generar el PDF.",
              );
            } finally {
              setPdfBusy(false);
            }
          }}
        >
          {pdfBusy ? "Preparando PDF…" : "Descargar cotización PDF"}
        </button>
        <a
          href={whatsappHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="home-orange-button flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold"
        >
          Cotizar por WhatsApp
        </a>
      </div>
      {pdfError ? (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {pdfError}
        </p>
      ) : null}
    </article>
  );
}
function ImportCalculatorBody() {
  const params = useSearchParams();
  const nextId = useRef(2);
  const [rows, setRows] = useState<ImportTaxRow[]>([]);
  const [tableError, setTableError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [candidates, setCandidates] = useState<ImportCandidate[]>(() => {
    const v = newImportCandidate("1");
    const year = Number(params.get("ano"));
    if (year) v.year = year;
    if (params.get("provider") === "iaai") v.provider = "iaai";
    const desc = params.get("vehiculo");
    if (desc) {
      const make = Object.keys(IMPORT_VEHICLE_POOL).find((m) =>
        desc.toLowerCase().startsWith(m.toLowerCase()),
      );
      if (make) {
        v.make = make;
        v.model =
          IMPORT_VEHICLE_POOL[make].find((m) =>
            desc.toLowerCase().includes(m.toLowerCase()),
          ) ?? "";
      }
    }
    return [v];
  });
  useEffect(() => {
    let alive = true;
    loadImportTaxTable()
      .then((data) => {
        if (alive) {
          setRows(data);
          setCandidates((current) =>
            current.map((v) =>
              v.taxRow ? v : { ...v, ...preselectVin(data, v) },
            ),
          );
          setTableError("");
        }
      })
      .catch((e) => {
        if (alive)
          setTableError(
            e instanceof Error ? e.message : "No se pudo cargar la tabla.",
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retry]);
  const [client, setClient] = useState("");
  const best = bestCandidate(candidates);
  return (
    <div className="min-w-0 text-[#08090b]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a54d1c]">
            Calculadora única Valcron
          </p>
          <h3 className="mt-2 text-2xl font-bold">Calcula, compara y elige.</h3>
          <p className="mt-2 text-sm text-[#676a70]">
            Marca, modelo y año. Elige una opción con su impuesto y primera
            placa.
          </p>
        </div>
        <button
          type="button"
          disabled={candidates.length >= 3}
          onClick={() => {
            const id = String(nextId.current++);
            setCandidates((current) =>
              current.length >= 3
                ? current
                : [...current, newImportCandidate(id)],
            );
          }}
          className="home-orange-button min-h-12 rounded-xl px-5 text-sm font-semibold disabled:opacity-40"
        >
          Agregar vehículo ({candidates.length}/3)
        </button>
      </div>
      <div className="mb-5 max-w-lg">
        <Field label="Nombre del cliente (requerido para el PDF)">
          <input
            className={inputClass}
            maxLength={120}
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Nombre y apellido"
            autoComplete="name"
            required
          />
        </Field>
      </div>
      {loading ? (
        <p role="status" className="mb-4 text-sm text-[#676a70]">
          Cargando opciones de la tabla…
        </p>
      ) : null}
      {tableError ? (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
        >
          {tableError}
          <button
            type="button"
            className="ml-3 min-h-11 underline"
            onClick={() => {
              setLoading(true);
              setRetry((n) => n + 1);
            }}
          >
            Reintentar tabla
          </button>
        </div>
      ) : null}
      <div
        className={`grid min-w-0 gap-4 ${candidates.length === 1 ? "max-w-3xl" : candidates.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}
      >
        {candidates.map((v, index) => (
          <CandidateCard
            key={v.id}
            v={v}
            index={index}
            rows={rows}
            best={best === v.id}
            client={client}
            onChange={(patch) =>
              setCandidates((current) =>
                current.map((item) =>
                  item.id === v.id ? { ...item, ...patch } : item,
                ),
              )
            }
            onRemove={
              candidates.length > 1
                ? () =>
                    setCandidates((current) =>
                      current.filter((item) => item.id !== v.id),
                    )
                : undefined
            }
          />
        ))}
      </div>
      <div className="mt-5 space-y-2 text-xs leading-relaxed text-[#676a70]">
        <p className="font-semibold text-[#08090b]">{IMPORT_ESTIMATE_NOTICE}</p>
        <p>{AUCTION_FEE_NOTICE}</p>
        <p>
          Los importes de la tabla corresponden a cada especificación exacta; no
          son valores FOB. El respaldo por fórmula se usa solo cuando eliges el
          modo manual. «Mejor opción» prioriza el menor total dentro de
          US$25,000–45,000; fuera de ese rango, el menor total válido. No evalúa
          condición mecánica.
        </p>
      </div>
    </div>
  );
}
export function ImportCostCalculator() {
  return (
    <Suspense
      fallback={
        <div className="min-h-80 rounded-2xl border border-[#e4e6ea] bg-white p-6">
          Cargando calculadora…
        </div>
      }
    >
      <ImportCalculatorBody />
    </Suspense>
  );
}
