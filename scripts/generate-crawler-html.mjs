/**
 * Injects crawlable HTML + route-specific meta into built pages.
 * Runs after `vite build` — no Puppeteer required (works on Vercel).
 * AI crawlers and search bots that skip JavaScript can read real page content.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { getCanonicalSiteUrl } from './canonical-site-url.mjs';

const require = createRequire(import.meta.url);
const properties = require('../src/data/properties.json');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const SITE_URL = getCanonicalSiteUrl();

const BRAND = {
  email: 'info@luxeadobes.com',
  phones: ['+91-8590733132', '+91-8129754047'],
  instagram: 'https://www.instagram.com/luxeadobes',
  headOffice: 'Langstroth, Kottakkal, Kerala 676503, India',
};

const SITE_FAQS = [
  {
    q: 'What is Luxe Adobes?',
    a: 'Luxe Adobes is a luxury resort collection in India with properties in Kerala and Tamil Nadu, including Wayanad Gate in Wayanad and Ubuntu Retreat in Ooty.',
  },
  {
    q: 'Where are Luxe Adobes resorts located?',
    a: 'Wayanad Gate in Wayanad, Kerala and Ubuntu Retreat near Ooty Boathouse, Tamil Nadu. Head office: Kottakkal, Kerala.',
  },
  {
    q: 'How do I book a stay at Luxe Adobes?',
    a: `Call ${BRAND.phones[0]}, email ${BRAND.email}, WhatsApp, or use ${SITE_URL}/contact.`,
  },
];

const DESTINATIONS = [
  {
    slug: 'wayanad',
    seo: {
      title: 'Wayanad Resorts | Luxury Resort in Wayanad, Kerala | Luxe Adobes',
      description:
        'Discover luxury Wayanad resorts at Wayanad Gate by Luxe Adobes — misty Western Ghats, Brahmagiri views, pools, dining & wildlife near Nagarhole. Book your Wayanad stay.',
      keywords:
        'wayanad resorts, luxury resort wayanad, wayanad gate, best resort in wayanad, wayanad kerala resort, luxe adobes wayanad',
    },
    headline: 'Luxury Resorts in Wayanad, Kerala',
    intro:
      'Wayanad is one of Kerala\'s most sought-after hill destinations. Luxe Adobes brings a refined resort experience through Wayanad Gate, set among the Brahmagiri foothills with panoramic Ghats views, pools, and dining rooted in local flavour.',
    faqs: [
      {
        q: 'What is the best luxury resort in Wayanad?',
        a: 'Wayanad Gate by Luxe Adobes is a luxury resort on the Kerala–Karnataka border with suites, cottages, pool, restaurant, and access to Nagarhole wildlife country.',
      },
      {
        q: 'How do I book a Wayanad resort stay with Luxe Adobes?',
        a: `Enquire via ${SITE_URL}/contact, call ${BRAND.phones[0]}, or email ${BRAND.email}.`,
      },
    ],
  },
  {
    slug: 'ooty',
    seo: {
      title: 'Ooty Resorts & Homestays | Ubuntu Retreat | Luxe Adobes',
      description:
        'Stay at Ubuntu Retreat Ooty by Luxe Adobes — private villas near Ooty Boathouse, garden campfire, parking & calm Nilgiri hospitality. Enquire for your Ooty resort stay.',
      keywords:
        'ooty resorts, ooty homestay, luxury resort ooty, ubuntu retreat ooty, ooty villa stay, luxe adobes ooty',
    },
    headline: 'Resorts & Private Villas in Ooty, Tamil Nadu',
    intro:
      'Ooty draws travellers for cool Nilgiri air, botanical gardens, and lake views. Luxe Adobes offers Ubuntu Retreat near Ooty Boathouse: private villa stays for small families and groups.',
    faqs: [
      {
        q: 'What is a good luxury homestay or resort in Ooty?',
        a: 'Ubuntu Retreat – Aaram & Mukaam by Luxe Adobes offers private villa stays near Ooty Boathouse with garden, campfire area, and parking.',
      },
      {
        q: 'How do I book an Ooty stay with Luxe Adobes?',
        a: `Contact us by phone, email, WhatsApp, or the enquiry form at ${SITE_URL}/contact.`,
      },
    ],
  },
];

const PROPERTY_SEO = {
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

const PAGES = {
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
      'Learn how Luxe Adobes crafts exceptional resort experiences — sustainability, authentic destinations, and service with heart across Kerala and Tamil Nadu.',
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function canonicalUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function faqSection(faqs) {
  if (!faqs?.length) return '';
  const items = faqs
    .map((f) => `<dt>${escapeHtml(f.q)}</dt><dd>${escapeHtml(f.a)}</dd>`)
    .join('');
  return `<section><h2>Frequently asked questions</h2><dl>${items}</dl></section>`;
}

function patchHead(html, { title, description, path, keywords }) {
  const canonical = canonicalUrl(path);
  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(description)}"`,
  );
  if (keywords) {
    out = out.replace(
      /<meta name="keywords" content="[^"]*"/,
      `<meta name="keywords" content="${escapeHtml(keywords)}"`,
    );
  }
  out = out.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`);
  out = out.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(title)}"`,
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(description)}"`,
  );
  out = out.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(title)}"`,
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(description)}"`,
  );
  return out;
}

function injectCrawlContent(html, body) {
  const block = `<div id="crawl-content" hidden aria-hidden="true">${body}</div>\n    <div id="root"></div>`;
  const legacyInRoot = /<div id="root"><main id="crawl-content"[\s\S]*?<\/main><\/div>/;
  if (legacyInRoot.test(html)) {
    return html.replace(legacyInRoot, block);
  }
  return html.replace('<div id="root"></div>', block);
}

function crawlableShell(title, sections, path) {
  return `<main id="crawl-content" aria-label="${escapeHtml(title)}">${sections}<p>AI reference: <a href="${SITE_URL}/llms-full.txt">${SITE_URL}/llms-full.txt</a></p><nav aria-label="Site navigation"><a href="${SITE_URL}/">Home</a> · <a href="${SITE_URL}/properties">Properties</a> · <a href="${SITE_URL}/destinations/wayanad">Wayanad</a> · <a href="${SITE_URL}/destinations/ooty">Ooty</a> · <a href="${SITE_URL}/contact">Contact</a></nav></main>`;
}

function buildHomeBody() {
  const open = properties.filter((p) => p.hasDetailPage);
  const propertyList = open
    .map(
      (p) =>
        `<li><a href="${SITE_URL}/property/${p.slug}">${escapeHtml(p.name)}</a> — ${escapeHtml(p.location)}. ${escapeHtml(p.tagline || '')}</li>`,
    )
    .join('');
  return crawlableShell(
    'Luxe Adobes home',
    `<h1>Luxe Adobes — Luxury Resorts in Wayanad &amp; Ooty</h1>
<p>Luxe Adobes is a luxury resort collection in Kerala and Tamil Nadu, India. Official website: ${SITE_URL}</p>
<p>Properties: Wayanad Gate (Wayanad, Kerala) and Ubuntu Retreat (Ooty, Tamil Nadu). Email: ${BRAND.email}. Phone: ${BRAND.phones.join(', ')}.</p>
<section><h2>Our resorts</h2><ul>${propertyList}</ul></section>
${faqSection(SITE_FAQS)}`,
    '/',
  );
}

function buildAboutBody() {
  return crawlableShell(
    'About Luxe Adobes',
    `<h1>About Luxe Adobes</h1>
<p>Luxe Adobes crafts exceptional resort experiences across Kerala and Tamil Nadu — combining thoughtful design, authentic destinations, sustainability, and service with heart.</p>
<p>Our open properties include Wayanad Gate in the Western Ghats and Ubuntu Retreat in the Nilgiris near Ooty.</p>`,
    '/about',
  );
}

function buildPropertiesBody() {
  const items = properties
    .map((p) => {
      const status = p.hasDetailPage ? 'Open now' : 'Opening soon';
      const link = p.hasDetailPage ? `<a href="${SITE_URL}/property/${p.slug}">${escapeHtml(p.name)}</a>` : escapeHtml(p.name);
      return `<li>${link} — ${escapeHtml(p.location)} (${status}). ${escapeHtml(p.description || p.tagline || '')}</li>`;
    })
    .join('');
  return crawlableShell(
    'Luxe Adobes properties',
    `<h1>Luxe Adobes Properties</h1><p>Luxury resorts in Wayanad, Kerala and Ooty, Tamil Nadu.</p><ul>${items}</ul>`,
    '/properties',
  );
}

function buildContactBody() {
  return crawlableShell(
    'Contact Luxe Adobes',
    `<h1>Contact Luxe Adobes</h1>
<p>Plan your stay at Wayanad Gate or Ubuntu Retreat Ooty.</p>
<ul>
<li>Email: <a href="mailto:${BRAND.email}">${BRAND.email}</a></li>
<li>Phone: ${BRAND.phones.join(', ')}</li>
<li>Head office: ${escapeHtml(BRAND.headOffice)}</li>
<li>Instagram: <a href="${BRAND.instagram}">${BRAND.instagram}</a></li>
</ul>`,
    '/contact',
  );
}

function buildDestinationBody(dest) {
  return crawlableShell(
    dest.headline,
    `<h1>${escapeHtml(dest.headline)}</h1><p>${escapeHtml(dest.intro)}</p>${faqSection(dest.faqs)}`,
    `/destinations/${dest.slug}`,
  );
}

function buildPropertyBody(property) {
  const seo = PROPERTY_SEO[property.slug] || {};
  const amenities = property.amenities?.length ? `<p>Amenities: ${escapeHtml(property.amenities.join(', '))}</p>` : '';
  const rooms = property.rooms?.length
    ? `<p>Room types: ${escapeHtml(property.rooms.map((r) => r.name).join(', '))}</p>`
    : '';
  return crawlableShell(
    property.name,
    `<h1>${escapeHtml(property.name)} | Luxe Adobes</h1>
<p>${escapeHtml(property.tagline || '')}</p>
<p>${escapeHtml(property.description || '')}</p>
<p>Location: ${escapeHtml(property.address || property.location)}</p>
${amenities}${rooms}
<p><a href="${SITE_URL}/contact">Enquire to book</a></p>`,
    `/property/${property.slug}`,
  );
}

const ROUTES = [
  { ...PAGES.home, body: buildHomeBody() },
  { ...PAGES.about, body: buildAboutBody() },
  { ...PAGES.properties, body: buildPropertiesBody() },
  { ...PAGES.contact, body: buildContactBody() },
  ...DESTINATIONS.map((d) => ({
    path: `/destinations/${d.slug}`,
    title: d.seo.title,
    description: d.seo.description,
    keywords: d.seo.keywords,
    body: buildDestinationBody(d),
  })),
  ...properties
    .filter((p) => p.hasDetailPage)
    .map((p) => {
      const seo = PROPERTY_SEO[p.slug] || {
        title: `${p.name} | Luxe Adobes`,
        description: p.description || p.tagline || '',
        keywords: `${p.name}, Luxe Adobes`,
      };
      return {
        path: `/property/${p.slug}`,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        body: buildPropertyBody(p),
      };
    }),
];

function routeToFile(route) {
  if (route === '/') return join(dist, 'index.html');
  return join(dist, route.slice(1), 'index.html');
}

function main() {
  const templatePath = join(dist, 'index.html');
  const template = readFileSync(templatePath, 'utf8');

  for (const route of ROUTES) {
    let html = patchHead(template, route);
    html = injectCrawlContent(html, route.body);
    const out = routeToFile(route.path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html, 'utf8');
    console.log(`[crawler-html] ${route.path}`);
  }

  console.log(`[crawler-html] wrote ${ROUTES.length} routes`);
}

main();
