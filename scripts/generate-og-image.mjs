import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public/images/seo');
const hero = join(root, 'public/images/home/hero/hero-2.webp');

mkdirSync(outDir, { recursive: true });

const width = 1200;
const height = 630;

const resized = await sharp(hero).resize(width, height, { fit: 'cover', position: 'centre' }).toBuffer();

const overlay = Buffer.from(
  `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1c1c1c" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#1c1c1c" stop-opacity="0.72"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="60" y="520" fill="#F5F0E8" font-family="Georgia, serif" font-size="52" font-weight="500">Luxe Adobes</text>
    <text x="60" y="570" fill="#C6A75E" font-family="Arial, sans-serif" font-size="24" letter-spacing="4">LUXURY RESORTS · WAYANAD · OOTY</text>
  </svg>`,
);

await sharp(resized)
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(outDir, 'og-share.jpg'));

console.log('[seo] og-share.jpg generated');
