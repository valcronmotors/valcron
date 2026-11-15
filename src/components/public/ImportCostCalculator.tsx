"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  AUCTION_FEE_NOTICE,
  IMPORT_ESTIMATE_NOTICE,
  importCostConfig as config,
} from "@/lib/import-cost-config";
import {
  bestCandidate,
  estimateImport,
  newImportCandidate,
  suggestedCo2,
  vehicleDescription,
  type ImportCandidate,
} from "@/lib/import-estimate";
import {
  IMPORT_COUNTRIES,
  IMPORT_VEHICLE_POOL,
  specificationsFor,
} from "@/lib/import-vehicle-catalog";
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
  onChange,
  onRemove,
}: {
  v: ImportCandidate;
  index: number;
  best: boolean;
  client: string;
  onChange: (patch: Partial<ImportCandidate>) => void;
  onRemove?: () => void;
}) {
  const [vinMessage, setVinMessage] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const result = estimateImport(v);
  const specs = specificationsFor(v.make, v.model, v.country, v.year);
  const numeric = (
    key: keyof ImportCandidate,
    label: string,
    min = 0,
    step = "0.01",
  ) => (
    <Field label={label}>
      <input
        className={inputClass}
        type="number"
        inputMode={step === "1" ? "numeric" : "decimal"}
        min={min}
        step={step}
        max={key === "year" ? new Date().getUTCFullYear() + 2 : 10000000}
        value={Number.isNaN(v[key]) ? "" : String(v[key])}
        onChange={(e) =>
          onChange({
            [key]: e.target.value === "" ? NaN : Number(e.target.value),
          })
        }
      />
    </Field>
  );
  const makes = [
    ...new Set([
      ...Object.keys(IMPORT_VEHICLE_POOL),
      ...(v.make ? [v.make] : []),
    ]),
  ];
  const models = [
    ...new Set([
      ...(IMPORT_VEHICLE_POOL[v.make] ?? []),
      ...(v.model ? [v.model] : []),
    ]),
  ];
  const countries = [
    ...new Set([...IMPORT_COUNTRIES, ...(v.country ? [v.country] : [])]),
  ];
  const message = [
    "Hola Valcron, quiero cotizar esta importación.",
    vehicleDescription(v),
    result
      ? `TOTAL ESTIMADO: ${usd(result.totalUsd)} / ${dop(result.totalDop)}`
      : "Quiero completar mi presupuesto.",
    ...(result?.lines.map((l) => `${l.label}: ${usd(l.usd)}`) ?? []),
    `Cambio: RD$${v.fx}/US$1`,
    IMPORT_ESTIMATE_NOTICE,
  ].join("\n");
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
        onChange(patch);
        setVinMessage(
          "Datos recibidos de NHTSA. Revisa los campos; los datos no disponibles quedan para completar.",
        );
      }
    } catch (error) {
      if (request.current === controller)
        setVinMessage(
          controller.signal.aborted
            ? "Consulta cancelada o sin respuesta. Puedes completar los datos manualmente."
            : error instanceof Error
              ? error.message
              : "No se pudo consultar NHTSA.",
        );
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) setDecoding(false);
    }
  }
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
            onClick={onRemove}
            className="min-h-11 px-2 text-sm underline"
          >
            Quitar vehículo {index + 1}
          </button>
        ) : null}
      </div>
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
              vin: e.target.value.toUpperCase().replace(/\s/g, ""),
              make: "",
              model: "",
              country: "",
              ...emptySpec,
              tableFobUsd: null,
              co2Percent: config.defaults.co2Percent,
            });
          }}
        />
      </Field>
      <button
        type="button"
        onClick={decode}
        disabled={decoding || !v.vin}
        className="mt-2 min-h-11 w-full rounded-xl border border-[#d8dbe0] px-3 text-sm font-semibold disabled:opacity-50"
      >
        {decoding ? "Consultando NHTSA…" : "Identificar vehículo"}
      </button>
      {vinMessage ? (
        <p
          role="status"
          className="mt-2 text-xs leading-relaxed text-[#676a70]"
        >
          {vinMessage}
        </p>
      ) : null}
      <div className="mt-4 grid min-w-0 gap-3">
        <Field label="Marca">
          <select
            className={inputClass}
            value={v.make}
            onChange={(e) =>
              onChange({
                make: e.target.value,
                model: "",
                country: "",
                ...emptySpec,
                tableFobUsd: null,
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
            disabled={!v.make}
            value={v.model}
            onChange={(e) =>
              onChange({
                model: e.target.value,
                country: "",
                ...emptySpec,
                tableFobUsd: null,
              })
            }
          >
            <option value="">Selecciona modelo</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="País de fabricación / origen">
          <select
            className={inputClass}
            disabled={!v.model}
            value={v.country}
            onChange={(e) =>
              onChange({
                country: e.target.value,
                ...emptySpec,
                tableFobUsd: null,
              })
            }
          >
            <option value="">Confirma país del vehículo</option>
            {countries.map((m) => (
              <option key={m} value={m}>
                {m === "USA"
                  ? "USA · simular DR-CAFTA 0%"
                  : `${m} · arancel 20%`}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Año modelo">
          <input
            className={inputClass}
            type="number"
            list={`years-${v.id}`}
            min={config.minimumYear}
            max={new Date().getUTCFullYear() + 2}
            step={1}
            value={Number.isNaN(v.year) ? "" : v.year}
            onChange={(e) =>
              onChange({
                year: e.target.value ? Number(e.target.value) : NaN,
                ...emptySpec,
                tableFobUsd: null,
              })
            }
          />
          <datalist id={`years-${v.id}`}>
            {[2021, 2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y} />
            ))}
          </datalist>
        </Field>
        <Field label="Especificación">
          <select
            key={`${v.make}/${v.model}/${v.country}/${v.year}`}
            className={inputClass}
            defaultValue="manual"
            disabled={!v.make || !v.model || !v.country}
            onChange={(e) => {
              const s = specs.find((s) => s.id === e.target.value);
              if (s)
                onChange({
                  ...s,
                  id: v.id,
                  valuation: "table",
                  tableFobUsd: s.fobUsd,
                  co2Percent: s.co2Percent ?? suggestedCo2(s.cc, s.fuel),
                });
              else onChange({ ...emptySpec, tableFobUsd: null });
            }}
          >
            <option value="manual">
              {v.series
                ? `Revisar / editar: ${v.series}`
                : "Ingresar especificación manual"}
            </option>
            {specs.map((s) => (
              <option key={s.id} value={s.id}>
                {[s.series, s.fuel, `${s.cc} CC`, s.drive].join(" · ")}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <details className="mt-3 rounded-xl border border-[#e4e6ea] p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          Especificación y motor
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["series", "Serie / trim"],
              ["fuel", "Combustible"],
              ["cylinders", "Cilindros"],
              ["cc", "Cilindrada (CC)"],
              ["passengers", "Pasajeros"],
              ["doors", "Puertas"],
              ["drive", "Tracción"],
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
        </div>
        <p className="mt-3 text-xs text-[#676a70]">
          Confirma la especificación del lote con el VIN o su documentación. No
          se generan versiones ni FOB oficiales.
        </p>
      </details>
      <div className="mt-4 grid gap-3">
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
        <Field label="Tipo de título">
          <select
            className={inputClass}
            value={v.title}
            onChange={(e) =>
              onChange({
                title: e.target.value as ImportCandidate["title"],
                ...(e.target.value === "rebuilt"
                  ? { valuation: "table" as const }
                  : {}),
              })
            }
          >
            <option value="clean">Clean</option>
            <option value="rebuilt">Rebuilt / Salvage</option>
          </select>
        </Field>
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
            <option value="invoice">Factura</option>
            <option value="table">Tabla DGA</option>
          </select>
        </Field>
        {v.valuation === "table" ? (
          <Field label="FOB de tabla (US$) · editable">
            <input
              className={inputClass}
              type="number"
              min="0.01"
              step="0.01"
              value={
                v.tableFobUsd ??
                (Number.isFinite(v.purchaseUsd) ? v.purchaseUsd : "")
              }
              onChange={(e) =>
                onChange({
                  tableFobUsd: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <span className="mt-1 block text-xs font-normal text-[#676a70]">
              Provisional = compra. Sustituye por el FOB oficial de la
              especificación cuando esté disponible.
            </span>
          </Field>
        ) : null}
        <Field label="CO₂ estimado">
          <select
            className={inputClass}
            value={v.co2Percent}
            onChange={(e) => onChange({ co2Percent: Number(e.target.value) })}
          >
            {[0, 1, 2, 3].map((p) => (
              <option key={p} value={p}>
                {p}% del CIF
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-[#676a70]">
            Sugerencia presupuestaria por motor, editable. La tasa legal depende
            de emisiones certificadas, no solo de cilindrada.
          </span>
        </Field>
      </div>
      <details className="mt-4 rounded-xl border border-[#e4e6ea] p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          Transporte, reparación y cambio
        </summary>
        <div className="mt-3 grid gap-3">
          {numeric("inlandUsd", "Grúa USA (US$)")}
          {numeric("freightUsd", "Flete marítimo (US$)")}
          {numeric("repairUsd", "Reparación estimada (US$)")}
          {numeric("fx", "Tasa RD$/US$", 0.01)}
        </div>
      </details>
      <div className="mt-4 space-y-2 text-xs">
        <p
          className={
            v.year >= config.minimumYear
              ? "text-green-800"
              : "font-bold text-red-800"
          }
        >
          {v.year >= config.minimumYear
            ? "Año admitido por esta calculadora (2021+). Validar admisibilidad antes de comprar."
            : "Cálculo bloqueado: solo modelos 2021 en adelante. Verifica antigüedad según Ley 04-07."}
        </p>
        {v.title === "rebuilt" ? (
          <p className="rounded-lg bg-amber-50 p-2 text-amber-900">
            Rebuilt/Salvage: usa la tabla DGA como referencia y confirma título,
            admisibilidad y valoración con Valcron antes de comprar.
          </p>
        ) : null}
        {result?.caftaSavings ? (
          <p className="text-green-800">
            Ahorro DR-CAFTA simulado: {usd(result.caftaSavings)} en arancel e
            ITBIS.
          </p>
        ) : null}
        {result?.sweetSpot ? (
          <p className="font-semibold text-[#a54d1c]">
            Punto dulce · total entre US$25,000 y US$45,000
          </p>
        ) : null}
      </div>
      {result ? (
        <section
          aria-label={`Resultado vehículo ${index + 1}`}
          className="mt-4 rounded-xl bg-[#fff7f0] p-4"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-[#a54d1c]">
            Total puesto en RD · ESTIMADO
          </p>
          <p className="mt-2 text-2xl font-bold">{usd(result.totalUsd)}</p>
          <p className="mt-1 font-semibold">{dop(result.totalDop)}</p>
          <dl className="mt-4 divide-y divide-[#edddd1]">
            {result.lines.map((line) => (
              <div
                key={line.key}
                className="flex flex-wrap justify-between gap-2 py-2 text-xs"
              >
                <dt>{line.label}</dt>
                <dd className="font-semibold">{usd(line.usd)}</dd>
              </div>
            ))}
          </dl>
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer font-semibold">
              Honorarios del contrato
            </summary>
            <p className="mt-2 leading-relaxed">
              Dealer Fee {usd(result.dealerFee)} · Repair Fee{" "}
              {usd(v.repairUsd > 0 ? config.repairFeeUsd : 0)} · Custom Fee{" "}
              {usd(config.customFeeUsd)} · Servicio dealer RD{" "}
              {dop(config.dealerServiceDop)}.
            </p>
          </details>
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer font-semibold">
              Bases de cálculo de impuestos
            </summary>
            <p className="mt-2 leading-relaxed">
              FOB {usd(result.fob)} · seguro de valoración 2%{" "}
              {usd(result.insurance)} · CIF {usd(result.cif)}. Arancel{" "}
              {usd(result.tariff)} · ITBIS 18% {usd(result.itbis)} · placa 17%{" "}
              {usd(result.plate)} · CO₂ {usd(result.co2)} · marbete{" "}
              {dop(result.marbeteDop)}. El seguro integra la base CIF y se cobra
              una sola vez en su partida.
            </p>
          </details>
        </section>
      ) : (
        <p className="mt-4 rounded-xl bg-[#f5f6f7] p-4 text-sm text-[#676a70]">
          Completa marca, modelo, país, año y precio válidos para calcular.
        </p>
      )}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={!result || pdfBusy}
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
  const [candidates, setCandidates] = useState<ImportCandidate[]>(() => {
    const v = newImportCandidate("1");
    const year = Number(params.get("ano"));
    if (year) v.year = year;
    if (params.get("provider") === "iaai") v.provider = "iaai";
    const description = params.get("vehiculo");
    if (description) {
      const make = Object.keys(IMPORT_VEHICLE_POOL).find((m) =>
        description.toLowerCase().startsWith(m.toLowerCase()),
      );
      if (make) {
        v.make = make;
        v.model =
          IMPORT_VEHICLE_POOL[make].find((m) =>
            description.toLowerCase().includes(m.toLowerCase()),
          ) ?? "";
      }
    }
    return [v];
  });
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
            Hasta 3 vehículos. Resultados estimados en tu navegador.
          </p>
        </div>
        <button
          type="button"
          disabled={candidates.length >= 3}
          onClick={() =>
            setCandidates((v) => [
              ...v,
              newImportCandidate(String(nextId.current++)),
            ])
          }
          className="home-orange-button min-h-12 rounded-xl px-5 text-sm font-semibold disabled:opacity-40"
        >
          Agregar vehículo ({candidates.length}/3)
        </button>
      </div>
      <div className="mb-5 max-w-lg">
        <Field label="Nombre del cliente (opcional, para el PDF)">
          <input
            className={inputClass}
            maxLength={120}
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Nombre y apellido"
            autoComplete="name"
          />
        </Field>
      </div>
      <div
        className={`grid min-w-0 gap-4 ${candidates.length === 1 ? "max-w-3xl" : candidates.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}
      >
        {candidates.map((v, index) => (
          <CandidateCard
            key={v.id}
            v={v}
            index={index}
            client={client}
            best={best === v.id}
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
          Origen USA simula arancel 0%; otro origen, 20%. La preferencia
          DR-CAFTA requiere acreditación documental y aceptación de la DGA; el
          VIN y el país de fabricación no bastan.{" "}
          <a
            href="https://www.aduanas.gob.do/media/05xjgcn2/instructivo-y-formulario-certificado-de-origen-cafta-dr-10-3-22-v4.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Requisitos de origen DGA
          </a>
          .
        </p>
        <p>
          «Mejor opción» compara únicamente costos estimados válidos: prioriza
          el menor total dentro del punto dulce; si no hay ninguno, el menor
          total. No evalúa condición mecánica ni disponibilidad.
        </p>
        <p>
          El FOB de tabla se ingresa manualmente según la referencia que
          corresponda. El CO₂ sugerido por motor es orientativo; confirma
          emisiones, título y antigüedad aplicable antes de ofertar.{" "}
          <a
            href="https://www.aduanas.gob.do/preguntas-frecuentes/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Consultar DGA
          </a>
          .
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
