"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  createAuctionOpportunity,
  prepareAuctionForWebsite,
  publishAuctionOpportunity,
  unpublishAuctionOpportunity,
  updateAuctionOpportunity,
  type AuctionActionState,
} from "@/app/actions/auctions";
import {
  attachVehiclePhotos,
  deleteVehiclePhoto,
  reorderVehiclePhotos,
  updateVehiclePhoto,
} from "@/app/actions/vehicles";
import { AdminAuctionPastePanel } from "@/components/admin/AdminAuctionPastePanel";
import { AdminMediaPicker } from "@/components/admin/AdminMediaPicker";
import { AdminSearchableSelect } from "@/components/admin/AdminSearchableSelect";
import { AuctionBadge } from "@/components/admin/AdminBadges";
import { AdminConfirmDialog } from "@/components/admin/AdminModal";
import {
  AdminCard,
  AdminError,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSelect,
  AdminTextArea,
} from "@/components/admin/ui";
import {
  ADMIN_BODY_STYLE_OPTIONS,
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
  resolveMakeValue,
  resolveModelValue,
  resolveSmartFieldValue,
  smartFieldState,
} from "@/lib/admin-smart-fields";
import {
  AUCTION_DAMAGE_OPTIONS,
  AUCTION_KEYS_OPTIONS,
  AUCTION_ODOMETER_OPTIONS,
  AUCTION_PRICE_MODES,
  AUCTION_PROVIDER_OPTIONS,
  AUCTION_RUN_DRIVE_OPTIONS,
  AUCTION_SALE_STATUS_OPTIONS,
  AUCTION_SECONDARY_DAMAGE_OPTIONS,
  AUCTION_TITLE_OPTIONS,
  BUY_NOW_DISCLAIMER,
  readAuctionMetadata,
  type AuctionAdminPriceMode,
} from "@/lib/auction-admin-fields";
import { AdminAuctionEligibilityPanel } from "@/components/admin/AdminAuctionEligibilityPanel";
import {
  auctionPublicationBlockMessage,
  auctionPublicationChecks,
  auctionPublishButtonLabel,
  canAttemptAuctionPublish,
} from "@/lib/auctions/auction-publication";
import { publishAuctionDraft } from "@/lib/auctions/publish-draft";
import { evaluateAuctionEligibility } from "@/lib/auctions/eligibility";
import {
  activeAuctionProviderChoices,
  historicalProviderLabel,
  opportunityVehicleTitle,
  type LinkedVehicleSummary,
} from "@/lib/auctions/opportunity-admin";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { MAX_VEHICLE_PHOTOS, validatePhotoFile, vehicleImageAdminPath } from "@/lib/storage";
import { removeStoredPhoto, uploadVehiclePhotos } from "@/lib/vehicle-photos";
import {
  OTHER_MAKE_LABEL,
  OTHER_MAKE_VALUE,
  OTHER_MODEL_LABEL,
  OTHER_MODEL_VALUE,
  VEHICLE_MAKE_OPTIONS,
  makeChangeConflictsWithModel,
  modelsForMake,
  yearOptions,
} from "@/lib/vehicle-make-models";
import type { AuctionOpportunityRow, AuctionProvider } from "@/lib/website-schema";

type EditorStep = 0 | 1 | 2 | 3 | 4;

const STEPS = [
  { id: 0 as const, label: "Subasta y lote" },
  { id: 1 as const, label: "Vehículo" },
  { id: 2 as const, label: "Condición" },
  { id: 3 as const, label: "Fotos" },
  { id: 4 as const, label: "Precio y publicación" },
];

const DRAFT_KEY = "valcron.auction.manual.draft.v27";

const LOCATION_SUGGESTIONS = [
  "TN - MEMPHIS",
  "FL - ORLANDO",
  "FL - MIAMI",
  "CA - LOS ANGELES",
  "TX - HOUSTON",
  "TX - DALLAS",
  "GA - ATLANTA",
  "NJ - NEWARK",
  "NY - LONG ISLAND",
  "IL - CHICAGO",
  "PA - PHILADELPHIA",
  "NC - CHARLOTTE",
];

type FormState = {
  provider: AuctionProvider;
  provider_lot_id: string;
  source_url: string;
  location: string;
  city: string;
  state: string;
  auction_date: string;
  auction_sale_status: string;
  seller_type: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  vin: string;
  mileage: string;
  mileage_unit: "mi" | "km";
  body_style: string;
  fuel: string;
  transmission: string;
  drivetrain: string;
  engine: string;
  exterior_color: string;
  interior_color: string;
  description: string;
  primary_damage: string;
  secondary_damage: string;
  run_and_drive: string;
  keys: string;
  odometer_status: string;
  title_status: string;
  price_mode: AuctionAdminPriceMode;
  buy_now_usd: string;
  video_url: string;
  featured: boolean;
  internal_notes: string;
};

type LocalPhoto = {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
};

