import {
  evaluateAuctionEligibility,
  type AuctionEligibilityResult,
  type EligibilityOverall,
} from "@/lib/auctions/eligibility";
import { readAuctionMetadata } from "@/lib/auction-admin-fields";
import type { AuctionOpportunityRow } from "@/lib/website-schema";

export type AuctionEligibilityAuditRow = {
  opportunityId: string;
  linkedVehicleId: string | null;
  provider: string;
  lot: string | null;
  title: string;
  websitePublished: boolean;
  overall: EligibilityOverall;
  overallLabel: string;
  reasons: string[];
  canRemainPublic: boolean;
};

export type AuctionEligibilityAuditReport = {
  auditedAt: string;
  totalPublishedWebsite: number;
  eligible: number;
  blocked: number;
  reviewRequired: number;
  failingPublic: AuctionEligibilityAuditRow[];
  all: AuctionEligibilityAuditRow[];
};

export function opportunityEligibilityInput(opportunity: AuctionOpportunityRow) {
  const meta = readAuctionMetadata(opportunity.auction_metadata);
  return {
    vin: opportunity.vin,
    title_status: opportunity.title_status,
    odometer_status: meta.odometer_status,
    primary_damage: opportunity.primary_damage,
    secondary_damage: meta.secondary_damage,
    run_and_drive: meta.run_and_drive,
  };
}

export function evaluateOpportunityEligibility(
  opportunity: AuctionOpportunityRow,
): AuctionEligibilityResult {
  return evaluateAuctionEligibility(opportunityEligibilityInput(opportunity));
}

export function auditPublishedAuctionOpportunities(
  opportunities: Array<
    AuctionOpportunityRow & {
      linked_vehicle?: { published?: boolean | null; id?: string } | null;
    }
  >,
): AuctionEligibilityAuditReport {
  const auditedAt = new Date().toISOString();
  const all: AuctionEligibilityAuditRow[] = [];

  for (const opportunity of opportunities) {
    const websitePublished = Boolean(opportunity.linked_vehicle?.published);
    if (!websitePublished && opportunity.status !== "published") continue;

    const result = evaluateOpportunityEligibility(opportunity);
    const reasons = [...result.blockedReasons, ...result.reviewReasons];
    all.push({
      opportunityId: opportunity.id,
      linkedVehicleId: opportunity.linked_vehicle_id,
      provider: opportunity.provider,
      lot: opportunity.provider_lot_id,
      title: [opportunity.year, opportunity.make, opportunity.model].filter(Boolean).join(" ") || "Sin título",
      websitePublished,
      overall: result.overall,
      overallLabel: result.overallLabel,
      reasons,
      canRemainPublic: result.canPublish,
    });
  }

  const failingPublic = all.filter((row) => row.websitePublished && !row.canRemainPublic);

  return {
    auditedAt,
    totalPublishedWebsite: all.filter((row) => row.websitePublished).length,
    eligible: all.filter((row) => row.overall === "eligible").length,
    blocked: all.filter((row) => row.overall === "blocked").length,
    reviewRequired: all.filter((row) => row.overall === "review_required").length,
    failingPublic,
    all,
  };
}

export function eligibilitySnapshot(result: AuctionEligibilityResult) {
  return {
    eligibility_overall: result.overall,
    eligibility_label: result.overallLabel,
    eligibility_can_publish: result.canPublish,
    eligibility_checked_at: new Date().toISOString(),
    eligibility_blocked_reasons: result.blockedReasons,
    eligibility_review_reasons: result.reviewReasons,
    eligibility_checks: result.checks.map((check) => ({
      id: check.id,
      verdict: check.verdict,
      reason: check.reason,
      detected: check.detected ?? null,
    })),
  };
}
