"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Star } from "lucide-react";
import {
  attachVehiclePhotos,
  createVehicle,
  deleteVehicle,
  deleteVehiclePhoto,
  reorderVehiclePhotos,
  setVehicleFeatured,
  setVehiclePublished,
  setVehicleStatus,
  updateVehicle,
  updateVehiclePhoto,
} from "@/app/actions/vehicles";
import { AdminConfirmDialog } from "@/components/admin/AdminModal";
import { AdminPublishBadge, AdminStatusBadge } from "@/components/admin/AdminBadges";
import {
  AdminCard,
  AdminDangerButton,
  AdminError,
  AdminField,
  AdminInput,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSelect,
  AdminTextArea,
} from "@/components/admin/ui";
import {
  ADMIN_CONDITION_OPTIONS,
  ADMIN_DRIVETRAIN_OPTIONS,
  ADMIN_FUEL_OPTIONS,
  ADMIN_TRANSMISSION_OPTIONS,
  withCurrentOption,
} from "@/lib/admin-field-options";
import { vehicleLabel } from "@/lib/admin-metrics";
import {
  formatCustomerFacingPrice,
  isAuctionOriginSource,
  PUBLIC_PRICE_MODE_LABELS,
  PUBLIC_PRICE_MODES,
  defaultPublicPriceMode,
  type PublicPriceMode,
} from "@/lib/public-price-mode";
import { MAX_VEHICLE_PHOTOS, vehicleImageAdminPath } from "@/lib/storage";
import { removeStoredPhoto, uploadVehiclePhotos } from "@/lib/vehicle-photos";
import { canPublishVehicleListing, vehiclePublicationChecks } from "@/lib/publication-readiness";
import {
  beginVehicleSubmit,
  clearVehicleDraft,
  emptyVehicleFormValues,
  endVehicleSubmit,
  readVehicleDraft,
  validateVehicleFormValues,
  vehicleFormDataFromValues,
  vehicleFormValuesFromRow,
  writeVehicleDraft,
  type VehicleFieldErrors,
  type VehicleFormValues,
} from "@/lib/vehicle-form-state";
import { stashFailedVehiclePhotos, takeFailedVehiclePhotos } from "@/lib/vehicle-photo-retry";
import {
  VEHICLE_SOURCE_TYPES,
  VEHICLE_STATUSES,
  type VehicleRow,
  type VehicleStatus,
} from "@/lib/website-schema";
import { vehicleStatusLabel } from "@/lib/vehicles/vehicle-status";

function statusActionLabel(status: VehicleStatus) {
  switch (status) {
    case "available":
      return "Marcar disponible";
    case "reserved":
      return "Reservar";
    case "sold":
      return "Marcar vendido";
    case "hidden":
      return "Ocultar";
    default:
      return vehicleStatusLabel(status);
  }
}

type LocalPhoto = {
  id: string;
  file: File;
  preview: string;
  alt: string;
  isCover: boolean;
};

const SOURCE_LABEL: Record<(typeof VEHICLE_SOURCE_TYPES)[number], string> = {
  valcron_stock: "Stock Valcron",
  consignment: "Consignación",
  trade_in: "Trade-in",
  other: "Otro",
};

function newLocalId() {
  return crypto.randomUUID();
}

function FormSection({
  id,
  index,
  title,
  hint,
  children,
}: {
  id?: string;
  index: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <AdminCard id={id}>
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 text-[11px] font-semibold tracking-[0.16em] text-[var(--admin-brand)]">
          {index}
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">{hint}</p>
        </div>
      </div>
      {children}
    </AdminCard>
  );
}