function emptyForm(): FormState {
  return {
    provider: "copart",
    provider_lot_id: "",
    source_url: "",
    location: "",
    city: "",
    state: "",
    auction_date: "",
    auction_sale_status: "Estado desconocido",
    seller_type: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    vin: "",
    mileage: "",
    mileage_unit: "mi",
    body_style: "",
    fuel: "",
    transmission: "",
    drivetrain: "",
    engine: "",
    exterior_color: "",
    interior_color: "",
    description: "",
    primary_damage: "",
    secondary_damage: "Not Reported",
    run_and_drive: "Not Reported",
    keys: "Unknown",
    odometer_status: "Unknown",
    title_status: "",
    price_mode: "contact",
    buy_now_usd: "",
    video_url: "",
    featured: false,
    internal_notes: "",
  };
}

function formFromOpportunity(opportunity: AuctionOpportunityRow): FormState {
  const meta = readAuctionMetadata(opportunity.auction_metadata);
  const location =
    (opportunity.location ?? "").trim() ||
    [meta.city, meta.state].filter(Boolean).join(" - ") ||
    "";
  return {
    provider: opportunity.provider,
    provider_lot_id: opportunity.provider_lot_id ?? "",
    source_url: opportunity.source_url ?? "",
    location,
    // Preserve city/state internally for drafts; not shown as separate inputs.
    city: meta.city ?? "",
    state: meta.state ?? "",
    auction_date: meta.auction_date ?? "",
    auction_sale_status: meta.auction_sale_status ?? "Estado desconocido",
    seller_type: meta.seller_type ?? "",
    year: opportunity.year != null ? String(opportunity.year) : "",
    make: opportunity.make ?? "",
    model: opportunity.model ?? "",
    trim: opportunity.trim ?? "",
    vin: opportunity.vin ?? "",
    mileage: opportunity.mileage != null ? String(opportunity.mileage) : "",
    mileage_unit: meta.mileage_unit === "km" ? "km" : "mi",
    body_style: meta.body_style ?? "",
    fuel: meta.fuel ?? "",
    transmission: meta.transmission ?? "",
    drivetrain: meta.drivetrain ?? "",
    engine: meta.engine ?? "",
    exterior_color: meta.exterior_color ?? "",
    interior_color: meta.interior_color ?? "",
    description: meta.description ?? "",
    primary_damage: opportunity.primary_damage ?? "",
    secondary_damage: meta.secondary_damage ?? "Not Reported",
    run_and_drive: meta.run_and_drive ?? "Not Reported",
    keys: meta.keys ?? "Unknown",
    odometer_status: meta.odometer_status ?? "Unknown",
    title_status: opportunity.title_status ?? "",
    price_mode: meta.price_mode ?? "contact",
    buy_now_usd: meta.buy_now_usd != null ? String(meta.buy_now_usd) : "",
    video_url: meta.video_url ?? "",
    featured: Boolean(meta.featured),
    internal_notes: opportunity.internal_notes ?? "",
  };
}

