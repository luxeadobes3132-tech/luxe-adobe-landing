/**
 * Central SEO configuration  -  update SITE_URL when the production domain is final.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.luxeadobes.com').replace(/\/$/, '');

export const SITE_NAME = 'Luxe Adobes';
export const SITE_TAGLINE = 'Luxury Resort Collection';
export const SITE_LOCALE = 'en_IN';

/** Default social preview when a page does not set its own image */
export const DEFAULT_OG_IMAGE = '/images/seo/og-share.jpg';

export const PAGE_SEO = {
  home: {
    path: '/',
    title: 'Luxe Adobes | Luxury Resorts in Wayanad & Ooty — Kerala & Tamil Nadu',
    description:
      'Luxe Adobes — luxury resorts in Wayanad, Kerala and Ooty, Tamil Nadu. Stay at Wayanad Gate or Ubuntu Retreat. Book Wayanad & Ooty resort stays with Luxe Adobes.',
    keywords:
      'Luxe Adobes, Luxe Adobes resorts, luxury resorts India, wayanad resorts, ooty resorts, Wayanad Gate, Ubuntu Retreat Ooty, Kerala resorts',
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
    title: 'Luxe Adobes Properties | Wayanad & Ooty Luxury Resorts',
    description:
      'Browse Luxe Adobes resorts — Wayanad Gate in Kerala and Ubuntu Retreat in Ooty. Luxury resort stays in Wayanad, Ooty, and across India.',
    keywords:
      'Luxe Adobes properties, wayanad resorts, ooty resorts, luxury resorts Kerala, luxury homestay Ooty, Wayanad Gate, Ubuntu Retreat',
  },
  contact: {
    path: '/contact',
    title: 'Contact Luxe Adobes | Enquiries, WhatsApp & Head Office',
    description:
      'Contact Luxe Adobes 24/7 by phone, email, or WhatsApp. Head office in Kottakkal, Kerala. Plan your stay at Wayanad Gate or Ubuntu Retreat Ooty.',
    keywords: 'contact Luxe Adobes, resort enquiry Kerala, book Wayanad Gate',
  },
};

const PROPERTY_SEO_OVERRIDES = {
  'wayanad-gate': {
    title: 'Wayanad Gate Resort | Luxury Resort in Wayanad, Kerala | Luxe Adobes',
    description:
      'Wayanad Gate — a luxury Wayanad resort by Luxe Adobes. Suites, cottages, pool, dining & Brahmagiri views near Nagarhole. Book your Wayanad resort stay.',
    keywords:
      'wayanad gate, wayanad resorts, luxury resort wayanad, best resort in wayanad, wayanad kerala resort, luxe adobes wayanad',
  },
  'ubuntu-retreat-ooty': {
    title: 'Ubuntu Retreat Ooty | Luxury Villa Stay | Luxe Adobes',
    description:
      'Ubuntu Retreat Ooty by Luxe Adobes — private villas near Ooty Boathouse with garden, campfire & parking. Enquire for your Ooty resort or homestay stay.',
    keywords:
      'ubuntu retreat ooty, ooty resorts, ooty homestay, luxury resort ooty, ooty villa stay, luxe adobes ooty',
  },
};

export function propertySeo(property) {
  const override = PROPERTY_SEO_OVERRIDES[property.slug];
  if (override) {
    return {
      path: `/property/${property.slug}`,
      title: override.title,
      description: override.description,
      keywords: override.keywords,
      image: property.heroImages?.[0] || DEFAULT_OG_IMAGE,
    };
  }

  const location = property.location || property.state || 'India';
  const title = `${property.name} | Luxe Adobes — ${location}`;
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