export function AdminVehicleEditor({ vehicle }: { vehicle?: VehicleRow | null }) {
  const router = useRouter();
  const saved = Boolean(vehicle?.id);
  const [values, setValues] = useState<VehicleFormValues>(() =>
    vehicle ? vehicleFormValuesFromRow(vehicle) : emptyVehicleFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<VehicleFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftRecovered, setDraftRecovered] = useState(false);
  const [draftReady, setDraftReady] = useState(saved);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const photos = vehicle?.vehicle_photos;
  const [published, setPublished] = useState(Boolean(vehicle?.published));
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? "draft");
  const [confirm, setConfirm] = useState<
    | { type: "publish" }
    | { type: "unpublish" }
    | { type: "delete" }
    | { type: "photo"; id: string; storagePath: string }
    | { type: "sold" }
    | null
  >(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const submitLock = useRef(false);
  const yearRef = useRef<HTMLInputElement>(null);
  const makeRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const featured = values.featured;
  const price = values.price;
  const currency = values.currency;
  const description = values.description;
  const cover = [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order).find((photo) => photo.is_cover)
    ?? [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0];

  const previewPhotos = useMemo(
    () => {
      const savedPhotos = saved ? [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order) : [];
      return saved ? [...savedPhotos, ...localPhotos] : localPhotos;
    },
    [localPhotos, photos, saved],
  );

  function patchValues(patch: Partial<VehicleFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (saved) {
        setDraftReady(true);
        return;
      }
      const draft = readVehicleDraft(window.localStorage);
      if (draft) {
        setValues(draft);
        setDraftRecovered(true);
        setNotice("Borrador recuperado");
      }
      setDraftReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    if (saved || !draftReady) return;
    const timer = window.setTimeout(() => {
      writeVehicleDraft(window.localStorage, values);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [saved, values, draftReady]);

  useEffect(() => {
    if (!vehicle?.id) return;
    const timer = window.setTimeout(() => {
      const stashed = takeFailedVehiclePhotos(vehicle.id);
      if (stashed.length === 0) return;
      setLocalPhotos(
        stashed.map((photo) => ({
          id: newLocalId(),
          file: photo.file,
          preview: URL.createObjectURL(photo.file),
          alt: photo.alt,
          isCover: photo.isCover,
        })),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [vehicle?.id]);

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    const room = MAX_VEHICLE_PHOTOS - (photos ?? []).length - localPhotos.length;
    const selected = incoming.slice(0, Math.max(room, 0));
    if (selected.length === 0) {
      setError(`Máximo ${MAX_VEHICLE_PHOTOS} fotos.`);
      return;
    }

    if (saved) {
      void uploadExisting(selected);
      return;
    }

    setLocalPhotos((current) => {
      const next = [
        ...current,
        ...selected.map((file, index) => ({
          id: newLocalId(),
          file,
          preview: URL.createObjectURL(file),
          alt: "",
          isCover: current.length === 0 && index === 0,
        })),
      ];
      if (!next.some((photo) => photo.isCover) && next[0]) {
        next[0].isCover = true;
      }
      return next;
    });
  }

  async function uploadExisting(files: File[]) {
    if (!vehicle?.id) return;
    setUploading(true);
    setError(null);
    const result = await uploadVehiclePhotos(files, {
      vehicleId: vehicle.id,
      currentCount: (photos ?? []).length,
    });
    if (result.paths.length > 0) {
      const attached = await attachVehiclePhotos({
        vehicleId: vehicle.id,
        paths: result.paths,
      });
      if (attached.error) {
        setError(attached.error);
      } else {
        setNotice("Fotos subidas.");
        router.refresh();
      }
    }
    if (result.error) {
      setError(result.error);
    }
    setUploading(false);
  }

  async function retryLocalUpload(vehicleId: string) {
    if (localPhotos.length === 0) {
      return { failed: false as const };
    }
    setUploading(true);
    setError(null);
    const files = localPhotos.map((photo) => photo.file);
    const result = await uploadVehiclePhotos(files, {
      vehicleId,
      currentCount: (photos ?? []).length,
    });
    const uploadedCount = result.paths.length;
    if (uploadedCount > 0) {
      const uploaded = localPhotos.slice(0, uploadedCount);
      const coverPhoto = uploaded.find((photo) => photo.isCover);
      const coverIndex = coverPhoto ? uploaded.indexOf(coverPhoto) : 0;
      const attached = await attachVehiclePhotos({
        vehicleId,
        paths: result.paths,
        coverPath: result.paths[coverIndex] ?? result.paths[0],
        altTexts: Object.fromEntries(
          result.paths.map((path, index) => [path, uploaded[index]?.alt ?? ""]),
        ),
      });
      if (attached.error) {
        setError(attached.error);
        setUploading(false);
        stashFailedVehiclePhotos(
          vehicleId,
          localPhotos.map((photo) => ({ file: photo.file, alt: photo.alt, isCover: photo.isCover })),
        );
        return { failed: true as const };
      }
    }
    const remaining = localPhotos.slice(uploadedCount);
    if (result.error || remaining.length > 0) {
      remaining.forEach((photo) => {
        if (photo.preview.startsWith("blob:")) URL.revokeObjectURL(photo.preview);
      });
      const kept = remaining.map((photo) => ({
        ...photo,
        preview: URL.createObjectURL(photo.file),
      }));
      setLocalPhotos(kept);
      stashFailedVehiclePhotos(
        vehicleId,
        kept.map((photo) => ({ file: photo.file, alt: photo.alt, isCover: photo.isCover })),
      );
      setError(
        result.error
          ? `${result.error} El vehículo quedó creado. Reintenta las fotos pendientes.`
          : "Algunas fotos no se subieron. Reintenta las pendientes.",
      );
      setUploading(false);
      return { failed: true as const };
    }
    setLocalPhotos([]);
    stashFailedVehiclePhotos(vehicleId, []);
    setUploading(false);
    return { failed: false as const };
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  }

  function moveLocal(from: number, to: number) {
    setLocalPhotos((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function moveSaved(from: number, to: number) {
    if (!vehicle?.id) return;
    const ordered = [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    const [item] = ordered.splice(from, 1);
    ordered.splice(to, 0, item);
    await reorderVehiclePhotos(
      vehicle.id,
      ordered.map((photo) => photo.id),
    );
    setNotice("Orden de fotos actualizado.");
    router.refresh();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || uploading || !beginVehicleSubmit(submitLock)) {
      return;
    }
    setError(null);
    const validation = validateVehicleFormValues(values);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.fieldErrors._form ?? null);
      const focusMap = {
        year: yearRef,
        make: makeRef,
        model: modelRef,
        vin: vinRef,
        price: priceRef,
      } as const;
      const target = validation.firstField ? focusMap[validation.firstField as keyof typeof focusMap] : null;
      target?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.current?.focus();
      endVehicleSubmit(submitLock);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    startTransition(async () => {
      try {
        const formData = vehicleFormDataFromValues(
          values,
          saved ? { id: vehicle?.id, status, published } : {},
        );
        const result = saved
          ? await updateVehicle(null, formData)
          : await createVehicle(null, formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (!saved && result.id) {
          setNotice("Vehículo creado correctamente.");
          clearVehicleDraft(window.localStorage);
          setDraftRecovered(false);
          if (localPhotos.length > 0) {
            const upload = await retryLocalUpload(result.id);
            if (upload.failed) {
              router.replace(`/admin/inventario/${result.id}?fotos=pendiente`);
              return;
            }
          }
          router.replace(`/admin/inventario/${result.id}?creado=1`);
          return;
        }
        setNotice(result.success ?? "Guardado.");
        router.refresh();
      } finally {
        setSaving(false);
        endVehicleSubmit(submitLock);
      }
    });
  }

  function applyPublished(next: boolean) {
    if (next) {
      const checks = vehiclePublicationChecks({
        year: Number(values.year),
        make: values.make,
        model: values.model,
        description: values.description,
        price: Number(values.price || 0),
        public_price_mode: values.public_price_mode,
        source_type: values.source_type,
        status,
        photos: vehicle?.vehicle_photos,
      });
      if (!canPublishVehicleListing(checks)) {
        setError("Completa los requisitos de publicación antes de publicar.");
        setConfirm(null);
        return;
      }
    }
    setPublished(next);
    setConfirm(null);
    if (saved && vehicle?.id) {
      void setVehiclePublished(vehicle.id, next).then((result) => {
        if (result.error) {
          setError(result.error);
          setPublished(!next);
        } else {
          setNotice(next ? "Unidad publicada." : "Publicación retirada.");
          router.refresh();
        }
      });
    }
  }

  const auctionOrigin = isAuctionOriginSource(values.source_type);
  const mode = values.public_price_mode ?? defaultPublicPriceMode(values.source_type);
  const showAmount = !auctionOrigin || mode !== "contact";
  const pricePreview = formatCustomerFacingPrice(
    auctionOrigin ? mode : "fixed",
    Number(price || 0) > 0 ? Number(price) : null,
    currency,
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>

      {saved && vehicle ? (
        <header className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
          <div className="flex min-w-0 items-start gap-4">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicleImageAdminPath(cover.storage_path)}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-surface-muted)] text-xs text-[var(--admin-text-muted)]">
                Sin portada
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-2xl">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
                {vehicle.trim || "Sin versión"}
                {vehicle.stock_number ? ` · ${vehicle.stock_number}` : ""}
                {vehicle.vin ? ` · ${vehicle.vin}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminStatusBadge estado={status} />
                <AdminPublishBadge published={published} />
                {featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--admin-brand)]/30 bg-[var(--admin-brand)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--admin-text)]">
                    <Star className="h-3 w-3" /> Destacado
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {vehicle.id ? (
              <a href={`/admin/inventario/${vehicle.id}/vista-previa`} target="_blank" rel="noreferrer">
                <AdminSecondaryButton type="button">Vista previa</AdminSecondaryButton>
              </a>
            ) : null}
            {published ? (
              <AdminSecondaryButton type="button" onClick={() => setConfirm({ type: "unpublish" })}>
                Retirar
              </AdminSecondaryButton>
            ) : (
              <AdminPrimaryButton type="button" onClick={() => setConfirm({ type: "publish" })}>
                Publicar
              </AdminPrimaryButton>
            )}
            <AdminSecondaryButton
              type="button"
              onClick={() => {
                setStatus("reserved");
                if (vehicle.id) void setVehicleStatus(vehicle.id, "reserved").then(() => router.refresh());
              }}
            >
              Reservar
            </AdminSecondaryButton>
            <AdminSecondaryButton type="button" onClick={() => setConfirm({ type: "sold" })}>
              Vendido
            </AdminSecondaryButton>
          </div>
        </header>
      ) : (
        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
            Agregar vehículo
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">
            Completa la ficha y guarda. Se crea como borrador, sin publicar.
          </p>
          {draftRecovered ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-4 py-3 text-sm text-[var(--admin-text-secondary)]">
              <span>Borrador recuperado</span>
              <AdminSecondaryButton
                type="button"
                onClick={() => {
                  clearVehicleDraft(window.localStorage);
                  setValues(emptyVehicleFormValues());
                  setDraftRecovered(false);
                  setNotice(null);
                  setFieldErrors({});
                }}
              >
                Descartar borrador
              </AdminSecondaryButton>
            </div>
          ) : null}
        </header>
      )}

      <AdminError message={error} />
      {notice ? (
        <p
          role="status"
          className="rounded-lg border border-[var(--admin-success)]/15 bg-[var(--admin-success-bg)] px-4 py-3 text-sm text-[var(--admin-success)]"
        >
          {notice}
        </p>
      ) : null}

      <FormSection
        index="01"
        title="Identificación"
        hint="Estos datos aparecen en el catálogo. Año, marca y modelo son obligatorios."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminField label="Año" required error={fieldErrors.year}>
            <AdminInput
              ref={yearRef}
              name="year"
              type="number"
              min={1980}
              max={2100}
              value={values.year}
              onChange={(event) => patchValues({ year: event.target.value })}
            />
          </AdminField>
          <AdminField label="Marca" required error={fieldErrors.make}>
            <AdminInput
              ref={makeRef}
              name="make"
              value={values.make}
              onChange={(event) => patchValues({ make: event.target.value })}
              placeholder="Toyota"
            />
          </AdminField>
          <AdminField label="Modelo" required error={fieldErrors.model}>
            <AdminInput
              ref={modelRef}
              name="model"
              value={values.model}
              onChange={(event) => patchValues({ model: event.target.value })}
              placeholder="RAV4"
            />
          </AdminField>
          <AdminField label="Versión" hint="Ejemplo: XLE, Limited.">
            <AdminInput
              name="trim"
              value={values.trim}
              onChange={(event) => patchValues({ trim: event.target.value })}
              placeholder="XLE"
            />
          </AdminField>
          <AdminField label="VIN" error={fieldErrors.vin}>
            <AdminInput
              ref={vinRef}
              name="vin"
              maxLength={17}
              value={values.vin}
              onChange={(event) => patchValues({ vin: event.target.value.toUpperCase() })}
              className="font-mono uppercase"
              placeholder="Opcional"
            />
          </AdminField>
          <AdminField label="Número de inventario" hint="Identificación interna. Opcional.">
            <AdminInput
              name="stock_number"
              value={values.stock_number}
              onChange={(event) => patchValues({ stock_number: event.target.value })}
              placeholder="VM-001"
            />
          </AdminField>
          <AdminField label="Origen">
            <AdminSelect
              name="source_type"
              value={values.source_type}
              onChange={(event) => {
                const source_type = event.target.value as VehicleFormValues["source_type"];
                patchValues({
                  source_type,
                  public_price_mode: isAuctionOriginSource(source_type)
                    ? isAuctionOriginSource(values.source_type)
                      ? values.public_price_mode
                      : "contact"
                    : "fixed",
                });
              }}
            >
              {VEHICLE_SOURCE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {SOURCE_LABEL[value]}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </div>
      </FormSection>

      <FormSection
        index="02"
        title="Especificaciones"
        hint="Completa lo que conozcas. Ayuda al cliente a comparar unidades."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="sm:col-span-2 xl:col-span-1">
            <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">Kilometraje</p>
            <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_8.5rem] gap-2">
              <AdminInput
                name="mileage"
                type="number"
                min={0}
                value={values.mileage}
                onChange={(event) => patchValues({ mileage: event.target.value })}
                className="mt-0"
              />
              <AdminSelect
                name="mileage_unit"
                value={values.mileage_unit}
                onChange={(event) => patchValues({ mileage_unit: event.target.value === "km" ? "km" : "mi" })}
                className="mt-0"
              >
                <option value="mi">Millas</option>
                <option value="km">Kilómetros</option>
              </AdminSelect>
            </div>
          </div>
          <AdminField label="Color exterior">
            <AdminInput
              name="exterior_color"
              value={values.exterior_color}
              onChange={(event) => patchValues({ exterior_color: event.target.value })}
            />
          </AdminField>
          <AdminField label="Color interior">
            <AdminInput
              name="interior_color"
              value={values.interior_color}
              onChange={(event) => patchValues({ interior_color: event.target.value })}
            />
          </AdminField>
          <AdminField label="Motor">
            <AdminInput
              name="engine"
              value={values.engine}
              onChange={(event) => patchValues({ engine: event.target.value })}
            />
          </AdminField>
          <AdminField label="Transmisión">
            <AdminSelect
              name="transmission"
              value={values.transmission}
              onChange={(event) => patchValues({ transmission: event.target.value })}
            >
              <option value="">Seleccionar</option>
              {withCurrentOption(ADMIN_TRANSMISSION_OPTIONS, values.transmission).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Tracción">
            <AdminSelect
              name="drivetrain"
              value={values.drivetrain}
              onChange={(event) => patchValues({ drivetrain: event.target.value })}
            >
              <option value="">Seleccionar</option>
              {withCurrentOption(ADMIN_DRIVETRAIN_OPTIONS, values.drivetrain).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Combustible">
            <AdminSelect
              name="fuel"
              value={values.fuel}
              onChange={(event) => patchValues({ fuel: event.target.value })}
            >
              <option value="">Seleccionar</option>
              {withCurrentOption(ADMIN_FUEL_OPTIONS, values.fuel).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Condición">
            <AdminSelect
              name="condition"
              value={values.condition}
              onChange={(event) => patchValues({ condition: event.target.value })}
            >
              <option value="">Seleccionar</option>
              {withCurrentOption(ADMIN_CONDITION_OPTIONS, values.condition).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </div>
      </FormSection>

      <FormSection
        id="fotos"
        index="03"
        title="Fotos"
        hint="JPG, PNG o WebP · máximo 8 MB por imagen. La portada es la imagen principal del catálogo."
      >
        <p className="mb-4 text-sm text-[var(--admin-text-secondary)]">
          {saved
            ? "Arrastra para reordenar. La portada aparece primero en el website."
            : "Puedes elegir fotos ahora. Se suben después de crear el vehículo."}
        </p>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-xl border border-dashed px-4 py-10 text-center transition duration-200 ${
            dragOver
              ? "border-[var(--admin-brand)] bg-[var(--admin-brand)]/8"
              : "border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)]"
          }`}
        >
          <ImagePlus className="mx-auto h-7 w-7 text-[var(--admin-text-muted)]" strokeWidth={1.6} />
          <p className="mt-3 text-sm font-medium text-[var(--admin-text)]">Arrastra las fotos aquí</p>
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">JPG, PNG o WebP · máximo 8 MB por imagen</p>
          <AdminSecondaryButton
            type="button"
            className="mt-4"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Subiendo fotos..." : "Seleccionar fotos"}
          </AdminSecondaryButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
        {previewPhotos.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[var(--admin-border)] px-4 py-8 text-center text-sm text-[var(--admin-text-muted)]">
            Todavía no hay fotos. El catálogo se ve mejor con una portada clara.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previewPhotos.map((photo, index) => {
              const savedPhoto = "storage_path" in photo;
              const src = savedPhoto
                ? vehicleImageAdminPath(photo.storage_path)
                : photo.preview;
              const isCover = savedPhoto ? photo.is_cover : photo.isCover;
              return (
                <li
                  key={photo.id}
                  draggable
                  onDragStart={() => {
                    dragIndex.current = index;
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    const from = dragIndex.current;
                    dragIndex.current = null;
                    if (from == null || from === index) return;
                    if (savedPhoto) {
                      void moveSaved(from, index);
                    } else {
                      moveLocal(from, index);
                    }
                  }}
                  className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-44 w-full object-cover" />
                    {isCover ? (
                      <span className="absolute left-2 top-2 rounded-md bg-[var(--admin-nav)] px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white">
                        PORTADA
                      </span>
                    ) : null}
                  </div>
                  <div className="grid gap-2 p-3">
                    <input
                      defaultValue={savedPhoto ? photo.alt_text ?? "" : photo.alt}
                      onChange={(event) => {
                        if (!savedPhoto) {
                          const value = event.target.value;
                          setLocalPhotos((current) =>
                            current.map((item) =>
                              item.id === photo.id ? { ...item, alt: value } : item,
                            ),
                          );
                        }
                      }}
                      onBlur={(event) => {
                        if (savedPhoto && vehicle?.id) {
                          void updateVehiclePhoto({
                            id: photo.id,
                            vehicleId: vehicle.id,
                            alt_text: event.target.value,
                          });
                        }
                      }}
                      placeholder="Descripción de la foto"
                      className="h-10 rounded-lg border border-[var(--admin-border)] px-2 text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`min-h-10 rounded-lg px-3 text-xs font-medium ${
                          isCover
                            ? "bg-[var(--admin-text)] text-white"
                            : "border border-[var(--admin-border)]"
                        }`}
                        onClick={() => {
                          if (savedPhoto && vehicle?.id) {
                            void updateVehiclePhoto({
                              id: photo.id,
                              vehicleId: vehicle.id,
                              is_cover: true,
                            }).then((result) => {
                              if (result.error) {
                                setError(result.error);
                                return;
                              }
                              setNotice("Foto de portada actualizada.");
                              router.refresh();
                            });
                          } else {
                            setLocalPhotos((current) =>
                              current.map((item) => ({ ...item, isCover: item.id === photo.id })),
                            );
                          }
                        }}
                      >
                        {isCover ? "Portada" : "Hacer portada"}
                      </button>
                      <button
                        type="button"
                        className="min-h-10 rounded-lg border border-[var(--admin-danger)]/20 px-3 text-xs text-[var(--admin-danger)]"
                        onClick={() => {
                          if (savedPhoto && vehicle?.id) {
                            setConfirm({ type: "photo", id: photo.id, storagePath: photo.storage_path });
                          } else {
                            setLocalPhotos((current) => current.filter((item) => item.id !== photo.id));
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </FormSection>

      <FormSection
        index="04"
        title="Información pública"
        hint="El precio y la descripción aparecen en la ficha del website."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            {auctionOrigin ? (
              <>
                <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">
                  Precio para el website <span className="text-[var(--admin-brand)]">*</span>
                </p>
                <p className="mt-1 text-xs font-normal text-[var(--admin-text-muted)]">
                  Los valores de la subasta no se copian como precio de Valcron.
                </p>
                <fieldset className="mt-3 grid gap-2">
                  <legend className="sr-only">Modo de precio público</legend>
                  {PUBLIC_PRICE_MODES.map((value) => (
                    <label key={value} className="flex min-h-10 items-center gap-2 text-sm text-[var(--admin-text)]">
                      <input
                        type="radio"
                        name="public_price_mode"
                        value={value}
                        checked={mode === value}
                        onChange={() => patchValues({ public_price_mode: value })}
                      />
                      {PUBLIC_PRICE_MODE_LABELS[value]}
                    </label>
                  ))}
                </fieldset>
              </>
            ) : (
              <>
                <input type="hidden" name="public_price_mode" value="fixed" />
                <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">
                  Precio <span className="text-[var(--admin-brand)]">*</span>
                </p>
                <p className="mt-1 text-xs font-normal text-[var(--admin-text-muted)]">
                  Obligatorio para publicar. Opcional al guardar el borrador.
                </p>
              </>
            )}
            {showAmount ? (
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                <AdminInput
                  ref={priceRef}
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.price}
                  onChange={(event) => patchValues({ price: event.target.value })}
                  className="mt-0"
                  aria-invalid={Boolean(fieldErrors.price)}
                />
                <AdminSelect
                  name="currency"
                  value={values.currency}
                  onChange={(event) => patchValues({ currency: event.target.value === "DOP" ? "DOP" : "USD" })}
                  className="mt-0"
                >
                  <option value="USD">USD</option>
                  <option value="DOP">DOP</option>
                </AdminSelect>
              </div>
            ) : (
              <>
                <input type="hidden" name="price" value="" />
                <input type="hidden" name="currency" value={values.currency} />
              </>
            )}
            {fieldErrors.price ? (
              <p role="alert" className="mt-1.5 text-xs text-[var(--admin-danger)]">
                {fieldErrors.price}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-[var(--admin-text-muted)]">Vista para el cliente</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--admin-text)]">{pricePreview}</p>
          </div>
          <AdminField
            label="Descripción"
            hint={
              values.description.trim().length < 20
                ? "Obligatorio para publicar: al menos 20 caracteres."
                : `${values.description.trim().length} caracteres`
            }
          >
            <AdminTextArea
              name="description"
              value={values.description}
              onChange={(event) => patchValues({ description: event.target.value })}
            />
          </AdminField>
        </div>
      </FormSection>

      <FormSection
        index="05"
        title="Publicación"
        hint={
          saved
            ? "Marca disponible, revisa la vista previa y luego publica. Destacar es independiente."
            : "Se guarda como borrador y no se publica. Después podrás marcar disponible y publicar."
        }
      >
        <PublicationPanel
          vehicle={vehicle}
          year={Number(values.year) || null}
          make={values.make}
          model={values.model}
          vin={values.vin}
          mileage={Number(values.mileage) || null}
          exteriorColor={values.exterior_color}
          status={status}
          published={published}
          featured={featured}
          saved={saved}
          price={Number(price || 0)}
          description={description}
          extraPhotoCount={localPhotos.length}
          sourceType={values.source_type}
          publicPriceMode={values.public_price_mode}
          onFeatured={(next) => {
            patchValues({ featured: next });
            if (saved && vehicle?.id) {
              void setVehicleFeatured(vehicle.id, next).then((result) => {
                if (result.error) {
                  setError(result.error);
                  patchValues({ featured: !next });
                  return;
                }
                setNotice(next ? "Unidad destacada en portada." : "Ya no aparece como destacada.");
                router.refresh();
              });
            }
          }}
          onPublish={() => setConfirm({ type: "publish" })}
          onUnpublish={() => setConfirm({ type: "unpublish" })}
        />
        {saved ? (
          <div className="mt-5">
            {status === "draft" ? (
              <p className="mb-3 text-sm text-[var(--admin-text-secondary)]">
                Siguiente paso: marcar disponible, luego vista previa y publicar en el website.
              </p>
            ) : null}
            <p className="mb-2 text-[13px] font-medium text-[var(--admin-text-secondary)]">Estado de la unidad</p>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_STATUSES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-10 rounded-lg px-3 text-sm font-medium transition duration-200 ${
                    status === value
                      ? "bg-[var(--admin-text)] text-white"
                      : "border border-[var(--admin-border)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
                  }`}
                  onClick={() => {
                    if (value === "sold") {
                      setConfirm({ type: "sold" });
                      return;
                    }
                    setStatus(value);
                    if ((value === "draft" || value === "hidden") && published) {
                      setPublished(false);
                    }
                    if (vehicle?.id) {
                      void setVehicleStatus(vehicle.id, value).then((result) => {
                        if (result.error) {
                          setError(result.error);
                          return;
                        }
                        setNotice(
                          value === "reserved"
                            ? "Unidad marcada como reservada."
                            : value === "available"
                              ? "Unidad marcada como disponible."
                              : value === "hidden"
                                ? "Unidad oculta."
                                : "Estado actualizado.",
                        );
                        router.refresh();
                      });
                    }
                  }}
                >
                  {statusActionLabel(value)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--admin-text-secondary)]">
            El vehículo se creará como borrador y no aparecerá en el website hasta que lo publiques.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <AdminPrimaryButton type="submit" disabled={saving || pending || uploading}>
            {saving || pending ? "Guardando..." : saved ? "Guardar cambios" : "Guardar vehículo"}
          </AdminPrimaryButton>
          {saved && vehicle?.id ? (
            <a href={`/admin/inventario/${vehicle.id}/vista-previa`} target="_blank" rel="noreferrer">
              <AdminSecondaryButton type="button">Vista previa</AdminSecondaryButton>
            </a>
          ) : null}
          {saved && localPhotos.length > 0 ? (
            <AdminSecondaryButton
              type="button"
              onClick={() => {
                void retryLocalUpload(vehicle!.id).then((result) => {
                  if (!result.failed) {
                    setNotice("Fotos subidas.");
                    router.refresh();
                  }
                });
              }}
              disabled={uploading}
            >
              {uploading ? "Subiendo fotos..." : "Reintentar fotos"}
            </AdminSecondaryButton>
          ) : null}
        </div>
        {saved ? (
          <div className="mt-8 border-t border-[var(--admin-border)] pt-4">
            <AdminDangerButton type="button" disabled={saving || pending} onClick={() => setConfirm({ type: "delete" })}>
              Eliminar vehículo
            </AdminDangerButton>
          </div>
        ) : null}
      </FormSection>

      <AdminConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.type === "delete"
            ? "Eliminar vehículo"
            : confirm?.type === "photo"
              ? "Eliminar foto"
              : confirm?.type === "unpublish"
                ? "Retirar del website"
                : confirm?.type === "sold"
                  ? "Marcar como vendido"
                  : "Publicar en el website"
        }
        description={
          confirm?.type === "delete"
            ? `Esto elimina ${vehicle ? vehicleLabel(vehicle) : "el vehículo"} y sus fotos. No se puede deshacer.`
            : confirm?.type === "photo"
              ? "La foto se eliminará de la galería."
              : confirm?.type === "unpublish"
                ? "La unidad dejará de aparecer en el inventario público."
                : confirm?.type === "sold"
                  ? "El vehículo quedará como vendido."
                  : "La unidad será visible en el website si cumple los requisitos."
        }
        confirmLabel={
          confirm?.type === "delete"
            ? "Eliminar"
            : confirm?.type === "photo"
              ? "Eliminar foto"
              : confirm?.type === "unpublish"
                ? "Retirar"
                : confirm?.type === "sold"
                  ? "Marcar vendido"
                  : "Publicar"
        }
        danger={confirm?.type === "delete" || confirm?.type === "photo" || confirm?.type === "unpublish"}
        pending={pending}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.type === "publish") {
            applyPublished(true);
            return;
          }
          if (confirm.type === "unpublish") {
            applyPublished(false);
            return;
          }
          if (confirm.type === "sold") {
            setStatus("sold");
            setConfirm(null);
            if (saved && vehicle?.id) {
              void setVehicleStatus(vehicle.id, "sold").then((result) => {
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setNotice("Unidad marcada como vendida.");
                router.refresh();
              });
            }
            return;
          }
          if (confirm.type === "photo" && vehicle?.id) {
            const payload = confirm;
            setConfirm(null);
            void deleteVehiclePhoto({
              id: payload.id,
              vehicleId: vehicle.id,
              storagePath: payload.storagePath,
            }).then(async (result) => {
              if (result.error) {
                setError(result.error);
                return;
              }
              await removeStoredPhoto(payload.storagePath);
              setNotice("Foto eliminada.");
              router.refresh();
            });
            return;
          }
          if (confirm.type === "delete" && vehicle?.id) {
            startTransition(() => {
              void deleteVehicle(vehicle.id).then((result) => {
                if (result.error) {
                  setError(result.error);
                  setConfirm(null);
                  return;
                }
                router.push("/admin/inventario");
              });
            });
          }
        }}
      />
    </form>
  );
}

function PublicationPanel({
  vehicle,
  year,
  make,
  model,
  vin,
  mileage,
  exteriorColor,
  status,
  published,
  featured,
  saved,
  price,
  description,
  extraPhotoCount,
  sourceType,
  publicPriceMode,
  onFeatured,
  onPublish,
  onUnpublish,
}: {
  vehicle?: VehicleRow | null;
  year?: number | null;
  make?: string;
  model?: string;
  vin?: string;
  mileage?: number | null;
  exteriorColor?: string;
  status: VehicleStatus;
  published: boolean;
  featured: boolean;
  saved: boolean;
  price: number;
  description: string;
  extraPhotoCount: number;
  sourceType: VehicleFormValues["source_type"];
  publicPriceMode: PublicPriceMode;
  onFeatured: (next: boolean) => void;
  onPublish: () => void;
  onUnpublish: () => void;
}) {
  const checks = vehiclePublicationChecks({
    year: year ?? vehicle?.year,
    make: make ?? vehicle?.make,
    model: model ?? vehicle?.model,
    description,
    price,
    public_price_mode: publicPriceMode,
    source_type: sourceType,
    status,
    photos: vehicle?.vehicle_photos,
    extraPhotoCount,
    vin: vin ?? vehicle?.vin,
    mileage: mileage ?? vehicle?.mileage,
    exterior_color: exteriorColor ?? vehicle?.exterior_color,
  });
  const ready = canPublishVehicleListing(checks);

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
            Visibilidad
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-[var(--admin-text)]">
            {published ? "Visible en el website" : ready ? "Lista para publicar" : "Aún no está lista"}
          </p>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            {vehicleStatusLabel(status)} · {featured ? "Destacada en portada" : "No destacada"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {published ? (
            <AdminSecondaryButton type="button" onClick={onUnpublish}>
              Retirar
            </AdminSecondaryButton>
          ) : (
            <AdminPrimaryButton type="button" onClick={onPublish} disabled={!saved}>
              Publicar
            </AdminPrimaryButton>
          )}
        </div>
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
        Obligatorio
      </p>
      <ul className="mt-2 grid gap-2 text-sm">
        {checks.filter((check) => check.required).map((check) => (
          <li key={check.id} className="flex items-center justify-between gap-3">
            <span className={check.ok ? "text-[var(--admin-text)]" : "text-[var(--admin-text-secondary)]"}>
              {check.label}
            </span>
            <span
              className={`text-xs font-medium ${
                check.ok ? "text-[var(--admin-success)]" : "text-[var(--admin-warning)]"
              }`}
            >
              {check.ok ? "Listo" : "Obligatorio"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
        Recomendado
      </p>
      <ul className="mt-2 grid gap-2 text-sm">
        {checks.filter((check) => !check.required).map((check) => (
          <li key={check.id} className="flex items-center justify-between gap-3">
            <span className={check.ok ? "text-[var(--admin-text)]" : "text-[var(--admin-text-secondary)]"}>
              {check.label}
            </span>
            <span className={`text-xs font-medium ${check.ok ? "text-[var(--admin-success)]" : "text-[var(--admin-text-muted)]"}`}>
              {check.ok ? "Listo" : "Recomendado"}
            </span>
          </li>
        ))}
      </ul>
      <label className="mt-5 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4">
        <span className="text-sm text-[var(--admin-text)]">Destacar en portada</span>
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => onFeatured(event.target.checked)}
          className="h-4 w-4 accent-[var(--admin-brand)]"
        />
      </label>
      {!saved ? (
        <p className="mt-3 text-xs text-[var(--admin-text-muted)]">
          Flujo recomendado: guardar vehículo → vista previa → publicar.
        </p>
      ) : (
        <p className="mt-3 text-xs text-[var(--admin-text-muted)]">
          Flujo recomendado: guardar cambios → vista previa → publicar.
        </p>
      )}
    </div>
  );
}
