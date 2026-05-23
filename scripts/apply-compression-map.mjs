/**
 * Updates /images/... paths in source from compression-map.json
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const MAP_PATH = path.join(__dirname, 'compression-map.json');

const GLOBS = ['src', 'index.html', 'public'];

async function walkFiles(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'images-deriv') continue;
      await walkFiles(full, acc);
    } else if (/\.(jsx?|tsx?|json|html|css|mjs)$/i.test(ent.name)) {
      acc.push(full);
    }
  }
  return acc;
}

async function main() {
  const map = JSON.parse(await fs.readFile(MAP_PATH, 'utf8'));
  const files = [];
  for (const d of GLOBS) {
    const full = path.join(ROOT, d);
    try {
      await walkFiles(full, files);
    } catch {
      /* skip */
    }
  }

  let total = 0;
  for (const file of files) {
    if (file.endsWith('compression-map.json') || file.endsWith('imageDerivatives.manifest.json')) continue;
    let text = await fs.readFile(file, 'utf8');
    let changed = false;
    for (const { from, to } of map) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
      const encodedFrom = from.replace(/ /g, '%20');
      const encodedTo = to.replace(/ /g, '%20');
      if (encodedFrom !== from && text.includes(encodedFrom)) {
        text = text.split(encodedFrom).join(encodedTo);
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(file, text);
      total++;
      console.log(path.relative(ROOT, file));
    }
  }
  console.log(`\nUpdated ${total} file(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
