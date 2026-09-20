import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import type { ContentArticle } from "@/lib/content/types";
import {
  canonicalVehicleUrl,
  formatVehiclePrice,
  vehicleDisplayTitle,
  vehicleSeoDescription,
} from "@/lib/vehicles/vehicle-formatters";
import type { PublicVehicle } from "@/types/vehicle";

export function absoluteUrl(path: string) {
  if (!path || path === "/") {
    return SITE.url;
  }
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function publicPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.shortName}`,
      description,
      url,
      locale: "es_DO",
      siteName: SITE.shortName,
      type,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.shortName,
    alternateName: SITE.brand,
    url: SITE.url,
    inLanguage: "es-DO",
    publisher: {
      "@id": `${SITE.url}/#business`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/inventario?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(article: ContentArticle, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": article.kind === "guide" ? "Article" : "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "es-DO",
    mainEntityOfPage: absoluteUrl(path),
    author: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url,
    },
    publisher: {
      "@id": `${SITE.url}/#business`,
    },
    image: article.hero?.src ? [article.hero.src] : undefined,
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function vehicleJsonLd(vehicle: PublicVehicle) {
  const title = vehicleDisplayTitle(vehicle);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title,
    url: canonicalVehicleUrl(vehicle),
    brand: vehicle.make ? { "@type": "Brand", name: vehicle.make } : undefined,
    model: vehicle.model || undefined,
    vehicleModelDate: vehicle.year ? String(vehicle.year) : undefined,
    vehicleIdentificationNumber: vehicle.vin || undefined,
    color: vehicle.exteriorColor || undefined,
    vehicleInteriorColor: vehicle.interiorColor || undefined,
    vehicleTransmission: vehicle.transmission || undefined,
    fuelType: vehicle.fuelType || undefined,
    driveWheelConfiguration: vehicle.drivetrain || undefined,
    description: vehicleSeoDescription(vehicle),
  };

  if (vehicle.mileage != null && Number.isFinite(vehicle.mileage)) {
    data.mileageFromOdometer = {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: vehicle.mileageUnit === "mi" ? "SMI" : "KMT",
    };
  }

  const image = vehicle.images[0]?.url ?? vehicle.fotosUrls[0];
  if (image) {
    data.image = image;
  }

  const sale =
    vehicle.availability !== "auction" &&
    vehicle.pricing.priceVisible &&
    vehicle.pricing.kind === "sale" &&
    (vehicle.pricing.usdPrice || vehicle.pricing.rdPrice);

  if (sale) {
    const price = vehicle.pricing.usdPrice
      ? { price: vehicle.pricing.usdPrice, currency: "USD" }
      : { price: vehicle.pricing.rdPrice, currency: "DOP" };
    const formatted = formatVehiclePrice(price.price, price.currency as "USD" | "DOP");
    if (formatted && price.price) {
      data.offers = {
        "@type": "Offer",
        url: canonicalVehicleUrl(vehicle),
        priceCurrency: price.currency,
        price: price.price,
        availability:
          vehicle.availability === "sold"
            ? "https://schema.org/SoldOut"
            : vehicle.availability === "available_rd"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
      };
    }
  }

  return data;
}
