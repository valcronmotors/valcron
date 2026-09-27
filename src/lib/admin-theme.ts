import type { VehicleStatus } from "@/lib/website-schema";

export const ADMIN_STATUS_BADGE: Record<VehicleStatus, string> = {
  draft:
    "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]",
  available:
    "border-transparent bg-[var(--admin-success-bg)] text-[var(--admin-success)]",
  reserved:
    "border-transparent bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]",
  sold:
    "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  hidden:
    "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]",
};

export function adminStatusBadgeClass(status: string | null | undefined) {
  if (status && status in ADMIN_STATUS_BADGE) {
    return ADMIN_STATUS_BADGE[status as VehicleStatus];
  }
  return "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]";
}

export const ADMIN_PUBLISH_BADGE = {
  published: "border-transparent bg-[var(--admin-success-bg)] text-[var(--admin-success)]",
  unpublished: "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]",
} as const;

export const AUCTION_BRAND = {
  copart: {
    label: "Copart",
    className:
      "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  },
  iaa: {
    label: "IAA",
    className:
      "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  },
  manheim: {
    label: "Manheim",
    className:
      "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  },
  other: {
    label: "Otro",
    className:
      "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  },
} as const;

export type AuctionBrand = keyof typeof AUCTION_BRAND;
