// End-to-end smoke check for the local site (run `npm run dev` first).
// Blocks every non-local request so no real message or booking can be sent,
// then checks layout, menu, language, tabs, gallery, links, console and images,
// saving screenshots to ./screenshots. Usage: node scripts/check-site.mjs [baseUrl]
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] || 'http://localhost:5174/'
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

const results = []
const ok = (name, pass, detail = '') => results.push({ name, pass, detail })

const browser = await chromium.launch()

async function open(viewport, label, lang = 'es') {
  const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const problems = []
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => {
    if (new URL(r.url()).hostname === 'localhost') problems.push(`failed: ${r.url()}`)
  })
  await page.route('**/*', (route) =>
    new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort(),
  )
  await page.goto(`${BASE}?lang=${lang}`, { waitUntil: 'networkidle' })
  ok(`${label}: no console/network errors`, problems.length === 0, problems.join(' | '))
  return { ctx, page, problems }
}

async function noOverflow(page, label) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
  ok(`${label}: no horizontal overflow`, sw <= cw, `scrollWidth=${sw} clientWidth=${cw}`)
}

async function imagesOk(page, label) {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager'
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))))
  })
  const bad = await page.$$eval('main img:not([data-lightbox-img])', (imgs) =>
    imgs.filter((i) => !i.naturalWidth || !i.alt || !i.getAttribute('width')).map((i) => i.currentSrc || i.src),
  )
  ok(`${label}: images load with alt + dimensions`, bad.length === 0, bad.join(', '))
}

/* ---------- Desktop ---------- */
{
  const { ctx, page } = await open({ width: 1440, height: 900 }, 'desktop-es')
  await noOverflow(page, 'desktop-es')
  await imagesOk(page, 'desktop-es')
  await page.screenshot({ path: `${OUT}/desktop-es-hero.png` })
  await page.screenshot({ path: `${OUT}/desktop-es-full.png`, fullPage: true })

  // Keyboard: first Tab lands on the skip link.
  await page.keyboard.press('Tab')
  ok('desktop: first Tab focuses skip link', (await page.evaluate(() => document.activeElement?.className)) === 'skip')

  // Tabs: keyboard navigation between categories.
  await page.locator('#tab-manicura').focus()
  await page.keyboard.press('ArrowRight')
  const selected = await page.getAttribute('#tab-pedicura', 'aria-selected')
  const visible = await page.isVisible('#panel-pedicura')
  ok('desktop: service tabs respond to arrow keys', selected === 'true' && visible)
  await page.locator('#tab-masajes').click()
  await page.locator('#services').screenshot({ path: `${OUT}/desktop-es-services.png` })

  // Gallery lightbox: open, next, close with Escape, focus returns.
  await page.locator('[data-gallery-index="1"]').click()
  const openState = await page.evaluate(() => document.querySelector('[data-lightbox]').open)
  await page.keyboard.press('ArrowRight')
  const caption = await page.textContent('[data-lightbox-caption]')
  await page.screenshot({ path: `${OUT}/desktop-es-lightbox.png` })
  await page.keyboard.press('Escape')
  const focusBack = await page.evaluate(() => document.activeElement?.dataset.galleryIndex)
  ok('desktop: lightbox opens, advances and closes', openState && caption?.startsWith('3 /') && focusBack === '1', `caption=${caption} focus=${focusBack}`)

  // FAQ toggles.
  await page.locator('.faq__item summary').first().click()
  ok('desktop: FAQ opens', await page.evaluate(() => document.querySelector('.faq__item').open))

  // Contact links point to verified channels only.
  const hrefs = await page.$$eval('a[href]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  const external = hrefs.filter((h) => /^https?:/.test(h))
  const allowed = ['reservas.koibox.cloud', 'wa.me', 'instagram.com', 'google.com']
  const unknown = external.filter((h) => !allowed.some((d) => h.includes(d)))
  ok('desktop: external links limited to verified channels', unknown.length === 0, unknown.join(', '))
  ok('desktop: phone link present', hrefs.includes('tel:+34613000591'))
  const blankWithoutRel = await page.$$eval('a[target=_blank]', (as) => as.filter((a) => !/noopener/.test(a.rel)).length)
  ok('desktop: new-tab links use rel=noopener', blankWithoutRel === 0)
  const anchors = hrefs.filter((h) => h.startsWith('#'))
  const missing = await page.evaluate((ids) => ids.filter((id) => !document.querySelector(id)), anchors)
  ok('desktop: in-page anchors resolve', missing.length === 0, missing.join(', '))

  // Language switch.
  await page.locator('[data-lang="en"]').click()
  const lang = await page.evaluate(() => document.documentElement.lang)
  const h1 = await page.textContent('h1')
  ok('desktop: switches to English', lang === 'en' && /Vegan/.test(h1 ?? ''), `lang=${lang} h1=${h1}`)
  await page.screenshot({ path: `${OUT}/desktop-en-full.png`, fullPage: true })
  await ctx.close()
}

/* ---------- Mobile ---------- */
for (const lang of ['es', 'en']) {
  const label = `mobile-${lang}`
  const { ctx, page } = await open({ width: 390, height: 844 }, label, lang)
  await noOverflow(page, label)
  await imagesOk(page, label)
  await page.screenshot({ path: `${OUT}/${label}-hero.png` })
  await page.screenshot({ path: `${OUT}/${label}-full.png`, fullPage: true })
  if (lang === 'es') {
    ok('mobile: sticky booking bar visible', await page.isVisible('.mobile-bar'))
    await page.locator('[data-menu-toggle]').click()
    await page.waitForTimeout(350)
    const expanded = await page.getAttribute('[data-menu-toggle]', 'aria-expanded')
    ok('mobile: menu opens', expanded === 'true' && (await page.isVisible('.nav__list a')))
    await page.screenshot({ path: `${OUT}/mobile-es-menu.png` })
    await page.keyboard.press('Escape')
    ok('mobile: Escape closes menu', (await page.getAttribute('[data-menu-toggle]', 'aria-expanded')) === 'false')
    await page.locator('#tab-facial').scrollIntoViewIfNeeded()
    await page.locator('#tab-facial').click()
    await page.locator('#services').screenshot({ path: `${OUT}/mobile-es-services.png` })
    await noOverflow(page, 'mobile-es after tab change')
  }
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.pass ? `  -> ${r.detail}` : ''}`)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exitCode = failed.length ? 1 : 0
