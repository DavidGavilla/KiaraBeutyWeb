// Research helper: opens the Google Maps photo viewer for Kiara Beauty Estética and saves
// a high-DPI capture of each photo (black borders trimmed) into ./research/maps,
// recording who uploaded each one. Usage: node scripts/fetch-maps.mjs
import { chromium } from 'playwright'
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const PLACE = 'https://www.google.com/maps/search/?api=1&query=Kiara+Beauty+Estetica+Plaza+Espana+4+Palma&hl=es'
const browser = await chromium.launch()
const page = await browser.newPage({ locale: 'es-ES', viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 })
page.setDefaultTimeout(12000)
await page.goto(PLACE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(3000)
for (const name of ['Rechazar todo', 'Reject all']) await page.getByRole('button', { name }).first().click({ timeout: 2500 }).catch(() => {})
await page.waitForTimeout(7000)
await page.locator('button[jsaction*="heroHeaderImage"], button[aria-label*="Foto"], button[aria-label*="foto"]').first().click()
await page.waitForTimeout(5000)
const log = []
let last = ''
for (let i = 0; i < 30; i++) {
  const meta = (await page.locator('body').innerText()).split('\n').slice(0, 12).join(' | ')
  const shot = await page.screenshot({ clip: { x: 330, y: 70, width: 1260, height: 1050 } })
  const trimmed = await sharp(shot).trim({ background: '#000000', threshold: 18 }).jpeg({ quality: 92 }).toBuffer()
  const hash = trimmed.length + ':' + trimmed.subarray(2000, 2100).toString('hex')
  if (hash === last) break
  last = hash
  const file = `research/maps/${String(i).padStart(2, '0')}-maps.jpg`
  await writeFile(file, trimmed)
  const { width, height } = await sharp(trimmed).metadata()
  log.push({ file, width, height, meta })
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(2500)
}
await writeFile('research/maps/manifest.json', JSON.stringify(log, null, 2))
console.log(log.map((l) => `${l.file} ${l.width}x${l.height} :: ${l.meta.slice(0, 120)}`).join('\n'))
await browser.close()
