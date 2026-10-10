import {
  publicPriceAmountOk,
  resolvePublicPriceMode,
  type PublicPriceMode,
} from "@/lib/public-price-mode";
import {
  canPublishVehicleStatus,
  type VehicleRow,
  type VehicleSourceType,
  type VehicleStatus,
} from "@/lib/website-schema";

export type PublicationCheck = {
  id: string;
  label: string;
  ok: boolean;
  required: boolean;
};

export function vehiclePublicationChecks(input: {
  year?: number | null;
  make?: string | null;
  model?: string | null;
  description?: string | null;
  price?: number | null;
  source_type?: VehicleSourceType | null;
  public_price_mode?: PublicPriceMode | null;
  status: VehicleStatus;
  photos?: VehicleRow["vehicle_photos"];
  extraPhotoCount?: number;
  vin?: string | null;
  mileage?: number | null;
  exterior_color?: string | null;
}): PublicationCheck[] {
  const photos = input.photos ?? [];
  // Prefer an explicit cover flag; any saved photo also counts so a missing
  // is_cover bit never blocks publish after a successful upload.
  const hasCover = photos.some((photo) => photo.is_cover) || photos.length > 0;
  const make = (input.make ?? "").trim();
  const model = (input.model ?? "").trim();
  const description = (input.description ?? "").trim();
  const photoCount = photos.length + Math.max(0, input.extraPhotoCount ?? 0);
  const mode = resolvePublicPriceMode(input.source_type, input.public_price_mode);
  const priceOk = publicPriceAmountOk(input.source_type, mode, input.price);

  return [
    {
      id: "identity",
      label: "Año, marca y modelo",
      ok: Boolean(input.year && make && model),
      required: true,
    },
    {
      id: "status",
      label: "Disponible, reservado o vendido",
      ok: canPublishVehicleStatus(input.status),
      required: true,
    },
    {
      id: "cover",
      label: "Foto de portada",
      ok: hasCover,
      required: true,
    },
    {
      id: "price",
      label: priceOk && mode === "contact" ? "Modo de precio público" : "Precio de venta",
      ok: priceOk,
      required: true,
    },
    {
      id: "description",
      label: "Descripción",
      ok: description.length >= 20,
      required: true,
    },
    {
      id: "vin",
      label: "VIN",
      ok: Boolean((input.vin ?? "").trim()),
      required: false,
    },
    {
      id: "mileage",
      label: "Kilometraje",
      ok: Number(input.mileage ?? 0) > 0,
      required: false,
    },
    {
      id: "color",
      label: "Color exterior",
      ok: Boolean((input.exterior_color ?? "").trim()),
      required: false,
    },
    {
      id: "gallery",
      label: "Más de una foto",
      ok: photoCount >= 2,
      required: false,
    },
  ];
}

export function canPublishVehicleListing(checks: PublicationCheck[]) {
  return checks.filter((check) => check.required).every((check) => check.ok);
}

export function publicationBlockers(checks: PublicationCheck[]) {
  return checks.filter((check) => check.required && !check.ok).map((check) => check.label);
}
