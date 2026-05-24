import propertiesData from './properties.json';
import { OOTY_DESTINATION_IMAGES, WAYANAD_DESTINATION_IMAGES } from './destinationImages';

/** Home hero carousel (keep in sync with Home.jsx). */
export const HOME_HERO_IMAGES = [
  '/images/home/hero/hero-2.webp',
  '/images/home/hero/hero-3.sm.webp',
  '/images/home/hero/hero-4.sm.webp',
  '/images/home/hero/hero-5.webp',
];

/** PageHeader backgrounds (keep in sync with PageHeader.jsx). */
export const PAGE_HEADER_IMAGES = {
  about: WAYANAD_DESTINATION_IMAGES.hero,
  properties: OOTY_DESTINATION_IMAGES.hero,
  contact: WAYANAD_DESTINATION_IMAGES.greenHills,
  wayanad: WAYANAD_DESTINATION_IMAGES.hero,
  ooty: OOTY_DESTINATION_IMAGES.hero,
  kerala: WAYANAD_DESTINATION_IMAGES.backwaters,
};

/** Unique source paths for every route hero / header LCP. */
export function getAllCriticalHeroSources() {
  const set = new Set(HOME_HERO_IMAGES);
  Object.values(PAGE_HEADER_IMAGES).forEach((src) => set.add(src));
  for (const property of propertiesData) {
    if (!property.hasDetailPage) continue;
    const lead = property.heroImages?.[0];
    if (lead) set.add(lead);
  }
  return [...set];
}
