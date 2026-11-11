import { formatDecimal } from "@/lib/money";

export function confirmedAuctionRunAndDrive(value: unknown) {
  return typeof value === "string" && ["run and drive", "reported run and drive"].includes(value.trim().toLowerCase().replace(/\s+/g, " "));
}

export function auctionDetailFacts(mileage: number | null | undefined, unit: "mi" | "km" | undefined, runAndDrive: boolean) {
  const miles = mileage != null && Number.isFinite(mileage) && mileage >= 0
    ? (unit === "km" ? Math.round(mileage / 1.609344) : mileage)
    : null;
  return [miles != null ? `${formatDecimal(miles, 0)} millas` : null, runAndDrive ? "Run and Drive" : null].filter(Boolean).join(" · ");
}
