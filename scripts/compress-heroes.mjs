/**
 * Re-compress home hero WebPs in place (max 1920px wide, quality 80).
 * Archives previous file under to-Be_deleted/ before replacing.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const HERO_DIR = path.join(ROOT, 'public', 'images', 'home', 'hero');
const ARCHIVE_ROOT = path.join(ROOT, 'to-Be_deleted', 'images', 'home', 'hero');
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 70;
const MIN_BYTES = 350 * 1024;

async function compressHero(fileName) {
  const abs = path.join(HERO_DIR, fileName);
  let stat;
  try {
    stat = await fs.stat(abs);
  } catch {
    console.log(`  skip ${fileName} (not found)`);
    return null;
  }

  if (stat.size < MIN_BYTES) {
    console.log(`  skip ${fileName} (${Math.round(stat.size / 1024)}KB — already small)`);
    return null;
  }

  const meta = await sharp(abs).metadata();
  const pipeline = sharp(abs).rotate();
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  const buffer = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
    .toBuffer();

  const beforeKb = Math.round(stat.size / 1024);
  const afterKb = Math.round(buffer.length / 1024);

  if (buffer.length >= stat.size) {
    console.log(`  keep ${fileName} (${beforeKb}KB — recompress would not shrink)`);
    return null;
  }

  const base = fileName.replace(/\.webp$/i, '');
  const outName = `${base}.sm.webp`;
  const outAbs = path.join(HERO_DIR, outName);

  await fs.mkdir(ARCHIVE_ROOT, { recursive: true });
  const archiveAbs = path.join(ARCHIVE_ROOT, fileName);
  try {
    await fs.access(archiveAbs);
  } catch {
    await fs.copyFile(abs, archiveAbs);
  }

  await fs.writeFile(outAbs, buffer);

  const saved = ((1 - buffer.length / stat.size) * 100).toFixed(1);
  console.log(`  ✓ ${fileName} → ${outName}: ${beforeKb}KB → ${afterKb}KB (−${saved}%)`);
  return { from: fileName, to: outName };
}

const PAGE_HEADER_REL = [
  'home/destinations/wayanad/wayanad-misty-hills.sm.webp',
  'home/destinations/tamil-nadu/tamil-nadu-nilgiri-landscape.sm.webp',
  'home/destinations/wayanad/wayanad-green-hills.sm.webp',
];

async function compressPageHeader(rel) {
  const fileName = path.basename(rel);
  const dir = path.join(ROOT, 'public', 'images', path.dirname(rel));
  const abs = path.join(dir, fileName);
  let stat;
  try {
    stat = await fs.stat(abs);
  } catch {
    console.log(`  skip ${rel} (not found)`);
    return null;
  }
  if (stat.size < MIN_BYTES) {
    console.log(`  skip ${rel} (${Math.round(stat.size / 1024)}KB — already small)`);
    return null;
  }

  const buffer = await sharp(abs)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
    .toBuffer();

  const beforeKb = Math.round(stat.size / 1024);
  const afterKb = Math.round(buffer.length / 1024);
  if (buffer.length >= stat.size) {
    console.log(`  keep ${rel} (${beforeKb}KB)`);
    return null;
  }

  const base = fileName.replace(/\.(jpe?g|webp|png)$/i, '');
  const outName = `${base}.sm.webp`;
  const outAbs = path.join(dir, outName);
  const archiveAbs = path.join(ARCHIVE_ROOT, '..', path.dirname(rel), fileName);
  await fs.mkdir(path.dirname(archiveAbs), { recursive: true });
  try {
    await fs.access(archiveAbs);
  } catch {
    await fs.copyFile(abs, archiveAbs);
  }
  await fs.writeFile(outAbs, buffer);
  console.log(`  ✓ ${rel} → ${outName}: ${beforeKb}KB → ${afterKb}KB`);
  return { from: fileName, to: outName, rel };
}

async function main() {
  const entries = await fs.readdir(HERO_DIR);
  const heroes = entries.filter((n) => /\.webp$/i.test(n) && !/\.sm\.webp$/i.test(n)).sort();
  console.log(`Compressing ${heroes.length} hero WebP(s) (max ${MAX_WIDTH}px, q${WEBP_QUALITY})…\n`);
  /** @type {{ from: string; to: string }[]} */
  const swapped = [];
  for (const name of heroes) {
    const entry = await compressHero(name);
    if (entry) swapped.push(entry);
  }

  console.log(`\nPage header images…\n`);
  for (const rel of PAGE_HEADER_REL) {
    await compressPageHeader(rel);
  }

  if (swapped.length) {
    const mapPath = path.join(ROOT, 'scripts', 'hero-compress-map.json');
    await fs.writeFile(mapPath, JSON.stringify(swapped, null, 2));
    console.log(`\nWrote ${mapPath} — update Home.jsx hero paths if needed.`);
  }
  console.log('Run: npm run images:build');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
