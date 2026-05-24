import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const properties = require('../src/data/properties.json');

const DESTINATION_SLUGS = ['wayanad', 'ooty'];

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.luxeadobes.com').replace(/\/$/, '');

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/properties', changefreq: 'weekly', priority: '0.9' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
  ...DESTINATION_SLUGS.map((slug) => ({
    loc: `/destinations/${slug}`,
    changefreq: 'weekly',
    priority: '0.88',
  })),
];

const propertyRoutes = properties
  .filter((p) => p.hasDetailPage === true)
  .map((p) => ({
    loc: `/property/${p.slug}`,
    changefreq: 'weekly',
    priority: '0.85',
  }));

const lastmod = new Date().toISOString().slice(0, 10);

const urls = [...staticRoutes, ...propertyRoutes]
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outPath = join(root, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`[seo] wrote ${staticRoutes.length + propertyRoutes.length} URLs → ${outPath}`);
