export const AUCTION_SOURCES = ["Copart", "IAAI", "Manheim"] as const;

export type AuctionSource = (typeof AUCTION_SOURCES)[number];

export type AuctionListing = {
  source: AuctionSource;
  lotNumber: string;
  url: string;
  vin: string;
  vinMasked: boolean;
  marca: string;
  modelo: string;
  trim: string;
  ano: string;
  fotosUrls: string[];
  ubicacionLote: string;
  costoSubastaUsd: number | null;
};

export type AuctionExtractResult =
  | { error: string; data?: undefined }
  | { error?: undefined; data: AuctionListing };

const TRIM_TOKENS = new Set(
  [
    "EX",
    "EXL",
    "EX-L",
    "LX",
    "LE",
    "SE",
    "XLE",
    "XSE",
    "LIMITED",
    "PRESTIGE",
    "SPORT",
    "TOURING",
    "HYBRID",
    "PLATINUM",
    "DENALI",
    "S",
    "SV",
    "SL",
    "BASE",
    "2WD",
    "AWD",
    "4WD",
    "FWD",
    "RWD",
  ].map((token) => token.toUpperCase()),
);

const MULTI_WORD_MAKES = [
  "MERCEDES-BENZ",
  "LAND ROVER",
  "ALFA ROMEO",
  "ASTON MARTIN",
  "ROLLS-ROYCE",
  "RANGE ROVER",
];

const IMAGE_SKIP = [
  "blob:",
  "copart.com/images/",
  "logo",
  "icon",
  "carfax",
  "bbb.org",
  "svg",
];

export function isAuctionSource(value: string): value is AuctionSource {
  return AUCTION_SOURCES.includes(value as AuctionSource);
}

export function parseAuctionQuery(input: string) {
  const query = input.trim();
  if (!query) {
    return { error: "Ingresa una URL o un número de lote de Copart, IAAI o Manheim." };
  }

  if (/^https?:\/\//i.test(query)) {
    let url: URL;
    try {
      url = new URL(query);
    } catch {
      return { error: "La URL no es válida." };
    }

    const host = url.hostname.toLowerCase();
    if (host.includes("copart.")) {
      const lotNumber = extractLotFromPath(url.pathname, /\/lot\/(\d+)/i);
      return {
        error: null,
        source: "Copart" as const,
        lotNumber,
        url: url.toString(),
      };
    }
    if (host.includes("iaai.")) {
      const lotNumber =
        extractLotFromPath(url.pathname, /\/vehicledetail\/(\d+)/i) ||
        extractLotFromPath(url.pathname, /\/vehicle\/(\d+)/i);
      return {
        error: null,
        source: "IAAI" as const,
        lotNumber,
        url: url.toString(),
      };
    }
    if (host.includes("manheim.")) {
      const lotNumber =
        url.searchParams.get("workOrderNumber") ||
        url.searchParams.get("lot") ||
        extractLotFromPath(url.pathname, /\/(\d{5,})/);
      return {
        error: null,
        source: "Manheim" as const,
        lotNumber,
        url: url.toString(),
      };
    }

    return {
      error:
        "Solo se admiten URLs de Copart, IAAI o Manheim. También puedes pegar solo el número de lote.",
    };
  }

  const lotNumber = query.replace(/[^\d]/g, "");
  if (!/^\d{5,12}$/.test(lotNumber)) {
    return {
      error:
        "El número de lote debe ser numérico. Pega la URL completa si el lote incluye letras.",
    };
  }

  return {
    error: null,
    source: null,
    lotNumber,
    url: null,
  };
}

function extractLotFromPath(pathname: string, pattern: RegExp) {
  return pathname.match(pattern)?.[1] ?? "";
}

export function listingUrlsFor(query: ReturnType<typeof parseAuctionQuery>) {
  if (query.error) {
    return [];
  }

  const urls: Array<{ source: AuctionSource; url: string; lotNumber: string }> = [];
  if (query.source && query.url) {
    urls.push({
      source: query.source,
      url: query.url,
      lotNumber: query.lotNumber,
    });
    return urls;
  }

  const lotNumber = query.lotNumber ?? "";
  if (!lotNumber && !query.url) {
    return [];
  }
  urls.push({
    source: "Copart",
    url: `https://www.copart.com/lot/${lotNumber}`,
    lotNumber,
  });
  urls.push({
    source: "IAAI",
    url: `https://www.iaai.com/VehicleDetail/${lotNumber}~US`,
    lotNumber,
  });
  urls.push({
    source: "IAAI",
    url: `https://www.iaai.com/vehicledetail/${lotNumber}`,
    lotNumber,
  });
  return urls;
}

export function parseListingPage(
  source: AuctionSource,
  url: string,
  lotNumber: string,
  pageText: string,
): AuctionListing | null {
  if (isMissingListing(pageText)) {
    return null;
  }

  const heading = extractHeading(pageText);
  const parsedTitle = parseVehicleTitle(heading || extractTitle(pageText));
  const vin = extractVin(pageText);
  const fotosUrls = extractPhotos(pageText);
  const ubicacionLote = extractLocation(pageText, source);
  const costoSubastaUsd = extractBid(pageText);
  const resolvedLot = extractLotNumber(pageText) || lotNumber;

  const hasIdentity = Boolean(
    parsedTitle.marca || parsedTitle.modelo || parsedTitle.ano || vin,
  );
  if (!hasIdentity && fotosUrls.length === 0) {
    return null;
  }

  return {
    source,
    lotNumber: resolvedLot,
    url,
    vin,
    vinMasked: vin.includes("*") || (vin.length > 0 && vin.length < 17),
    marca: titleCase(parsedTitle.marca),
    modelo: titleCase(parsedTitle.modelo),
    trim: parsedTitle.trim,
    ano: parsedTitle.ano,
    fotosUrls,
    ubicacionLote,
    costoSubastaUsd,
  };
}

