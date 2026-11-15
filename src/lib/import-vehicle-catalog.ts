/** Pool comercial: no supone que cada modelo exista en todos los países/años/versiones. */
export const IMPORT_VEHICLE_POOL: Record<string, string[]> = {
  Toyota: [
    "RAV4",
    "Highlander",
    "Grand Highlander",
    "4Runner",
    "Land Cruiser",
    "Sequoia",
    "Tacoma",
    "Tundra",
  ],
  Honda: ["CR-V", "Passport", "Pilot"],
  Kia: ["Sportage", "Sorento", "Telluride"],
  Hyundai: ["Tucson", "Santa Fe", "Palisade"],
  Mazda: ["CX-5", "CX-9", "CX-50", "CX-90"],
  Chevrolet: ["Traverse", "Tahoe", "Suburban", "Colorado", "Silverado"],
  Ford: ["Bronco", "Explorer", "Edge", "Ranger", "F-150"],
  "Mercedes-Benz": ["GLA", "GLE", "GLS"],
  BMW: ["X3", "X5", "X6", "X7"],
  GMC: ["Sierra"],
};
export const IMPORT_COUNTRIES = [
  "USA",
  "JAPAN",
  "CANADA",
  "MEXICO",
  "SOUTH KOREA",
  "GERMANY",
  "CHINA",
  "UNITED KINGDOM",
  "OTRO",
];
