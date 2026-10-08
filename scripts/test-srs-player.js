const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERR:', err));

  console.log('Navigating to carnet-erreurs...');
  await page.goto('http://127.0.0.1:3000/carnet-erreurs', { waitUntil: 'domcontentloaded' });
  
  // Attente que React s'hydrate complètement
  console.log('Waiting for React hydration...');
  await page.waitForTimeout(3000);

  console.log('Clicking Lancer la Session du Jour...');
  const startBtn = page.getByRole('button', { name: /Lancer la Session du Jour/i });
  await startBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'public/tests/srs-player-active.png' });
  console.log('Captured srs-player-active.png');

  // Reveal answer
  const revealBtn = page.getByRole('button', { name: /Afficher la Réponse/i });
  if (await revealBtn.isVisible()) {
    console.log('Clicking reveal answer...');
    await revealBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'public/tests/srs-player-revealed.png' });
    console.log('Captured srs-player-revealed.png');
  } else {
    console.log('Reveal button NOT visible');
  }

  await browser.close();
  console.log('Test completed successfully');
}

main().catch(console.error);
