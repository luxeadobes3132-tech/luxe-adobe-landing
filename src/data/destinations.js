import { OOTY_DESTINATION_IMAGES, WAYANAD_DESTINATION_IMAGES } from './destinationImages';

/**
 * Destination landing pages — targets location searches (e.g. "wayanad resorts", "ooty resorts").
 */
export const DESTINATIONS = [
  {
    slug: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    regionLabel: 'Western Ghats, Kerala',
    heroImage: WAYANAD_DESTINATION_IMAGES.hero,
    pageHeaderVariant: 'wayanad',
    propertySlugs: ['wayanad-gate', 'stayaro', 'cloud-veil'],
    seo: {
      title: 'Wayanad Resorts | Luxury Resort in Wayanad, Kerala | Luxe Adobes',
      description:
        'Discover luxury Wayanad resorts at Wayanad Gate by Luxe Adobes — misty Western Ghats, Brahmagiri views, pools, dining & wildlife near Nagarhole. Book your Wayanad stay.',
      keywords:
        'wayanad resorts, luxury resort wayanad, wayanad gate, best resort in wayanad, wayanad kerala resort, luxe adobes wayanad, wayanad hotels, resort near nagarhole',
    },
    headline: 'Luxury Resorts in Wayanad, Kerala',
    subtitle: 'Misty hills, coffee estates, and curated hospitality in the Western Ghats',
    intro:
      'Wayanad is one of Kerala\'s most sought-after hill destinations — a landscape of mist, rainforest, coffee plantations, and wildlife corridors along the Kerala–Karnataka border. Luxe Adobes brings a refined resort experience to this region through Wayanad Gate, set among the Brahmagiri foothills with panoramic Ghats views, restorative pools, and dining rooted in local flavour.',
    highlights: [
      {
        title: 'Western Ghats setting',
        body: 'Wake to Brahmagiri ridgelines, forest air, and the quiet rhythm of borderland Kerala — ideal for couples, families, and nature-led getaways.',
      },
      {
        title: 'Wildlife & adventure',
        body: 'Nagarhole Tiger Reserve and waterfall trails are within reach for day visits, while evenings return you to poolside calm and attentive service.',
      },
      {
        title: 'Rooms for every traveller',
        body: 'Choose suites, deluxe rooms, private cottages, or group dormitory beds — all with access to resort facilities and dining.',
      },
    ],
    galleryImages: [
      { src: WAYANAD_DESTINATION_IMAGES.waterfall, alt: 'Waterfall in Wayanad, Kerala' },
      { src: WAYANAD_DESTINATION_IMAGES.mountains, alt: 'Western Ghats mountains near Wayanad' },
      { src: WAYANAD_DESTINATION_IMAGES.greenHills, alt: 'Green hills of Wayanad, Kerala' },
    ],
    faqs: [
      {
        question: 'What is the best luxury resort in Wayanad?',
        answer:
          'Wayanad Gate by Luxe Adobes is a luxury resort on the Kerala–Karnataka border in the Western Ghats, offering suites, cottages, a pool, restaurant, banquet hall, and easy access to Nagarhole wildlife country.',
      },
      {
        question: 'Where is Wayanad Gate located?',
        answer:
          'Wayanad Gate is in Kattikkulam, Wayanad district, Kerala — along the Thalassery–Mysore route with Brahmagiri hills as a backdrop and Mannanthavady nearby.',
      },
      {
        question: 'Does Luxe Adobes have other Wayanad properties?',
        answer:
          'Yes. Wayanad Gate is open now. Stayaro and Cloud Veil — additional Luxe Adobes experiences in Wayanad — are opening soon.',
      },
      {
        question: 'How do I book a Wayanad resort stay with Luxe Adobes?',
        answer:
          'Enquire via our contact page, call +91-8590733132, email info@luxeadobes.com, or WhatsApp us. Our team shares availability, room types, and rates for your dates.',
      },
    ],
  },
  {
    slug: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    regionLabel: 'Nilgiris, Tamil Nadu',
    heroImage: OOTY_DESTINATION_IMAGES.hero,
    pageHeaderVariant: 'ooty',
    propertySlugs: ['ubuntu-retreat-ooty'],
    seo: {
      title: 'Ooty Resorts & Homestays | Ubuntu Retreat | Luxe Adobes',
      description:
        'Stay at Ubuntu Retreat Ooty by Luxe Adobes — private villas near Ooty Boathouse, garden campfire, parking & calm Nilgiri hospitality. Enquire for your Ooty resort stay.',
      keywords:
        'ooty resorts, ooty homestay, luxury resort ooty, ubuntu retreat ooty, ooty villa stay, luxe adobes ooty, nilgiri resorts, best stay in ooty',
    },
    headline: 'Resorts & Private Villas in Ooty, Tamil Nadu',
    subtitle: 'Nilgiri hills, tea country, and unhurried stays near Ooty town',
    intro:
      'Ooty — the Queen of Hill Stations — draws travellers for cool Nilgiri air, botanical gardens, lake views, and colonial-era charm. Luxe Adobes offers Ubuntu Retreat near Ooty Boathouse: private villa stays for small families and groups, with a garden, campfire area, and easy access to town while keeping a peaceful hill address.',
    highlights: [
      {
        title: 'Private villa comfort',
        body: 'Each villa accommodates up to four adults with beds, bathroom, and the privacy of a standalone retreat — ideal for weekend escapes from Bangalore and Chennai.',
      },
      {
        title: 'Central yet quiet',
        body: "Just 500 m from Ooty Boathouse, 2 km from the bus stand, and 3 km from town, it's ideally positioned for exploring Ooty while offering a quiet retreat at the end of the day.",
      },
      {
        title: 'Luxe Adobes hospitality',
        body: 'Ubuntu Retreat is part of the Luxe Adobes collection, with the same commitment to thoughtful design, warm service, and enquiry-led booking.',
      },
    ],
    galleryImages: [
      { src: OOTY_DESTINATION_IMAGES.lake, alt: 'Ooty Lake, Tamil Nadu' },
      { src: OOTY_DESTINATION_IMAGES.forestHouse, alt: 'Forest retreat near Ooty, Nilgiris' },
      { src: OOTY_DESTINATION_IMAGES.gardens, alt: 'Botanical gardens near Ooty' },
    ],
    faqs: [
      {
        question: 'What is a good luxury homestay or resort in Ooty?',
        answer:
          'Ubuntu Retreat – Aaram & Mukaam by Luxe Adobes offers private villa stays near Ooty Boathouse with a garden, campfire area, parking, and space for up to four adults per villa.',
      },
      {
        question: 'How far is Ubuntu Retreat from Ooty town?',
        answer:
          'Ubuntu Retreat is about 3 km from Ooty town, 2 km from Ooty Bus Stand, and around 500 m from Ooty Boathouse.',
      },
      {
        question: 'Is Ubuntu Retreat suitable for families?',
        answer:
          'Yes. The private villa layout suits small families and groups of up to four adults, with on-site parking and a relaxed garden setting.',
      },
      {
        question: 'How do I book an Ooty stay with Luxe Adobes?',
        answer:
          'Contact us by phone, email, WhatsApp, or the enquiry form on luxeadobes.com. We confirm villa availability and rates for your travel dates.',
      },
    ],
  },
];

export function getDestinationBySlug(slug) {
  return DESTINATIONS.find((d) => d.slug === slug) ?? null;
}

export function destinationSeo(destination) {
  return {
    path: `/destinations/${destination.slug}`,
    title: destination.seo.title,
    description: destination.seo.description,
    keywords: destination.seo.keywords,
    image: destination.heroImage,
  };
}

export function getDestinationSlugs() {
  return DESTINATIONS.map((d) => d.slug);
}
