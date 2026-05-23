/**
 * Re-encode large JPEGs in place with mozjpeg (quality 90) when output is smaller.
 * Archives originals to to-Be_deleted/ first.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(ROOT, 'public', 'images');
const ARCHIVE = path.join(ROOT, 'to-Be_deleted');
const MIN_BYTES = 500 * 1024;
const MIN_SAVINGS = 0.005;
const JPEG_QUALITY = 88;

async function walk(dir, baseRel = '') {
  const out = [];
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_')) continue;
    const rel = path.join(baseRel, ent.name).split(path.sep).join('/');
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(abs, rel)));
    else if (/\.jpe?g$/i.test(ent.name)) out.push({ abs, rel });
  }
  return out;
}

async function main() {
  const files = await walk(IMAGES);
  let n = 0;
  for (const { abs, rel } of files) {
    const stat = await fs.stat(abs);
    if (stat.size < MIN_BYTES) continue;

    const buf = await sharp(abs)
      .rotate()
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    if (buf.length >= stat.size * (1 - MIN_SAVINGS)) continue;

    const archive = path.join(ARCHIVE, rel);
    await fs.mkdir(path.dirname(archive), { recursive: true });
    try {
      await fs.access(archive);
    } catch {
      await fs.copyFile(abs, archive);
    }
    const staged = path.join(ROOT, '.image-staging', rel);
    await fs.mkdir(path.dirname(staged), { recursive: true });
    await fs.writeFile(staged, buf);
    try {
      await fs.unlink(abs);
    } catch {
      /* locked */
    }
    try {
      await fs.rename(staged, abs);
    } catch {
      await fs.copyFile(staged, abs);
      await fs.unlink(staged).catch(() => {});
    }
    n++;
    const pct = ((1 - buf.length / stat.size) * 100).toFixed(1);
    console.log(`${pct}%  ${Math.round(stat.size / 1024)}KB → ${Math.round(buf.length / 1024)}KB  ${rel}`);
  }
  console.log(`\nRe-encoded ${n} JPEG(s) with mozjpeg q${JPEG_QUALITY}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
