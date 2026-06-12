/**
 * Syncs favicon.ico from public/favicon.png (exact same 32×32 image).
 * Google and legacy browsers request /favicon.ico automatically.
 */
import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const src = join(publicDir, 'favicon.png');
const dest = join(publicDir, 'favicon.ico');

copyFileSync(src, dest);
console.log('[favicons] favicon.ico synced from favicon.png');
