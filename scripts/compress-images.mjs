/**
 * High-quality WebP compression for large images in public/images/.
 * Archives originals under to-Be_deleted/ (same relative paths).
 * Writes compression-map.json for reference updates.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'public', 'images');
const ARCHIVE_ROOT = path.join(ROOT, 'to-Be_deleted');
const STAGING_ROOT = path.join(ROOT, '.image-staging');
const MAP_PATH = path.join(ROOT, 'scripts', 'compression-map.json');

const MIN_BYTES = 200 * 1024;
const MIN_SAVINGS = 0.02;
const PHOTO_QUALITY = 92;
const PNG_OPAQUE_QUALITY = 95;
const RASTER = /\.(jpe?g|png|webp)$/i;

async function walk(dir, baseRel = '') {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.name.startsWith('_')) continue;
    const rel = path.join(baseRel, ent.name).split(path.sep).join('/');
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(abs, rel)));
    else if (ent.isFile() && RASTER.test(ent.name)) out.push({ abs, rel });
  }
  return out;
}

function webpOutRel(rel) {
  return rel.replace(/\.(jpe?g|png|webp)$/i, '.webp');
}

function publicPath(rel) {
  return `/images/${rel}`;
}

async function compressOne({ abs, rel }, doneFrom) {
  const stat = await fs.stat(abs);
  if (stat.size < MIN_BYTES) return null;

  const outRel = webpOutRel(rel);
  const outAbs = path.join(IMAGES, outRel);
  const archiveAbs = path.join(ARCHIVE_ROOT, rel);
  const from = publicPath(rel);

  if (doneFrom.has(from)) return null;

  const samePath = path.resolve(outAbs) === path.resolve(abs);
  try {
    await fs.access(archiveAbs);
    if (!samePath) {
      await fs.access(outAbs);
      return null;
    }
    return null;
  } catch {
    /* not archived yet */
  }

  const meta = await sharp(abs).metadata();
  const ext = path.extname(abs).toLowerCase();

  await fs.mkdir(path.dirname(archiveAbs), { recursive: true });
  await fs.copyFile(abs, archiveAbs);

  const hasAlpha = meta.hasAlpha && ext === '.png';
  const webpOpts = hasAlpha
    ? { lossless: true, effort: 6 }
    : {
        quality: ext === '.png' ? PNG_OPAQUE_QUALITY : PHOTO_QUALITY,
        effort: 6,
        smartSubsample: true,
        alphaQuality: 100,
      };

  const buffer = await sharp(abs).rotate().webp(webpOpts).toBuffer();
  if (buffer.length >= stat.size * (1 - MIN_SAVINGS)) {
    console.log(`  skip ${rel} (WebP would not shrink; kept original)`);
    await fs.unlink(archiveAbs).catch(() => {});
    return null;
  }
  const outStat = { size: buffer.length };

  const stagedAbs = path.join(STAGING_ROOT, outRel);
  await fs.mkdir(path.dirname(stagedAbs), { recursive: true });
  await fs.writeFile(stagedAbs, buffer);

  try {
    if (!samePath && path.resolve(abs) !== path.resolve(outAbs)) {
      try {
        await fs.unlink(outAbs);
      } catch {
        /* output may not exist yet */
      }
    }
    if (samePath) {
      try {
        await fs.unlink(outAbs);
      } catch {
        /* locked  -  fall through to rename attempt */
      }
    }
    await fs.rename(stagedAbs, outAbs);
    if (!samePath) await fs.unlink(abs).catch(() => {});
  } catch (err) {
    console.warn(`  ⚠ Could not install ${outRel} (${err.code}); left in .image-staging/`);
    if (!samePath) {
      await fs.writeFile(outAbs, buffer);
      await fs.unlink(abs).catch(() => {});
    } else {
      return null;
    }
  }

  const to = publicPath(outRel);
  const saved = ((1 - outStat.size / stat.size) * 100).toFixed(1);
  console.log(
    `${saved}%  ${Math.round(stat.size / 1024)}KB → ${Math.round(outStat.size / 1024)}KB  ${rel}`
  );
  return { from, to, archived: path.relative(ROOT, archiveAbs).split(path.sep).join('/') };
}

async function loadExistingMap() {
  try {
    const raw = await fs.readFile(MAP_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function main() {
  await fs.mkdir(ARCHIVE_ROOT, { recursive: true });
  const files = await walk(IMAGES);
  const map = await loadExistingMap();
  const doneFrom = new Set(map.map((e) => e.from));

  console.log(`Compressing files ≥ ${Math.round(MIN_BYTES / 1024)} KB (quality ${PHOTO_QUALITY}, lossless PNG+alpha)…\n`);

  for (const file of files) {
    const entry = await compressOne(file, doneFrom);
    if (entry) {
      map.push(entry);
      doneFrom.add(entry.from);
      await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2));
    }
  }

  await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2));
  const before = map.length
    ? '(see per-file lines above)'
    : 0;
  console.log(`\nDone: ${map.length} file(s) compressed. Map: scripts/compression-map.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
