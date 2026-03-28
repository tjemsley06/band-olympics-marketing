import puppeteer from 'puppeteer';
import { resolve } from 'path';

const templates = [
  { file: '01-hero-square.html', width: 1080, height: 1080, output: '01-hero-1080x1080.png' },
  { file: '01-hero-landscape.html', width: 1200, height: 630, output: '01-hero-1200x630.png' },
  { file: '01-hero-story.html', width: 1080, height: 1920, output: '01-hero-1080x1920.png' },
  { file: '02-pain-points-square.html', width: 1080, height: 1080, output: '02-pain-points-1080x1080.png' },
  { file: '02-pain-points-landscape.html', width: 1200, height: 630, output: '02-pain-points-1200x630.png' },
  { file: '02-pain-points-story.html', width: 1080, height: 1920, output: '02-pain-points-1080x1920.png' },
  { file: '03-features-square.html', width: 1080, height: 1080, output: '03-features-1080x1080.png' },
  { file: '03-features-landscape.html', width: 1200, height: 630, output: '03-features-1200x630.png' },
  { file: '03-features-story.html', width: 1080, height: 1920, output: '03-features-1080x1920.png' },
  { file: '04-pricing-square.html', width: 1080, height: 1080, output: '04-pricing-1080x1080.png' },
  { file: '04-pricing-landscape.html', width: 1200, height: 630, output: '04-pricing-1200x630.png' },
  { file: '04-pricing-story.html', width: 1080, height: 1920, output: '04-pricing-1080x1920.png' },
  { file: '05-education-square.html', width: 1080, height: 1080, output: '05-education-1080x1080.png' },
  { file: '05-education-landscape.html', width: 1200, height: 630, output: '05-education-1200x630.png' },
  { file: '05-education-story.html', width: 1080, height: 1920, output: '05-education-1080x1920.png' },
  { file: '06-easy-setup-square.html', width: 1080, height: 1080, output: '06-easy-setup-1080x1080.png' },
  { file: '06-easy-setup-landscape.html', width: 1200, height: 630, output: '06-easy-setup-1200x630.png' },
  { file: '06-easy-setup-story.html', width: 1080, height: 1920, output: '06-easy-setup-1080x1920.png' },
];

const baseDir = resolve(import.meta.dirname);
const outputDir = resolve(baseDir, 'output');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const t of templates) {
  const page = await browser.newPage();
  await page.setViewport({ width: t.width, height: t.height, deviceScaleFactor: 1 });
  const filePath = `file://${resolve(baseDir, t.file)}`;
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 15000 });
  // Wait for Google Fonts to load
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: resolve(outputDir, t.output),
    clip: { x: 0, y: 0, width: t.width, height: t.height },
  });
  console.log(`Captured: ${t.output}`);
  await page.close();
}

await browser.close();
console.log('All 18 screenshots saved to output/');
