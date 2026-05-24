/**
 * Post-build prerender — saves fully rendered HTML for every indexable route.
 * Google receives real page content without relying on JavaScript execution.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const PORT = 4177;
const PREVIEW_HOST = '127.0.0.1';

const ROUTES = [
  '/',
  '/about',
  '/properties',
  '/contact',
  '/destinations/wayanad',
  '/destinations/ooty',
  '/destinations/kerala',
  '/property/wayanad-gate',
  '/property/ubuntu-retreat-ooty',
];

function routeToFile(route) {
  if (route === '/') return join(dist, 'index.html');
  return join(dist, route.slice(1), 'index.html');
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['vite', 'preview', '--host', PREVIEW_HOST, '--port', String(PORT), '--strictPort'],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
    );

    let settled = false;
    const tryResolve = () => {
      if (settled) return;
      settled = true;
      resolve(proc);
    };

    proc.stdout.on('data', (chunk) => {
      if (String(chunk).includes('Local:')) tryResolve();
    });
    proc.stderr.on('data', (chunk) => {
      if (String(chunk).includes('Local:')) tryResolve();
    });
    proc.on('error', reject);
    setTimeout(tryResolve, 10_000);
  });
}

async function waitForServer(baseUrl) {
  for (let i = 0; i < 30; i += 1) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('[prerender] preview server did not start');
}

async function prerenderRoute(page, baseUrl, route) {
  const url = `${baseUrl}${route}?_prerender=1`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90_000 });
  await page.waitForSelector('footer', { timeout: 60_000 });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

  let html = await page.content();
  html = html.replace(/\?_prerender=1/g, '').replace(/&_prerender=1/g, '');

  const out = routeToFile(route);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  console.log(`[prerender] ${route}`);
}

async function main() {
  const baseUrl = `http://${PREVIEW_HOST}:${PORT}`;
  const preview = await startPreview();

  try {
    await waitForServer(baseUrl);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      for (const route of ROUTES) {
        await prerenderRoute(page, baseUrl, route);
      }
    } finally {
      await browser.close();
    }
  } finally {
    preview.kill('SIGTERM');
  }

  console.log(`[prerender] wrote ${ROUTES.length} routes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
