import propertiesData from '../../data/properties.json';
import { getDestinationSlugs } from '../../data/destinations';
import { SITE_FAQS } from '../../data/siteFaqs';
import {
  SITE_EMAIL,
  SITE_INSTAGRAM,
  SITE_PHONES,
  SITE_ADDRESS,
  SITE_HEAD_OFFICE_MAPS_URL,
} from '../../data/siteContact';
import { SITE_URL, SITE_TAGLINE, SITE_NAME } from '../../data/siteSeo';
import { absoluteUrl } from '../../utils/seo';

const indexableProperties = propertiesData.filter((p) => p.hasDetailPage === true);

export function organizationJsonLd() {
  const phone = SITE_PHONES[0]?.tel;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/images/home/branding/luxe-adobes-black.png'),
    description:
      'Luxe Adobes is a collection of luxury resorts and retreats in Kerala and Tamil Nadu, including Wayanad Gate and Ubuntu Retreat Ooty.',
    email: SITE_EMAIL,
    telephone: phone,
    sameAs: [SITE_INSTAGRAM.url],
    knowsAbout: [
      'Luxury resorts',
      'Wayanad resorts',
      'Ooty resorts',
      'Kerala hospitality',
      'Nilgiri hill stays',
    ],
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'AdministrativeArea', name: 'Kerala' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
      { '@type': 'City', name: 'Wayanad' },
      { '@type': 'City', name: 'Ooty' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS.lines[0],
      addressLocality: 'Kottakkal',
      addressRegion: 'Kerala',
      postalCode: '676503',
      addressCountry: 'IN',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: [SITE_TAGLINE, 'Luxe Adobes Resorts', 'Luxe Adobes Kerala'],
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/properties?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqJsonLd(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function homeJsonLd() {
  const blocks = [organizationJsonLd(), websiteJsonLd()];
  const faq = faqJsonLd(SITE_FAQS);
  if (faq) blocks.push(faq);

  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Luxe Adobes luxury resorts',
    itemListElement: indexableProperties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: property.name,
      url: absoluteUrl(`/property/${property.slug}`),
    })),
  });

  return blocks;
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/contact#head-office`,
    name: `${SITE_NAME}  -  Head Office`,
    description: 'Head office of Luxe Adobes luxury resort collection.',
    url: absoluteUrl('/contact'),
    telephone: SITE_PHONES[0]?.tel,
    email: SITE_EMAIL,
    image: absoluteUrl('/images/home/branding/luxe-adobes-black.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS.lines[0],
      addressLocality: 'Kottakkal',
      addressRegion: 'Kerala',
      postalCode: '676503',
      addressCountry: 'IN',
    },
    hasMap: SITE_HEAD_OFFICE_MAPS_URL,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}

export function contactJsonLd() {
  return [organizationJsonLd(), localBusinessJsonLd()];
}

export function propertyBreadcrumbJsonLd(property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Properties',
        item: absoluteUrl('/properties'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.name,
        item: absoluteUrl(`/property/${property.slug}`),
      },
    ],
  };
}

export function lodgingBusinessJsonLd(property) {
  const image = (property.heroImages || property.gallery || [])
    .filter(Boolean)
    .map((src) => absoluteUrl(src));

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': absoluteUrl(`/property/${property.slug}#lodging`),
    name: property.name,
    description: property.description || property.tagline,
    url: absoluteUrl(`/property/${property.slug}`),
    image: image.length ? image : [absoluteUrl('/images/home/hero/hero-2.webp')],
    telephone: SITE_PHONES[0]?.tel,
    email: SITE_EMAIL,
    address: property.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: property.address,
          addressRegion: property.state,
          addressCountry: 'IN',
        }
      : undefined,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    amenityFeature: (property.amenities || []).map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    ...(property.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: property.geo.latitude,
            longitude: property.geo.longitude,
          },
        }
      : {}),
    ...(property.mapShareUrl ? { hasMap: property.mapShareUrl } : {}),
  };
}

export function propertyJsonLd(property) {
  return [
    organizationJsonLd(),
    propertyBreadcrumbJsonLd(property),
    lodgingBusinessJsonLd(property),
  ];
}

export function destinationBreadcrumbJsonLd(destination) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinations',
        item: absoluteUrl('/properties'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: destination.name,
        item: absoluteUrl(`/destinations/${destination.slug}`),
      },
    ],
  };
}

export function destinationFaqJsonLd(destination) {
  return faqJsonLd(destination.faqs);
}

export function destinationJsonLd(destination) {
  const properties = indexableProperties.filter((p) =>
    destination.propertySlugs.includes(p.slug)
  );

  const blocks = [
    organizationJsonLd(),
    destinationBreadcrumbJsonLd(destination),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': absoluteUrl(`/destinations/${destination.slug}#page`),
      name: destination.headline,
      description: destination.intro,
      url: absoluteUrl(`/destinations/${destination.slug}`),
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: {
        '@type': 'Place',
        name: destination.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: destination.state,
        },
      },
    },
  ];

  const faq = destinationFaqJsonLd(destination);
  if (faq) blocks.push(faq);

  if (properties.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Luxe Adobes resorts in ${destination.name}`,
      itemListElement: properties.map((property, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: property.name,
        url: absoluteUrl(`/property/${property.slug}`),
      })),
    });
  }

  return blocks;
}

/** All indexable paths for sitemap generation */
export function getIndexablePaths() {
  const staticPaths = ['/', '/about', '/properties', '/contact'];
  const destinationPaths = getDestinationSlugs().map((slug) => `/destinations/${slug}`);
  const propertyPaths = indexableProperties.map((p) => `/property/${p.slug}`);
  return [...staticPaths, ...destinationPaths, ...propertyPaths];
}
