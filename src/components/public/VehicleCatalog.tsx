"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Field,
  FormError,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/form-fields";
import { Modal } from "@/components/ui/modal";
import { formatDop } from "@/lib/money";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";

export function VehicleCatalog() {
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/public/vehicles", { cache: "no-store" });
        const payload = (await response.json()) as {
          data?: PublicVehicle[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudo cargar el inventario público.");
        }
        if (!cancelled) {
          setVehicles(payload.data ?? []);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo sincronizar el catálogo.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const marcas = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.marca))].sort(),
    [vehicles],
  );
  const anos = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.ano))].sort((a, b) => b - a),
    [vehicles],
  );
  const visible = useMemo(() => {
    const min = Number(precioMin);
    const max = Number(precioMax);
    return vehicles.filter((vehicle) => {
      if (marca && vehicle.marca !== marca) {
        return false;
      }
      if (ano && String(vehicle.ano) !== ano) {
        return false;
      }
      if (Number.isFinite(min) && min > 0 && vehicle.precioVentaDop < min) {
        return false;
      }
      if (Number.isFinite(max) && max > 0 && vehicle.precioVentaDop > max) {
        return false;
      }
      return true;
    });
  }, [ano, marca, precioMax, precioMin, vehicles]);
  const selected = vehicles.find((vehicle) => vehicle.id === selectedId) ?? null;

  return (
    <div className="grid gap-6">
      <FormError message={error} />
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <Field label="Marca">
          <SelectInput value={marca} onChange={(event) => setMarca(event.target.value)}>
            <option value="">Todas</option>
            {marcas.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Año">
          <SelectInput value={ano} onChange={(event) => setAno(event.target.value)}>
            <option value="">Todos</option>
            {anos.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Precio mínimo (DOP)">
          <TextInput
            type="number"
            min={0}
            value={precioMin}
            onChange={(event) => setPrecioMin(event.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Precio máximo (DOP)">
          <TextInput
            type="number"
            min={0}
            value={precioMax}
            onChange={(event) => setPrecioMax(event.target.value)}
            placeholder="Sin límite"
          />
        </Field>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-white/10 px-6 py-12 text-center text-sm text-slate-400">
          Sincronizando inventario público...
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-sm text-slate-400">
          No hay vehículos disponibles con esos filtros en valcronmotors.com.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onOpen={() => setSelectedId(vehicle.id)}
            />
          ))}
        </div>
      )}

      <VehicleDetailModal
        vehicle={selected}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

function VehicleCard({
  vehicle,
  onOpen,
}: {
  vehicle: PublicVehicle;
  onOpen: () => void;
}) {
  const cover = vehicle.fotosUrls[0];
  const whatsapp = catalogWhatsappHref(vehicle);

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1726] shadow-lg shadow-black/20">
      <button type="button" onClick={onOpen} className="relative block aspect-[16/10] bg-[#07111f]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={publicVehicleTitle(vehicle)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-slate-500">
            Sin foto
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {publicVehicleTitle(vehicle)}
          </h2>
          <p className="mt-1 text-xs text-slate-400">VIN {vehicle.vin}</p>
        </div>
        <p className="text-sm text-slate-300">
          {vehicle.especificaciones.version
            ? `Versión ${vehicle.especificaciones.version}`
            : "Especificaciones disponibles en la ficha"}
        </p>
        <p className="text-xl font-semibold text-cyan-200">
          {formatDop(vehicle.precioVentaDop)}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-10 items-center rounded-full bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10"
          >
            Ver detalle
          </button>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function VehicleDetailModal({
  vehicle,
  onClose,
}: {
  vehicle: PublicVehicle | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIndex(0);
    setSent(false);
    setError(null);
  }, [vehicle?.id]);

  if (!vehicle) {
    return null;
  }

  const currentVehicle = vehicle;
  const photos = currentVehicle.fotosUrls;
  const current = photos[index] ?? photos[0] ?? null;
  const whatsapp = catalogWhatsappHref(currentVehicle);

  async function handleLead(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          telefono: formData.get("telefono"),
          email: formData.get("email"),
          mensaje: formData.get("mensaje"),
          vehiculoId: currentVehicle.id,
          vin: currentVehicle.vin,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "No se pudo enviar la solicitud.");
        return;
      }
      setSent(true);
    } catch {
      setError("No se pudo enviar la solicitud. Intenta de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open
      size="xl"
      title={publicVehicleTitle(currentVehicle)}
      subtitle={`${formatDop(currentVehicle.precioVentaDop)} · VIN ${currentVehicle.vin}`}
      onClose={onClose}
    >
      <div className="grid gap-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
          <div className="relative aspect-[16/9]">
            {current ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current}
                alt={publicVehicleTitle(currentVehicle)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Sin fotos públicas
              </div>
            )}
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setIndex((currentIndex) => (currentIndex - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 px-3 py-2 text-sm text-white"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((currentIndex) => (currentIndex + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 px-3 py-2 text-sm text-white"
                >
                  Siguiente
                </button>
              </>
            ) : null}
          </div>
          {photos.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto p-3">
              {photos.map((url, photoIndex) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setIndex(photoIndex)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${
                    photoIndex === index ? "ring-cyan-300" : "ring-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <dl className="grid gap-3 rounded-2xl border border-white/10 p-4 sm:grid-cols-2">
          <Spec label="Marca" value={currentVehicle.especificaciones.marca} />
          <Spec label="Modelo" value={currentVehicle.especificaciones.modelo} />
          <Spec label="Año" value={String(currentVehicle.especificaciones.ano)} />
          <Spec
            label="Trim / Versión"
            value={currentVehicle.especificaciones.version || "No especificada"}
          />
          <Spec label="VIN" value={currentVehicle.especificaciones.vin} />
          <Spec label="Precio de venta" value={formatDop(currentVehicle.precioVentaDop)} />
        </dl>

        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Consultar por WhatsApp
          </a>
        ) : null}

        <form action={handleLead} className="grid gap-4 rounded-2xl border border-white/10 p-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Solicitar información</h3>
            <p className="mt-1 text-xs text-slate-400">
              El formulario entra al CRM como lead Web vinculado a este VIN.
            </p>
          </div>
          <FormError message={error} />
          {sent ? (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Recibimos tu solicitud. Un asesor te contactará en breve.
            </p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre">
                  <TextInput name="nombre" required placeholder="Tu nombre" />
                </Field>
                <Field label="Teléfono">
                  <TextInput name="telefono" placeholder="809-000-0000" />
                </Field>
                <Field label="Correo">
                  <TextInput name="email" type="email" placeholder="correo@cliente.com" />
                </Field>
              </div>
              <Field label="Mensaje">
                <TextArea
                  name="mensaje"
                  placeholder="Cuéntanos horario de visita o forma de pago"
                />
              </Field>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
              >
                {pending ? "Enviando..." : "Enviar al CRM"}
              </button>
            </>
          )}
        </form>
      </div>
    </Modal>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white">{value}</dd>
    </div>
  );
}