function optionsFrom(list: readonly string[]) {
  return list.map((value) => ({ value, label: value }));
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

function SmartSelectField({
  label,
  options,
  value,
  onChange,
  required,
  id,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
  id?: string;
}) {
  const state = smartFieldState(options, value);
  return (
    <AdminField label={label} required={required}>
      <AdminSelect
        id={id}
        value={state.selectValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === ADMIN_OTHER_SENTINEL) {
            onChange(state.customValue || "Other");
            return;
          }
          onChange(next);
        }}
      >
        <option value="">Seleccionar</option>
        {options
          .filter((option) => option.value !== "Other" && option.value !== "Otro" && option.value !== "Otra")
          .map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        <option value={ADMIN_OTHER_SENTINEL}>Otro</option>
      </AdminSelect>
      {state.isOther || state.selectValue === ADMIN_OTHER_SENTINEL ? (
        <AdminInput
          className="mt-2"
          value={state.customValue || (state.isOther ? value : "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Escribe el valor"
        />
      ) : null}
    </AdminField>
  );
}

export function AdminAuctionForm({
  opportunity,
  linkedVehicle,
}: {
  opportunity?: AuctionOpportunityRow | null;
  linkedVehicle?: LinkedVehicleSummary | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = Boolean(opportunity?.id);
  const [step, setStep] = useState<EditorStep>(() => {
    const paso = Number(searchParams.get("paso"));
    if (paso >= 0 && paso <= 4) return paso as EditorStep;
    return 0;
  });
  const recoveredDraft = useMemo(() => {
    if (saved || typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as FormState;
    } catch {
      return null;
    }
  }, [saved]);

  const [values, setValues] = useState<FormState>(() => {
    if (opportunity) return formFromOpportunity(opportunity);
    return recoveredDraft ? { ...emptyForm(), ...recoveredDraft } : emptyForm();
  });
  const initialMake = opportunity?.make ?? recoveredDraft?.make ?? "";
  const initialModel = opportunity?.model ?? recoveredDraft?.model ?? "";
  const [customMake, setCustomMake] = useState(() => makeSelectState(initialMake).customValue);
  const [customModel, setCustomModel] = useState(() => modelSelectState(initialMake, initialModel).customValue);
  const [makeSelect, setMakeSelect] = useState(() => makeSelectState(initialMake).selectValue);
  const [modelSelect, setModelSelect] = useState(() => modelSelectState(initialMake, initialModel).selectValue);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(() =>
    !saved && recoveredDraft ? "Borrador local recuperado. Guarda para persistirlo en el servidor." : null,
  );
  const [publicPath, setPublicPath] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPhotos] = useState<LocalPhoto[]>([]);
  const [vehicleId, setVehicleId] = useState<string | null>(opportunity?.linked_vehicle_id ?? linkedVehicle?.id ?? null);
  const [published, setPublished] = useState(Boolean(linkedVehicle?.published));
  const photos = useMemo(() => linkedVehicle?.vehicle_photos ?? [], [linkedVehicle?.vehicle_photos]);
  const [confirm, setConfirm] = useState<"publish" | "unpublish" | null>(null);

  useEffect(() => {
    if (saved) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* quota */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [values, saved]);

  const makeState = useMemo(() => {
    if (makeSelect === OTHER_MAKE_VALUE) {
      return { selectValue: OTHER_MAKE_VALUE, customValue: customMake, isOther: true };
    }
    return makeSelectState(values.make);
  }, [customMake, makeSelect, values.make]);

  const modelOptions = useMemo(() => {
    const base = modelsForMake(values.make).map((model) => ({ value: model, label: model }));
    return [...base, { value: OTHER_MODEL_VALUE, label: OTHER_MODEL_LABEL }];
  }, [values.make]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function applyPasteFields(
    pastePatch: Record<string, string>,
    meta: { providerHint: "copart" | "iaa" | "manheim" | null },
  ) {
    setValues((current) => {
      const next = { ...current };
      for (const [key, value] of Object.entries(pastePatch)) {
        if (key in next && value != null) {
          (next as Record<string, unknown>)[key] = value;
        }
      }
      return next;
    });
    if (pastePatch.make) {
      const makeStateNext = makeSelectState(pastePatch.make);
      setMakeSelect(makeStateNext.selectValue);
      setCustomMake(makeStateNext.customValue);
    }
    if (pastePatch.model || pastePatch.make) {
      const makeForModel = pastePatch.make || values.make;
      const modelStateNext = modelSelectState(makeForModel, pastePatch.model || values.model);
      setModelSelect(modelStateNext.selectValue);
      setCustomModel(modelStateNext.customValue);
    }
    if (meta.providerHint) {
      setNotice(
        `Datos aplicados. Confirma la casa de subasta (${meta.providerHint === "iaa" ? "IAA" : meta.providerHint === "manheim" ? "Manheim" : "Copart"} sugerida). No se guardó ni publicó automáticamente.`,
      );
    } else {
      setNotice("Datos aplicados. Revisa los campos y confirma la casa de subasta. No se guardó ni publicó automáticamente.");
    }
    setStep(0);
  }

  const publicationInput = useMemo(
    () => ({
      provider: values.provider,
      provider_lot_id: values.provider_lot_id,
      year: values.year,
      make: values.make,
      model: values.model,
      location: values.location,
      price_mode: values.price_mode,
      buy_now_usd: values.buy_now_usd ? Number(values.buy_now_usd) : null,
      hasCoverPhoto: (photos?.length ?? 0) > 0,
      photoCount: photos?.length ?? 0,
      vin: values.vin,
      title_status: values.title_status,
      odometer_status: values.odometer_status,
      primary_damage: values.primary_damage,
      secondary_damage: values.secondary_damage,
      run_and_drive: values.run_and_drive,
    }),
    [values, photos],
  );

  const publishBlockers = useMemo(() => auctionPublicationChecks(publicationInput), [publicationInput]);
  const eligibility = useMemo(() => evaluateAuctionEligibility(publicationInput), [publicationInput]);
  const publishEnabled = canAttemptAuctionPublish(publicationInput);
  const publishLabel = auctionPublishButtonLabel(publicationInput);

  function jumpToField(nextStep: EditorStep, anchor: string) {
    setStep(nextStep);
    window.setTimeout(() => {
      const el = document.getElementById(anchor);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLElement) el.focus();
    }, 80);
  }

  function buildFormData(id?: string) {
    const make = resolveMakeValue(makeSelect === OTHER_MAKE_VALUE ? OTHER_MAKE_VALUE : makeState.selectValue, customMake || values.make);
    const model = resolveModelValue(
      modelSelect === OTHER_MODEL_VALUE ? OTHER_MODEL_VALUE : modelSelect || values.model,
      customModel || values.model,
    );
    const formData = new FormData();
    if (id) formData.set("id", id);
    formData.set("provider", values.provider);
    formData.set("provider_lot_id", values.provider_lot_id);
    formData.set("source_url", values.source_url);
    formData.set("location", values.location);
    formData.set("city", values.city);
    formData.set("state", values.state);
    formData.set("auction_date", values.auction_date);
    formData.set("auction_sale_status", values.auction_sale_status);
    formData.set("seller_type", values.seller_type);
    formData.set("year", values.year);
    formData.set("make", make || values.make);
    formData.set("model", model || values.model);
    formData.set("trim", values.trim);
    formData.set("vin", values.vin);
    formData.set("mileage", values.mileage);
    formData.set("mileage_unit", values.mileage_unit);
    formData.set("body_style", values.body_style);
    formData.set("fuel", values.fuel);
    formData.set("transmission", values.transmission);
    formData.set("drivetrain", values.drivetrain);
    formData.set("engine", values.engine);
    formData.set("exterior_color", values.exterior_color);
    formData.set("interior_color", values.interior_color);
    formData.set("description", values.description);
    formData.set("primary_damage", values.primary_damage);
    formData.set("secondary_damage", values.secondary_damage);
    formData.set("run_and_drive", values.run_and_drive);
    formData.set("keys", values.keys);
    formData.set("odometer_status", values.odometer_status);
    formData.set("title_status", values.title_status);
    formData.set("price_mode", values.price_mode);
    formData.set("buy_now_usd", values.buy_now_usd);
    formData.set("video_url", values.video_url);
    formData.set("featured", values.featured ? "true" : "false");
    formData.set("internal_notes", values.internal_notes);
    formData.set("status", opportunity?.status === "archived" ? "archived" : opportunity?.status === "published" ? "published" : "draft");
    return formData;
  }

  async function saveDraft(): Promise<AuctionActionState> {
    if (values.source_url && !isSafeHttpUrl(values.source_url)) {
      return { error: "El enlace de origen debe comenzar con http:// o https://." };
    }
    if (!values.provider || !["copart", "iaa", "manheim", "other"].includes(values.provider)) {
      return { error: "Selecciona Copart, IAA o Manheim." };
    }
    setSaving(true);
    const formData = buildFormData(opportunity?.id);
    let result: AuctionActionState;
    try {
      result = saved
        ? await updateAuctionOpportunity(null, formData)
        : await createAuctionOpportunity(null, formData);
    } catch {
      return { error: "No se pudo guardar. Comprueba tu conexión y vuelve a intentar." };
    } finally {
      setSaving(false);
    }
    if (!result.error && result.id) {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      if (!saved) {
        router.replace(`/admin/subastas/${result.id}`);
      } else {
        router.refresh();
      }
    }
    return result;
  }

  async function ensureVehicle(): Promise<string | null> {
    if (vehicleId) return vehicleId;
    if (!opportunity?.id) {
      const created = await saveDraft();
      if (created.error || !created.id) {
        setError(created.error);
        return null;
      }
      const prepared = await prepareAuctionForWebsite(created.id);
      if (prepared.error || !(prepared.vehicleId ?? prepared.id)) {
        setError(prepared.error);
        return null;
      }
      const id = prepared.vehicleId ?? prepared.id!;
      setVehicleId(id);
      return id;
    }
    const prepared = await prepareAuctionForWebsite(opportunity.id);
    if (prepared.error || !(prepared.vehicleId ?? prepared.id)) {
      setError(prepared.error);
      return null;
    }
    const id = prepared.vehicleId ?? prepared.id!;
    setVehicleId(id);
    return id;
  }

  async function handleSave() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await saveDraft();
      if (result.error) {
        setError(result.error);
        return;
      }
      setNotice(result.success ?? "Borrador guardado.");
    });
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = [...fileList];
    if (!files.length) return;
    setError(null);
    setUploading(true);
    const id = await ensureVehicle();
    if (!id) {
      setUploading(false);
      return;
    }
    const accepted: File[] = [];
    for (const file of files) {
      const invalid = validatePhotoFile(file);
      if (invalid) {
        setError(invalid);
        continue;
      }
      accepted.push(file);
    }
    if (!accepted.length) {
      setUploading(false);
      return;
    }
    if ((photos?.length ?? 0) + localPhotos.length + accepted.length > MAX_VEHICLE_PHOTOS) {
      setError(`Máximo ${MAX_VEHICLE_PHOTOS} fotos.`);
      setUploading(false);
      return;
    }
    const hadPhotos = (photos?.length ?? 0) > 0;
    const result = await uploadVehiclePhotos(accepted, {
      vehicleId: id,
      currentCount: (photos?.length ?? 0) + localPhotos.length,
    });
    if (result.paths.length > 0) {
      const attached = await attachVehiclePhotos({
        vehicleId: id,
        paths: result.paths,
        coverPath: !hadPhotos ? result.paths[0] : undefined,
      });
      if (attached.error) {
        setUploading(false);
        setError(attached.error);
        return;
      }
    }
    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNotice("Fotos subidas.");
    router.refresh();
  }

  async function handlePublish() {
    const result = await publishAuctionDraft(publicationInput, saveDraft, publishAuctionOpportunity);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPublished(true);
    setPublicPath(result.publicPath ?? null);
    setNotice(result.success ?? "Publicado.");
    if (!opportunity?.id) {
      router.replace(`/admin/subastas/${result.id}?paso=4`);
    } else {
      router.refresh();
    }
  }

  async function handleUnpublish() {
    if (!opportunity?.id) return;
    const result = await unpublishAuctionOpportunity(opportunity.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPublished(false);
    setNotice(result.success ?? "Despublicado.");
    router.refresh();
  }

  const title = opportunity ? opportunityVehicleTitle(opportunity) : "Agregar vehículo de subasta";
  const providerChoices = activeAuctionProviderChoices(values.provider);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title={saved ? title : "Agregar vehículo de subasta"}
        subtitle="Ingreso manual. No se publica en Inventario Valcron."
        actions={
          saved ? (
            <AuctionBadge source={values.provider} />
          ) : (
            <Link href="/admin/subastas">
              <AdminSecondaryButton>Volver</AdminSecondaryButton>
            </Link>
          )
        }
      />

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Pasos del editor">
        {STEPS.map((item) => {
          const active = step === item.id;
          const done = step > item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium ${
                active
                  ? "bg-[var(--admin-text)] text-white"
                  : done
                    ? "bg-[var(--admin-success-bg)] text-[var(--admin-success)]"
                    : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)]"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <span className="tabular-nums">{item.id + 1}</span>}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {error ? <AdminError message={error} /> : null}
      {notice ? (
        <p className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-4 py-3 text-sm text-[var(--admin-text-secondary)]">
          {notice}
          {publicPath ? (
            <>
              {" "}
              <Link href={publicPath} className="font-medium underline" target="_blank">
                Ver oportunidad publicada
              </Link>
            </>
          ) : null}
        </p>
      ) : null}

      {step === 0 ? (
        <AdminAuctionPastePanel
          currentValues={{
            year: values.year,
            make: values.make,
            model: values.model,
            trim: values.trim,
            provider_lot_id: values.provider_lot_id,
            vin: values.vin,
            location: values.location,
            auction_date: values.auction_date,
            auction_sale_status: values.auction_sale_status,
            seller_type: values.seller_type,
            body_style: values.body_style,
            fuel: values.fuel,
            engine: values.engine,
            transmission: values.transmission,
            drivetrain: values.drivetrain,
            exterior_color: values.exterior_color,
            mileage: values.mileage,
            mileage_unit: values.mileage_unit,
            odometer_status: values.odometer_status,
            primary_damage: values.primary_damage,
            secondary_damage: values.secondary_damage,
            keys: values.keys,
            run_and_drive: values.run_and_drive,
            title_status: values.title_status,
            internal_notes: values.internal_notes,
            source_url: values.source_url,
            price_mode: values.price_mode,
            buy_now_usd: values.buy_now_usd,
            description: values.description,
          }}
          onApply={applyPasteFields}
        />
      ) : null}

      {step === 0 ? (
        <FormSection title="Subasta y lote" hint="Selecciona la casa de subasta e ingresa el lote. El pegado de texto no publica ni guarda solo.">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Casa de subasta" required>
              <AdminSelect
                value={values.provider}
                onChange={(event) => patch("provider", event.target.value as AuctionProvider)}
              >
                {providerChoices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Número de lote" required>
              <AdminInput
                value={values.provider_lot_id}
                onChange={(event) => patch("provider_lot_id", event.target.value)}
                placeholder="Ej. 66502456"
              />
            </AdminField>
            <div className="sm:col-span-2">
              <AdminField label="URL de origen">
                <AdminInput
                  value={values.source_url}
                  onChange={(event) => patch("source_url", event.target.value)}
                  placeholder="https://..."
                />
              </AdminField>
            </div>
            <div className="sm:col-span-2">
              <AdminField label="Ubicación de subasta">
                <AdminSearchableSelect
                  name="location"
                  value={
                    LOCATION_SUGGESTIONS.includes(values.location)
                      ? values.location
                      : values.location
                        ? "__other__"
                        : ""
                  }
                  options={LOCATION_SUGGESTIONS.map((item) => ({ value: item, label: item }))}
                  allowCustom
                  otherValue="__other__"
                  otherLabel="Otra ubicación"
                  customValue={LOCATION_SUGGESTIONS.includes(values.location) ? "" : values.location}
                  placeholder="Ej. TN - MEMPHIS"
                  onValueChange={(next) => {
                    if (next === "__other__") return;
                    patch("location", next);
                  }}
                  onCustomChange={(custom) => patch("location", custom)}
                />
              </AdminField>
            </div>
            <AdminField label="Fecha de subasta">
              <AdminInput
                type="date"
                value={values.auction_date}
                onChange={(event) => patch("auction_date", event.target.value)}
              />
            </AdminField>
            <AdminField label="Estado de subasta">
              <AdminSelect
                value={values.auction_sale_status}
                onChange={(event) => patch("auction_sale_status", event.target.value)}
              >
                {AUCTION_SALE_STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Tipo de vendedor">
              <AdminInput
                value={values.seller_type}
                onChange={(event) => patch("seller_type", event.target.value)}
                placeholder="Cuando se conozca"
              />
            </AdminField>
          </div>
          <p className="mt-4 text-sm text-[var(--admin-text-muted)]">
            Proveedor seleccionado: <strong>{historicalProviderLabel(values.provider)}</strong>
            {AUCTION_PROVIDER_OPTIONS.every((item) => item.value !== values.provider) ? " (histórico)" : ""}
          </p>
        </FormSection>
      ) : null}

      {step === 1 ? (
        <FormSection title="Información del vehículo" hint="Usa los selectores inteligentes. Elige «Otra marca» u «Otro modelo» si no aparece en la lista.">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Año" required>
              <AdminSelect value={values.year} onChange={(event) => patch("year", event.target.value)}>
                <option value="">Seleccionar</option>
                {yearOptions().map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Marca" required>
              <AdminSearchableSelect
                name="make"
                value={makeSelect || makeState.selectValue}
                options={VEHICLE_MAKE_OPTIONS.map((make) => ({ value: make, label: make }))}
                allowCustom
                otherValue={OTHER_MAKE_VALUE}
                otherLabel={OTHER_MAKE_LABEL}
                customValue={customMake}
                onValueChange={(next) => {
                  setMakeSelect(next);
                  if (next === OTHER_MAKE_VALUE) {
                    patch("make", customMake);
                    return;
                  }
                  const previousMake = values.make;
                  const conflicts = makeChangeConflictsWithModel(previousMake, next, values.model);
                  patch("make", next);
                  if (conflicts) {
                    setModelSelect(OTHER_MODEL_VALUE);
                    setCustomModel(values.model);
                  } else {
                    setModelSelect(modelSelectState(next, values.model).selectValue);
                  }
                }}
                onCustomChange={(custom) => {
                  setCustomMake(custom);
                  patch("make", custom);
                }}
              />
            </AdminField>
            <AdminField label="Modelo" required>
              <AdminSearchableSelect
                name="model"
                value={modelSelect}
                options={modelOptions}
                allowCustom
                otherValue={OTHER_MODEL_VALUE}
                otherLabel={OTHER_MODEL_LABEL}
                customValue={customModel}
                onValueChange={(next) => {
                  setModelSelect(next);
                  if (next === OTHER_MODEL_VALUE) {
                    patch("model", customModel);
                    return;
                  }
                  patch("model", next);
                }}
                onCustomChange={(custom) => {
                  setCustomModel(custom);
                  patch("model", custom);
                }}
              />
            </AdminField>
            <AdminField label="Trim / versión">
              <AdminInput value={values.trim} onChange={(event) => patch("trim", event.target.value)} />
            </AdminField>
            <AdminField label="VIN">
              <AdminInput
                id="vin"
                value={values.vin}
                onChange={(event) => patch("vin", event.target.value.toUpperCase())}
                maxLength={24}
                placeholder="VIN completo de 17 caracteres"
                autoCapitalize="characters"
              />
            </AdminField>
            <AdminField label="Kilometraje">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <AdminInput
                  value={values.mileage}
                  onChange={(event) => patch("mileage", event.target.value)}
                  inputMode="numeric"
                />
                <AdminSelect
                  value={values.mileage_unit}
                  onChange={(event) => patch("mileage_unit", event.target.value as "mi" | "km")}
                >
                  <option value="mi">mi</option>
                  <option value="km">km</option>
                </AdminSelect>
              </div>
            </AdminField>
            <SmartSelectField
              label="Carrocería"
              options={withCurrentOption(ADMIN_BODY_STYLE_OPTIONS, values.body_style)}
              value={values.body_style}
              onChange={(next) => patch("body_style", resolveSmartFieldValue(
                smartFieldState(ADMIN_BODY_STYLE_OPTIONS, next).isOther ? ADMIN_OTHER_SENTINEL : next,
                smartFieldState(ADMIN_BODY_STYLE_OPTIONS, next).isOther ? next : "",
              ))}
            />
            <SmartSelectField
              label="Combustible"
              options={withCurrentOption(ADMIN_FUEL_OPTIONS, values.fuel)}
              value={values.fuel}
              onChange={(next) => patch("fuel", next)}
            />
            <SmartSelectField
              label="Transmisión"
              options={withCurrentOption(ADMIN_TRANSMISSION_OPTIONS, values.transmission)}
              value={values.transmission}
              onChange={(next) => patch("transmission", next)}
            />
            <SmartSelectField
              label="Tracción"
              options={withCurrentOption(ADMIN_DRIVETRAIN_OPTIONS, values.drivetrain)}
              value={values.drivetrain}
              onChange={(next) => patch("drivetrain", next)}
            />
            <AdminField label="Motor">
              <AdminInput value={values.engine} onChange={(event) => patch("engine", event.target.value)} />
            </AdminField>
            <SmartSelectField
              label="Color exterior"
              options={withCurrentOption(ADMIN_EXTERIOR_COLOR_OPTIONS, values.exterior_color)}
              value={values.exterior_color}
              onChange={(next) => patch("exterior_color", next)}
            />
            <AdminField label="Color interior">
              <AdminInput
                value={values.interior_color}
                onChange={(event) => patch("interior_color", event.target.value)}
              />
            </AdminField>
            <div className="sm:col-span-2">
              <AdminField label="Descripción">
                <AdminTextArea
                  value={values.description}
                  onChange={(event) => patch("description", event.target.value)}
                  rows={4}
                  placeholder="Descripción pública de la oportunidad"
                />
              </AdminField>
            </div>
          </div>
        </FormSection>
      ) : null}

      {step === 2 ? (
        <FormSection title="Condición y daños" hint="Usa la terminología exacta de la subasta cuando esté disponible. Run and Drive no es una garantía mecánica.">
          <div className="mb-4">
            <AdminAuctionEligibilityPanel
              result={eligibility}
              compact
              onJump={(nextStep, anchor) => jumpToField(nextStep, anchor)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SmartSelectField
              id="primary_damage"
              label="Daño principal"
              options={optionsFrom(AUCTION_DAMAGE_OPTIONS)}
              value={values.primary_damage}
              onChange={(next) => patch("primary_damage", next)}
            />
            <SmartSelectField
              id="secondary_damage"
              label="Daño secundario"
              options={optionsFrom(AUCTION_SECONDARY_DAMAGE_OPTIONS)}
              value={values.secondary_damage}
              onChange={(next) => patch("secondary_damage", next)}
            />
            <SmartSelectField
              id="run_and_drive"
              label="Run and Drive"
              options={optionsFrom(AUCTION_RUN_DRIVE_OPTIONS)}
              value={values.run_and_drive}
              onChange={(next) => patch("run_and_drive", next)}
            />
            <AdminField label="Llaves">
              <AdminSelect value={values.keys} onChange={(event) => patch("keys", event.target.value)}>
                {AUCTION_KEYS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Estado del odómetro">
              <AdminSelect
                id="odometer_status"
                value={values.odometer_status}
                onChange={(event) => patch("odometer_status", event.target.value)}
              >
                {AUCTION_ODOMETER_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <SmartSelectField
              id="title_status"
              label="Tipo de título / documento"
              options={optionsFrom(AUCTION_TITLE_OPTIONS)}
              value={values.title_status}
              onChange={(next) => patch("title_status", next)}
            />
            <div className="sm:col-span-2">
              <AdminField label="Notas internas">
                <AdminTextArea
                  value={values.internal_notes}
                  onChange={(event) => patch("internal_notes", event.target.value)}
                  rows={3}
                  placeholder="Solo visibles en Admin"
                />
              </AdminField>
            </div>
          </div>
        </FormSection>
      ) : null}

      {step === 3 ? (
        <FormSection
          title="Fotografías y videos"
          hint="Sube solo imágenes autorizadas. No se descargan fotos de la subasta automáticamente."
        >
          <AdminMediaPicker onFiles={handleFiles} uploading={uploading || pending} />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(photos ?? []).map((photo) => (
              <div key={photo.id} className="relative overflow-hidden rounded-lg border border-[var(--admin-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.storage_path ? vehicleImageAdminPath(String(photo.storage_path)) : ""}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex items-center justify-between gap-1 p-2">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 text-xs ${photo.is_cover ? "text-[var(--admin-warning)]" : "text-[var(--admin-text-muted)]"}`}
                    onClick={() => {
                      if (!vehicleId) return;
                      void updateVehiclePhoto({ id: photo.id, vehicleId, is_cover: true }).then(() =>
                        router.refresh(),
                      );
                    }}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Portada
                  </button>
                  <button
                    type="button"
                    className="text-xs text-[var(--admin-danger)]"
                    onClick={() => {
                      if (!vehicleId || !photo.storage_path) return;
                      void deleteVehiclePhoto({
                        id: photo.id,
                        vehicleId,
                        storagePath: String(photo.storage_path),
                      }).then(async () => {
                        await removeStoredPhoto(String(photo.storage_path));
                        router.refresh();
                      });
                    }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            {localPhotos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-[var(--admin-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.preview} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
          {(photos?.length ?? 0) > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminSecondaryButton
                type="button"
                disabled={!vehicleId}
                onClick={() => {
                  if (!vehicleId || !photos?.length) return;
                  const ids = [...photos].map((photo) => photo.id);
                  const [first, ...rest] = ids;
                  if (!first) return;
                  void reorderVehiclePhotos(vehicleId, [...rest, first]).then(() => router.refresh());
                }}
              >
                Reordenar
              </AdminSecondaryButton>
            </div>
          ) : null}
          <div className="mt-4">
            <AdminField label="Video (URL o enlace)">
              <AdminInput
                value={values.video_url}
                onChange={(event) => patch("video_url", event.target.value)}
                placeholder="https://... (opcional)"
              />
            </AdminField>
          </div>
        </FormSection>
      ) : null}

      {step === 4 ? (
        <FormSection
          title="Precio y publicación"
          hint="Por defecto el precio público es «Precio a consultar». Solo muestra Buy Now si el monto está verificado."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Modo de precio" required>
              <AdminSelect
                value={values.price_mode}
                onChange={(event) => patch("price_mode", event.target.value as AuctionAdminPriceMode)}
              >
                {AUCTION_PRICE_MODES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            {values.price_mode === "buy_now" ? (
              <AdminField label="Buy Now (USD)" required>
                <AdminInput
                  value={values.buy_now_usd}
                  onChange={(event) => patch("buy_now_usd", event.target.value)}
                  inputMode="decimal"
                  placeholder="Monto verificado"
                />
              </AdminField>
            ) : (
              <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-4 py-3 text-sm text-[var(--admin-text-secondary)]">
                CTA público: <strong>Solicitar cotización</strong>
              </div>
            )}
          </div>
          {values.price_mode === "buy_now" ? (
            <p className="mt-4 rounded-xl border border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] px-4 py-3 text-sm text-[var(--admin-warning)]">
              {BUY_NOW_DISCLAIMER}
            </p>
          ) : null}
          <label className="mt-4 flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(event) => patch("featured", event.target.checked)}
            />
            Destacar en carrusel de subastas
          </label>
          <div className="mt-6">
            <AdminAuctionEligibilityPanel
              result={eligibility}
              onJump={(nextStep, anchor) => jumpToField(nextStep, anchor)}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <AdminPrimaryButton
              type="button"
              disabled={pending || saving || uploading || !publishEnabled}
              onClick={() => setConfirm("publish")}
              title={publishEnabled ? "Publicar oportunidad" : auctionPublicationBlockMessage(publicationInput) ?? publishLabel}
            >
              {publishLabel}
            </AdminPrimaryButton>
            {published ? (
              <AdminSecondaryButton type="button" disabled={pending || saving || uploading} onClick={() => setConfirm("unpublish")}>
                Despublicar
              </AdminSecondaryButton>
            ) : null}
            {publicPath ? (
              <Link href={publicPath} target="_blank">
                <AdminSecondaryButton type="button">Vista previa pública</AdminSecondaryButton>
              </Link>
            ) : null}
          </div>
        </FormSection>
      ) : null}

      <div className="sticky bottom-0 z-30 -mx-1 border-t border-[var(--admin-border)] bg-white px-2 pt-3 shadow-[0_-8px_24px_rgba(8,9,11,0.08)] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {step === 4 && !publishEnabled ? (
          <p className="mb-2 text-xs text-[var(--admin-warning)]">
            {auctionPublicationBlockMessage(publicationInput) ??
              `Falta: ${publishBlockers
                .filter((check) => check.required && !check.ok)
                .map((check) => check.label)
                .join(", ")}`}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <AdminSecondaryButton
            type="button"
            disabled={step === 0}
            aria-label="Anterior"
            onClick={() => setStep((current) => Math.max(0, current - 1) as EditorStep)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Anterior
          </AdminSecondaryButton>
          <div className="flex flex-wrap justify-end gap-2">
            <AdminSecondaryButton type="button" disabled={pending || saving || uploading} onClick={() => void handleSave()}>
              Guardar borrador
            </AdminSecondaryButton>
            {vehicleId || opportunity?.linked_vehicle_id ? (
              <AdminSecondaryButton type="button" onClick={() => setStep(4)}>
                Vista previa
              </AdminSecondaryButton>
            ) : null}
            {step < 4 ? (
              <AdminPrimaryButton
                type="button"
                onClick={() => setStep((current) => Math.min(4, current + 1) as EditorStep)}
              >
                Continuar
                <ChevronRight className="h-4 w-4" aria-hidden />
              </AdminPrimaryButton>
            ) : (
              <AdminPrimaryButton
                type="button"
                disabled={pending || saving || uploading || !publishEnabled}
                onClick={() => setConfirm("publish")}
                title={
                  publishEnabled
                    ? "Publicar oportunidad"
                    : auctionPublicationBlockMessage(publicationInput) ?? publishLabel
                }
              >
                {publishLabel}
              </AdminPrimaryButton>
            )}
          </div>
        </div>
      </div>

      <AdminConfirmDialog
        open={confirm === "publish"}
        title="Publicar oportunidad"
        description="Se validarán los campos requeridos, la foto de portada y la Verificación Valcron. La unidad aparecerá solo en Oportunidades de Subasta."
        confirmLabel="Publicar"
        pending={pending || saving}
        onConfirm={() => {
          setConfirm(null);
          setError(null);
          setNotice(null);
          startTransition(async () => {
            try {
              await handlePublish();
            } catch {
              setError("No se pudo confirmar la publicación. Comprueba el estado antes de reintentar.");
            }
          });
        }}
        onClose={() => setConfirm(null)}
      />
      <AdminConfirmDialog
        open={confirm === "unpublish"}
        title="Despublicar oportunidad"
        description="La oportunidad dejará de verse en el inventario público de subastas."
        confirmLabel="Despublicar"
        pending={pending}
        danger
        onConfirm={() => {
          setConfirm(null);
          setError(null);
          setNotice(null);
          startTransition(async () => {
            try {
              await handleUnpublish();
            } catch {
              setError("No se pudo confirmar la despublicación. Comprueba el estado antes de reintentar.");
            }
          });
        }}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
