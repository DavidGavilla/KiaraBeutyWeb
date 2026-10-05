import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/figtree'
import './style.css'
import {
  business,
  categories,
  faqs,
  gallery,
  hours,
  photos,
  reviews,
  ui,
  type Lang,
  type Photo,
  type Service,
  type UiCopy,
} from './content'
import { icon } from './icons'

const LANG_KEY = 'kiara-lang'
const app = document.querySelector<HTMLDivElement>('#app')

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const esc = (value: string): string => value.replace(/[&<>"']/g, (c) => ESCAPES[c])

function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    return stored === 'es' || stored === 'en' ? stored : null
  } catch {
    return null
  }
}

function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // Storage can be unavailable (private mode); the language still applies for this visit.
  }
}

function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang')
  if (param === 'es' || param === 'en') return param
  return readStoredLang() ?? 'es'
}

function formatPrice(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

const photoUrl = (photo: Photo, width = photo.widths[photo.widths.length - 1]) => `/images/${photo.name}-${width}.webp`

function img(photo: Photo, lang: Lang, opts: { sizes: string; eager?: boolean; className?: string }): string {
  const loading = opts.eager ? 'eager" fetchpriority="high' : 'lazy'
  const srcset = photo.widths.map((w) => `${photoUrl(photo, w)} ${w}w`).join(', ')
  return `<img src="${photoUrl(photo)}" srcset="${srcset}" sizes="${opts.sizes}" width="${photo.width}" height="${photo.height}"
    alt="${esc(photo.alt[lang])}" loading="${loading}" decoding="async"${opts.className ? ` class="${opts.className}"` : ''} />`
}

/** Aborted on every re-render so document/window listeners never pile up. */
let listeners = new AbortController()

const external = (href: string, _t?: UiCopy) =>
  `href="${href}" target="_blank" rel="noopener noreferrer" aria-describedby="newtab-hint"`

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function header(t: UiCopy, lang: Lang): string {
  const links = Object.entries(t.nav)
    .map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`)
    .join('')
  const langSwitch = (['es', 'en'] as const)
    .map(
      (code) =>
        `<button type="button" class="lang__btn" data-lang="${code}" aria-pressed="${code === lang}" lang="${code}">
          <span aria-hidden="true">${code.toUpperCase()}</span><span class="sr-only">${code === 'es' ? 'Español' : 'English'}</span>
        </button>`,
    )
    .join('')
  return `
  <a class="skip" href="#main">${esc(t.skip)}</a>
  <p class="proposal">${esc(t.proposal)}</p>
  <header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="brand" href="#top" aria-label="${esc(business.name)}">
        <span class="brand__mark" aria-hidden="true">${icon('leaf')}</span>
        <span class="brand__name">Kiara Beauty<small>Estética</small></span>
      </a>
      <nav class="nav" id="site-nav" aria-label="${lang === 'es' ? 'Principal' : 'Main'}" data-nav>
        <ul class="nav__list">${links}</ul>
      </nav>
      <div class="site-header__actions">
        <div class="lang" role="group" aria-label="${esc(t.langLabel)}">${langSwitch}</div>
        <a class="btn btn--primary btn--sm header-cta" ${external(business.booking, t)}>${esc(t.book)}</a>
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>
          <span class="menu-toggle__bars" aria-hidden="true"></span>
          <span class="sr-only" >${esc(t.menu)}</span>
        </button>
      </div>
    </div>
  </header>`
}

function hero(t: UiCopy, lang: Lang): string {
  const facts = t.facts
    .map(([big, small]) => `<li><strong>${esc(big)}</strong><span>${esc(small)}</span></li>`)
    .join('')
  return `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero__copy">
      <p class="eyebrow">${icon('pin')} ${esc(t.heroEyebrow)}</p>
      <h1 id="hero-title" class="hero__title">${esc(t.heroTitle)}</h1>
      <p class="hero__text">${esc(t.heroText)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#services">${esc(t.heroCtaServices)}</a>
        <a class="btn btn--ghost" ${external(business.whatsapp, t)}>${icon('whatsapp')} ${esc(t.heroCtaAvailability)}</a>
      </div>
      <p class="hero__note">${esc(t.heroNote)}</p>
      <ul class="hero__facts">${facts}</ul>
    </div>
    <figure class="hero__media">
      ${img(photos.hero, lang, { sizes: '(min-width: 960px) 46vw, 100vw', eager: true })}
      <figcaption class="hero__badge">${icon('leaf')} ${lang === 'es' ? 'Vegana · cruelty-free' : 'Vegan · cruelty-free'}</figcaption>
    </figure>
  </section>`
}

function serviceRow(service: Service, t: UiCopy, lang: Lang): string {
  const price = formatPrice(service.price, lang) + (service.perUnit ? ` <small>${esc(t.perUnit)}</small>` : '')
  return `<li class="menu-item">
    <span class="menu-item__name">${esc(service.name[lang])}</span>
    <span class="menu-item__dots" aria-hidden="true"></span>
    <span class="menu-item__meta"><span class="menu-item__time">${service.minutes} ${t.min}</span><span class="menu-item__price">${price}</span></span>
  </li>`
}

function services(t: UiCopy, lang: Lang): string {
  const tabs = categories
    .map((cat, i) => {
      const flat = cat.services.filter((x) => !x.perUnit)
      const from = Math.min(...(flat.length ? flat : cat.services).map((x) => x.price))
      return `<button type="button" role="tab" class="tab" id="tab-${cat.id}" aria-controls="panel-${cat.id}"
        aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        <span class="tab__title">${esc(cat.title[lang])}</span>
        <span class="tab__from">${esc(t.from)} ${formatPrice(from, lang)}</span>
      </button>`
    })
    .join('')
  const panels = categories
    .map(
      (cat, i) => `<div role="tabpanel" class="panel" id="panel-${cat.id}" aria-labelledby="tab-${cat.id}" tabindex="0"${i === 0 ? '' : ' hidden'}>
        <div class="panel__media">${img(photos[cat.image], lang, { sizes: '(min-width: 960px) 26vw, 100vw' })}</div>
        <div class="panel__body">
          <h3 class="panel__title">${esc(cat.title[lang])}</h3>
          <p class="panel__summary">${esc(cat.summary[lang])}</p>
          <ul class="menu" role="list">${cat.services.map((x) => serviceRow(x, t, lang)).join('')}</ul>
          <a class="btn btn--primary" ${external(business.booking, t)}>${icon('calendar')} ${esc(t.bookThis)}</a>
        </div>
      </div>`,
    )
    .join('')
  return `
  <section class="section services" id="services" aria-labelledby="services-title">
    <div class="section__head">
      <p class="eyebrow">${esc(t.servicesEyebrow)}</p>
      <h2 id="services-title">${esc(t.servicesTitle)}</h2>
      <p class="section__lede">${esc(t.servicesIntro)} (<a ${external(business.booking, t)}>Koibox</a>), ${esc(t.checkedOn)} ${esc(business.pricesCheckedOn[lang])}.</p>
    </div>
    <div class="services__layout">
      <div class="tabs" role="tablist" aria-label="${esc(t.servicesEyebrow)}" data-tabs>${tabs}</div>
      <div class="panels">${panels}</div>
    </div>
  </section>`
}

function about(t: UiCopy, lang: Lang): string {
  const values = t.values
    .map(([title, text]) => `<li><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join('')
  return `
  <section class="section about" id="about" aria-labelledby="about-title">
    <div class="about__media">
      ${img(photos.cabin, lang, { sizes: '(min-width: 960px) 30vw, 100vw', className: 'about__img about__img--a' })}
      ${img(photos.oil, lang, { sizes: '(min-width: 960px) 20vw, 60vw', className: 'about__img about__img--b' })}
    </div>
    <div class="about__copy">
      <p class="eyebrow">${esc(t.aboutEyebrow)}</p>
      <h2 id="about-title">${esc(t.aboutTitle)}</h2>
      ${t.aboutText.map((p) => `<p>${esc(p)}</p>`).join('')}
      <ul class="values">${values}</ul>
    </div>
  </section>`
}

function galleryView(t: UiCopy, lang: Lang): string {
  const items = gallery
    .map(
      (key, i) => `<li class="gallery__item gallery__item--${i}">
        <button type="button" class="gallery__btn" data-gallery-index="${i}" aria-label="${esc(t.galleryOpen)}: ${esc(photos[key].alt[lang])}">
          ${img(photos[key], lang, { sizes: '(min-width: 960px) 25vw, 50vw' })}
        </button>
      </li>`,
    )
    .join('')
  return `
  <section class="section gallery" id="gallery" aria-labelledby="gallery-title">
    <div class="section__head section__head--row">
      <div>
        <p class="eyebrow">${esc(t.galleryEyebrow)}</p>
        <h2 id="gallery-title">${esc(t.galleryTitle)}</h2>
      </div>
      <a class="link" ${external(business.instagram, t)}>${icon('instagram')} ${business.instagramHandle}</a>
    </div>
    <ul class="gallery__grid" role="list">${items}</ul>
    <p class="fineprint">${esc(t.galleryNote)}</p>
    <dialog class="lightbox" data-lightbox aria-label="${esc(t.galleryTitle)}">
      <figure class="lightbox__figure"><img data-lightbox-img alt="" /><figcaption data-lightbox-caption></figcaption></figure>
      <button type="button" class="lightbox__btn lightbox__prev" data-lightbox-prev aria-label="${esc(t.galleryPrev)}">${icon('arrowLeft')}</button>
      <button type="button" class="lightbox__btn lightbox__next" data-lightbox-next aria-label="${esc(t.galleryNext)}">${icon('arrowRight')}</button>
      <button type="button" class="lightbox__btn lightbox__close" data-lightbox-close aria-label="${esc(t.close)}">${icon('close')}</button>
    </dialog>
  </section>`
}

function reviewsView(t: UiCopy, lang: Lang): string {
  const cards = reviews
    .map((r) => {
      const translated = r.lang !== lang
      return `<li class="review">
        <div class="review__stars" role="img" aria-label="5/5">${icon('star').repeat(5)}</div>
        <blockquote lang="${translated ? lang : r.lang}"><p>${esc(translated ? r.translation : r.text)}</p></blockquote>
        ${translated ? `<p class="review__orig"><span>${esc(t.reviewTranslated)} · </span><span lang="${r.lang}">“${esc(r.text)}”</span></p>` : ''}
        <p class="review__by">${esc(r.author)} · Google · ${r.year}</p>
      </li>`
    })
    .join('')
  return `
  <section class="section reviews" id="reviews" aria-labelledby="reviews-title">
    <div class="section__head section__head--row">
      <div>
        <p class="eyebrow">${esc(t.reviewsEyebrow)}</p>
        <h2 id="reviews-title">${esc(t.reviewsTitle)}</h2>
      </div>
      <a class="link" ${external(business.maps, t)}>${esc(t.reviewsAll)} ${icon('arrowRight')}</a>
    </div>
    <ul class="reviews__grid" role="list">${cards}</ul>
    <p class="fineprint">${esc(t.reviewsSource)}</p>
  </section>`
}

function faqView(t: UiCopy, lang: Lang): string {
  const items = faqs
    .map((f) => `<details class="faq__item"><summary>${esc(f.q[lang])}${icon('plus')}</summary><p>${esc(f.a[lang])}</p></details>`)
    .join('')
  return `
  <section class="section faq" id="faq" aria-labelledby="faq-title">
    <div class="section__head">
      <p class="eyebrow">${esc(t.faqEyebrow)}</p>
      <h2 id="faq-title">${esc(t.faqTitle)}</h2>
    </div>
    <div class="faq__list">${items}</div>
  </section>`
}

function visit(t: UiCopy, lang: Lang): string {
  const rows = hours
    .map(
      (h) => `<tr${h.time ? '' : ' class="is-closed"'}><th scope="row">${esc(h.day[lang])}</th><td>${h.time ?? esc(t.closed)}</td></tr>`,
    )
    .join('')
  return `
  <section class="section visit" id="visit" aria-labelledby="visit-title">
    <div class="section__head">
      <p class="eyebrow">${esc(t.visitEyebrow)}</p>
      <h2 id="visit-title">${esc(t.visitTitle)}</h2>
    </div>
    <div class="visit__grid">
      <div class="visit__card">
        <h3>${esc(t.address)}</h3>
        <address>${esc(business.street)}, ${esc(business.floor)}<br />${business.postalCode} ${business.city}, Illes Balears</address>
        <h3>${esc(t.howTo)}</h3>
        <ol class="steps">${t.howToSteps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>
        <a class="btn btn--ghost" ${external(business.directions, t)}>${icon('pin')} ${esc(t.directions)}</a>
      </div>
      <div class="visit__card">
        <h3>${esc(t.hoursTitle)}</h3>
        <table class="hours"><tbody>${rows}</tbody></table>
      </div>
      <div class="visit__card visit__card--accent">
        <h3>${esc(t.contactTitle)}</h3>
        <ul class="contact" role="list">
          <li><a ${external(business.booking, t)}>${icon('calendar')}<span><strong>${esc(t.contactBook)}</strong><small>${esc(t.contactBookNote)}</small></span></a></li>
          <li><a ${external(business.whatsapp, t)}>${icon('whatsapp')}<span><strong>${esc(t.contactWhatsapp)}</strong><small>${esc(t.contactWhatsappNote)}</small></span></a></li>
          <li><a href="${business.phoneHref}">${icon('phone')}<span><strong>${esc(t.contactCall)}</strong><small>${business.phoneDisplay}</small></span></a></li>
          <li><a ${external(business.instagram, t)}>${icon('instagram')}<span><strong>${esc(t.contactInstagram)}</strong><small>${business.instagramHandle}</small></span></a></li>
        </ul>
      </div>
    </div>
  </section>`
}

function footer(t: UiCopy): string {
  return `
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p class="brand brand--footer"><span class="brand__mark" aria-hidden="true">${icon('leaf')}</span><span class="brand__name">Kiara Beauty<small>Estética</small></span></p>
      <p>${esc(business.street)}, ${esc(business.floor)} · ${business.postalCode} ${business.city} · <a href="${business.phoneHref}">${business.phoneDisplay}</a></p>
      <p class="site-footer__legal">${esc(t.footerLegal)} — <em>${esc(t.footerLegalPending)}</em></p>
      <p class="site-footer__credit">${esc(t.footerCredit)}</p>
    </div>
  </footer>
  <span id="newtab-hint" hidden>${esc(t.newTab)}</span>
  <nav class="mobile-bar" aria-label="${esc(t.contactTitle)}">
    <a ${external(business.booking, t)}>${icon('calendar')}<span>${esc(t.book)}</span></a>
    <a ${external(business.whatsapp, t)}>${icon('whatsapp')}<span>WhatsApp</span></a>
    <a href="${business.phoneHref}">${icon('phone')}<span>${esc(t.contactCall)}</span></a>
  </nav>`
}

/* ------------------------------------------------------------------ */
/* Behaviour                                                           */
/* ------------------------------------------------------------------ */

function bindMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const nav = document.querySelector<HTMLElement>('[data-nav]')
  if (!toggle || !nav) return
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open))
    nav.classList.toggle('is-open', open)
    document.body.classList.toggle('menu-open', open)
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'))
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false)
  })
  matchMedia('(max-width: 960px)').addEventListener('change', (e) => {
    if (!e.matches) setOpen(false)
  }, { signal: listeners.signal })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false)
      toggle.focus()
    }
  }, { signal: listeners.signal })
}

