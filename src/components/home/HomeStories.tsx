/**
 * Customer delivery / testimonial carousel.
 * Hidden until verified customer photos and quotes exist in the repo.
 * Do not invent names, photos, or testimonials.
 */
export const HOME_CUSTOMER_STORIES: readonly {
  quote: string;
  name: string;
  location: string;
  imageSrc: string;
  imageAlt: string;
}[] = [];

export function HomeStories() {
  if (HOME_CUSTOMER_STORIES.length === 0) {
    return null;
  }

  return null;
}
