/**
 * Restore originals when WebP is not smaller; keep successful compressions only.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'public', 'images');
const MAP_PATH = path.join(__dirname, 'compression-map.json');
const MIN_SAVINGS = 0.02;

function relFromPublic(publicPath) {
  return publicPath.replace(/^\/images\//, '').replace(/\//g, path.sep);
}

async function main() {
  const map = JSON.parse(await fs.readFile(MAP_PATH, 'utf8'));
  const kept = [];
  let restored = 0;

  for (const entry of map) {
    const archiveAbs = path.join(ROOT, entry.archived);
    const toAbs = path.join(IMAGES, relFromPublic(entry.to));
    const fromAbs = path.join(IMAGES, relFromPublic(entry.from));

    let archiveSize;
    try {
      archiveSize = (await fs.stat(archiveAbs)).size;
    } catch {
      console.warn(`Missing archive: ${entry.archived}`);
      continue;
    }

    let outSize = 0;
    try {
      outSize = (await fs.stat(toAbs)).size;
    } catch {
      console.warn(`Missing output: ${entry.to}`);
      await fs.copyFile(archiveAbs, fromAbs);
      await fs.mkdir(path.dirname(fromAbs), { recursive: true });
      restored++;
      continue;
    }

    if (outSize >= archiveSize * (1 - MIN_SAVINGS)) {
      await fs.mkdir(path.dirname(fromAbs), { recursive: true });
      try {
        await fs.unlink(toAbs);
      } catch {
        /* */
      }
      await fs.copyFile(archiveAbs, fromAbs);
      restored++;
      console.log(`Restored: ${entry.from} (webp was not smaller)`);
    } else {
      if (path.resolve(fromAbs) !== path.resolve(toAbs)) {
        try {
          await fs.access(fromAbs);
          await fs.unlink(fromAbs);
        } catch {
          /* */
        }
      }
      kept.push(entry);
      const pct = ((1 - outSize / archiveSize) * 100).toFixed(1);
      console.log(`Kept: ${entry.to} (−${pct}%)`);
    }
  }

  await fs.writeFile(MAP_PATH, JSON.stringify(kept, null, 2));
  console.log(`\nKept ${kept.length}, restored ${restored}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