function bindTabs(): void {
  const list = document.querySelector<HTMLElement>('[data-tabs]')
  if (!list) return
  const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role=tab]')]
  const select = (tab: HTMLButtonElement, focus = false) => {
    for (const other of tabs) {
      const active = other === tab
      other.setAttribute('aria-selected', String(active))
      other.tabIndex = active ? 0 : -1
      const panel = document.getElementById(other.getAttribute('aria-controls') ?? '')
      if (panel) panel.hidden = !active
    }
    if (focus) tab.focus()
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }
  list.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[role=tab]')
    if (tab) select(tab)
  })
  list.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0) return
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    let next: number | null = null
    if (e.key in moves) next = (current + moves[e.key] + tabs.length) % tabs.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = tabs.length - 1
    if (next === null) return
    e.preventDefault()
    select(tabs[next], true)
  })
}

function bindLightbox(lang: Lang): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]')
  const image = document.querySelector<HTMLImageElement>('[data-lightbox-img]')
  const caption = document.querySelector<HTMLElement>('[data-lightbox-caption]')
  if (!dialog || !image || !caption) return
  let index = 0
  let opener: HTMLElement | null = null
  const show = (i: number) => {
    index = (i + gallery.length) % gallery.length
    const photo = photos[gallery[index]]
    image.src = photoUrl(photo)
    image.width = photo.width
    image.height = photo.height
    image.alt = photo.alt[lang]
    caption.textContent = `${index + 1} / ${gallery.length} · ${photo.alt[lang]}`
  }
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-index]').forEach((btn) =>
    btn.addEventListener('click', () => {
      opener = btn
      show(Number(btn.dataset.galleryIndex))
      dialog.showModal()
    }),
  )
  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index - 1))
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index + 1))
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1)
    if (e.key === 'ArrowRight') show(index + 1)
  })
  dialog.addEventListener('close', () => opener?.focus())
}

