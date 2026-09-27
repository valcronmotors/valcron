export function canPublicReadPhoto(options: {
  vehiclePublished: boolean;
  vehicleStatus: string;
}) {
  return (
    options.vehiclePublished &&
    (options.vehicleStatus === "available" ||
      options.vehicleStatus === "reserved" ||
      options.vehicleStatus === "sold")
  );
}
