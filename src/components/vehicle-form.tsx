"use client";

import { useActionState, useMemo, useState } from "react";
import { createVehiculo, updateVehiculo } from "@/app/actions/catalog";
import {
  Field,
  FormError,
  MoneyInput,
  SelectInput,
  TextInput,
} from "@/components/form-fields";
import { VehicleFinancialSummary } from "@/components/vehicles/VehicleFinancialSummary";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { COMPANY_NAMES } from "@/lib/companies";
import {
  DEFAULT_TASA_USD_DOP,
  TRIM_SUGGESTIONS,
  VEHICLE_STATES,
  calculateVehicleCosts,
  parseAmount,
} from "@/lib/vehicle-costs";
import { decodeVin } from "@/lib/vin";

const currentYear = new Date().getFullYear();

export type VehicleFormValues = {
  id: string;
  vin: string;
  marca: string;
  modelo: string;
  trim: string | null;
  ano: number;
  estado: string | null;
  costo_subasta_usd: number | null;
  gastos_taller_usa_usd: number | null;
  gastos_grua_usd: number | null;
  gastos_titulacion_usd: number | null;
  fees_adicionales_usd: number | null;
  flete_usd: number | null;
  tasa_usd_dop: number | null;
  costo_taller_dop: number | null;
  impuestos_dga_dop: number | null;
  precio_venta_dop: number | null;
  fotos_urls?: string[] | null;
  ubicacion_lote?: string | null;
  lote_numero?: string | null;
  fuente_subasta?: string | null;
};

function amountState(value: number | null | undefined) {
  return String(value ?? 0);
}

export function VehicleForm({ vehicle }: { vehicle?: VehicleFormValues }) {
  const action = vehicle
    ? updateVehiculo.bind(null, vehicle.id)
    : createVehiculo;
  const [state, formAction, pending] = useActionState(action, null);
  const [vin, setVin] = useState(vehicle?.vin ?? "");
  const [marca, setMarca] = useState(vehicle?.marca ?? "");
  const [modelo, setModelo] = useState(vehicle?.modelo ?? "");
  const [trim, setTrim] = useState(vehicle?.trim ?? "");
  const [ano, setAno] = useState(String(vehicle?.ano ?? currentYear));
  const [vinStatus, setVinStatus] = useState("");
  const [costoSubastaUsd, setCostoSubastaUsd] = useState(
    amountState(vehicle?.costo_subasta_usd),
  );
  const [gastosTallerUsaUsd, setGastosTallerUsaUsd] = useState(
    amountState(vehicle?.gastos_taller_usa_usd),
  );
  const [gastosGruaUsd, setGastosGruaUsd] = useState(
    amountState(vehicle?.gastos_grua_usd),
  );
  const [gastosTitulacionUsd, setGastosTitulacionUsd] = useState(
    amountState(vehicle?.gastos_titulacion_usd),
  );
  const [feesAdicionalesUsd, setFeesAdicionalesUsd] = useState(
    amountState(vehicle?.fees_adicionales_usd),
  );
  const [fleteUsd, setFleteUsd] = useState(amountState(vehicle?.flete_usd));
  const [tasaUsdDop, setTasaUsdDop] = useState(
    String(vehicle?.tasa_usd_dop ?? DEFAULT_TASA_USD_DOP),
  );
  const [gastosTallerRdDop, setGastosTallerRdDop] = useState(
    amountState(vehicle?.costo_taller_dop),
  );
  const [impuestosDgaDop, setImpuestosDgaDop] = useState(
    amountState(vehicle?.impuestos_dga_dop),
  );
  const [precioVentaDop, setPrecioVentaDop] = useState(
    vehicle?.precio_venta_dop != null ? String(vehicle.precio_venta_dop) : "",
  );
  const [precioManual, setPrecioManual] = useState(
    vehicle?.precio_venta_dop != null,
  );
  const [fotosUrls, setFotosUrls] = useState(vehicle?.fotos_urls ?? []);

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
      gastosTallerUsaUsd,
      gastosGruaUsd,
      gastosTitulacionUsd,
      feesAdicionalesUsd,
      fleteUsd,
      tasaUsdDop,
      gastosTallerRdDop,
      impuestosDgaDop,
    ],
  );

  const precioMostrado = precioManual
    ? precioVentaDop
    : costs.precioEstimadoDop.toFixed(2);
  const trimOptions = Array.from(
    new Set([trim, ...TRIM_SUGGESTIONS].filter(Boolean)),
  );

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
      setVinStatus("No se pudo decodificar el VIN. Completa el trim manualmente.");
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

  return (
    <form action={formAction} className="grid gap-6">
      <p className="text-sm text-slate-400">
        El registro se asociará a {COMPANY_NAMES.valcron}.
      </p>
      <FormError message={state?.error} />
      <input
        type="hidden"
        name="fotos_urls"
        value={JSON.stringify(fotosUrls)}
      />
      <input type="hidden" name="lote_numero" value={vehicle?.lote_numero ?? ""} />
      <input
        type="hidden"
        name="fuente_subasta"
        value={vehicle?.fuente_subasta ?? ""}
      />
      <input
        type="hidden"
        name="ubicacion_lote"
        value={vehicle?.ubicacion_lote ?? ""}
      />

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
            <span className="mt-2 block text-xs text-cyan-300">{vinStatus}</span>
          ) : null}
        </Field>
        <Field label="Estado">
          <SelectInput name="estado" defaultValue={vehicle?.estado ?? "En Subasta"}>
            {VEHICLE_STATES.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </SelectInput>
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
        <Field label="Modelo / Trim">
          <TextInput
            name="trim"
            list="trim-suggestions"
            value={trim}
            placeholder="EXL, Prestige, Sport"
            onChange={(event) => setTrim(event.target.value)}
          />
          <datalist id="trim-suggestions">
            {trimOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
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
      </div>

      <VehicleGallery
        urls={fotosUrls}
        vehicleId={vehicle?.id}
        compact
        onChange={setFotosUrls}
      />

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Gastos y costos USD
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Costo Subasta (USD)">
            <MoneyInput
              currency="USD"
              name="costo_subasta_usd"
              value={costoSubastaUsd}
              onChange={(event) => setCostoSubastaUsd(event.target.value)}
            />
          </Field>
          <Field label="Gastos de Taller en USA (USD)">
            <MoneyInput
              currency="USD"
              name="gastos_taller_usa_usd"
              value={gastosTallerUsaUsd}
              onChange={(event) => setGastosTallerUsaUsd(event.target.value)}
            />
          </Field>
          <Field label="Gastos de Grúa (USD)">
            <MoneyInput
              currency="USD"
              name="gastos_grua_usd"
              value={gastosGruaUsd}
              onChange={(event) => setGastosGruaUsd(event.target.value)}
            />
          </Field>
          <Field label="Gastos de Titulación / Documentos (USD)">
            <MoneyInput
              currency="USD"
              name="gastos_titulacion_usd"
              value={gastosTitulacionUsd}
              onChange={(event) => setGastosTitulacionUsd(event.target.value)}
            />
          </Field>
          <Field label="Fees Adicionales / Otros Gastos (USD)">
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Gastos y costos DOP
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Gastos de Taller en RD (DOP)">
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
          <Field label="Precio de Venta Final (DOP)">
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {pending
            ? "Guardando..."
            : vehicle
              ? "Guardar cambios"
              : "Guardar vehículo"}
        </button>
      </div>
    </form>
  );
}
