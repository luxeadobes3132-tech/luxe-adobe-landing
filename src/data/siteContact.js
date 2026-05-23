/**
 * Single source for contact details (footer, contact page, CTAs).
 * Update here to keep the site consistent.
 */
export const SITE_EMAIL = 'info@luxeadobes.com';

/** E.164 without +  -  used for wa.me */
export const SITE_WHATSAPP_E164 = '918590733132';

export const SITE_PHONES = [
  { tel: '+918590733132', display: '+91-8590733132' },
  { tel: '+918129754047', display: '+91-8129754047' },
];

export const SITE_INSTAGRAM = {
  url: 'https://www.instagram.com/luxeadobes?igsh=MXN0ZjRnZnB2OG9qcg==',
  handle: '@luxeadobes',
};

export const SITE_ADDRESS = {
  /** Lines for stacked display */
  lines: ['Langstroth, Kottakkal', 'Kerala 676503', 'India'],
  /** One line under map / SEO-style */
  oneLine: 'Langstroth, Kottakkal, Kerala 676503',
};

/** Google Maps share link (opens app / place) */
export const SITE_HEAD_OFFICE_MAPS_URL = 'https://maps.app.goo.gl/3pFG3c1PfEpa5can6';

/**
 * iframe embed  -  search-based. Replace with “Share → Embed a map” HTML from Google if you want an exact pin.
 * @see https://maps.app.goo.gl/3pFG3c1PfEpa5can6
 */
export const SITE_HEAD_OFFICE_MAP_EMBED_URL =
  'https://www.google.com/maps?q=Langstroth%2C+Kottakkal%2C+Kerala+676503&output=embed';

/** Short place name (area) shown under the head-office label on the map block */
export const SITE_HEAD_OFFICE_LABEL = 'Langstroth, Kottakkal';

/** Category label for the map / address card (e.g. “Head office”) */
export const SITE_HEAD_OFFICE_KIND = 'Head office';

/** WhatsApp deep link; optional pre-filled message */
export function siteWhatsAppUrl(text) {
  const base = `https://wa.me/${SITE_WHATSAPP_E164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
