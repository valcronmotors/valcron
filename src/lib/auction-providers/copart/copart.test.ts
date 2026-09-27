import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsvRecords, serializeCopartCsv } from "@/lib/auction-providers/copart/csv";
import { COPART_CSV_HEADERS, validateCopartHeaders, zipCopartRow } from "@/lib/auction-providers/copart/schema";
import { formatCopartInsertError, redactIngestErrorText } from "@/lib/auction-providers/copart/ingest-error";
import { matchesCopartFilters, normalizeCopartSearchFilters, paginateRows } from "@/lib/auction-providers/copart/filters";
import { copartFeedIsStale, copartFreshnessCopy } from "@/lib/auction-providers/copart/freshness";
import { ingestCopartCsv } from "@/lib/auction-providers/copart/ingest";
import {
  copartAdminMediaSrc,
  copartCardImageUrl,
  copartPhotoPresentation,
  isCopartDirectImageHost,
  isCopartImageHost,
  isCopartImageManifestUrl,
  normalizeCopartFeedImages,
  normalizeCopartImageReference,
  parseCopartLotImagesManifest,
} from "@/lib/auction-providers/copart/images";
import {
  blankToNull,
  normalizeCopartRow,
  normalizeCopartVin,
  parseCopartMileage,
  parseCopartMoney,
  parseCopartYear,
} from "@/lib/auction-providers/copart/normalizer";
import {
  COPART_DUPLICATE_LOT_MESSAGE,
  copartMetadataLeaksIntoPublicDto,
  copartOpportunityInsert,
  copartPublicDraftExtras,
} from "@/lib/auction-providers/copart/opportunity";
import { copartSearchQueryPlan } from "@/lib/auction-providers/copart/search";
import { COPART_CACHE_INSERT_COLUMNS } from "@/lib/auction-providers/copart/supabase-writer";
import { copartLotSourceUrl, normalizeCopartLotNumber, validateCopartSourceUrl } from "@/lib/auction-providers/copart/urls";
import { opportunityToVehicleDraft, publicVehicleKeysFromDraft } from "@/lib/auctions/prepare-website";
import { publicActionError } from "@/lib/action-errors";

