import { describe, expect, it } from "vitest";
import {
  ACTIVE_AUCTION_PROVIDERS,
  ACTIVE_PROVIDER_FILTERS,
  OPPORTUNITY_WEBSITE_STATE_LABEL,
  activeAuctionProviderChoices,
  filterOpportunities,
  formatAuctionDisplayName,
  historicalProviderLabel,
  newOpportunityRejectsManheim,
  opportunityCountLabel,
  opportunityMatchesQuery,
  opportunityOverflowActions,
  opportunityThumbnailUrl,
  opportunityVehicleTitle,
  opportunityWebsiteState,
  providerFilterFromParam,
  remapNewOpportunityProvider,
} from "@/lib/auctions/opportunity-admin";
import type { AuctionOpportunityRow } from "@/lib/website-schema";

function opportunity(overrides: Partial<AuctionOpportunityRow> = {}): AuctionOpportunityRow {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    provider: "copart",
    provider_lot_id: "66502456",
    source_url: "https://www.copart.com/lot/66502456",
    vin: "1HGCM82633A004352",
    year: 2021,
    make: "HONDA",
    model: "CR-V",
    trim: "EX",
    mileage: 104392,
    title_status: "SC",
    primary_damage: "FRONT END",
    location: "APOPKA, FL",
    auction_metadata: {
      thumbnailUrl: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg",
    },
    internal_notes: null,
    status: "review",
    linked_vehicle_id: null,
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("active auction opportunity UI", () => {
  it("offers Copart, IAA, and Manheim for new opportunities", () => {
    const labels = activeAuctionProviderChoices().map((item) => item.id);
    expect(labels).toEqual(["copart", "iaa", "manheim"]);
    expect(activeAuctionProviderChoices().find((item) => item.id === "iaa")?.label).toBe("IAA");
    expect(ACTIVE_AUCTION_PROVIDERS).toEqual(["copart", "iaa", "manheim"]);
    expect(ACTIVE_PROVIDER_FILTERS.map((item) => item.id)).toEqual(["all", "copart", "iaa", "manheim"]);
    expect(newOpportunityRejectsManheim("manheim", false)).toBe(false);
    expect(newOpportunityRejectsManheim("copart", false)).toBe(false);
    expect(remapNewOpportunityProvider("manheim")).toBe("manheim");
    expect(remapNewOpportunityProvider("iaa")).toBe("iaa");
  });

  it("keeps Manheim selectable for new and historical records", () => {
    const choices = activeAuctionProviderChoices("manheim");
    expect(choices.some((item) => item.id === "manheim")).toBe(true);
    expect(newOpportunityRejectsManheim("manheim", true)).toBe(false);
    expect(historicalProviderLabel("manheim")).toBe("Manheim");
    expect(providerFilterFromParam("manheim")).toBe("manheim");
  });
});

describe("opportunity filters and search", () => {
  const rows = [
    opportunity(),
    opportunity({ id: "iaa-1", provider: "iaa", provider_lot_id: "555", make: "TOYOTA", model: "CAMRY", status: "draft" }),
    opportunity({ id: "mh-1", provider: "manheim", provider_lot_id: "99", make: "FORD", model: "F-150", status: "archived" }),
  ];

  it("filters by Copart, IAA, and Manheim", () => {
    expect(filterOpportunities(rows, { provider: "copart" }).map((row) => row.id)).toEqual([
      "11111111-1111-4111-8111-111111111111",
    ]);
    expect(filterOpportunities(rows, { provider: "iaa" })[0]?.provider).toBe("iaa");
    expect(filterOpportunities(rows, { provider: "manheim" })[0]?.provider).toBe("manheim");
    expect(filterOpportunities(rows, { provider: "all" }).some((row) => row.provider === "manheim")).toBe(true);
  });

  it("filters by opportunity status", () => {
    expect(filterOpportunities(rows, { status: "draft" })).toHaveLength(1);
    expect(filterOpportunities(rows, { status: "archived" })[0]?.provider).toBe("manheim");
  });

  it("searches vehicle, VIN, and lot together with provider/status", () => {
    expect(opportunityMatchesQuery(rows[0]!, "66502456")).toBe(true);
    expect(opportunityMatchesQuery(rows[0]!, "1HGCM82633A004352")).toBe(true);
    expect(opportunityMatchesQuery(rows[0]!, "honda")).toBe(true);
    expect(
      filterOpportunities(rows, { provider: "copart", status: "review", query: "honda" }),
    ).toHaveLength(1);
    expect(filterOpportunities(rows, { query: "camry", provider: "copart" })).toHaveLength(0);
  });
});

describe("opportunity presentation", () => {
  it("humanizes vehicle names without mutating raw provider data", () => {
    const row = opportunity();
    expect(opportunityVehicleTitle(row)).toBe("2021 Honda CR-V");
    expect(formatAuctionDisplayName("HONDA")).toBe("Honda");
    expect(formatAuctionDisplayName("RAV4")).toBe("RAV4");
    expect(formatAuctionDisplayName("F-150")).toBe("F-150");
    expect(row.make).toBe("HONDA");
    expect(opportunityCountLabel(1)).toBe("1 oportunidad");
    expect(opportunityCountLabel(3)).toBe("3 oportunidades");
  });

  it("uses a Copart thumbnail when the official feed image is valid", () => {
    expect(opportunityThumbnailUrl(opportunity())).toMatch(/^https:\/\/cs\.copart\.com\//);
    expect(opportunityThumbnailUrl(opportunity({ provider: "iaa" }))).toBeNull();
    expect(opportunityThumbnailUrl(opportunity({ auction_metadata: {} }))).toBeNull();
  });

  it("derives website state from the linked vehicle, not from the opportunity existing", () => {
    const row = opportunity();
    expect(opportunityWebsiteState(row)).toBe("unprepared");
    expect(OPPORTUNITY_WEBSITE_STATE_LABEL.unprepared).toBe("No preparado");
    expect(OPPORTUNITY_WEBSITE_STATE_LABEL.draft).toBe("Borrador");
    expect(OPPORTUNITY_WEBSITE_STATE_LABEL.ready).toBe("Listo para publicar");
    expect(OPPORTUNITY_WEBSITE_STATE_LABEL.published).toBe("Publicado");
    expect(opportunityWebsiteState({ ...row, linked_vehicle_id: "veh-1" }, null)).toBe("draft");
    expect(
      opportunityWebsiteState(
        { ...row, linked_vehicle_id: "veh-1" },
        {
          id: "veh-1",
          published: false,
          status: "draft",
          year: 2021,
          make: "Honda",
          model: "CR-V",
          description: "Corta",
          price: null,
          source_type: "other",
          vehicle_photos: [],
        },
      ),
    ).toBe("draft");
    expect(
      opportunityWebsiteState(
        {
          ...row,
          linked_vehicle_id: "veh-1",
          title_status: "Salvage Title",
          primary_damage: "Normal Wear",
          auction_metadata: {
            ...row.auction_metadata,
            odometer_status: "Actual",
            secondary_damage: "None",
            run_and_drive: "Run and Drive",
            price_mode: "contact",
          },
        },
        {
          id: "veh-1",
          published: false,
          status: "available",
          year: 2021,
          make: "Honda",
          model: "CR-V",
          description: "Unidad lista para entrega en Santo Domingo Este.",
          price: null,
          public_price_mode: "contact",
          source_type: "other",
          vehicle_photos: [{ id: "p1", is_cover: true }],
        },
      ),
    ).toBe("ready");
    expect(
      opportunityWebsiteState(
        {
          ...row,
          linked_vehicle_id: "veh-1",
          vin: "7FARS6H97TE******",
          auction_metadata: {
            ...row.auction_metadata,
            odometer_status: "Actual",
            secondary_damage: "None",
            run_and_drive: "Run and Drive",
            price_mode: "contact",
          },
        },
        {
          id: "veh-1",
          published: false,
          status: "available",
          year: 2021,
          make: "Honda",
          model: "CR-V",
          description: "Unidad lista para entrega en Santo Domingo Este.",
          price: null,
          public_price_mode: "contact",
          source_type: "other",
          vehicle_photos: [{ id: "p1", is_cover: true }],
        },
      ),
    ).toBe("draft");
    expect(
      opportunityWebsiteState(
        { ...row, linked_vehicle_id: "veh-1" },
        {
          id: "veh-1",
          published: true,
          status: "available",
          year: 2021,
          make: "Honda",
          model: "CR-V",
          description: "Unidad lista para entrega en Santo Domingo Este.",
          price: 18900,
          source_type: "other",
          vehicle_photos: [{ id: "p1", is_cover: true }],
        },
      ),
    ).toBe("published");
  });

  it("exposes manual workflow overflow actions without extraction labels", () => {
    const actions = opportunityOverflowActions(opportunity());
    expect(actions.map((item) => item.id)).toEqual(["view", "edit", "publish", "source", "archive"]);
    expect(actions.map((item) => item.label)).toEqual([
      "Ver oportunidad",
      "Editar",
      "Publicar",
      "Abrir lote original",
      "Archivar",
    ]);
    expect(JSON.stringify(actions)).not.toMatch(/provider_lot_id|linked_vehicle_id|source_type|NOT_CONFIGURED|Extract|CSV|Preparar/);
    const linked = opportunityOverflowActions(
      {
        ...opportunity(),
        linked_vehicle_id: "veh-1",
        status: "published",
      },
      {
        id: "veh-1",
        published: true,
        status: "available",
        year: 2021,
        make: "Honda",
        model: "CR-V",
        description: "Lista",
        price: null,
        public_price_mode: "contact",
        source_type: "other",
        vehicle_photos: [{ id: "p1", is_cover: true }],
      },
    );
    expect(linked.some((item) => item.id === "preview")).toBe(true);
    expect(linked.some((item) => item.id === "unpublish")).toBe(true);
    expect(linked.some((item) => item.id === "publish")).toBe(false);
    expect(opportunityOverflowActions({ ...opportunity(), status: "archived" }).some((item) => item.id === "archive")).toBe(
      false,
    );
  });

  it("still renders a historical Manheim row in the unfiltered list", () => {
    const row = opportunity({ provider: "manheim", make: "BMW", model: "330I" });
    expect(filterOpportunities([row], { provider: "all" })).toHaveLength(1);
    expect(opportunityVehicleTitle(row)).toBe("2021 BMW 330I");
    expect(historicalProviderLabel(row.provider)).toBe("Manheim");
  });
});
