"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
import { AdminConfirmDialog, AdminModal } from "@/components/admin/AdminModal";
import { AdminMediaPicker } from "@/components/admin/AdminMediaPicker";
import { AdminSearchableSelect } from "@/components/admin/AdminSearchableSelect";
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
  ADMIN_EXTERIOR_COLOR_OPTIONS,
  ADMIN_FUEL_OPTIONS,
  ADMIN_OTHER_SENTINEL,
  ADMIN_TRANSMISSION_OPTIONS,
  withCurrentOption,
} from "@/lib/admin-field-options";
import {
  makeSelectState,
  modelSelectState,
  resolveSmartFieldValue,
  smartFieldState,
} from "@/lib/admin-smart-fields";
import { vehicleLabel } from "@/lib/admin-metrics";
import {
  formatCustomerFacingPrice,
  isAuctionOriginSource,
  PUBLIC_PRICE_MODE_LABELS,
  PUBLIC_PRICE_MODES,
  defaultPublicPriceMode,
} from "@/lib/public-price-mode";
import { MAX_VEHICLE_PHOTOS, validatePhotoFile, vehicleImageAdminPath } from "@/lib/storage";
import { removeStoredPhoto, uploadVehiclePhotos } from "@/lib/vehicle-photos";
import {
  canPublishVehicleListing,
  publicationBlockers,
  vehiclePublicationChecks,
  type PublicationCheck,
} from "@/lib/publication-readiness";
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
  OTHER_MAKE_LABEL,
  OTHER_MAKE_VALUE,
  OTHER_MODEL_LABEL,
  OTHER_MODEL_VALUE,
  VEHICLE_MAKE_OPTIONS,
  makeChangeConflictsWithModel,
  modelRequiresCustomInput,
  modelsForMake,
  yearOptions,
} from "@/lib/vehicle-make-models";
import {
  VEHICLE_SOURCE_TYPES,
  type VehicleRow,
  type VehicleStatus,
} from "@/lib/website-schema";
import { buildVehicleSlug, vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import { vehicleStatusLabel } from "@/lib/vehicles/vehicle-status";

type EditorStep = 0 | 1 | 2 | 3;

type LocalPhoto = {
  id: string;
  file: File;
  preview: string;
  alt: string;
  isCover: boolean;
};

const STEPS = [
  { id: 0 as const, label: "Vehículo", short: "1" },
  { id: 1 as const, label: "Fotos", short: "2" },
  { id: 2 as const, label: "Detalles", short: "3" },
  { id: 3 as const, label: "Publicar", short: "4" },
];

const AVAILABILITY_OPTIONS: { value: VehicleStatus; label: string; hint: string }[] = [
  { value: "available", label: "Disponible", hint: "Listo para venta" },
  { value: "reserved", label: "Reservado", hint: "Con anticipo o apartado" },
  { value: "sold", label: "Vendido", hint: "Ya no está a la venta" },
];

const SOURCE_LABEL: Record<(typeof VEHICLE_SOURCE_TYPES)[number], string> = {
  valcron_stock: "Stock Valcron",
  consignment: "Consignación",
  trade_in: "Trade-in",
  other: "Otro",
};

const CHECK_STEP: Record<string, EditorStep> = {
  identity: 0,
  status: 0,
  price: 0,
  cover: 1,
  description: 2,
};

function newLocalId() {
  return crypto.randomUUID();
}

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminCard>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">{title}</h2>
        {hint ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--admin-text-secondary)]">{hint}</p>
        ) : null}
      </div>
      {children}
    </AdminCard>
  );
}

function initialStepFromSearch(search: URLSearchParams | null): EditorStep {
  if (!search) return 0;
  if (search.get("creado") === "1") return 1;
  const paso = Number(search.get("paso"));
  if (paso >= 0 && paso <= 3) return paso as EditorStep;
  return 0;
}