const FIXTURE_ROWS = [
  {
    "Lot number": "90000001",
    Year: "2021",
    Make: "TOYOTA",
    "Model Group": "RAV4",
    "Model Detail": "RAV4",
    Trim: "XLE",
    VIN: "JTMRWRFV0MD123456",
    Odometer: "41200.0",
    Color: "WHITE",
    "Damage Description": "FRONT END",
    "Secondary Damage": "",
    "Sale Title State": "FL",
    "Sale Title Type": "SC",
    "Has Keys-Yes or No": "YES",
    Engine: "2.5L 4",
    Drive: "ALL WHEEL DRIVE",
    Transmission: "AUTOMATIC",
    "Fuel Type": "GAS",
    Cylinders: "4",
    "Runs/Drives": "Run & Drive Verified",
    "Sale Status": "On Minimum Bid",
    "Location city": "MIAMI",
    "Location state": "FL",
    "Currency Code": "USD",
    "Image Thumbnail": "cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0001/thumb-a.jpg",
    "Buy-It-Now Price": "12500.0",
    "Image URL": "http://inventoryv2.copart.io/v1/lotImages/90000001?country=us&brand=cprt&yardNumber=1",
    "Last Updated Time": "2026-09-20T12:00:00Z",
    "Est. Retail Value": "22000.0",
    "Repair cost": "4100.0",
    "Sale Date M/D/CY": "20261002",
    "Sale time (HHMM)": "1200",
    "Seller Name": "Example Insurance",
  },
  {
    "Lot number": "90000002",
    Year: "2018",
    Make: "HONDA",
    "Model Group": "CIVIC",
    VIN: "19XFC2F59JE123456",
    Odometer: "88010.0",
    Color: "BLUE",
    "Damage Description": "REAR END",
    "Sale Title Type": "DV",
    "Has Keys-Yes or No": "NO",
    "Runs/Drives": "DEFAULT",
    "Location city": "HOUSTON",
    "Location state": "TX",
    "Currency Code": "USD",
    "Buy-It-Now Price": "0.0",
    "Image Thumbnail": "cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0001/thumb-b.jpg",
    "Last Updated Time": "2026-09-21T08:00:00Z",
    "Sale Date M/D/CY": "0",
  },
  {
    "Lot number": "90000003",
    Year: "2019",
    Make: "FORD",
    "Model Group": "F-150",
    Trim: "",
    VIN: "1FTEW1E53KFA12345",
    Odometer: "64000.0",
    Color: "BLACK",
    "Damage Description": "HAIL",
    "Sale Title Type": "CT",
    "Has Keys-Yes or No": "YES",
    Engine: "3.5L 6",
    Drive: "4x4 w/Rear Wheel Drv",
    Transmission: "AUTOMATIC",
    "Fuel Type": "GAS",
    "Runs/Drives": "Vehicle Starts",
    "Location city": "ATLANTA",
    "Location state": "GA",
    "Buy-It-Now Price": "8900.0",
    "Currency Code": "USD",
    "Image Thumbnail": "",
    "Image URL": "https://evil.example/not-copart.jpg",
    "Last Updated Time": "2026-09-22T10:00:00Z",
  },
  {
    "Lot number": "90000004",
    Year: "2016",
    Make: "BMW",
    "Model Group": "3 SERIES",
    "Model Detail": "320",
    VIN: "WBA8E9C50GK123456",
    Odometer: "101200.0",
    "Damage Description": "SIDE",
    "Secondary Damage": "MECHANICAL",
    "Runs/Drives": "DEFAULT",
    "Location city": "NEWARK",
    "Location state": "NJ",
    "Buy-It-Now Price": "4500.0",
    "Has Keys-Yes or No": "EXM",
    "Currency Code": "USD",
    "Last Updated Time": "2026-09-18T18:00:00Z",
  },
  {
    "Lot number": "90000005",
    Year: "2024",
    Make: "HORIZON TRAILER",
    "Model Group": "UNKNOWN",
    VIN: "",
    Odometer: "0.0",
    "Body Style": "TRAILER",
    "Damage Description": "NORMAL WEAR",
    "Runs/Drives": "DEFAULT",
    "Location city": "VALLEJO",
    "Location state": "CA",
    "Buy-It-Now Price": "9750.0",
    "Currency Code": "USD",
    "Last Updated Time": "2026-09-25T20:00:00Z",
  },
  {
    "Lot number": "90000006",
    Year: "2015",
    Make: "MINI",
    "Model Group": "COOPER",
    VIN: "WMWXS5C55FT123456",
    Odometer: "120812.0",
    Color: "BEIGE",
    "Damage Description": "FRONT END",
    "Secondary Damage": "MINOR DENT/SCRATCHES",
    "Runs/Drives": "Run & Drive Verified",
    "Location city": "PHOENIX",
    "Location state": "AZ",
    "Buy-It-Now Price": "1800.0",
    Engine: "1.5L 3",
    Transmission: "AUTOMATIC",
    Drive: "FRONT WHEEL DRIVE",
    "Fuel Type": "GAS",
    "Currency Code": "USD",
    "Last Updated Time": "2026-09-19T11:00:00Z",
  },
];

export const COPART_SAMPLE_CSV = serializeCopartCsv(FIXTURE_ROWS);

