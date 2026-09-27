"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAuctionOpportunity,
  parseAuctionUrlAction,
  prepareAuctionForWebsite,
  updateAuctionOpportunity,
  type AuctionActionState,
} from "@/app/actions/auctions";
import { lookupCopartLotAction, type CopartLotLookupActionResult } from "@/app/actions/copart";
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
import { AuctionBadge } from "@/components/admin/AdminBadges";
import { CopartLookupCard } from "@/components/admin/CopartLookupCard";
import { AdminConfirmDialog } from "@/components/admin/AdminModal";
import {
  activeAuctionProviderChoices,
  historicalProviderLabel,
  remapNewOpportunityProvider,
} from "@/lib/auctions/opportunity-admin";
import {
  COPART_DUPLICATE_LOT_MESSAGE,
} from "@/lib/auction-providers/copart/opportunity";
import {
  COPART_LOOKUP_LOADED_COPY,
  COPART_LOOKUP_SUCCESS_MESSAGE,
  COPART_LOT_NOT_FOUND_HINT,
  COPART_LOT_NOT_FOUND_MESSAGE,
  shouldConfirmCopartLookupReplace,
  type CopartOpportunityFormValues,
} from "@/lib/auction-providers/copart/lookup";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { type AuctionOpportunityRow, type AuctionProvider } from "@/lib/website-schema";