export function AdminVehicleEditor({ vehicle }: { vehicle?: VehicleRow | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = Boolean(vehicle?.id);
  const [step, setStep] = useState<EditorStep>(() => initialStepFromSearch(searchParams));
  const [values, setValues] = useState<VehicleFormValues>(() =>
    vehicle ? vehicleFormValuesFromRow(vehicle) : emptyVehicleFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<VehicleFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(() =>
    searchParams.get("creado") === "1" ? "Borrador creado. Continúa con fotos y publicación." : null,
  );
  const [draftRecovered, setDraftRecovered] = useState(false);
  const [draftReady, setDraftReady] = useState(saved);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [coverNotice, setCoverNotice] = useState<string | null>(null);
  const photos = vehicle?.vehicle_photos;
  const [published, setPublished] = useState(Boolean(vehicle?.published));
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? "draft");
  const [confirm, setConfirm] = useState<
    | { type: "publish" }
    | { type: "unpublish" }
    | { type: "delete" }
    | { type: "photo"; id: string; storagePath: string }
    | { type: "sold" }
    | { type: "make-change"; nextMake: string }
    | null
  >(null);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [forceOtherYear, setForceOtherYear] = useState(() => {
    const year = vehicle?.year != null ? String(vehicle.year) : "";
    return Boolean(year && !yearOptions().some((option) => String(option) === year));
  });
  const [forceOtherMake, setForceOtherMake] = useState(
    () => makeSelectState(vehicle?.make ?? "").isOther,
  );
  const [forceOtherModel, setForceOtherModel] = useState(
    () => modelSelectState(vehicle?.make ?? "", vehicle?.model ?? "").isOther,
  );
  const [customMake, setCustomMake] = useState(() => makeSelectState(vehicle?.make ?? "").customValue);
  const [customModel, setCustomModel] = useState(() =>
    modelSelectState(vehicle?.make ?? "", vehicle?.model ?? "").customValue,
  );
  const [forceOtherExterior, setForceOtherExterior] = useState(
    () => smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, vehicle?.exterior_color ?? "").isOther,
  );
  const [customExteriorColor, setCustomExteriorColor] = useState(
    () => smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, vehicle?.exterior_color ?? "").customValue,
  );
  const [forceOtherTransmission, setForceOtherTransmission] = useState(
    () => smartFieldState(ADMIN_TRANSMISSION_OPTIONS, vehicle?.transmission ?? "").isOther,
  );
  const [customTransmission, setCustomTransmission] = useState(
    () => smartFieldState(ADMIN_TRANSMISSION_OPTIONS, vehicle?.transmission ?? "").customValue,
  );
  const [forceOtherDrivetrain, setForceOtherDrivetrain] = useState(
    () => smartFieldState(ADMIN_DRIVETRAIN_OPTIONS, vehicle?.drivetrain ?? "").isOther,
  );
  const [customDrivetrain, setCustomDrivetrain] = useState(
    () => smartFieldState(ADMIN_DRIVETRAIN_OPTIONS, vehicle?.drivetrain ?? "").customValue,
  );
  const [forceOtherFuel, setForceOtherFuel] = useState(
    () => smartFieldState(ADMIN_FUEL_OPTIONS, vehicle?.fuel ?? "").isOther,
  );
  const [customFuel, setCustomFuel] = useState(
    () => smartFieldState(ADMIN_FUEL_OPTIONS, vehicle?.fuel ?? "").customValue,
  );
  const submitLock = useRef(false);
  const yearRef = useRef<HTMLButtonElement>(null);
  const makeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const featured = values.featured;
  const price = values.price;
  const currency = values.currency;
  const coverSrc = (() => {
    const savedCover =
      [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order).find((photo) => photo.is_cover) ??
      [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0];
    if (savedCover) return vehicleImageAdminPath(savedCover.storage_path);
    const localCover = localPhotos.find((photo) => photo.isCover) ?? localPhotos[0];
    return localCover?.preview ?? null;
  })();

  const previewPhotos = useMemo(() => {
    const savedPhotos = saved ? [...(photos ?? [])].sort((a, b) => a.sort_order - b.sort_order) : [];
    return saved ? [...savedPhotos, ...localPhotos] : localPhotos;
  }, [localPhotos, photos, saved]);

  const checks = useMemo(
    () =>
      vehiclePublicationChecks({
        year: Number(values.year) || null,
        make: values.make,
        model: values.model,
        description: values.description,
        price: Number(values.price || 0),
        public_price_mode: values.public_price_mode,
        source_type: values.source_type,
        status,
        photos: vehicle?.vehicle_photos,
        extraPhotoCount: localPhotos.length,
        vin: values.vin,
        mileage: Number(values.mileage) || null,
        exterior_color: values.exterior_color,
      }),
    [localPhotos.length, status, values, vehicle?.vehicle_photos],
  );
  const readyToPublish = canPublishVehicleListing(checks);
  const requiredChecks = checks.filter((check) => check.required);
  const requiredDone = requiredChecks.filter((check) => check.ok).length;
  const blockers = publicationBlockers(checks);
  const makeOptions = useMemo(
    () => VEHICLE_MAKE_OPTIONS.map((make) => ({ value: make, label: make })),
    [],
  );
  const makeState = useMemo(() => {
    const derived = makeSelectState(values.make);
    if (forceOtherMake) {
      return { selectValue: OTHER_MAKE_VALUE, customValue: customMake || derived.customValue, isOther: true };
    }
    return derived;
  }, [customMake, forceOtherMake, values.make]);
  const modelState = useMemo(() => {
    const derived = modelSelectState(values.make, values.model);
    if (forceOtherModel) {
      return { selectValue: OTHER_MODEL_VALUE, customValue: customModel || derived.customValue, isOther: true };
    }
    return derived;
  }, [customModel, forceOtherModel, values.make, values.model]);
  const modelOptions = useMemo(() => {
    const base = modelsForMake(values.make).map((model) => ({ value: model, label: model }));
    const current = values.model.trim();
    if (current && !modelState.isOther && !base.some((option) => option.value === current)) {
      return [{ value: current, label: current }, ...base];
    }
    return base;
  }, [modelState.isOther, values.make, values.model]);
  const exteriorColorState = useMemo(() => {
    const derived = smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, values.exterior_color);
    if (forceOtherExterior) {
      return {
        selectValue: ADMIN_OTHER_SENTINEL,
        customValue: customExteriorColor || derived.customValue,
        isOther: true,
      };
    }
    return derived;
  }, [customExteriorColor, forceOtherExterior, values.exterior_color]);
  const transmissionState = useMemo(() => {
    const derived = smartFieldState(ADMIN_TRANSMISSION_OPTIONS, values.transmission);
    if (forceOtherTransmission) {
      return {
        selectValue: ADMIN_OTHER_SENTINEL,
        customValue: customTransmission || derived.customValue,
        isOther: true,
      };
    }
    return derived;
  }, [customTransmission, forceOtherTransmission, values.transmission]);
  const drivetrainState = useMemo(() => {
    const derived = smartFieldState(ADMIN_DRIVETRAIN_OPTIONS, values.drivetrain);
    if (forceOtherDrivetrain) {
      return {
        selectValue: ADMIN_OTHER_SENTINEL,
        customValue: customDrivetrain || derived.customValue,
        isOther: true,
      };
    }
    return derived;
  }, [customDrivetrain, forceOtherDrivetrain, values.drivetrain]);
  const fuelState = useMemo(() => {
    const derived = smartFieldState(ADMIN_FUEL_OPTIONS, values.fuel);
    if (forceOtherFuel) {
      return { selectValue: ADMIN_OTHER_SENTINEL, customValue: customFuel || derived.customValue, isOther: true };
    }
    return derived;
  }, [customFuel, forceOtherFuel, values.fuel]);

  function patchValues(patch: Partial<VehicleFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
    setDirty(true);
  }

  function syncCustomFieldsFromValues(next: VehicleFormValues) {
    const nextMake = makeSelectState(next.make);
    const nextModel = modelSelectState(next.make, next.model);
    const nextColor = smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, next.exterior_color);
    const nextTransmission = smartFieldState(ADMIN_TRANSMISSION_OPTIONS, next.transmission);
    const nextDrivetrain = smartFieldState(ADMIN_DRIVETRAIN_OPTIONS, next.drivetrain);
    const nextFuel = smartFieldState(ADMIN_FUEL_OPTIONS, next.fuel);
    setForceOtherYear(Boolean(next.year && !yearOptions().some((year) => String(year) === next.year)));
    setForceOtherMake(nextMake.isOther);
    setCustomMake(nextMake.customValue);
    setForceOtherModel(nextModel.isOther);
    setCustomModel(nextModel.customValue);
    setForceOtherExterior(nextColor.isOther);
    setCustomExteriorColor(nextColor.customValue);
    setForceOtherTransmission(nextTransmission.isOther);
    setCustomTransmission(nextTransmission.customValue);
    setForceOtherDrivetrain(nextDrivetrain.isOther);
    setCustomDrivetrain(nextDrivetrain.customValue);
    setForceOtherFuel(nextFuel.isOther);
    setCustomFuel(nextFuel.customValue);
  }

  function requestMakeChange(nextSelect: string) {
    if (!nextSelect) {
      setForceOtherMake(false);
      setCustomMake("");
      patchValues({ make: "" });
      return;
    }
    if (nextSelect === OTHER_MAKE_VALUE) {
      setForceOtherMake(true);
      patchValues({ make: customMake });
      return;
    }
    if (makeChangeConflictsWithModel(values.make, nextSelect, values.model)) {
      setConfirm({ type: "make-change", nextMake: nextSelect });
      return;
    }
    setForceOtherMake(false);
    setCustomMake("");
    const keepAsCustom = modelRequiresCustomInput(nextSelect, values.model);
    setForceOtherModel(keepAsCustom);
    setCustomModel(keepAsCustom ? values.model : "");
    patchValues({ make: nextSelect });
  }

  function commitMakeChange(nextMake: string, clearModel: boolean) {
    setForceOtherMake(false);
    setCustomMake("");
    if (clearModel) {
      setForceOtherModel(false);
      setCustomModel("");
      patchValues({ make: nextMake, model: "" });
      return;
    }
    setForceOtherModel(true);
    setCustomModel(values.model);
    patchValues({ make: nextMake });
  }

  function goToCheck(check: PublicationCheck) {
    const target = CHECK_STEP[check.id] ?? 0;
    setStep(target);
    window.setTimeout(() => {
      if (check.id === "identity") {
        yearRef.current?.focus();
        makeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (check.id === "price") priceRef.current?.focus();
      if (check.id === "description") descriptionRef.current?.focus();
      if (check.id === "cover") {
        document.getElementById("admin-vehicle-media-picker")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      if (check.id === "status") {
        document.getElementById("availability-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
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
        syncCustomFieldsFromValues(draft);
        setDraftRecovered(true);
        setNotice("Borrador recuperado en este dispositivo.");
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
      setNotice("Hay fotos pendientes de subir. Reinténtalas desde el paso Fotos.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [vehicle?.id]);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty && localPhotos.length === 0) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, localPhotos.length]);

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const invalid = incoming
      .map((file) => ({ file, error: validatePhotoFile(file) }))
      .find((item) => item.error);
    if (invalid?.error) {
      setError(
        `${invalid.file.name}: ${invalid.error} Si la foto viene de un iPhone en HEIC, ábrela en Fotos y expórtala como JPG.`,
      );
      return;
    }

    const room = MAX_VEHICLE_PHOTOS - (photos ?? []).length - localPhotos.length;
    const selected = incoming.slice(0, Math.max(room, 0));
    if (selected.length === 0) {
      setError(`Máximo ${MAX_VEHICLE_PHOTOS} fotos.`);
      return;
    }
    if (selected.length < incoming.length) {
      setNotice(`Se agregaron ${selected.length} de ${incoming.length} fotos (límite ${MAX_VEHICLE_PHOTOS}).`);
    }

    if (saved) {
      void uploadExisting(selected);
      return;
    }

    setLocalPhotos((current) => {
      const firstUpload = current.length === 0;
      const next = [
        ...current,
        ...selected.map((file, index) => ({
          id: newLocalId(),
          file,
          preview: URL.createObjectURL(file),
          alt: "",
          isCover: firstUpload && index === 0,
        })),
      ];
      if (!next.some((photo) => photo.isCover) && next[0]) {
        next[0].isCover = true;
      }
      return next;
    });
    setDirty(true);
    if (localPhotos.length === 0) {
      setCoverNotice("La primera foto se designó como portada. Puedes cambiarla en cualquier momento.");
    }
  }

  async function uploadExisting(files: File[]) {
    if (!vehicle?.id) return;
    setUploading(true);
    setError(null);
    const hadPhotos = (photos ?? []).length > 0;
    const result = await uploadVehiclePhotos(files, {
      vehicleId: vehicle.id,
      currentCount: (photos ?? []).length,
    });
    if (result.paths.length > 0) {
      const attached = await attachVehiclePhotos({
        vehicleId: vehicle.id,
        paths: result.paths,
        coverPath: !hadPhotos ? result.paths[0] : undefined,
      });
      if (attached.error) {
        setError(attached.error);
      } else {
        setNotice(
          result.paths.length === 1 ? "Foto subida correctamente." : `${result.paths.length} fotos subidas.`,
        );
        if (!hadPhotos) {
          setCoverNotice("La primera foto se designó como portada.");
        }
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
        altTexts: Object.fromEntries(result.paths.map((path, index) => [path, uploaded[index]?.alt ?? ""])),
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
    setDirty(true);
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

  function applyAvailability(next: VehicleStatus) {
    if (next === "sold") {
      setConfirm({ type: "sold" });
      return;
    }
    setStatus(next);
    setDirty(true);
    if ((next === "draft" || next === "hidden") && published) {
      setPublished(false);
    }
    if (vehicle?.id) {
      void setVehicleStatus(vehicle.id, next).then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        setNotice(`Disponibilidad: ${vehicleStatusLabel(next)}.`);
        router.refresh();
      });
    }
  }

  function saveDraft(options?: { advance?: boolean; afterSave?: (id?: string) => void }) {
    if (saving || uploading || publishing || !beginVehicleSubmit(submitLock)) {
      return;
    }
    setError(null);
    setPublicLink(null);
    const validation = validateVehicleFormValues(values);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.fieldErrors._form ?? "Completa año, marca y modelo para guardar.");
      setStep(0);
      window.setTimeout(() => {
        if (validation.firstField === "year") yearRef.current?.focus();
        if (validation.firstField === "make") makeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (validation.firstField === "model") modelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (validation.firstField === "vin") vinRef.current?.focus();
        if (validation.firstField === "price") priceRef.current?.focus();
      }, 50);
      endVehicleSubmit(submitLock);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    startTransition(async () => {
      try {
        const formData = vehicleFormDataFromValues(
          values,
          saved ? { id: vehicle?.id, status, published } : { status, published: false },
        );
        const result = saved ? await updateVehicle(null, formData) : await createVehicle(null, formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        setDirty(false);
        if (!saved && result.id) {
          setNotice("Borrador guardado correctamente");
          clearVehicleDraft(window.localStorage);
          setDraftRecovered(false);
          if (localPhotos.length > 0) {
            const upload = await retryLocalUpload(result.id);
            if (upload.failed) {
              router.replace(`/admin/inventario/${result.id}?fotos=pendiente`);
              return;
            }
          }
          if (options?.afterSave) {
            options.afterSave(result.id);
            return;
          }
          const nextPath = options?.advance
            ? `/admin/inventario/${result.id}?paso=${Math.min(step + 1, 3)}`
            : `/admin/inventario/${result.id}?creado=1`;
          router.replace(nextPath);
          return;
        }
        setNotice("Borrador guardado correctamente");
        if (options?.afterSave) {
          options.afterSave(vehicle?.id);
          return;
        }
        if (options?.advance && step < 3) {
          setStep((current) => (Math.min(current + 1, 3) as EditorStep));
        }
        router.refresh();
      } finally {
        setSaving(false);
        endVehicleSubmit(submitLock);
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDraft();
  }

  function continueStep() {
    if (step < 3) {
      if (!saved && step === 0) {
        saveDraft({ advance: true });
        return;
      }
      setStep((current) => (Math.min(current + 1, 3) as EditorStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    saveDraft();
  }

  function buildPublicHref(id: string) {
    return vehiclePath(
      buildVehicleSlug({
        id,
        year: Number(values.year) || vehicle?.year || 0,
        make: values.make || vehicle?.make || "",
        model: values.model || vehicle?.model || "",
        trim: values.trim || vehicle?.trim,
      }),
    );
  }

  function runPublish(vehicleId: string, next: boolean) {
    setPublishing(true);
    setError(null);
    void setVehiclePublished(vehicleId, next).then((result) => {
      setPublishing(false);
      if (result.error) {
        setError(result.error);
        setPublicLink(null);
        return;
      }
      setPublished(next);
      if (next) {
        const href = buildPublicHref(vehicleId);
        setPublicLink(href);
        setNotice("Publicado correctamente. Ya puede aparecer en el website.");
      } else {
        setPublicLink(null);
        setNotice("Publicación retirada.");
      }
      router.refresh();
    });
  }

  function applyPublished(next: boolean) {
    setConfirm(null);
    if (next) {
      if (!canPublishVehicleListing(checks)) {
        setError(`Falta completar: ${blockers.join(", ")}.`);
        setStep(3);
        return;
      }
      if (!saved || !vehicle?.id) {
        saveDraft({
          afterSave: (id) => {
            if (!id) {
              setError("No se pudo guardar antes de publicar.");
              return;
            }
            runPublish(id, true);
            router.replace(`/admin/inventario/${id}?paso=3`);
          },
        });
        return;
      }
      if (dirty) {
        saveDraft({
          afterSave: (id) => {
            if (!id) {
              setError("No se pudo guardar antes de publicar.");
              return;
            }
            runPublish(id, true);
          },
        });
        return;
      }
      runPublish(vehicle.id, true);
      return;
    }
    if (!saved || !vehicle?.id) return;
    runPublish(vehicle.id, false);
  }

  const auctionOrigin = isAuctionOriginSource(values.source_type);
  const mode = values.public_price_mode ?? defaultPublicPriceMode(values.source_type);
  const showAmount = !auctionOrigin || mode !== "contact";
  const pricePreview = formatCustomerFacingPrice(
    auctionOrigin ? mode : "fixed",
    Number(price || 0) > 0 ? Number(price) : null,
    currency,
  );
  const busy = saving || pending || uploading || publishing;
  const previewHref = vehicle?.id ? `/admin/inventario/${vehicle.id}/vista-previa` : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative grid gap-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-6"
      noValidate
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-2xl">
            {saved && vehicle
              ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
              : "Agregar vehículo"}
          </h1>
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            {saved
              ? "Completa los pasos y publica cuando esté listo."
              : "Guía en 4 pasos. Puedes guardar borrador en cualquier momento."}
          </p>
          {saved ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminStatusBadge estado={status} />
              <AdminPublishBadge published={published} />
              {featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--admin-brand)]/30 bg-[var(--admin-brand)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--admin-text)]">
                  <Star className="h-3 w-3" /> Destacado
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        {saved && published && vehicle?.id ? (
          <a
            href={vehiclePath(
              buildVehicleSlug({
                id: vehicle.id,
                year: vehicle.year ?? (Number(values.year) || 0),
                make: vehicle.make ?? values.make,
                model: vehicle.model ?? values.model,
                trim: vehicle.trim,
              }),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-semibold text-[var(--admin-brand)] underline-offset-4 hover:underline sm:inline"
          >
            Ver en website
          </a>
        ) : null}
      </header>

      {draftRecovered ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-4 py-3 text-sm text-[var(--admin-text-secondary)]">
          <span>Borrador recuperado en este dispositivo</span>
          <AdminSecondaryButton
            type="button"
            onClick={() => {
              clearVehicleDraft(window.localStorage);
              const empty = emptyVehicleFormValues();
              setValues(empty);
              syncCustomFieldsFromValues(empty);
              setForceOtherYear(false);
              setDraftRecovered(false);
              setNotice(null);
              setPublicLink(null);
              setFieldErrors({});
              setDirty(false);
            }}
          >
            Descartar borrador
          </AdminSecondaryButton>
        </div>
      ) : null}

      <AdminError message={error} />
      {notice ? (
        <div
          role="status"
          className="rounded-lg border border-[var(--admin-success)]/15 bg-[var(--admin-success-bg)] px-4 py-3 text-sm text-[var(--admin-success)]"
        >
          <p>{notice}</p>
          {publicLink ? (
            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex font-semibold underline-offset-2 hover:underline"
            >
              Ver página pública del vehículo
            </a>
          ) : null}
        </div>
      ) : null}

      <nav aria-label="Pasos del vehículo" className="grid grid-cols-4 gap-2">
        {STEPS.map((item) => {
          const active = step === item.id;
          const done = step > item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`rounded-xl border px-2 py-3 text-center transition ${
                active
                  ? "border-[var(--admin-text)] bg-[var(--admin-text)] text-white"
                  : done
                    ? "border-[var(--admin-success)]/30 bg-[var(--admin-success-bg)] text-[var(--admin-success)]"
                    : "border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)]"
              }`}
            >
              <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]">
                {done && !active ? <Check className="mx-auto h-3.5 w-3.5" /> : item.short}
              </span>
              <span className="mt-1 block text-[11px] font-medium sm:text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <CompactReadiness
        requiredDone={requiredDone}
        requiredTotal={requiredChecks.length}
        checks={requiredChecks}
        onSelect={goToCheck}
      />

      {step === 0 ? (
        <FormSection title="Información del vehículo" hint="Datos básicos para identificar la unidad.">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Año" required error={fieldErrors.year}>
              <AdminSearchableSelect
                name="year"
                value={
                  forceOtherYear ||
                  (values.year && !yearOptions().some((year) => String(year) === values.year))
                    ? ADMIN_OTHER_SENTINEL
                    : values.year
                }
                options={yearOptions().map((year) => ({ value: String(year), label: String(year) }))}
                emptyLabel="Seleccionar año"
                placeholder="Buscar año…"
                inputMode="numeric"
                allowCustom
                otherValue={ADMIN_OTHER_SENTINEL}
                otherLabel="Otro año"
                customValue={
                  forceOtherYear ||
                  (values.year && !yearOptions().some((year) => String(year) === values.year))
                    ? values.year
                    : ""
                }
                onValueChange={(next) => {
                  if (!next) {
                    setForceOtherYear(false);
                    patchValues({ year: "" });
                    return;
                  }
                  if (next === ADMIN_OTHER_SENTINEL) {
                    setForceOtherYear(true);
                    return;
                  }
                  setForceOtherYear(false);
                  patchValues({ year: next });
                }}
                onCustomChange={(next) => {
                  setForceOtherYear(true);
                  patchValues({ year: next.replace(/[^\d]/g, "").slice(0, 4) });
                }}
                aria-label="Año"
              />
              <button ref={yearRef} type="button" tabIndex={-1} className="sr-only" aria-hidden>
                Año
              </button>
            </AdminField>
            <AdminField label="Marca" required error={fieldErrors.make}>
              <div ref={makeRef}>
                <AdminSearchableSelect
                  name="make"
                  value={makeState.selectValue}
                  options={makeOptions}
                  emptyLabel="Seleccionar marca"
                  placeholder="Buscar marca…"
                  allowCustom
                  otherValue={OTHER_MAKE_VALUE}
                  otherLabel={OTHER_MAKE_LABEL}
                  customValue={customMake}
                  onValueChange={requestMakeChange}
                  onCustomChange={(next) => {
                    setForceOtherMake(true);
                    setCustomMake(next);
                    patchValues({ make: next });
                  }}
                  aria-label="Marca"
                />
              </div>
            </AdminField>
            <AdminField label="Modelo" required error={fieldErrors.model}>
              <div ref={modelRef}>
                <AdminSearchableSelect
                  name="model"
                  value={modelState.selectValue}
                  options={modelOptions}
                  emptyLabel="Seleccionar modelo"
                  placeholder="Buscar modelo…"
                  allowCustom
                  otherValue={OTHER_MODEL_VALUE}
                  otherLabel={OTHER_MODEL_LABEL}
                  customValue={customModel}
                  onValueChange={(next) => {
                    if (!next) {
                      setForceOtherModel(false);
                      setCustomModel("");
                      patchValues({ model: "" });
                      return;
                    }
                    if (next === OTHER_MODEL_VALUE) {
                      setForceOtherModel(true);
                      patchValues({ model: customModel });
                      return;
                    }
                    setForceOtherModel(false);
                    setCustomModel("");
                    patchValues({ model: next });
                  }}
                  onCustomChange={(next) => {
                    setForceOtherModel(true);
                    setCustomModel(next);
                    patchValues({ model: next });
                  }}
                  aria-label="Modelo"
                />
              </div>
            </AdminField>
            <AdminField label="Versión / Trim">
              <AdminInput
                name="trim"
                value={values.trim}
                onChange={(event) => patchValues({ trim: event.target.value })}
                placeholder="SX Prestige"
              />
            </AdminField>
            <AdminField label="VIN" hint="17 caracteres. Opcional." error={fieldErrors.vin}>
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
            <div>
              <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">Kilometraje</p>
              <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                <AdminInput
                  name="mileage"
                  type="number"
                  min={0}
                  inputMode="numeric"
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
                  <option value="km">Km</option>
                </AdminSelect>
              </div>
            </div>
            <div className="sm:col-span-2">
              {auctionOrigin ? (
                <>
                  <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">
                    Precio público <span className="text-[var(--admin-brand)]">*</span>
                  </p>
                  <fieldset className="mt-2 grid gap-2 sm:grid-cols-2">
                    <legend className="sr-only">Modo de precio público</legend>
                    {PUBLIC_PRICE_MODES.map((value) => (
                      <label
                        key={value}
                        className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-sm"
                      >
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
                <input type="hidden" name="public_price_mode" value="fixed" />
              )}
              {showAmount ? (
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                  <AdminField label="Precio" required={false} error={fieldErrors.price}>
                    <AdminInput
                      ref={priceRef}
                      name="price"
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={values.price}
                      onChange={(event) => patchValues({ price: event.target.value })}
                      className="mt-0"
                    />
                  </AdminField>
                  <AdminField label="Moneda">
                    <AdminSelect
                      name="currency"
                      value={values.currency}
                      onChange={(event) =>
                        patchValues({ currency: event.target.value === "DOP" ? "DOP" : "USD" })
                      }
                      className="mt-0"
                    >
                      <option value="USD">USD</option>
                      <option value="DOP">DOP</option>
                    </AdminSelect>
                  </AdminField>
                </div>
              ) : (
                <>
                  <input type="hidden" name="price" value="" />
                  <input type="hidden" name="currency" value={values.currency} />
                </>
              )}
              <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
                Vista cliente: <span className="font-semibold text-[var(--admin-text)]">{pricePreview}</span>
              </p>
            </div>
          </div>

          <div id="availability-selector" className="mt-6">
            <p className="text-[13px] font-medium text-[var(--admin-text-secondary)]">
              Disponibilidad <span className="text-[var(--admin-brand)]">*</span>
            </p>
            <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
              Obligatorio para publicar. Un borrador no aparece en el website.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {AVAILABILITY_OPTIONS.map((option) => {
                const active = status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => applyAvailability(option.value)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-[var(--admin-text)] bg-[var(--admin-text)] text-white"
                        : "border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] hover:bg-[var(--admin-surface-muted)]"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className={`mt-0.5 block text-xs ${active ? "text-white/70" : "text-[var(--admin-text-muted)]"}`}>
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
            {status === "draft" || status === "hidden" ? (
              <p className="mt-2 text-xs text-[var(--admin-warning)]">
                Estado actual: {vehicleStatusLabel(status)}. Elige Disponible, Reservado o Vendido para poder publicar.
              </p>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <AdminField label="Número de inventario">
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
      ) : null}

      {step === 1 ? (
        <FormSection
          title="Fotos"
          hint="Elige galería, archivos o cámara. La portada es obligatoria para publicar."
        >
          {coverNotice ? (
            <div className="mb-4 rounded-lg border border-[var(--admin-brand)]/20 bg-[var(--admin-brand)]/8 px-4 py-3 text-sm text-[var(--admin-text)]">
              {coverNotice}
            </div>
          ) : null}
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-xl border border-dashed px-4 py-5 transition sm:py-6 ${
              dragOver
                ? "border-[var(--admin-brand)] bg-[var(--admin-brand)]/8"
                : "border-[var(--admin-border-strong)] bg-[var(--admin-surface-muted)]"
            }`}
          >
            <p className="mb-4 text-center text-sm font-medium text-[var(--admin-text)]">
              {saved
                ? "Agrega fotos desde tu galería, archivos o cámara"
                : "Puedes elegir fotos ahora; se suben al guardar el borrador"}
            </p>
            <AdminMediaPicker
              id="admin-vehicle-media-picker"
              onFiles={addFiles}
              uploading={uploading}
              disabled={saving || pending || publishing}
            />
          </div>

          {previewPhotos.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[var(--admin-border)] px-4 py-8 text-center text-sm text-[var(--admin-text-muted)]">
              Todavía no hay fotos. Agrega al menos una para la portada.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {previewPhotos.map((photo, index) => {
                const savedPhoto = "storage_path" in photo;
                const src = savedPhoto ? vehicleImageAdminPath(photo.storage_path) : photo.preview;
                const isCover = savedPhoto ? Boolean(photo.is_cover) : photo.isCover;
                return (
                  <li
                    key={photo.id}
                    className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]"
                  >
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${values.year} ${values.make} ${values.model} · Foto ${index + 1}`} className="h-44 w-full object-cover" />
                      {isCover ? (
                        <span className="absolute left-2 top-2 rounded-md bg-[var(--admin-text)] px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white">
                          PORTADA
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2 p-3">
                      <button
                        type="button"
                        className={`min-h-11 flex-1 rounded-lg px-3 text-xs font-semibold ${
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
                              setCoverNotice("Portada actualizada.");
                              setNotice("Foto de portada actualizada.");
                              router.refresh();
                            });
                          } else {
                            setLocalPhotos((current) =>
                              current.map((item) => ({ ...item, isCover: item.id === photo.id })),
                            );
                            setCoverNotice("Portada seleccionada.");
                            setDirty(true);
                          }
                        }}
                      >
                        {isCover ? "Portada actual" : "Usar como portada"}
                      </button>
                      <button
                        type="button"
                        className="min-h-11 rounded-lg border border-[var(--admin-danger)]/20 px-3 text-xs text-[var(--admin-danger)]"
                        onClick={() => {
                          if (savedPhoto && vehicle?.id) {
                            setConfirm({ type: "photo", id: photo.id, storagePath: photo.storage_path });
                          } else {
                            setLocalPhotos((current) => current.filter((item) => item.id !== photo.id));
                            setDirty(true);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                      {savedPhoto ? (
                        <button
                          type="button"
                          className="min-h-11 rounded-lg border border-[var(--admin-border)] px-3 text-xs"
                          disabled={index === 0}
                          onClick={() => void moveSaved(index, Math.max(0, index - 1))}
                        >
                          Subir
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="min-h-11 rounded-lg border border-[var(--admin-border)] px-3 text-xs"
                          disabled={index === 0}
                          onClick={() => moveLocal(index, Math.max(0, index - 1))}
                        >
                          Subir
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {saved && localPhotos.length > 0 ? (
            <AdminSecondaryButton
              type="button"
              className="mt-4"
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
              {uploading ? "Subiendo fotos..." : "Reintentar fotos pendientes"}
            </AdminSecondaryButton>
          ) : null}
        </FormSection>
      ) : null}

      {step === 2 ? (
        <FormSection title="Detalles" hint="Descripción y especificaciones para la ficha pública.">
          <AdminField
            label="Descripción"
            required
            hint={
              values.description.trim().length < 20
                ? "Mínimo 20 caracteres para publicar."
                : `${values.description.trim().length} caracteres`
            }
          >
            <AdminTextArea
              ref={descriptionRef}
              name="description"
              value={values.description}
              onChange={(event) => patchValues({ description: event.target.value })}
              placeholder="Describe la unidad, estado y puntos clave para el cliente."
            />
          </AdminField>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="Color exterior">
              <AdminSearchableSelect
                name="exterior_color"
                value={exteriorColorState.selectValue}
                options={ADMIN_EXTERIOR_COLOR_OPTIONS.filter((option) => option.value !== "Otro")}
                emptyLabel="Seleccionar color"
                placeholder="Buscar color…"
                allowCustom
                otherValue={ADMIN_OTHER_SENTINEL}
                otherLabel="Otro"
                customValue={customExteriorColor}
                onValueChange={(next) => {
                  if (!next) {
                    setForceOtherExterior(false);
                    setCustomExteriorColor("");
                    patchValues({ exterior_color: "" });
                    return;
                  }
                  if (next === ADMIN_OTHER_SENTINEL) {
                    setForceOtherExterior(true);
                    patchValues({ exterior_color: customExteriorColor });
                    return;
                  }
                  setForceOtherExterior(false);
                  setCustomExteriorColor("");
                  patchValues({ exterior_color: next });
                }}
                onCustomChange={(next) => {
                  setForceOtherExterior(true);
                  setCustomExteriorColor(next);
                  patchValues({ exterior_color: next });
                }}
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
              <AdminSearchableSelect
                name="transmission"
                value={transmissionState.selectValue}
                options={ADMIN_TRANSMISSION_OPTIONS.filter((option) => option.value !== "Otra")}
                emptyLabel="Seleccionar"
                placeholder="Buscar transmisión…"
                allowCustom
                otherValue={ADMIN_OTHER_SENTINEL}
                otherLabel="Otra"
                customValue={customTransmission}
                onValueChange={(next) => {
                  if (!next) {
                    setForceOtherTransmission(false);
                    setCustomTransmission("");
                    patchValues({ transmission: "" });
                    return;
                  }
                  if (next === ADMIN_OTHER_SENTINEL) {
                    setForceOtherTransmission(true);
                    patchValues({ transmission: customTransmission });
                    return;
                  }
                  setForceOtherTransmission(false);
                  setCustomTransmission("");
                  patchValues({ transmission: next });
                }}
                onCustomChange={(next) => {
                  setForceOtherTransmission(true);
                  setCustomTransmission(next);
                  patchValues({ transmission: resolveSmartFieldValue(ADMIN_OTHER_SENTINEL, next, ADMIN_OTHER_SENTINEL, "Otra") });
                }}
              />
            </AdminField>
            <AdminField label="Tracción">
              <AdminSearchableSelect
                name="drivetrain"
                value={drivetrainState.selectValue}
                options={ADMIN_DRIVETRAIN_OPTIONS.filter((option) => option.value !== "Otro")}
                emptyLabel="Seleccionar"
                placeholder="Buscar tracción…"
                allowCustom
                otherValue={ADMIN_OTHER_SENTINEL}
                otherLabel="Otro"
                customValue={customDrivetrain}
                onValueChange={(next) => {
                  if (!next) {
                    setForceOtherDrivetrain(false);
                    setCustomDrivetrain("");
                    patchValues({ drivetrain: "" });
                    return;
                  }
                  if (next === ADMIN_OTHER_SENTINEL) {
                    setForceOtherDrivetrain(true);
                    patchValues({ drivetrain: customDrivetrain });
                    return;
                  }
                  setForceOtherDrivetrain(false);
                  setCustomDrivetrain("");
                  patchValues({ drivetrain: next });
                }}
                onCustomChange={(next) => {
                  setForceOtherDrivetrain(true);
                  setCustomDrivetrain(next);
                  patchValues({ drivetrain: next });
                }}
              />
            </AdminField>
            <AdminField label="Combustible">
              <AdminSearchableSelect
                name="fuel"
                value={fuelState.selectValue}
                options={ADMIN_FUEL_OPTIONS.filter((option) => option.value !== "Otro")}
                emptyLabel="Seleccionar"
                placeholder="Buscar combustible…"
                allowCustom
                otherValue={ADMIN_OTHER_SENTINEL}
                otherLabel="Otro"
                customValue={customFuel}
                onValueChange={(next) => {
                  if (!next) {
                    setForceOtherFuel(false);
                    setCustomFuel("");
                    patchValues({ fuel: "" });
                    return;
                  }
                  if (next === ADMIN_OTHER_SENTINEL) {
                    setForceOtherFuel(true);
                    patchValues({ fuel: customFuel });
                    return;
                  }
                  setForceOtherFuel(false);
                  setCustomFuel("");
                  patchValues({ fuel: next });
                }}
                onCustomChange={(next) => {
                  setForceOtherFuel(true);
                  setCustomFuel(next);
                  patchValues({ fuel: next });
                }}
              />
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
      ) : null}

      {step === 3 ? (
        <FormSection title="Revisar y publicar" hint="Confirma la ficha antes de hacerla visible.">
          <div className="grid gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
            {coverSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverSrc} alt="" className="h-28 w-full rounded-lg object-cover sm:h-24" />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-lg bg-[var(--admin-surface-muted)] text-xs text-[var(--admin-text-muted)] sm:h-24">
                Sin portada
              </div>
            )}
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-[var(--admin-text)]">
                {values.year || "—"} {values.make || "—"} {values.model || "—"}
              </p>
              <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
                {values.trim || "Sin versión"} · {vehicleStatusLabel(status)} · {pricePreview}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--admin-text-muted)]">
                {values.description.trim() || "Sin descripción todavía."}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Destacar en portada
            </p>
            <label className="mt-3 flex min-h-12 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => {
                  const next = event.target.checked;
                  patchValues({ featured: next });
                  if (saved && vehicle?.id) {
                    void setVehicleFeatured(vehicle.id, next).then((result) => {
                      if (result.error) {
                        setError(result.error);
                        patchValues({ featured: !next });
                        return;
                      }
                      setNotice(next ? "Marcado para destacar en Home (solo si está publicado)." : "Ya no está destacado.");
                      router.refresh();
                    });
                  }
                }}
                className="mt-1 h-4 w-4 accent-[var(--admin-brand)]"
              />
              <span className="text-sm leading-5 text-[var(--admin-text)]">
                Destacar en la página de inicio
                <span className="mt-1 block text-xs text-[var(--admin-text-muted)]">
                  No publica el vehículo. Solo resalta unidades ya publicadas en Home.
                </span>
              </span>
            </label>
          </div>

          {!readyToPublish ? (
            <div className="mt-4 rounded-xl border border-[var(--admin-warning)]/25 bg-[var(--admin-warning)]/8 px-4 py-3 text-sm text-[var(--admin-text)]">
              <p className="font-semibold">Aún no se puede publicar</p>
              <ul className="mt-2 grid gap-1.5">
                {requiredChecks
                  .filter((check) => !check.ok)
                  .map((check) => (
                    <li key={check.id}>
                      <button
                        type="button"
                        className="text-left font-medium text-[var(--admin-brand)] underline-offset-2 hover:underline"
                        onClick={() => goToCheck(check)}
                      >
                        {check.label}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-[var(--admin-success)]/20 bg-[var(--admin-success-bg)] px-4 py-3 text-sm text-[var(--admin-success)]">
              Requisitos completos. Puedes publicar este vehículo.
            </p>
          )}

          <div className="mt-5 hidden flex-wrap gap-3 lg:flex">
            <AdminSecondaryButton type="button" onClick={() => saveDraft()} disabled={busy}>
              {busy && saving ? "Guardando..." : "Guardar borrador"}
            </AdminSecondaryButton>
            {previewHref ? (
              <a href={previewHref} target="_blank" rel="noreferrer">
                <AdminSecondaryButton type="button">Vista previa</AdminSecondaryButton>
              </a>
            ) : null}
            {published ? (
              <AdminSecondaryButton type="button" onClick={() => setConfirm({ type: "unpublish" })} disabled={busy}>
                Retirar del website
              </AdminSecondaryButton>
            ) : (
              <AdminPrimaryButton
                type="button"
                onClick={() => setConfirm({ type: "publish" })}
                disabled={busy || !saved || !readyToPublish}
              >
                {publishing ? "Publicando..." : "Publicar vehículo"}
              </AdminPrimaryButton>
            )}
          </div>

          {saved ? (
            <div className="mt-8 border-t border-[var(--admin-border)] pt-4">
              <AdminDangerButton type="button" disabled={busy} onClick={() => setConfirm({ type: "delete" })}>
                Eliminar vehículo
              </AdminDangerButton>
            </div>
          ) : null}
        </FormSection>
      ) : null}

      {/* Desktop step actions */}
      <div className="hidden items-center justify-between gap-3 lg:flex">
        <AdminSecondaryButton
          type="button"
          disabled={step === 0 || busy}
          onClick={() => setStep((current) => (Math.max(0, current - 1) as EditorStep))}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Atrás
        </AdminSecondaryButton>
        <div className="flex flex-wrap gap-2">
          <AdminSecondaryButton type="button" onClick={() => saveDraft()} disabled={busy}>
            {saving ? "Guardando..." : "Guardar borrador"}
          </AdminSecondaryButton>
          {step < 3 ? (
            <AdminPrimaryButton type="button" onClick={continueStep} disabled={busy}>
              Continuar
              <ChevronRight className="ml-1 h-4 w-4" />
            </AdminPrimaryButton>
          ) : null}
        </div>
      </div>

      <StickyActionBar
        step={step}
        busy={busy}
        saving={saving}
        publishing={publishing}
        saved={saved}
        published={published}
        readyToPublish={readyToPublish}
        previewHref={previewHref}
        onBack={() => setStep((current) => (Math.max(0, current - 1) as EditorStep))}
        onSave={() => saveDraft()}
        onContinue={continueStep}
        onPublish={() => setConfirm({ type: "publish" })}
        onUnpublish={() => setConfirm({ type: "unpublish" })}
      />

      <AdminModal
        open={confirm?.type === "make-change"}
        title="Cambiar marca"
        subtitle={
          confirm?.type === "make-change"
            ? `El modelo «${values.model}» no está en la lista de ${confirm.nextMake}.`
            : undefined
        }
        onClose={() => setConfirm(null)}
        footer={
          <div className="grid gap-2 sm:grid-cols-3">
            <AdminSecondaryButton type="button" onClick={() => setConfirm(null)} className="w-full">
              Cancelar
            </AdminSecondaryButton>
            <AdminSecondaryButton
              type="button"
              className="w-full"
              onClick={() => {
                if (confirm?.type !== "make-change") return;
                commitMakeChange(confirm.nextMake, true);
                setConfirm(null);
              }}
            >
              Borrar modelo
            </AdminSecondaryButton>
            <AdminPrimaryButton
              type="button"
              className="w-full"
              onClick={() => {
                if (confirm?.type !== "make-change") return;
                commitMakeChange(confirm.nextMake, false);
                setConfirm(null);
              }}
            >
              Conservar modelo
            </AdminPrimaryButton>
          </div>
        }
      />

      <AdminConfirmDialog
        open={Boolean(confirm) && confirm?.type !== "make-change"}
        title={
          confirm?.type === "delete"
            ? "Eliminar vehículo"
            : confirm?.type === "photo"
              ? "Eliminar foto"
              : confirm?.type === "unpublish"
                ? "Retirar del website"
                : confirm?.type === "sold"
                  ? "Marcar como vendido"
                  : "Publicar vehículo"
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
                  : "Se guardarán los cambios pendientes y la unidad quedará visible en el website si cumple los requisitos."
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
                  : "Publicar vehículo"
        }
        danger={confirm?.type === "delete" || confirm?.type === "photo" || confirm?.type === "unpublish"}
        pending={pending || publishing || saving}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm || confirm.type === "make-change") return;
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
            setDirty(true);
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

function CompactReadiness({
  requiredDone,
  requiredTotal,
  checks,
  onSelect,
}: {
  requiredDone: number;
  requiredTotal: number;
  checks: PublicationCheck[];
  onSelect: (check: PublicationCheck) => void;
}) {
  const missing = checks.filter((check) => !check.ok);
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-[var(--admin-shadow)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--admin-text)]">
          Listo para publicar: {requiredDone}/{requiredTotal}
        </p>
        <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--admin-surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--admin-success)] transition-all"
            style={{ width: `${requiredTotal ? (requiredDone / requiredTotal) * 100 : 0}%` }}
          />
        </div>
      </div>
      {missing.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {missing.map((check) => (
            <li key={check.id}>
              <button
                type="button"
                onClick={() => onSelect(check)}
                className="rounded-full border border-[var(--admin-warning)]/30 bg-[var(--admin-warning)]/10 px-3 py-1 text-xs font-medium text-[var(--admin-text)]"
              >
                {check.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-[var(--admin-success)]">Listo para publicar.</p>
      )}
    </div>
  );
}

function StickyActionBar({
  step,
  busy,
  saving,
  publishing,
  saved,
  published,
  readyToPublish,
  previewHref,
  onBack,
  onSave,
  onContinue,
  onPublish,
  onUnpublish,
}: {
  step: EditorStep;
  busy: boolean;
  saving: boolean;
  publishing: boolean;
  saved: boolean;
  published: boolean;
  readyToPublish: boolean;
  previewHref: string | null;
  onBack: () => void;
  onSave: () => void;
  onContinue: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--admin-border)] bg-[var(--admin-surface)]/95 px-3 pt-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2">
        {step === 3 ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onSave}
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white px-3 text-sm font-semibold text-[var(--admin-text)] disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar borrador"}
              </button>
              {previewHref ? (
                <a
                  href={previewHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white px-3 text-sm font-semibold text-[var(--admin-text)]"
                >
                  Vista previa
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white px-3 text-sm font-semibold text-[var(--admin-text-muted)]"
                >
                  Vista previa
                </button>
              )}
            </div>
            {published ? (
              <button
                type="button"
                onClick={onUnpublish}
                disabled={busy}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold text-[var(--admin-text)] disabled:opacity-60"
              >
                Retirar del website
              </button>
            ) : (
              <button
                type="button"
                onClick={onPublish}
                disabled={busy || !saved || !readyToPublish}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--admin-text)] px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {publishing ? "Publicando..." : "Publicar vehículo"}
              </button>
            )}
          </>
        ) : (
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
            <button
              type="button"
              onClick={onBack}
              disabled={step === 0 || busy}
              className="inline-flex min-h-12 w-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white text-[var(--admin-text)] disabled:opacity-40"
              aria-label="Atrás"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={busy}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white px-3 text-sm font-semibold text-[var(--admin-text)] disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={onContinue}
              disabled={busy}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--admin-text)] px-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