describe("Copart official CSV mapping", () => {
  it("validates the official 59 headers including quoted comma header", () => {
    expect(COPART_CSV_HEADERS).toHaveLength(59);
    expect(COPART_CSV_HEADERS).toContain("High Bid =non-vix,Sealed=Vix");
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    expect(validateCopartHeaders(records[0] ?? []).ok).toBe(true);
    expect(records[0]).toEqual([...COPART_CSV_HEADERS]);
    const committed = readFileSync(new URL("./fixtures/salesdata.sample.csv", import.meta.url), "utf8");
    expect(validateCopartHeaders(parseCsvRecords(committed)[0] ?? []).ok).toBe(true);
  });

  it("parses quoted commas, CRLF, and blank optional values", () => {
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    expect(records[0]?.length).toBe(59);
    const honda = zipCopartRow(records[0] ?? [], records[2] ?? []);
    expect(honda?.["Buy-It-Now Price"]).toBe("0.0");
    expect(honda?.Trim).toBe("");
    expect(honda?.["Secondary Damage"]).toBe("");
  });

  it("quarantines Copart inches-quote rows that explode later columns", () => {
    const prefix = Array.from({ length: 14 }, () => "x").join(",");
    const records = parseCsvRecords(
      `${prefix},body,color,rest\n${prefix},"M-240ML-SLIDE 29'9"","TWO TONE","UNDERCARRIAGE"\n`,
    );
    const exploded = records[1] ?? [];
    expect(exploded.some((value) => value.length > 20) || exploded.length !== 17).toBe(true);
  });

  it("quarantines exploded text fields instead of inserting them", () => {
    const row = zipCopartRow(COPART_CSV_HEADERS as unknown as string[], COPART_CSV_HEADERS.map((header) => {
      if (header === "Lot number") return "60299556";
      if (header === "Year") return "2022";
      if (header === "Make") return "GRAND DESIGN";
      if (header === "Model Group") return "TRANSCEND";
      if (header === "VIN") return "573TT3025N8820437";
      if (header === "Color") return "TWO TONE".padEnd(600, "X");
      return "";
    }));
    expect(normalizeCopartRow(row!).reason).toMatch(/field_too_long:color/);
    expect(normalizeCopartRow(row!).vehicle).toBeNull();
  });

  it("rejects malformed short rows", () => {
    const parsed = parseCsvRecords('Lot number,Year\n"1"\n');
    expect(parsed[1]?.length).toBeLessThan(8);
  });

  it("normalizes VIN, lot, year, mileage, currency, and Buy It Now", () => {
    expect(normalizeCopartVin(" jtmrwrfv0md123456 ")).toBe("JTMRWRFV0MD123456");
    expect(normalizeCopartVin("TOOSHORT")).toBeNull();
    expect(normalizeCopartLotNumber("90000001")).toBe("90000001");
    expect(parseCopartYear("2021")).toBe(2021);
    expect(parseCopartYear("12")).toBeNull();
    expect(parseCopartMileage("41200.0")).toBe(41200);
    expect(parseCopartMoney("0.0")).toBeNull();
    expect(parseCopartMoney("12500.0")).toBe(12500);
    expect(blankToNull("UNKNOWN")).toBeNull();
  });

  it("maps a full official row without fabricating values", () => {
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    const row = zipCopartRow(records[0] ?? [], records[1] ?? []);
    const result = normalizeCopartRow(row!);
    expect(result.vehicle?.make).toBe("TOYOTA");
    expect(result.vehicle?.model).toBe("RAV4");
    expect(result.vehicle?.buyItNowPrice).toBe(12500);
    expect(result.vehicle?.primaryDamage).toBe("FRONT END");
    expect(result.vehicle?.location).toBe("MIAMI, FL");
    expect(result.vehicle?.sourceUrl).toBe("https://www.copart.com/lot/90000001");
    expect(result.vehicle?.thumbnailUrl).toMatch(/^https:\/\/cs\.copart\.com\//);
  });
});

describe("Copart image and source URLs", () => {
  const thumb = "cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg";
  const manifest = "http://inventoryv2.copart.io/v1/lotImages/90000001?country=us&brand=cprt&yardNumber=1";
  const full = "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_ful.jpg";

  it("accepts official Copart hosts and https thumbnails", () => {
    expect(isCopartImageHost("cs.copart.com")).toBe(true);
    expect(isCopartDirectImageHost("cs.copart.com")).toBe(true);
    expect(isCopartDirectImageHost("inventoryv2.copart.io")).toBe(false);
    expect(
      normalizeCopartImageReference(thumb),
    ).toBe("https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg");
    expect(normalizeCopartImageReference(manifest)).toMatch(/^https:\/\/inventoryv2\.copart\.io\//);
  });

  it("never uses the lotImages JSON URL as an img src", () => {
    expect(isCopartImageManifestUrl(manifest.replace("http://", "https://"))).toBe(true);
    expect(copartCardImageUrl(null, manifest)).toBeNull();
    expect(copartPhotoPresentation(null, manifest).kind).toBe("placeholder");
    expect(copartPhotoPresentation(thumb, manifest).kind).toBe("image");
  });

  it("normalizes thumbnail, primary image, blanks, query strings, and duplicates", () => {
    const images = normalizeCopartFeedImages({
      thumbnail: thumb,
      imageUrl: manifest,
      extraUrls: [`${full} `, full],
    });
    expect(images.thumbnailUrl).toMatch(/_thb\.jpg$/);
    expect(images.primaryImageUrl).toBe(images.thumbnailUrl);
    expect(images.imageUrls).toHaveLength(2);
    expect(
      normalizeCopartImageReference("https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_ful.jpg?x=1"),
    ).toContain("x=1");
    expect(normalizeCopartFeedImages({ thumbnail: "", imageUrl: "" }).thumbnailUrl).toBeNull();
    expect(copartPhotoPresentation("", null).kind).toBe("placeholder");
    expect(copartAdminMediaSrc(images.thumbnailUrl)).toMatch(/^\/api\/admin\/copart-media\?src=/);
  });

  it("parses a sanitized lotImages manifest and prefers full JPEGs", () => {
    const urls = parseCopartLotImagesManifest({
      imgCount: 2,
      lotImages: [
        {
          sequence: 0,
          link: [
            { url: `${full} `, isThumbNail: false, isHdImage: false, isBlurred: false, isEngineSound: false },
            { url: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg", isThumbNail: true },
            { url: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_hrs.jpg", isHdImage: true },
          ],
        },
        {
          sequence: 1,
          link: [{ url: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/def_ful.jpg", isThumbNail: false }],
        },
      ],
    });
    expect(urls).toEqual([
      "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_ful.jpg",
      "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/def_ful.jpg",
    ]);
  });

  it("rejects invalid image hosts and non-https source URLs", () => {
    expect(normalizeCopartImageReference("https://evil.example/photo.jpg")).toBeNull();
    expect(normalizeCopartImageReference("https://www.copart.com/lot/1.jpg")).toBeNull();
    expect(isCopartImageHost("cs.copart.com.attacker.com")).toBe(false);
    expect(isCopartImageHost("notcopart.com")).toBe(false);
    expect(normalizeCopartImageReference("javascript:alert(1)")).toBeNull();
    expect(normalizeCopartImageReference("data:image/jpeg;base64,aaa")).toBeNull();
    expect(normalizeCopartImageReference("file:///tmp/a.jpg")).toBeNull();
    expect(normalizeCopartImageReference("http://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg")).toMatch(
      /^https:\/\/cs\.copart\.com\//,
    );
    expect(validateCopartSourceUrl("http://www.copart.com/lot/90000001")).toBeNull();
    expect(validateCopartSourceUrl("https://www.iaai.com/VehicleDetail/1")).toBeNull();
    expect(copartLotSourceUrl("90000001")).toBe("https://www.copart.com/lot/90000001");
  });
});

describe("Copart search filters and pagination", () => {
  it("filters Buy It Now, damage, location, and paginates server-side math", () => {
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    const vehicles = records.slice(1).map((values) => {
      const row = zipCopartRow(records[0] ?? [], values)!;
      return normalizeCopartRow(row).vehicle;
    });
    const ready = vehicles.flatMap((vehicle) =>
      vehicle
        ? [
            {
              searchText: `${vehicle.lotNumber} ${vehicle.make} ${vehicle.model}`.toLowerCase(),
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              locationState: vehicle.locationState,
              titleType: vehicle.titleType,
              primaryDamage: vehicle.primaryDamage,
              runCondition: vehicle.runCondition,
              buyItNowPrice: vehicle.buyItNowPrice,
              mileage: vehicle.mileage,
            },
          ]
        : [],
    );
    const bin = ready.filter((row) =>
      matchesCopartFilters(row, normalizeCopartSearchFilters({ buyItNow: true })),
    );
    expect(bin.every((row) => (row.buyItNowPrice ?? 0) > 0)).toBe(true);
    const texas = ready.filter((row) =>
      matchesCopartFilters(row, normalizeCopartSearchFilters({ locationState: "TX" })),
    );
    expect(texas).toHaveLength(1);
    const page = paginateRows(ready, 1, 2);
    expect(page.items).toHaveLength(2);
    expect(page.totalPages).toBeGreaterThan(1);
    expect(copartSearchQueryPlan({ query: "90000001" }).exactLot).toBe("90000001");
  });
});

describe("Copart ingest, opportunities, and public privacy", () => {
  it("streams a fixture, dedupes lots, and reports stats", async () => {
    const file = join(tmpdir(), "valcron-copart-fixture.csv");
    const duplicate = `${COPART_SAMPLE_CSV}${serializeCopartCsv([FIXTURE_ROWS[0]!]).split("\r\n")[1]}\r\n`;
    writeFileSync(file, duplicate);
    const result = await ingestCopartCsv({ filePath: file, keepRows: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.valid).toBe(FIXTURE_ROWS.length);
    expect(result.stats.duplicates).toBeGreaterThanOrEqual(1);
    expect(result.stats.feedTimestamp).toBeTruthy();
  });

  it("ingests a sanitized Copart inches-quote row without exploding later fields", async () => {
    const file = join(tmpdir(), "valcron-copart-inches.csv");
    const base = {
      ...FIXTURE_ROWS[0],
      "Lot number": "60299556",
      Year: "2022",
      Make: "GRAND DESIGN",
      "Model Group": "TRANSCEND",
      "Model Detail": "TRANSCEND",
      VIN: "573TT3025N8820437",
      Color: "WHITE",
      "Damage Description": "UNDERCARRIAGE",
      "Location city": "VALLEJO",
      "Location state": "CA",
    };
    const values = COPART_CSV_HEADERS.map((header) => {
      if (header === "Body Style") return `"M-240ML-SLIDE 29'9""`;
      if (header === "Color") return `"TWO TONE"`;
      const value = String(base[header as keyof typeof base] ?? "");
      return /["\r\n,]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    });
    writeFileSync(file, `${COPART_SAMPLE_CSV}${values.join(",")}\r\n`);
    const result = await ingestCopartCsv({ filePath: file, keepRows: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.rows.some((row) => row.lotNumber === "90000001")).toBe(true);
    expect(result.rows.every((row) => (row.color?.length ?? 0) < 80)).toBe(true);
    expect(result.rows.every((row) => row.searchText.length < 500)).toBe(true);
    const exploded = result.rows.find((row) => row.lotNumber === "60299556");
    if (exploded) {
      expect(exploded.bodyStyle).toBe("M-240ML-SLIDE 29'9\"");
      expect(exploded.color).toBe("TWO TONE");
    } else {
      expect(result.stats.rejected).toBeGreaterThanOrEqual(1);
    }
  });

  it("reports insert failures with batch, lot, and safe database details", () => {
    const message = formatCopartInsertError(
      {
        code: "413",
        message: "Payload too large Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaaaaaaaaaaaaaaaaaaa",
        details: "request body exceeded limit",
        hint: null,
      },
      { batchNumber: 10, csvRowsRead: 2346, rowCount: 250, lotNumbers: ["60299556", "52408406"] },
    );
    expect(message).toMatch(/lote Copart #10/);
    expect(message).toContain("60299556");
    expect(message).toContain("code=413");
    expect(message).not.toMatch(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    expect(redactIngestErrorText("Bearer abc.def.ghi")).toBe("[redacted]");
  });

  it("maps add-to-opportunity fields without dumping every CSV column", () => {
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    const row = zipCopartRow(records[0] ?? [], records[1] ?? [])!;
    const vehicle = normalizeCopartRow(row).vehicle!;
    const insert = copartOpportunityInsert(vehicle);
    expect(insert.provider).toBe("copart");
    expect(insert.provider_lot_id).toBe("90000001");
    expect(insert.auction_metadata).not.toHaveProperty("highBid");
    expect(JSON.stringify(insert)).not.toMatch(/password|credential/i);
    expect(COPART_DUPLICATE_LOT_MESSAGE).toBe("Este lote ya está en tus oportunidades.");
    expect(
      publicActionError(
        { code: "23505", message: 'duplicate key value violates unique constraint "auction_opportunities_provider_lot_uidx"' },
        "No se pudo guardar.",
      ),
    ).toBe(COPART_DUPLICATE_LOT_MESSAGE);
  });

  it("prepares a website draft without Copart private metadata or auto price", () => {
    const records = parseCsvRecords(COPART_SAMPLE_CSV);
    const row = zipCopartRow(records[0] ?? [], records[1] ?? [])!;
    const vehicle = normalizeCopartRow(row).vehicle!;
    const insert = copartOpportunityInsert(vehicle);
    const draft = opportunityToVehicleDraft({
      ...insert,
      internal_notes: "NOTAS INTERNAS",
      provider_lot_id: insert.provider_lot_id,
    });
    expect(draft.data?.source_type).toBe("other");
    expect(draft.data?.published).toBe(false);
    expect(draft.data?.engine).toBe("2.5L 4");
    expect(draft.data?.exterior_color).toBe("WHITE");
    expect(JSON.stringify(draft.data)).not.toContain("Example Insurance");
    expect(JSON.stringify(draft.data)).not.toContain("4100");
    expect(JSON.stringify(publicVehicleKeysFromDraft(draft.data!))).not.toContain("buyItNowPrice");
    expect(copartMetadataLeaksIntoPublicDto(draft.data)).toBe(false);
    expect(copartPublicDraftExtras(insert.auction_metadata).fuel).toBe("GAS");
    expect(draft.data?.price).toBeNull();
    expect(draft.data?.public_price_mode).toBe("contact");
  });

  it("marks missing Copart snapshots as stale", () => {
    expect(copartFeedIsStale(null)).toBe(true);
    expect(copartFreshnessCopy(new Date().toISOString()).stale).toBe(false);
    expect(copartFreshnessCopy("2020-01-01T00:00:00.000Z").warning).toMatch(/desactualizado/i);
  });

  it("keeps Copart ingest out of public catalog code", () => {
    const catalog = readFileSync(new URL("../../public-catalog.ts", import.meta.url), "utf8");
    const home = readFileSync(new URL("../../../app/page.tsx", import.meta.url), "utf8");
    expect(catalog).not.toMatch(/auction-providers\/copart/);
    expect(home).not.toMatch(/auction-providers\/copart/);
  });
});

describe("Copart migration contract", () => {
  it("creates admin-only cache tables without touching V1 inventory tables", () => {
    const sql = readFileSync(
      new URL("../../../../supabase/migrations/20260927190000_copart_inventory_cache.sql", import.meta.url),
      "utf8",
    );
    expect(sql).toMatch(/create table public\.copart_feed_snapshots/);
    expect(sql).toMatch(/create table public\.copart_inventory_cache/);
    expect(sql).toMatch(/enable row level security/);
    expect(sql).toMatch(/revoke all on table public\.copart_inventory_cache from anon/);
    expect(sql).toMatch(/using \(\(select public\.is_website_admin\(\)\)\)/);
    expect(sql).toMatch(/grant execute on function public\.activate_copart_feed_snapshot/);
    expect(sql).toMatch(/grant execute on function public\.fail_copart_feed_snapshot/);
    expect(sql).toMatch(/grant all on table public\.copart_inventory_cache to service_role/);
    expect(sql).toMatch(/get diagnostics activated = row_count/);
    expect(sql).toMatch(/gin_trgm_ops/);
    expect(sql).toMatch(/create extension if not exists pg_trgm with schema extensions/);
    expect(sql).not.toMatch(/alter table public\.vehicles/);
    expect(sql).not.toMatch(/alter table public\.auction_opportunities/);
    expect(sql).not.toMatch(/SUPABASE_SERVICE_ROLE/);
    expect(COPART_CACHE_INSERT_COLUMNS).toContain("lot_number");
    expect(COPART_CACHE_INSERT_COLUMNS).toContain("search_text");
    expect(COPART_CACHE_INSERT_COLUMNS).not.toContain("password");
  });
});
