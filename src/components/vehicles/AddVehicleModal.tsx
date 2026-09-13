"use client";

import { useMemo, useState, useTransition } from "react";
import { createVehiculo } from "@/app/actions/catalog";
import {
  Field,
  FormError,
  MoneyInput,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { VehicleFinancialSummary } from "@/components/vehicles/VehicleFinancialSummary";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { COMPANY_NAMES } from "@/lib/companies";
import type { VehicleRow } from "@/lib/inventory";
import type { AuctionListing } from "@/lib/auction";
import { usableVin } from "@/lib/auction";
import {
  DEFAULT_TASA_USD_DOP,
  TRIM_SUGGESTIONS,
  calculateVehicleCosts,
  parseAmount,
} from "@/lib/vehicle-costs";
import { decodeVin } from "@/lib/vin";

const currentYear = new Date().getFullYear();

export function AddVehicleModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (record: VehicleRow) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [vin, setVin] = useState("");
  const [vinStatus, setVinStatus] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [trim, setTrim] = useState("");
  const [ano, setAno] = useState("");
  const [costoSubastaUsd, setCostoSubastaUsd] = useState("0");
  const [gastosTallerUsaUsd, setGastosTallerUsaUsd] = useState("0");
  const [gastosGruaUsd, setGastosGruaUsd] = useState("0");
  const [gastosTitulacionUsd, setGastosTitulacionUsd] = useState("0");
  const [feesAdicionalesUsd, setFeesAdicionalesUsd] = useState("0");
  const [fleteUsd, setFleteUsd] = useState("0");
  const [tasaUsdDop, setTasaUsdDop] = useState(String(DEFAULT_TASA_USD_DOP));
  const [gastosTallerRdDop, setGastosTallerRdDop] = useState("0");
  const [impuestosDgaDop, setImpuestosDgaDop] = useState("0");
  const [precioVentaDop, setPrecioVentaDop] = useState("");
  const [precioManual, setPrecioManual] = useState(false);
  const [auctionQuery, setAuctionQuery] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractMessage, setExtractMessage] = useState("");
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [ubicacionLote, setUbicacionLote] = useState("");
  const [loteNumero, setLoteNumero] = useState("");
  const [fuenteSubasta, setFuenteSubasta] = useState("");

  const costs = useMemo(
    () =>
      calculateVehicleCosts({
        costoSubastaUsd: parseAmount(costoSubastaUsd),
        gastosTallerUsaUsd: parseAmount(gastosTallerUsaUsd),
        gastosGruaUsd: parseAmount(gastosGruaUsd),
        gastosTitulacionUsd: parseAmount(gastosTitulacionUsd),
        feesAdicionalesUsd: parseAmount(feesAdicionalesUsd),
        fleteUsd: parseAmount(fleteUsd),
        tasaUsdDop: parseAmount(tasaUsdDop) || DEFAULT_TASA_USD_DOP,
        gastosTallerRdDop: parseAmount(gastosTallerRdDop),
        impuestosDgaDop: parseAmount(impuestosDgaDop),
      }),
    [
      costoSubastaUsd,
      feesAdicionalesUsd,
      fleteUsd,
      gastosGruaUsd,
      gastosTallerRdDop,
      gastosTallerUsaUsd,
      gastosTitulacionUsd,
      impuestosDgaDop,
      tasaUsdDop,
    ],
  );

  const precioMostrado = precioManual
    ? precioVentaDop
    : costs.precioEstimadoDop.toFixed(2);
  const trimOptions = Array.from(
    new Set([trim, ...TRIM_SUGGESTIONS].filter(Boolean)),
  );

  function resetForm() {
    setError(null);
    setVin("");
    setVinStatus("");
    setMarca("");
    setModelo("");
    setTrim("");
    setAno("");
    setCostoSubastaUsd("0");
    setGastosTallerUsaUsd("0");
    setGastosGruaUsd("0");
    setGastosTitulacionUsd("0");
    setFeesAdicionalesUsd("0");
    setFleteUsd("0");
    setTasaUsdDop(String(DEFAULT_TASA_USD_DOP));
    setGastosTallerRdDop("0");
    setImpuestosDgaDop("0");
    setPrecioVentaDop("");
    setPrecioManual(false);
    setAuctionQuery("");
    setExtracting(false);
    setExtractMessage("");
    setFotosUrls([]);
    setUbicacionLote("");
    setLoteNumero("");
    setFuenteSubasta("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleVinChange(nextVin: string) {
    const normalized = nextVin.toUpperCase().replace(/\s+/g, "");
    setVin(normalized);
    if (normalized.length !== 17) {
      setVinStatus("");
      return;
    }

    setVinStatus("Decodificando VIN...");
    const decoded = await decodeVin(normalized);
    if (!decoded) {
      setVinStatus(
        "No se pudo decodificar el VIN. Completa marca, modelo y trim manualmente.",
      );
      return;
    }

    if (decoded.marca) {
      setMarca(decoded.marca);
    }
    if (decoded.modelo) {
      setModelo(decoded.modelo);
    }
    if (decoded.ano) {
      setAno(decoded.ano);
    }
    if (decoded.trim) {
      setTrim(decoded.trim);
    }
    setVinStatus(
      decoded.trim
        ? `VIN decodificado. Trim sugerido: ${decoded.trim}`
        : "VIN decodificado. Ingresa el trim o versión manualmente.",
    );
  }

  function applyAuctionListing(listing: AuctionListing) {
    const vinValue = usableVin(listing.vin);
    setVin(vinValue);
    if (listing.marca) {
      setMarca(listing.marca);
    }
    if (listing.modelo) {
      setModelo(listing.modelo);
    }
    if (listing.trim) {
      setTrim(listing.trim);
    }
    if (listing.ano) {
      setAno(listing.ano);
    }
    if (listing.costoSubastaUsd != null) {
      setCostoSubastaUsd(String(listing.costoSubastaUsd));
    }
    setFotosUrls(listing.fotosUrls);
    setUbicacionLote(listing.ubicacionLote);
    setLoteNumero(listing.lotNumber);
    setFuenteSubasta(listing.source);
    setVinStatus(
      listing.vinMasked || vinValue.length !== 17
        ? "VIN público enmascarado. Completa los caracteres faltantes antes de guardar."
        : `Datos extraídos de ${listing.source}. Revisa el lote y completa flete, grúa, titulación, taller RD e impuestos DGA.`,
    );
    setExtractMessage(
      `Datos extraídos de ${listing.source}${listing.lotNumber ? ` · Lote ${listing.lotNumber}` : ""}${listing.ubicacionLote ? ` · ${listing.ubicacionLote}` : ""}. Completa los costos locales antes de guardar.`,
    );
  }

  async function handleExtractAuction() {
    setError(null);
    setExtractMessage("");
    setExtracting(true);

    try {
      const response = await fetch("/api/scrape-auction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: auctionQuery }),
      });
      const payload = (await response.json()) as {
        error?: string;
        data?: AuctionListing;
      };

      if (!response.ok || payload.error || !payload.data) {
        setError(
          payload.error ??
            "No se pudo extraer el lote. Verifica la URL o el número e inténtalo de nuevo.",
        );
        return;
      }

      applyAuctionListing(payload.data);
    } catch {
      setError(
        "No se pudo consultar la subasta. Revisa tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setExtracting(false);
    }
  }

  function handleSubmit(formData: FormData) {
    formData.set("mode", "modal");
    formData.set("estado", "En Subasta");
    startTransition(async () => {
      const result = await createVehiculo(null, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.record) {
        onCreated(result.record);
      }
      handleClose();
    });
  }

  return (
    <Modal
      open={open}
      title="Agregar vehículo"
      subtitle={`Alta de inventario para ${COMPANY_NAMES.valcron}.`}
      onClose={handleClose}
    >
      <form action={handleSubmit} className="grid gap-6">
        <FormError message={error} />

        <section className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Importar desde Subasta
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Pega una URL o el número de lote de Copart, IAAI o Manheim. Extraemos
            VIN, marca, modelo, año, trim, fotos, ubicación y oferta actual.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <TextInput
              name="auction_query"
              value={auctionQuery}
              placeholder="https://www.copart.com/lot/64684866 o 64684866"
              className="mt-0"
              onChange={(event) => setAuctionQuery(event.target.value)}
            />
            <button
              type="button"
              onClick={() => void handleExtractAuction()}
              disabled={extracting || !auctionQuery.trim()}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
            >
              {extracting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
                  Extrayendo...
                </>
              ) : (
                "Extraer Datos"
              )}
            </button>
          </div>
          {extractMessage ? (
            <p className="mt-3 text-sm text-cyan-200">{extractMessage}</p>
          ) : null}
        </section>

        <input type="hidden" name="fotos_urls" value={JSON.stringify(fotosUrls)} />
        <input type="hidden" name="lote_numero" value={loteNumero} />
        <input type="hidden" name="fuente_subasta" value={fuenteSubasta} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="VIN">
            <TextInput
              name="vin"
              required
              minLength={17}
              maxLength={17}
              value={vin}
              placeholder="17 caracteres"
              onChange={(event) => void handleVinChange(event.target.value)}
            />
            {vinStatus ? (
              <span className="mt-2 block text-xs text-cyan-300">
                {vinStatus}
              </span>
            ) : null}
          </Field>
          <Field label="Año">
            <TextInput
              name="ano"
              type="number"
              required
              min={1980}
              max={currentYear + 1}
              value={ano}
              onChange={(event) => setAno(event.target.value)}
            />
          </Field>
          <Field label="Marca">
            <TextInput
              name="marca"
              required
              value={marca}
              placeholder="Toyota"
              onChange={(event) => setMarca(event.target.value)}
            />
          </Field>
          <Field label="Modelo">
            <TextInput
              name="modelo"
              required
              value={modelo}
              placeholder="Corolla"
              onChange={(event) => setModelo(event.target.value)}
            />
          </Field>
          <Field label="Trim / Versión">
            <TextInput
              name="trim"
              list="add-vehicle-trim-suggestions"
              value={trim}
              placeholder="EXL, Prestige, Sport"
              onChange={(event) => setTrim(event.target.value)}
            />
            <datalist id="add-vehicle-trim-suggestions">
              {trimOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </Field>
          <Field label="Tasa USD → DOP">
            <TextInput
              name="tasa_usd_dop"
              type="number"
              min={1}
              step="0.01"
              value={tasaUsdDop}
              onChange={(event) => setTasaUsdDop(event.target.value)}
            />
          </Field>
          <Field label="Ubicación del lote">
            <TextInput
              name="ubicacion_lote"
              value={ubicacionLote}
              placeholder="CA - Van Nuys"
              onChange={(event) => setUbicacionLote(event.target.value)}
            />
          </Field>
        </div>

        <VehicleGallery urls={fotosUrls} compact onChange={setFotosUrls} />

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Costos USD
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            La oferta de subasta se completa al extraer. Revisa y agrega flete,
            grúa, titulación y demás costos locales.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Subasta (USD)">
              <MoneyInput
                currency="USD"
                name="costo_subasta_usd"
                value={costoSubastaUsd}
                onChange={(event) => setCostoSubastaUsd(event.target.value)}
              />
            </Field>
            <Field label="Taller USA (USD)">
              <MoneyInput
                currency="USD"
                name="gastos_taller_usa_usd"
                value={gastosTallerUsaUsd}
                onChange={(event) => setGastosTallerUsaUsd(event.target.value)}
              />
            </Field>
            <Field label="Grúa (USD)">
              <MoneyInput
                currency="USD"
                name="gastos_grua_usd"
                value={gastosGruaUsd}
                onChange={(event) => setGastosGruaUsd(event.target.value)}
              />
            </Field>
            <Field label="Titulación (USD)">
              <MoneyInput
                currency="USD"
                name="gastos_titulacion_usd"
                value={gastosTitulacionUsd}
                onChange={(event) =>
                  setGastosTitulacionUsd(event.target.value)
                }
              />
            </Field>
            <Field label="Fees adicionales (USD)">
              <MoneyInput
                currency="USD"
                name="fees_adicionales_usd"
                value={feesAdicionalesUsd}
                onChange={(event) => setFeesAdicionalesUsd(event.target.value)}
              />
            </Field>
            <Field label="Flete (USD)">
              <MoneyInput
                currency="USD"
                name="flete_usd"
                value={fleteUsd}
                onChange={(event) => setFleteUsd(event.target.value)}
              />
            </Field>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Costos DOP
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Taller RD (DOP)">
              <MoneyInput
                currency="DOP"
                name="costo_taller_dop"
                value={gastosTallerRdDop}
                onChange={(event) => setGastosTallerRdDop(event.target.value)}
              />
            </Field>
            <Field label="Impuestos DGA (DOP)">
              <MoneyInput
                currency="DOP"
                name="impuestos_dga_dop"
                value={impuestosDgaDop}
                onChange={(event) => setImpuestosDgaDop(event.target.value)}
              />
            </Field>
            <Field label="Precio Venta Final (DOP)">
              <MoneyInput
                currency="DOP"
                name="precio_venta_dop"
                value={precioMostrado}
                onChange={(event) => {
                  setPrecioManual(true);
                  setPrecioVentaDop(event.target.value);
                }}
              />
            </Field>
          </div>
        </div>

        <VehicleFinancialSummary
          costs={costs}
          tasaUsdDop={parseAmount(tasaUsdDop) || DEFAULT_TASA_USD_DOP}
          precioVentaDop={parseAmount(precioMostrado)}
        />

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-5 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar vehículo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