function isMissingListing(pageText: string) {
  const sample = pageText.slice(0, 2500);
  return (
    /returned error 410/i.test(sample) ||
    /DetailsNotFoundView/i.test(sample) ||
    /that vehicle isn[’']t available/i.test(sample) ||
    /lot not found/i.test(sample) ||
    /can you read this text/i.test(sample) && !/#\s+\d{4}\s+/m.test(pageText)
  );
}

function extractTitle(pageText: string) {
  return (
    pageText.match(/^Title:\s*(.+)$/m)?.[1]?.split("|")[0]?.trim() ?? ""
  );
}

function extractHeading(pageText: string) {
  return pageText.match(/^#\s+(\d{4}\s+.+)$/m)?.[1]?.trim() ?? "";
}

function parseVehicleTitle(title: string) {
  const cleaned = title
    .replace(/\|.*/, "")
    .replace(/for auction.*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  const match = cleaned.match(/^(\d{4})\s+(.+)$/);
  if (!match) {
    return { ano: "", marca: "", modelo: "", trim: "" };
  }

  const ano = match[1];
  let rest = match[2];
  let marca = "";
  const multi = MULTI_WORD_MAKES.find((name) => rest.startsWith(`${name} `));
  if (multi) {
    marca = multi;
    rest = rest.slice(multi.length).trim();
  } else {
    const [first, ...remaining] = rest.split(" ");
    marca = first ?? "";
    rest = remaining.join(" ");
  }

  const tokens = rest.split(" ").filter(Boolean);
  const trimTokens: string[] = [];
  while (tokens.length > 1 && TRIM_TOKENS.has(tokens[tokens.length - 1] ?? "")) {
    trimTokens.unshift(tokens.pop()!);
  }

  return {
    ano,
    marca,
    modelo: tokens.join(" "),
    trim: trimTokens.join(" "),
  };
}

function extractVin(pageText: string) {
  const labeled =
    pageText.match(/VIN(?:\s*\(Status\))?:\s*([A-HJ-NPR-Z0-9*]{11,17})/i)?.[1] ??
    "";
  if (labeled) {
    return labeled.toUpperCase();
  }

  const generic = pageText.match(/\b([A-HJ-NPR-Z0-9]{11,17})\b/);
  return generic?.[1]?.toUpperCase() ?? "";
}

function extractLotNumber(pageText: string) {
  return (
    pageText.match(/Lot number:\s*(\d{5,12})/i)?.[1] ||
    pageText.match(/Stock\s*#:\s*(\d{5,12})/i)?.[1] ||
    pageText.match(/Item\s*#:\s*(\d{5,12})/i)?.[1] ||
    ""
  );
}

function extractLocation(pageText: string, source: AuctionSource) {
  const labeled =
    pageText.match(/Location:\s*([A-Z]{2}\s*-\s*[A-Za-z .'-]+)/i)?.[1] ||
    pageText.match(/Selling Branch:\s*([^\n]+)/i)?.[1] ||
    pageText.match(/Sale name:\s*([A-Z]{2}\s*-\s*[A-Za-z .'-]+)/i)?.[1];
  if (labeled) {
    return labeled.replace(/\s+/g, " ").trim();
  }

  if (source === "Copart") {
    return pageText.match(/\b([A-Z]{2}\s*-\s*[A-Z][A-Za-z .'-]+)\b/)?.[1] ?? "";
  }

  return "";
}

function extractBid(pageText: string) {
  const match =
    pageText.match(/Current bid[:\s]*\$?\s*([\d,]+(?:\.\d{2})?)\s*USD/i) ||
    pageText.match(/Current (?:High )?Bid[:\s]*\$([\d,]+(?:\.\d{2})?)/i) ||
    pageText.match(/Buy Now[:\s]*\$([\d,]+(?:\.\d{2})?)/i) ||
    pageText.match(/Minimum bid[:\s]*\$([\d,]+(?:\.\d{2})?)/i);

  if (!match?.[1]) {
    return null;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function extractPhotos(pageText: string) {
  const urls = Array.from(
    pageText.matchAll(/\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s)]*)?)\)/gi),
  )
    .map((match) => normalizePhotoUrl(match[1]))
    .filter((url): url is string => Boolean(url));

  const iaaiKeys = Array.from(
    pageText.matchAll(/imageKeys=(\d+~SID~B\d+~S0~I\d+~[^&\s)]+)/gi),
  ).map(
    (match) =>
      `https://vis.iaai.com/resizer?imageKeys=${match[1]}&width=845&height=633`,
  );

  return Array.from(new Set([...urls, ...iaaiKeys])).slice(0, 24);
}

function normalizePhotoUrl(url: string) {
  const lower = url.toLowerCase();
  if (IMAGE_SKIP.some((part) => lower.includes(part))) {
    return null;
  }

  return url.replace(/_v?thb\.jpg$/i, "_ful.jpg");
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word.includes("-")
        ? word
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join("-")
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export function usableVin(vin: string) {
  const cleaned = vin.replace(/\*/g, "").toUpperCase();
  return cleaned;
}
