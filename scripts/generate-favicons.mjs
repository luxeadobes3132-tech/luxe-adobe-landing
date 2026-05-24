import sharp from 'sharp';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'public/images/home/branding/luxe-adobes-black.png');
const favDir = join(root, 'public/images/fav');

mkdirSync(favDir, { recursive: true });

const sizes = [
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(join(favDir, name));
}

copyFileSync(join(favDir, 'favicon.ico'), join(root, 'public/favicon.ico'));
console.log('[seo] favicons generated');
