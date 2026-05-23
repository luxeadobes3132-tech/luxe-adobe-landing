/**
 * Central SEO configuration  -  update SITE_URL when the production domain is final.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://luxeadobes.com').replace(/\/$/, '');

export const SITE_NAME = 'Luxe Adobes';
export const SITE_TAGLINE = 'Luxury Resort Collection';
export const SITE_LOCALE = 'en_IN';

/** Default social preview when a page does not set its own image */
export const DEFAULT_OG_IMAGE = '/images/home/hero/hero-2.webp';

export const PAGE_SEO = {
  home: {
    path: '/',
    title: 'Luxe Adobes | Luxury Resorts in Wayanad & Ooty, Kerala & Tamil Nadu',
    description:
      'Discover Luxe Adobes  -  curated luxury stays at Wayanad Gate in Kerala and Ubuntu Retreat in Ooty. Misty hills, private villas, and world-class hospitality across India.',
    keywords:
      'Luxe Adobes, luxury resort Kerala, Wayanad Gate, Ubuntu Retreat Ooty, luxury homestay Ooty, Wayanad resort',
  },
  about: {
    path: '/about',
    title: 'About Luxe Adobes | Vision, Values & Luxury Hospitality',
    description:
      'Learn how Luxe Adobes crafts exceptional resort experiences  -  sustainability, authentic destinations, and service with heart across Kerala and Tamil Nadu.',
    keywords: 'about Luxe Adobes, luxury hospitality India, sustainable tourism Kerala',
  },
  properties: {
    path: '/properties',
    title: 'Our Properties | Luxury Resorts in Kerala & Tamil Nadu',
    description:
      'Explore Luxe Adobes properties  -  Wayanad Gate in the Western Ghats and Ubuntu Retreat near Ooty. More destinations opening across India.',
    keywords: 'Luxe Adobes properties, Wayanad resort, Ooty homestay, luxury resorts India',
  },
  contact: {
    path: '/contact',
    title: 'Contact Luxe Adobes | Enquiries, WhatsApp & Head Office',
    description:
      'Contact Luxe Adobes 24/7 by phone, email, or WhatsApp. Head office in Kottakkal, Kerala. Plan your stay at Wayanad Gate or Ubuntu Retreat Ooty.',
    keywords: 'contact Luxe Adobes, resort enquiry Kerala, book Wayanad Gate',
  },
};

export function propertySeo(property) {
  const location = property.location || property.state || 'India';
  const title = `${property.name} | Luxe Adobes  -  ${location}`;
  const description =
    (property.description || property.tagline || '').trim() ||
    `Stay at ${property.name}, a Luxe Adobes property in ${location}. Enquire for availability and exclusive experiences.`;
  return {
    path: `/property/${property.slug}`,
    title,
    description,
    image: property.heroImages?.[0] || DEFAULT_OG_IMAGE,
    keywords: `${property.name}, ${location}, Luxe Adobes, luxury stay`,
  };
}