export function AdminAuctionForm({ opportunity }: { opportunity?: AuctionOpportunityRow | null }) {
  const router = useRouter();
  const saved = Boolean(opportunity?.id);
  const [parseState, setParseState] = useState<AuctionActionState>({ error: null });
  const [parsing, setParsing] = useState(false);
  const [saveState, setSaveState] = useState<AuctionActionState>({ error: null });
  const [pending, setPending] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [provider, setProvider] = useState<AuctionProvider>(opportunity?.provider ?? "copart");
  const [lot, setLot] = useState(opportunity?.provider_lot_id ?? "");
  const [sourceUrl, setSourceUrl] = useState(opportunity?.source_url ?? "");
  const [form, setForm] = useState<CopartOpportunityFormValues>({
    vin: opportunity?.vin ?? "",
    year: opportunity?.year != null ? String(opportunity.year) : "",
    make: opportunity?.make ?? "",
    model: opportunity?.model ?? "",
    trim: opportunity?.trim ?? "",
    mileage: opportunity?.mileage != null ? String(opportunity.mileage) : "",
    titleStatus: opportunity?.title_status ?? "",
    primaryDamage: opportunity?.primary_damage ?? "",
    location: opportunity?.location ?? "",
  });
  const [notes, setNotes] = useState(opportunity?.internal_notes ?? "");
  const [lookup, setLookup] = useState<CopartLotLookupActionResult | null>(null);
  const [baseline, setBaseline] = useState<CopartOpportunityFormValues | null>(
    opportunity?.id
      ? {
          vin: opportunity.vin ?? "",
          year: opportunity.year != null ? String(opportunity.year) : "",
          make: opportunity.make ?? "",
          model: opportunity.model ?? "",
          trim: opportunity.trim ?? "",
          mileage: opportunity.mileage != null ? String(opportunity.mileage) : "",
          titleStatus: opportunity.title_status ?? "",
          primaryDamage: opportunity.primary_damage ?? "",
          location: opportunity.location ?? "",
        }
      : null,
  );
  const [lastAppliedLot, setLastAppliedLot] = useState<string | null>(null);
  const [pendingReplace, setPendingReplace] = useState<CopartLotLookupActionResult | null>(null);

  function patchForm(key: keyof CopartOpportunityFormValues, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyLookup(result: CopartLotLookupActionResult) {
    if (result.status !== "found" || !result.prefill) {
      setLookup(result);
      return;
    }
    const next = result.prefill;
    setProvider("copart");
    setLot(next.lot);
    setSourceUrl(next.sourceUrl || result.sourceUrl || sourceUrl);
    setForm(next.form);
    setBaseline(next.form);
    setLastAppliedLot(next.lot);
    setLookup(result);
    setParseState({
      error: null,
      success: COPART_LOOKUP_SUCCESS_MESSAGE,
      parsed: { provider: "copart", providerLotId: next.lot, sourceUrl: next.sourceUrl },
      lookup: result,
    });
  }

  function considerLookup(result: CopartLotLookupActionResult) {
    if (result.status === "found" && result.prefill) {
      const confirm = shouldConfirmCopartLookupReplace({
        current: form,
        baseline,
        lastAppliedLot,
        incomingLot: result.prefill.lot,
      });
      if (confirm) {
        setPendingReplace(result);
        return;
      }
    }
    applyLookup(result);
  }

  async function handleParse(formData: FormData) {
    setParsing(true);
    const result = await parseAuctionUrlAction(null, formData);
    if (result.parsed) {
      setProvider(saved ? result.parsed.provider : remapNewOpportunityProvider(result.parsed.provider));
      setLot(result.parsed.providerLotId ?? "");
      setSourceUrl(result.parsed.sourceUrl);
    }
    if (result.lookup) {
      considerLookup(result.lookup);
    } else {
      setParseState(result);
    }
    setParsing(false);
  }

  async function lookupLot() {
    if (lookingUp || provider !== "copart") return;
    setLookingUp(true);
    const result = await lookupCopartLotAction(lot || sourceUrl);
    considerLookup(result);
    setLookingUp(false);
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = saved
      ? await updateAuctionOpportunity(null, formData)
      : await createAuctionOpportunity(null, formData);
    setSaveState(result);
    setPending(false);
    if (!result.error && result.id && !saved) {
      router.replace(`/admin/subastas/${result.id}`);
    }
  }

  async function prepare() {
    if (!opportunity?.id) return;
    setPreparing(true);
    const result = await prepareAuctionForWebsite(opportunity.id);
    setSaveState(result);
    setPreparing(false);
    if (!result.error && result.id) {
      router.push(`/admin/inventario/${result.id}`);
    }
  }

  const lookupBusy = lookingUp || parsing;
  const notFound = lookup?.status === "not_found";

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title={saved ? "Oportunidad" : "Agregar oportunidad"}
        subtitle="Busca un lote Copart o completa los datos. No se publica automáticamente."
      />

      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Importar desde enlace</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--admin-text-secondary)]">
          Si pegas un enlace de Copart, buscamos el lote en el inventario oficial. IAA se completa a mano.
        </p>
        <form action={handleParse} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <AdminInput
            name="source_url"
            placeholder="https://www.copart.com/lot/..."
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className="h-12"
          />
          <AdminPrimaryButton type="submit" disabled={lookupBusy} className="sm:min-w-[10.5rem]">
            {parsing ? "Buscando..." : "Analizar enlace"}
          </AdminPrimaryButton>
        </form>
        <AdminError message={parseState.error} />
        {parseState.success && lookup?.status === "found" ? (
          <p className="mt-3 text-sm text-[var(--admin-success)]">{parseState.success}</p>
        ) : parseState.success && lookup?.status !== "not_found" ? (
          <p className="mt-3 text-sm text-[var(--admin-success)]">{parseState.success}</p>
        ) : null}
        {parseState.parsed && lookup?.status !== "found" && lookup?.status !== "not_found" ? (
          <div className="mt-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
            <p className="text-sm font-medium text-[var(--admin-text)]">Revisa y completa la información antes de guardar.</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--admin-text-muted)]">Proveedor</dt>
                <dd>
                  {historicalProviderLabel(
                    saved ? parseState.parsed.provider : remapNewOpportunityProvider(parseState.parsed.provider),
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--admin-text-muted)]">Lote</dt>
                <dd>{parseState.parsed.providerLotId || "Completar a mano"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--admin-text-muted)]">Enlace</dt>
                <dd className="truncate">{parseState.parsed.sourceUrl}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </AdminCard>

      {lookup?.status === "found" && lookup.vehicle ? (
        <CopartLookupCard
          vehicle={lookup.vehicle}
          gallery={lookup.gallery}
          lastUpdated={lookup.lastUpdated}
          duplicateId={saved ? null : lookup.duplicateId}
        />
      ) : null}

      {lookup?.error && lookup.status !== "found" && lookup.status !== "not_found" ? (
        <AdminError message={lookup.error} />
      ) : null}

      {notFound ? (
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">{COPART_LOT_NOT_FOUND_MESSAGE}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--admin-text-secondary)]">{COPART_LOT_NOT_FOUND_HINT}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/subastas/copart">
              <AdminPrimaryButton type="button">Buscar en inventario Copart</AdminPrimaryButton>
            </Link>
            <AdminSecondaryButton type="button" onClick={() => setLookup(null)}>
              Continuar manualmente
            </AdminSecondaryButton>
          </div>
        </AdminCard>
      ) : null}

      <form action={handleSubmit} className="grid gap-6">
        {opportunity?.id ? <input type="hidden" name="id" value={opportunity.id} /> : null}
        <AdminCard>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--admin-text)]">Datos de la unidad</h2>
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                Información pública Valcron se define después, al preparar para website. El precio público no se copia
                desde Copart.
              </p>
            </div>
            <AuctionBadge source={provider} />
          </div>
          <AdminError message={saveState.error} />
          {saveState.error === COPART_DUPLICATE_LOT_MESSAGE && saveState.id ? (
            <p className="mt-2 text-sm">
              <Link href={`/admin/subastas/${saveState.id}`} className="font-medium underline-offset-2 hover:underline">
                Ver oportunidad
              </Link>
            </p>
          ) : null}
          {saveState.success ? (
            <p className="mt-3 text-sm text-[var(--admin-success)]">{saveState.success}</p>
          ) : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminField
              label="Proveedor"
              hint={provider === "iaa" ? "IAA se ingresa a mano hasta que exista acceso B2B." : undefined}
            >
              <AdminSelect
                name="provider"
                value={provider}
                onChange={(event) => setProvider(event.target.value as AuctionProvider)}
              >
                {activeAuctionProviderChoices(saved ? opportunity?.provider : provider).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField
              label="Número de lote"
              hint={provider === "copart" ? "Busca el lote en el inventario oficial de Copart." : undefined}
            >
              <div className="flex gap-2">
                <AdminInput
                  name="provider_lot_id"
                  value={lot}
                  onChange={(event) => setLot(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && provider === "copart") {
                      event.preventDefault();
                      void lookupLot();
                    }
                  }}
                />
                {provider === "copart" ? (
                  <AdminSecondaryButton type="button" disabled={lookupBusy} onClick={() => void lookupLot()}>
                    {lookingUp ? "Buscando..." : "Buscar lote"}
                  </AdminSecondaryButton>
                ) : null}
              </div>
            </AdminField>
            <div className="sm:col-span-2">
              <AdminField label="Enlace de origen">
                <AdminInput name="source_url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} />
              </AdminField>
              {isSafeHttpUrl(sourceUrl) ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-10 items-center text-sm text-[var(--admin-text-secondary)] underline-offset-2 hover:underline"
                >
                  Abrir lote original
                </a>
              ) : null}
            </div>
            <AdminField label="VIN">
              <AdminInput
                name="vin"
                maxLength={17}
                value={form.vin}
                onChange={(event) => patchForm("vin", event.target.value)}
                className="font-mono uppercase"
              />
            </AdminField>
            <AdminField label="Año">
              <AdminInput
                name="year"
                type="number"
                min={1980}
                max={2100}
                value={form.year}
                onChange={(event) => patchForm("year", event.target.value)}
              />
            </AdminField>
            <AdminField label="Marca">
              <AdminInput name="make" value={form.make} onChange={(event) => patchForm("make", event.target.value)} />
            </AdminField>
            <AdminField label="Modelo">
              <AdminInput name="model" value={form.model} onChange={(event) => patchForm("model", event.target.value)} />
            </AdminField>
            <AdminField label="Versión">
              <AdminInput name="trim" value={form.trim} onChange={(event) => patchForm("trim", event.target.value)} />
            </AdminField>
            <AdminField label="Kilometraje">
              <AdminInput
                name="mileage"
                type="number"
                min={0}
                value={form.mileage}
                onChange={(event) => patchForm("mileage", event.target.value)}
              />
            </AdminField>
            <AdminField label="Título">
              <AdminInput
                name="title_status"
                value={form.titleStatus}
                onChange={(event) => patchForm("titleStatus", event.target.value)}
              />
            </AdminField>
            <AdminField label="Daño principal">
              <AdminInput
                name="primary_damage"
                value={form.primaryDamage}
                onChange={(event) => patchForm("primaryDamage", event.target.value)}
              />
            </AdminField>
            <AdminField label="Ubicación de subasta" hint="Yard o ciudad de la subasta. No es la dirección de Valcron.">
              <AdminInput
                name="location"
                value={form.location}
                onChange={(event) => patchForm("location", event.target.value)}
              />
            </AdminField>
            <div className="sm:col-span-2 xl:col-span-4">
              <AdminField label="Nota interna" hint="No aparece en el catálogo público.">
                <AdminTextArea name="internal_notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
              </AdminField>
            </div>
          </div>
          {lookup?.status === "found" ? (
            <p className="mt-4 text-xs text-[var(--admin-text-muted)]">{COPART_LOOKUP_LOADED_COPY}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <AdminPrimaryButton type="submit" disabled={pending || preparing || lookupBusy}>
              {pending ? "Guardando..." : "Guardar borrador"}
            </AdminPrimaryButton>
            {saved ? (
              <AdminSecondaryButton type="button" disabled={pending || preparing} onClick={() => void prepare()}>
                {preparing ? "Preparando..." : "Preparar para website"}
              </AdminSecondaryButton>
            ) : null}
          </div>
        </AdminCard>
      </form>

      <AdminConfirmDialog
        open={Boolean(pendingReplace)}
        title="¿Reemplazar los datos del vehículo?"
        description="Ya editaste esta ficha. Si continúas, los datos del nuevo lote de Copart reemplazarán lo que escribiste."
        confirmLabel="Reemplazar datos"
        pending={false}
        onConfirm={() => {
          if (pendingReplace) applyLookup(pendingReplace);
          setPendingReplace(null);
        }}
        onClose={() => setPendingReplace(null)}
      />
    </div>
  );
}
