const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const shot = async (path) => {
    await page.waitForTimeout(600);
    await page.screenshot({ path: `public/screenshots/${path}`, fullPage: false });
    console.log(`✓ ${path}`);
  };

  const base = 'http://localhost:3000';

  // Navigate to a fresh page
  async function go() {
    await page.goto(base, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
  }

  // ===== 1. HOMEPAGE — Ringkasan view with empty form =====
  await go();
  // Ensure Ringkasan is selected (default)
  await shot('01-home.png');

  // ===== 2. HASIL KALKULASI — Form filled + result card =====
  await go();
  // Click "Usia (bulan)" if present
  const bulanBtn = page.locator('button:has-text("Usia (bulan)")');
  if (await bulanBtn.count() > 0) await bulanBtn.click();
  await page.waitForTimeout(200);
  // Fill form
  await page.locator('input#usiaBulan').fill('24');
  // Click Laki-laki label
  await page.locator('label:has-text("Laki-laki")').click();
  await page.locator('input#weight').fill('12.5');
  await page.locator('input#height').fill('85');
  // Click Hitung
  await page.locator('button:has-text("Hitung")').click();
  await page.waitForTimeout(400);
  await shot('02-hasil.png');

  // ===== 3. BB/U MODE — only weight field =====
  await go();
  // Switch to Usia (bulan) first
  const bulanBtn2 = page.locator('button:has-text("Usia (bulan)")');
  if (await bulanBtn2.count() > 0) await bulanBtn2.click();
  await page.waitForTimeout(200);
  // Click BB/U
  await page.locator('button:has-text("BB/U")').click();
  await page.waitForTimeout(200);
  // Fill form to show it in action
  await page.locator('input#usiaBulan').fill('18');
  await page.locator('label:has-text("Laki-laki")').click();
  await page.locator('input#weight').fill('8.2');
  await page.waitForTimeout(200);
  await shot('03-bbu.png');

  // ===== 4. TB/U MODE — only height field =====
  await go();
  const bulanBtn3 = page.locator('button:has-text("Usia (bulan)")');
  if (await bulanBtn3.count() > 0) await bulanBtn3.click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("TB/U")').click();
  await page.waitForTimeout(200);
  await page.locator('input#usiaBulan').fill('36');
  await page.locator('label:has-text("Perempuan")').click();
  await page.locator('input#height').fill('92');
  await shot('04-tbu.png');

  // ===== 5. BB/TB MODE — both fields =====
  await go();
  const bulanBtn4 = page.locator('button:has-text("Usia (bulan)")');
  if (await bulanBtn4.count() > 0) await bulanBtn4.click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("BB/TB")').click();
  await page.waitForTimeout(200);
  await page.locator('input#usiaBulan').fill('12');
  await page.locator('label:has-text("Laki-laki")').click();
  await page.locator('input#weight').fill('9.5');
  await page.locator('input#height').fill('72');
  await shot('05-bbtb.png');

  // ===== 6. IMT/U MODE =====
  await go();
  const bulanBtn5 = page.locator('button:has-text("Usia (bulan)")');
  if (await bulanBtn5.count() > 0) await bulanBtn5.click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("IMT/U")').click();
  await page.waitForTimeout(200);
  await page.locator('input#usiaBulan').fill('48');
  await page.locator('label:has-text("Laki-laki")').click();
  await page.locator('input#weight').fill('16.0');
  await page.locator('input#height').fill('102');
  await shot('06-imtu.png');

  // ===== 7. ARSIP MODE — form with data fields =====
  await go();
  // Enable archive
  await page.locator('button:has-text("Arsip")').click();
  await page.waitForTimeout(300);
  // Switch to Tanggal Lahir
  const tglBtn = page.locator('button:has-text("Tanggal Lahir")');
  if (await tglBtn.count() > 0) await tglBtn.click();
  await page.waitForTimeout(200);
  // Fill all archive fields
  await page.locator('input#name').fill('BUDI SANTOSO');
  await page.locator('input#birthDate').fill('2023-01-15');
  await page.locator('input#parentName').fill('SARI WIDODO');
  await page.locator('textarea#address').fill('JL. MERPATI NO. 10, KEC. BANJARSARI');
  // Select gender
  await page.locator('label:has-text("Laki-laki")').click();
  // Fill measurements
  await page.locator('input#weight').fill('12.5');
  await page.locator('input#height').fill('85');
  await shot('07-arsip.png');

  // ===== 8. ARSIP RECORDS — save two records =====
  // Save first
  await page.locator('button:has-text("Simpan")').click();
  await page.waitForTimeout(1000);

  // Reload and add second record
  await go();
  await page.locator('button:has-text("Arsip")').click();
  await page.waitForTimeout(300);
  const tglBtn2 = page.locator('button:has-text("Tanggal Lahir")');
  if (await tglBtn2.count() > 0) await tglBtn2.click();
  await page.waitForTimeout(200);
  await page.locator('input#name').fill('SITI AISYAH');
  await page.locator('input#birthDate').fill('2022-06-20');
  await page.locator('label:has-text("Perempuan")').click();
  await page.locator('input#weight').fill('10.2');
  await page.locator('input#height').fill('78');
  await page.locator('button:has-text("Simpan")').click();
  await page.waitForTimeout(1000);

  // Reload to show the records table
  await go();
  await page.locator('button:has-text("Arsip")').click();
  await page.waitForTimeout(500);
  await shot('08-arsip-records.png');

  await browser.close();
  console.log('All screenshots captured successfully.');
})();
