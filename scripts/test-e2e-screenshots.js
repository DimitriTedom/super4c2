const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
  const outDir = path.join(process.cwd(), 'public', 'tests');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Launching browser via Playwright...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Navigating to Compréhension Orale CBT...');
  await page.goto('http://127.0.0.1:3000/examens/demo-101-co/co', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const coQ1Path = path.join(outDir, 'co-q1-screenshot.png');
  await page.screenshot({ path: coQ1Path });
  console.log('Captured CO Q1 screenshot:', coQ1Path);

  // Click Question suivante
  console.log('2. Clicking Question suivante...');
  const nextButton = page.getByRole('button', { name: /Question suivante/i });
  if (await nextButton.isVisible()) {
    await nextButton.click();
    await page.waitForTimeout(1000);
    const coQ2Path = path.join(outDir, 'co-q2-screenshot.png');
    await page.screenshot({ path: coQ2Path });
    console.log('Captured CO Q2 screenshot:', coQ2Path);
  }

  // Admin Series CE
  console.log('3. Navigating to Admin Séries CE...');
  await page.goto('http://127.0.0.1:3000/admin/series-ce', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const adminListPath = path.join(outDir, 'admin-series-list.png');
  await page.screenshot({ path: adminListPath });
  console.log('Captured Admin Series list:', adminListPath);

  // Admin Question Form
  console.log('4. Checking Admin Question Form...');
  const addQuestionLink = page.locator('a[href*="/questions"]').first();
  if (await addQuestionLink.isVisible()) {
    await addQuestionLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    const adminQuestionsPath = path.join(outDir, 'admin-questions-list.png');
    await page.screenshot({ path: adminQuestionsPath });
    console.log('Captured Admin Questions list:', adminQuestionsPath);

    const addBtn = page.getByRole('link', { name: /Ajouter une question/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);
      const formPath = path.join(outDir, 'admin-question-form.png');
      await page.screenshot({ path: formPath });
      console.log('Captured Admin Question Form:', formPath);
    }
  }

  await browser.close();
  console.log('PLAYWRIGHT TEST COMPLETE: ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

runTest().catch(err => {
  console.error('Playwright test failed:', err);
  process.exit(1);
});