function bindLang(lang: Lang): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const next = btn.dataset.lang as Lang
      if (next === lang) return
      storeLang(next)
      const url = new URL(location.href)
      url.searchParams.set('lang', next)
      history.replaceState(null, '', url)
      const activeTab = document.querySelector('[role=tab][aria-selected=true]')?.id
      const y = scrollY
      render(next, `[data-lang="${next}"]`)
      if (activeTab) document.getElementById(activeTab)?.click()
      scrollTo({ top: y, behavior: 'instant' })
    }),
  )
}

function bindReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.section__head, .panels, .about__media, .values li, .gallery__item, .review, .visit__card')
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  items.forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add('reveal')
      observer.observe(el)
    }
  })
}

function bindHeader(): void {
  const headerEl = document.querySelector<HTMLElement>('[data-header]')
  if (!headerEl) return
  const update = () => headerEl.classList.toggle('is-scrolled', scrollY > 24)
  update()
  addEventListener('scroll', update, { passive: true, signal: listeners.signal })
}

function updateMeta(lang: Lang): void {
  const meta = {
    es: {
      title: 'Kiara Beauty Estética · Manicura, faciales y masajes en Plaza España, Palma',
      description:
        "Estética vegana y cruelty-free en Plaça d'Espanya 4, Palma. Manicura, pedicura, tratamientos faciales, lifting de pestañas, cejas con hilo y masajes. Reserva online.",
    },
    en: {
      title: 'Kiara Beauty Estética · Nails, facials & massage at Plaza España, Palma',
      description:
        "Vegan, cruelty-free beauty studio at Plaça d'Espanya 4, Palma. Manicures, pedicures, facials, lash lifts, brow threading and massage. Book online.",
    },
  }[lang]
  document.documentElement.lang = lang
  document.title = meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description)
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'es' ? 'es_ES' : 'en_GB')
}

function render(lang: Lang, focusSelector?: string): void {
  if (!app) return
  listeners.abort()
  listeners = new AbortController()
  document.body.classList.remove('menu-open')
  const t = ui[lang]
  app.innerHTML = `${header(t, lang)}
  <main id="main" tabindex="-1">
    ${hero(t, lang)}
    ${services(t, lang)}
    ${about(t, lang)}
    ${galleryView(t, lang)}
    ${reviewsView(t, lang)}
    ${faqView(t, lang)}
    ${visit(t, lang)}
  </main>
  ${footer(t)}`
  updateMeta(lang)
  bindMenu()
  bindTabs()
  bindLightbox(lang)
  bindLang(lang)
  bindHeader()
  bindReveal()
  if (focusSelector) document.querySelector<HTMLElement>(focusSelector)?.focus()
}

render(initialLang())
