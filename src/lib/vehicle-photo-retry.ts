export type PendingVehiclePhoto = {
  file: File;
  alt: string;
  isCover: boolean;
};

const pending = new Map<string, PendingVehiclePhoto[]>();

export function stashFailedVehiclePhotos(vehicleId: string, photos: PendingVehiclePhoto[]) {
  if (!vehicleId || photos.length === 0) {
    pending.delete(vehicleId);
    return;
  }
  pending.set(vehicleId, photos);
}

export function takeFailedVehiclePhotos(vehicleId: string) {
  const photos = pending.get(vehicleId) ?? [];
  pending.delete(vehicleId);
  return photos;
}

export function peekFailedVehiclePhotos(vehicleId: string) {
  return pending.get(vehicleId) ?? [];
}

export function resetFailedVehiclePhotos() {
  pending.clear();
}
