/**
 * One-off: download About page Unsplash images into public/images/about/sustainability/
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'about', 'sustainability');

const ASSETS = [
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&auto=format',
    file: 'forest-nature.webp',
  },
  {
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=85&auto=format',
    file: 'environmental-stewardship.webp',
  },
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85&auto=format',
    file: 'community.webp',
  },
];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const { url, file } of ASSETS) {
  const res = await fetch(url, { headers: { 'User-Agent': 'LuxeAdobes-asset-import/1.0' } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT_DIR, file);
  await sharp(buf).rotate().webp({ quality: 88, effort: 6 }).toFile(out);
  const stat = await fs.stat(out);
  console.log(`Wrote ${file} (${Math.round(stat.size / 1024)} KB)`);
}
