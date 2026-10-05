// One-off research helper: opens Kiara Beauty's public Instagram profile and posts
// and saves the post images the page loads into ./research/raw (with manifest.json).
// Usage: node scripts/fetch-instagram.mjs
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const PROFILE = 'https://www.instagram.com/kiara.beauty.estetica/'
const OUT = new URL('../research/raw/', import.meta.url)
const log = (m) => process.stdout.write(m + '\n')
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ locale: 'es-ES', viewport: { width: 1280, height: 1400 } })
const page = await ctx.newPage()
page.setDefaultTimeout(15000)

const bodies = new Map() // url -> Buffer
page.on('response', async (res) => {
  const url = res.url()
  if (!/cdninstagram|fbcdn/.test(url) || !(res.headers()['content-type'] || '').startsWith('image/')) return
  try { bodies.set(url.split('?')[0], { url, buf: await res.body() }) } catch {}
})

async function largestImages() {
  return page.$$eval('img', (imgs) =>
    imgs
      .filter((i) => i.getBoundingClientRect().width > 250)
      .map((i) => {
        const set = (i.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(' ')).filter((p) => p[0])
        set.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
        return { src: set[0]?.[0] || i.currentSrc || i.src, alt: i.alt }
      }),
  )
}

await page.goto(PROFILE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(5000)
const dismiss = async () => { for (const t of ['Rechazar cookies opcionales', 'Decline optional cookies', 'Cerrar']) await page.getByRole('button', { name: t }).first().click({ timeout: 1500 }).catch(() => {}) }
await dismiss()
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 3000); await page.waitForTimeout(1500); await dismiss() }
const posts = [...new Set(await page.$$eval('a[href*="/p/"], a[href*="/reel/"]', (as) => as.map((a) => a.href)))]
log(`found ${posts.length} posts`)
await page.screenshot({ path: new URL('profile.png', OUT).pathname.slice(1), fullPage: false })

const wanted = []
const profileImg = await page.$('header img')
if (profileImg) wanted.push({ id: 'profile', ...(await profileImg.evaluate((i) => ({ src: i.currentSrc || i.src, alt: i.alt }))) })

for (const url of posts.slice(0, 40)) {
  const id = url.split('/').filter(Boolean).pop()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)
    await dismiss()
    for (let slide = 0; slide < 8; slide++) {
      for (const info of await largestImages()) if (!wanted.some((w) => w.src === info.src)) wanted.push({ id, url, ...info })
      const next = page.locator('button[aria-label="Siguiente"], button[aria-label="Next"]').first()
      if (!(await next.isVisible().catch(() => false))) break
      await next.click().catch(() => {})
      await page.waitForTimeout(1200)
    }
    log(`${id}: total ${wanted.length}`)
  } catch (e) {
    log(`${id}: ${e.message.split('\n')[0]}`)
  }
}

let n = 0
for (const w of wanted) {
  const key = w.src.split('?')[0]
  let buf = bodies.get(key)?.buf
  if (!buf) {
    try { const r = await ctx.request.get(w.src, { timeout: 15000 }); if (r.ok()) buf = await r.body() } catch {}
  }
  if (!buf) { w.error = 'not downloaded'; continue }
  w.file = `${String(n++).padStart(2, '0')}-${w.id}.jpg`
  await writeFile(new URL(w.file, OUT), buf)
  delete w.src
}
await writeFile(new URL('manifest.json', OUT), JSON.stringify(wanted, null, 2))
log(`saved ${n} images`)
await browser.close()
