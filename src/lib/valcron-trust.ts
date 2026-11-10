/** Snapshot verified on the real Google Business Profile, 2026-11-10. */
export const GOOGLE_BUSINESS_PROFILE = {
  name: "Valcron Motors Group",
  rating: 5.0,
  reviewCount: 4,
  verifiedOn: "10 de noviembre de 2026",
  url: "https://www.google.com/maps/place/Valcron+Motors+Group/@18.4953308,-69.7966912,17z/data=!3m1!4b1!4m6!3m5!1s0x8eaf87fbc60c045f:0xdb7e9ddce70f0731!8m2!3d18.4953308!4d-69.7966912!16s%2Fg%2F11yrzv0g4n?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D",
} as const;

// Add only Valcron's real delivery photos after permission and caption checks.
// Stock/illustrative marketing images must never be presented as client deliveries.
export const REAL_DELIVERY_PHOTOS: { src: string; alt: string; caption: string }[] = [];
