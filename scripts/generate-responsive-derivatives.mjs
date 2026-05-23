/**
 * Builds WebP derivatives under public/images-deriv/ and writes
 * src/data/imageDerivatives.manifest.json for ResponsiveImg / getResponsiveImageAttrs.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'images-deriv');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'imageDerivatives.manifest.json');

const TARGET_WIDTHS = [480, 768, 1200, 1920];
const RASTER_EXT = /\.(jpe?g|png|webp)$/i;

const webpOptions = { quality: 82, effort: 4 };

async function walk(dir, baseRel = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const rel = path.join(baseRel, ent.name);
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '_ready-to-delete' || ent.name.startsWith('_')) {
        continue;
      }
      files.push(...(await walk(abs, rel)));
    } else if (ent.isFile() && RASTER_EXT.test(ent.name)) {
      files.push({ abs, rel: rel.split(path.sep).join('/') });
    }
  }
  return files;
}

async function main() {
  let list;
  try {
    list = await walk(IMAGES_DIR);
  } catch (e) {
    console.warn('[images] public/images missing or unreadable:', e.message);
    await fs.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 0), 'utf8');
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  /** @type {Record<string, { webp: { href: string; w: number }[] }>} */
  const manifest = {};

  for (const { abs, rel } of list) {
    const publicKey = `/images/${rel.replace(/\\/g, '/')}`;
    const parsed = path.parse(rel);
    const outSubdir = path.join(OUT_DIR, parsed.dir);
    await fs.mkdir(outSubdir, { recursive: true });

    const webpEntries = [];

    for (const w of TARGET_WIDTHS) {
      const outName = `${parsed.name}-${w}.webp`;
      const outAbs = path.join(outSubdir, outName);
      const pipeline = sharp(abs).rotate().resize({
        width: w,
        withoutEnlargement: true,
        fit: 'inside',
      });

      try {
        await pipeline.webp(webpOptions).toFile(outAbs);
      } catch (err) {
        console.warn('[images] skip', publicKey, w, err.message);
        continue;
      }

      const meta = await sharp(outAbs).metadata();
      const intrinsicW = meta.width ?? w;
      const dirPosix = parsed.dir ? parsed.dir.split(path.sep).join('/') : '';
      const href = `/images-deriv/${dirPosix ? `${dirPosix}/` : ''}${outName}`.replace(/\/+/g, '/');
      webpEntries.push({ href, w: intrinsicW });
    }

    if (webpEntries.length > 0) {
      manifest[publicKey] = { webp: webpEntries };
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(
    `[images] wrote ${Object.keys(manifest).length} sources → ${OUT_DIR} + ${path.relative(ROOT, MANIFEST_PATH)}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
