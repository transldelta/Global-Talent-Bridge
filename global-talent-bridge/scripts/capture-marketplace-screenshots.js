/**
 * scripts/capture-marketplace-screenshots.js
 *
 * Captures fresh screenshots of live corridorwork.com public pages.
 * Uses Playwright (npx) with system-cached Chromium.
 *
 * Run: node scripts/capture-marketplace-screenshots.js
 *
 * Rules:
 * - Live website only (https://corridorwork.com)
 * - No admin pages, no buyer-room, no promo-video
 * - No fake data added
 * - Desktop viewport 1440×1200, deviceScaleFactor 2 (retina)
 * - Waits for networkidle
 */

// Use npx-cached playwright when not installed as project dependency
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (_) {
  ({ chromium } = require('/Users/brahimbenabla/.npm/_npx/e41f203b7505f1fb/node_modules/playwright'));
}
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '../public/marketplace-screenshots');

const PAGES = [
  {
    name: 'corridorwork-homepage.png',
    url: 'https://corridorwork.com/',
    desc: 'Homepage',
  },
  {
    name: 'corridorwork-for-buyers.png',
    url: 'https://corridorwork.com/for-buyers',
    desc: 'For Buyers',
  },
  {
    name: 'corridorwork-employers.png',
    url: 'https://corridorwork.com/for-employers',
    desc: 'For Employers',
  },
  {
    name: 'corridorwork-candidates.png',
    url: 'https://corridorwork.com/for-candidates',
    desc: 'For Candidates',
  },
  {
    name: 'corridorwork-partners.png',
    url: 'https://corridorwork.com/partners',
    desc: 'Partners',
  },
  {
    name: 'corridorwork-demo.png',
    url: 'https://corridorwork.com/demo',
    desc: 'Demo',
  },
  {
    name: 'corridorwork-buyer-snapshot.png',
    url: 'https://corridorwork.com/buyer-snapshot',
    desc: 'Buyer Snapshot',
  },
];

async function captureScreenshots() {
  console.log('Starting Playwright screenshot capture...\n');

  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const results = [];

  for (const target of PAGES) {
    const outPath = path.join(OUT_DIR, target.name);
    console.log(`Capturing: ${target.desc} → ${target.url}`);

    try {
      const page = await context.newPage();

      // Navigate and wait for network idle
      await page.goto(target.url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Extra settle time for CSS transitions / fonts
      await page.waitForTimeout(1500);

      // Screenshot: full page, clip to first ~1200px height (hero + first sections)
      await page.screenshot({
        path: outPath,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1440, height: 1200 },
      });

      await page.close();

      const stat = fs.statSync(outPath);
      const kb = Math.round(stat.size / 1024);
      console.log(`  ✓ Saved: ${outPath} (${kb} KB)`);
      results.push({ name: target.name, path: outPath, size: kb, ok: true });
    } catch (err) {
      console.error(`  ✗ Failed: ${target.desc} — ${err.message}`);
      results.push({ name: target.name, ok: false, error: err.message });
    }
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.name} — ${r.size} KB`);
    } else {
      console.log(`  ✗ ${r.name} — FAILED: ${r.error}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} screenshot(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${results.length} screenshots captured successfully.`);
}

captureScreenshots().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
