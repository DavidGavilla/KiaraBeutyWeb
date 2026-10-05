// Single source of truth for Kiara Beauty Estética's site content.
// Every fact here was checked on 2026-10-05; see research/SOURCES.md for sources.
// Edit this file to update services, prices, hours, contact links, photos or copy.

export type Lang = 'es' | 'en'
export type Localized = Record<Lang, string>

export interface Service {
  name: Localized
  price: number
  minutes: number
  perUnit?: boolean
}

export interface ServiceCategory {
  id: string
  title: Localized
  summary: Localized
  image: PhotoKey
  services: Service[]
}

export interface Photo {
  /** File stem in /public/images; files are named `<name>-<width>.webp`. */
  name: string
  width: number
  height: number
  /** Generated widths, ascending; the last one is the largest file. */
  widths: number[]
  alt: Localized
  /** Public post where the business published the photo. */
  source: string
}

export interface Review {
  author: string
  year: number
  lang: Lang
  text: string
  translation: string
}

export interface Faq {
  q: Localized
  a: Localized
}

/* ------------------------------------------------------------------ */
/* Business facts                                                      */
/* ------------------------------------------------------------------ */

export const business = {
  name: 'Kiara Beauty Estética',
  professional: 'Kiara',
  phoneDisplay: '+34 613 000 591',
  phoneHref: 'tel:+34613000591',
  /** WhatsApp Business link published in the official Instagram bio. */
  whatsapp: 'https://wa.me/message/GBENBJNJEYUWL1',
  /** Official online booking system (Koibox) linked from the Instagram bio. */
  booking: 'https://reservas.koibox.cloud/kiara-beauty-estetica',
  instagram: 'https://www.instagram.com/kiara.beauty.estetica/',
  instagramHandle: '@kiara.beauty.estetica',
  maps: 'https://www.google.com/maps/place/Kiara+Beauty+Est%C3%A9tica/@39.5762431,2.6531689,17z/data=!4m6!3m5!1s0x129793d68051a57f:0x95249de63250c7b3!8m2!3d39.5762431!4d2.6531689',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Kiara%20Beauty%20Est%C3%A9tica%2C%20Pla%C3%A7a%20d%27Espanya%204%2C%2007004%20Palma',
  street: "Plaça d'Espanya, 4",
  floor: '3.º 1.ª',
  postalCode: '07004',
  city: 'Palma',
  rating: { value: '5,0', count: 19 },
  pricesCheckedOn: { es: '5 de octubre de 2026', en: '5 October 2026' } as Localized,
} as const

/** Weekly opening hours, Monday first. `null` = closed. */
export const hours: { day: Localized; time: string | null }[] = [
  { day: { es: 'Lunes', en: 'Monday' }, time: '09:30 – 18:00' },
  { day: { es: 'Martes', en: 'Tuesday' }, time: '09:30 – 18:00' },
  { day: { es: 'Miércoles', en: 'Wednesday' }, time: '09:30 – 18:00' },
  { day: { es: 'Jueves', en: 'Thursday' }, time: '09:30 – 18:00' },
  { day: { es: 'Viernes', en: 'Friday' }, time: '09:30 – 18:00' },
  { day: { es: 'Sábado', en: 'Saturday' }, time: null },
  { day: { es: 'Domingo', en: 'Sunday' }, time: null },
]

/* ------------------------------------------------------------------ */
/* Photos (public Instagram posts by the business — permission pending) */
/* ------------------------------------------------------------------ */

const ig = (id: string) => `https://www.instagram.com/p/${id}/`
const photo = (name: string, width: number, height: number, widths: number[], source: string, es: string, en: string): Photo => ({
  name,
  width,
  height,
  widths,
  source,
  alt: { es, en },
})

export const photos = {
  hero: photo('manicura-verde-girasoles', 1800, 2060, [640, 1200], business.maps,
    'Manos con manicura semipermanente verde oliva sujetando un ramo de girasoles',
    'Hands with olive-green gel manicure holding a bouquet of sunflowers'),
  manicure: photo('manicura-nude-manos', 1440, 1440, [640, 1200], ig('DJElTtLNvLL'),
    'Manos con manicura en tono nude rosado y acabado brillante',
    'Hands with a glossy pink-nude manicure'),
  french: photo('manicura-francesa', 828, 853, [640, 828], ig('DOttpvCDayO'),
    'Detalle de manicura francesa con línea blanca fina',
    'Close-up of a French manicure with a fine white tip'),
  lashes: photo('lifting-pestanas-coreano', 828, 908, [640, 828], ig('DU00F5djBYa'),
    'Pestañas naturales elevadas tras un lifting coreano',
    'Natural lashes lifted after a Korean lash lift'),
  eyes: photo('mirada-pestanas-cejas', 828, 828, [640, 828], ig('DU00F5djBYa'),
    'Primer plano de una mirada con pestañas rizadas y cejas definidas',
    'Close-up of an eye with curled lashes and defined brows'),
  headMassage: photo('masaje-craneo-facial', 844, 1055, [640, 844], ig('DIJPR_sNZ7h'),
    'Masaje cráneo-facial con la clienta tumbada y relajada',
    'Head and face massage with the client lying relaxed'),
  oil: photo('masaje-aceite-espalda', 362, 640, [362], ig('DNdXo_5sbug'),
    'Aceite de masaje cayendo sobre la mano antes de un masaje de espalda',
    'Massage oil poured into a hand before a back massage'),
  cabin: photo('cabina-velas-aceite', 980, 1307, [640, 980], ig('DRe5orVDBkZ'),
    'Bandeja con velas encendidas, sérum y toalla enrollada preparada para un tratamiento',
    'Tray with lit candles, serum and a rolled towel ready for a treatment'),
  serum: photo('fitocosmetica-serum', 1440, 1920, [640, 1200], ig('DSFdSRcjCil'),
    'Frasco de fitocosmética sobre una roca natural',
    'Bottle of phytocosmetics on a natural rock'),
  pedicure: photo('pedicura-piernas', 920, 1150, [640, 920], ig('DIBNGGDNX0-'),
    'Piernas y pies cuidados reflejados en un espejo redondo',
    'Well-cared-for legs and feet reflected in a round mirror'),
  lotion: photo('crema-manos', 1000, 1000, [640, 1000], ig('DHdchKSNfGZ'),
    'Crema de manos aplicándose sobre las palmas',
    'Hand cream being applied to the palms'),
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos

/** Gallery order. */
export const gallery: PhotoKey[] = ['hero', 'lashes', 'manicure', 'cabin', 'french', 'headMassage', 'eyes', 'serum', 'pedicure', 'lotion']

/* ------------------------------------------------------------------ */
/* Services — names, prices and durations from the Koibox booking page */
/* ------------------------------------------------------------------ */

const s = (es: string, en: string, price: number, minutes: number, perUnit = false): Service => ({
  name: { es, en },
  price,
  minutes,
  perUnit,
})

export const categories: ServiceCategory[] = [
  {
    id: 'manicura',
    title: { es: 'Manicura', en: 'Manicure' },
    summary: {
      es: 'Semipermanente, japonesa, francesa o sin color. Retirada incluida o de otro centro.',
      en: 'Gel polish, Japanese, French or natural. Removal included, also from other salons.',
    },
    image: 'manicure',
    services: [
      s('Manicura sin color', 'Manicure, no polish', 15, 30),
      s('Manicura sin color (con retirada)', 'Manicure, no polish (with removal)', 18, 45),
      s('Manicura esmalte normal', 'Manicure, regular polish', 20, 45),
      s('Manicura japonesa', 'Japanese manicure', 20, 45),
      s('Manicura normal (con retirada)', 'Regular manicure (with removal)', 22, 60),
      s('Manicura semipermanente (mini lady)', 'Gel polish manicure (mini lady)', 25, 40),
      s('Manicura completa semipermanente', 'Full gel polish manicure', 30, 60),
      s('Manicura completa semipermanente (con retirada)', 'Full gel polish manicure (with removal)', 30, 75),
      s(
        'Manicura completa semipermanente (retirada de otro centro)',
        'Full gel polish manicure (removal from another salon)',
        35,
        75,
      ),
      s('Manicura con refuerzo', 'Reinforced manicure', 35, 90),
      s('Suplemento francesa', 'French tip add-on', 5, 20),
      s('Nail art simple', 'Simple nail art', 0.5, 15, true),
      s('Suplemento diseño', 'Design add-on', 0.5, 10, true),
      s('Retirada semipermanente (manos)', 'Gel polish removal (hands)', 10, 30),
      s('Retirada de gel', 'Gel removal', 15, 30),
    ],
  },
  {
    id: 'pedicura',
    title: { es: 'Pedicura', en: 'Pedicure' },
    summary: {
      es: 'Cuidado completo de pies con o sin color, y un masaje extra si te apetece.',
      en: 'Complete foot care with or without colour, plus an optional extra massage.',
    },
    image: 'pedicure',
    services: [
      s('Pedicura sin color', 'Pedicure, no polish', 25, 45),
      s('Pedicura sin color (con retirada)', 'Pedicure, no polish (with removal)', 28, 45),
      s('Pedicura esmalte normal', 'Pedicure, regular polish', 30, 60),
      s('Pedicura japonesa', 'Japanese pedicure', 30, 60),
      s('Pedicura semipermanente', 'Gel polish pedicure', 40, 60),
      s('Pedicura semipermanente (con retirada)', 'Gel polish pedicure (with removal)', 40, 75),
      s('Extra masaje de pies', 'Extra foot massage', 10, 15),
      s('Retirada semipermanente (pies)', 'Gel polish removal (feet)', 10, 30),
    ],
  },
  {
    id: 'facial',
    title: { es: 'Tratamientos faciales', en: 'Facials' },
    summary: {
      es: 'Higiene y tratamientos según tu tipo de piel, con fitocosmética Sublime Oils.',
      en: 'Cleansing and skin-type treatments with Sublime Oils phytocosmetics.',
    },
    image: 'serum',
    services: [
      s('Higiene facial premium', 'Premium facial cleanse', 55, 60),
      s('Sublime Facial Signature', 'Sublime Facial Signature', 55, 60),
      s('Tratamiento piel deshidratada', 'Dehydrated skin treatment', 50, 55),
      s('Tratamiento piel grasa', 'Oily skin treatment', 50, 55),
      s('Tratamiento piel sensible', 'Sensitive skin treatment', 50, 55),
    ],
  },
  {
    id: 'pestanas-cejas',
    title: { es: 'Pestañas y cejas', en: 'Lashes & brows' },
    summary: {
      es: 'Lifting coreano de pestañas, tintes y diseño de cejas con hilo.',
      en: 'Korean lash lift, tints and threaded brow shaping.',
    },
    image: 'lashes',
    services: [
      s('Lifting coreano', 'Korean lash lift', 50, 60),
      s('Lifting de pestañas', 'Lash lift', 45, 60),
      s('Tratamiento Regen pestañas', 'Regen lash treatment', 15, 20),
      s('Tinte de pestañas', 'Lash tint', 10, 15),
      s('Diseño de cejas', 'Brow design', 15, 20),
      s('Mantenimiento de cejas', 'Brow maintenance', 10, 15),
      s('Tinte de cejas', 'Brow tint', 10, 15),
    ],
  },
  {
    id: 'hilo',
    title: { es: 'Depilación con hilo', en: 'Threading' },
    summary: {
      es: 'Zonas faciales con hilo orgánico: rápido y preciso.',
      en: 'Facial areas with organic thread: quick and precise.',
    },
    image: 'eyes',
    services: [
      s('Nariz', 'Nose', 4, 5),
      s('Mentón', 'Chin', 4, 10),
      s('Labio superior', 'Upper lip', 5, 10),
      s('Cuello', 'Neck', 5, 5),
      s('Orejas', 'Ears', 6, 10),
      s('Patillas', 'Sideburns', 6, 10),
    ],
  },
  {
    id: 'masajes',
    title: { es: 'Masajes y corporal', en: 'Massage & body' },
    summary: {
      es: 'Relajante, descontracturante, cráneo-facial, drenaje y exfoliación. Hay bonos de masajes.',
      en: 'Relaxing, deep-tissue back, head-and-face, drainage and scrubs. Massage packages available.',
    },
    image: 'headMassage',
    services: [
      s('Masaje descontracturante de espalda', 'Deep-tissue back massage', 40, 40),
      s('Masaje piernas cansadas', 'Tired legs massage', 40, 40),
      s('Higiene de espalda', 'Back cleanse', 40, 40),
      s('Masaje cráneo-facial', 'Head and face massage', 50, 50),
      s('Drenaje linfático local', 'Local lymphatic drainage', 50, 50),
      s('Masaje relajante', 'Relaxing massage', 55, 55),
      s('Exfoliación corporal', 'Body scrub', 60, 50),
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Reviews — excerpts from Google Maps, author shortened for privacy   */
/* ------------------------------------------------------------------ */

export const reviews: Review[] = [
  {
    author: 'Renee H.',
    year: 2025,
    lang: 'en',
    text: 'The atmosphere was super cozy, I could feel the passion that Kiara puts into her work.',
    translation: 'El ambiente era muy acogedor; se notaba la pasión que Kiara pone en su trabajo.',
  },
  {
    author: 'Anabel R.',
    year: 2025,
    lang: 'es',
    text: 'El centro es un remanso de paz, decorado con una armonía y buen gusto fuera de serie.',
    translation: 'The studio is a haven of calm, decorated with outstanding harmony and taste.',
  },
  {
    author: 'Clara U.',
    year: 2024,
    lang: 'es',
    text: 'El material está esterilizado, todo muy limpio.',
    translation: 'The tools are sterilised and everything is very clean.',
  },
  {
    author: 'baba b.',
    year: 2024,
    lang: 'en',
    text: 'She uses vegan products and avoids harmful ingredients. My manicure was flawless and lasted a long time.',
    translation: 'Usa productos veganos y evita ingredientes dañinos. Mi manicura quedó impecable y duró mucho.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — only answers backed by published information                 */
/* ------------------------------------------------------------------ */

export const faqs: Faq[] = [
  {
    q: { es: '¿Cómo pido cita?', en: 'How do I book?' },
    a: {
      es: 'Puedes reservar en la agenda online oficial (Koibox), escribir por WhatsApp o llamar al +34 613 000 591. Si escribes o llamas, la cita queda confirmada cuando Kiara te responde.',
      en: 'Book through the official online calendar (Koibox), send a WhatsApp message or call +34 613 000 591. If you message or call, your appointment is confirmed once Kiara replies.',
    },
  },
  {
    q: { es: '¿Qué productos utilizáis?', en: 'Which products do you use?' },
    a: {
      es: 'Kiara Beauty se presenta como estética vegana y cruelty-free y trabaja con fitocosmética Sublime Oils Phytocosmetics.',
      en: 'Kiara Beauty describes itself as a vegan, cruelty-free studio and works with Sublime Oils Phytocosmetics.',
    },
  },
  {
    q: { es: '¿Qué diferencia tiene el lifting coreano?', en: 'What makes the Korean lash lift different?' },
    a: {
      es: 'Eleva y riza tu pestaña natural desde la raíz, sin extensiones, con productos suaves a base de cisteamina enriquecidos con péptidos, vitaminas, pantenol y aceites de almendra dulce y jojoba.',
      en: 'It lifts and curls your natural lashes from the root, without extensions, using gentle cysteamine-based products enriched with peptides, vitamins, panthenol and sweet almond and jojoba oils.',
    },
  },
  {
    q: {
      es: 'Llevo semipermanente de otro centro, ¿me lo podéis retirar?',
      en: 'I have gel polish from another salon. Can you remove it?',
    },
    a: {
      es: 'Sí. Existe una manicura completa semipermanente con retirada de otro centro (35 €, 75 min). La retirada sola cuesta 10 €.',
      en: 'Yes. There is a full gel polish manicure including removal from another salon (€35, 75 min). Removal on its own is €10.',
    },
  },
  {
    q: { es: '¿Dónde está exactamente el centro?', en: 'Where exactly is the studio?' },
    a: {
      es: "En Plaça d'Espanya, 4, 3.º 1.ª (tercera planta), 07004 Palma. Si necesitas acceso sin escaleras, consúltalo antes de venir: aún no hemos confirmado si el edificio tiene ascensor.",
      en: "At Plaça d'Espanya 4, 3rd floor, door 1, 07004 Palma. If you need step-free access, ask before your visit: we have not yet confirmed whether the building has a lift.",
    },
  },
  {
    q: { es: '¿Abrís los fines de semana?', en: 'Are you open at weekends?' },
    a: {
      es: 'No. El centro abre de lunes a viernes; sábados y domingos permanece cerrado.',
      en: 'No. The studio opens Monday to Friday and is closed on Saturdays and Sundays.',
    },
  },
]

/* ------------------------------------------------------------------ */
/* Interface copy                                                      */
/* ------------------------------------------------------------------ */

export const ui = {
  es: {
    skip: 'Saltar al contenido',
    proposal: 'Propuesta de diseño para Kiara Beauty Estética · No es la web oficial',
    nav: { services: 'Tratamientos', about: 'El centro', gallery: 'Galería', reviews: 'Opiniones', visit: 'Visítanos' },
    menu: 'Menú',
    close: 'Cerrar',
    book: 'Pedir cita',
    langLabel: 'Idioma',
    heroEyebrow: "Plaça d'Espanya · Palma",
    heroTitle: 'Estética vegana, sin prisas, en el centro de Palma',
    heroText:
      'Kiara cuida tus manos, tu piel y tu mirada en un estudio tranquilo, en un tercer piso de la Plaza de España. Productos cruelty-free y cada cita con su tiempo.',
    heroCtaServices: 'Ver tratamientos',
    heroCtaAvailability: 'Consultar disponibilidad',
    heroNote: 'Escríbenos por WhatsApp y te respondemos con los huecos libres.',
    facts: [
      ['5,0', 'en Google · 19 reseñas'],
      ['Vegana', 'y cruelty-free'],
      ['L – V', '09:30 – 18:00'],
    ],
    servicesEyebrow: 'Carta de tratamientos',
    servicesTitle: 'Todo lo que puedes reservar',
    servicesIntro: 'Precios y duraciones publicados en la agenda online oficial',
    checkedOn: 'consultada el',
    from: 'desde',
    perUnit: 'por uña',
    min: 'min',
    viewAll: 'Ver los {n} servicios',
    hideAll: 'Ocultar servicios',
    bookThis: 'Reservar online',
    aboutEyebrow: 'El centro',
    aboutTitle: 'Un estudio pequeño, atendido por Kiara',
    aboutText: [
      'Kiara Beauty abrió en noviembre de 2023 en un piso de la Plaza de España. Aquí te atiende siempre la misma profesional, Kiara, de principio a fin.',
      'Trabaja con cosmética vegana y cruelty-free de Sublime Oils Phytocosmetics y dedica a cada cita el tiempo que necesita: manicuras que duran, una piel cuidada y un rato para desconectar.',
    ],
    values: [
      ['Vegana y cruelty-free', 'Fitocosmética Sublime Oils, sin testar en animales.'],
      ['Una sola profesional', 'Kiara se encarga de tu cita de principio a fin.'],
      ['Material esterilizado', 'Higiene cuidada en cada servicio.'],
    ],
    galleryEyebrow: 'Galería',
    galleryTitle: 'Trabajos y espacio',
    galleryNote: 'Fotografías publicadas por Kiara Beauty en Instagram.',
    galleryOpen: 'Ampliar foto',
    galleryPrev: 'Foto anterior',
    galleryNext: 'Foto siguiente',
    reviewsEyebrow: 'Opiniones',
    reviewsTitle: '5,0 de media en 19 reseñas de Google',
    reviewsSource: 'Extractos de reseñas públicas en Google Maps.',
    reviewsAll: 'Leer todas en Google',
    reviewOriginal: 'Original en inglés',
    reviewTranslated: 'Traducción',
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Antes de tu cita',
    visitEyebrow: 'Visítanos',
    visitTitle: 'Tercera planta, en la Plaza de España',
    address: 'Dirección',
    hoursTitle: 'Horario',
    closed: 'Cerrado',
    howTo: 'Cómo llegar',
    howToSteps: [
      'El portal está en el número 4 de la Plaça d’Espanya.',
      'Busca el 3.º 1.ª en el portero: el centro está en la tercera planta.',
      'La Estació Intermodal (tren y metro) está en la misma plaza.',
      '¿Necesitas acceso sin escaleras? Pregúntanos antes de venir.',
    ],
    directions: 'Abrir ruta en Google Maps',
    contactTitle: 'Reserva o pregunta',
    contactBook: 'Reservar online',
    contactBookNote: 'Agenda oficial Koibox',
    contactWhatsapp: 'WhatsApp',
    contactWhatsappNote: 'Consulta disponibilidad',
    contactCall: 'Llamar',
    contactInstagram: 'Instagram',
    newTab: '(se abre en una pestaña nueva)',
    footerLegal: 'Aviso legal · Privacidad · Cookies',
    footerLegalPending: 'Pendiente de los datos del titular',
    footerCredit: 'Propuesta de diseño. Contenido verificado el 5 de octubre de 2026.',
  },
  en: {
    skip: 'Skip to content',
    proposal: 'Design proposal for Kiara Beauty Estética · Not the official website',
    nav: { services: 'Treatments', about: 'The studio', gallery: 'Gallery', reviews: 'Reviews', visit: 'Visit' },
    menu: 'Menu',
    close: 'Close',
    book: 'Book now',
    langLabel: 'Language',
    heroEyebrow: "Plaça d'Espanya · Palma",
    heroTitle: 'Vegan beauty care, unhurried, in the heart of Palma',
    heroText:
      'Kiara looks after your hands, skin and lashes in a calm third-floor studio on Plaza de España. Cruelty-free products and every appointment given its time.',
    heroCtaServices: 'See treatments',
    heroCtaAvailability: 'Check availability',
    heroNote: 'Send us a WhatsApp and we will reply with free slots.',
    facts: [
      ['5.0', 'on Google · 19 reviews'],
      ['Vegan', '& cruelty-free'],
      ['Mon – Fri', '09:30 – 18:00'],
    ],
    servicesEyebrow: 'Treatment menu',
    servicesTitle: 'Everything you can book',
    servicesIntro: 'Prices and durations as published on the official online calendar',
    checkedOn: 'checked on',
    from: 'from',
    perUnit: 'per nail',
    min: 'min',
    viewAll: 'See all {n} services',
    hideAll: 'Hide services',
    bookThis: 'Book online',
    aboutEyebrow: 'The studio',
    aboutTitle: 'A small studio, run by Kiara',
    aboutText: [
      'Kiara Beauty opened in November 2023 in an apartment on Plaza de España. You are always looked after by the same professional, Kiara, from start to finish.',
      'She works with vegan, cruelty-free Sublime Oils Phytocosmetics and gives each appointment the time it needs: long-lasting manicures, well-cared-for skin and a moment to switch off.',
    ],
    values: [
      ['Vegan & cruelty-free', 'Sublime Oils phytocosmetics, never tested on animals.'],
      ['One professional', 'Kiara takes care of your visit from start to finish.'],
      ['Sterilised tools', 'Careful hygiene in every service.'],
    ],
    galleryEyebrow: 'Gallery',
    galleryTitle: 'Work and space',
    galleryNote: 'Photos published by Kiara Beauty on Instagram.',
    galleryOpen: 'Enlarge photo',
    galleryPrev: 'Previous photo',
    galleryNext: 'Next photo',
    reviewsEyebrow: 'Reviews',
    reviewsTitle: '5.0 average from 19 Google reviews',
    reviewsSource: 'Excerpts from public reviews on Google Maps.',
    reviewsAll: 'Read them all on Google',
    reviewOriginal: 'Original in Spanish',
    reviewTranslated: 'Translation',
    faqEyebrow: 'FAQ',
    faqTitle: 'Before your visit',
    visitEyebrow: 'Visit',
    visitTitle: 'Third floor, on Plaza de España',
    address: 'Address',
    hoursTitle: 'Opening hours',
    closed: 'Closed',
    howTo: 'Getting here',
    howToSteps: [
      'The entrance is at number 4, Plaça d’Espanya.',
      'Look for 3.º 1.ª on the door panel: the studio is on the third floor.',
      'The Estació Intermodal (train and metro) is on the same square.',
      'Need step-free access? Ask us before your visit.',
    ],
    directions: 'Open directions in Google Maps',
    contactTitle: 'Book or ask',
    contactBook: 'Book online',
    contactBookNote: 'Official Koibox calendar',
    contactWhatsapp: 'WhatsApp',
    contactWhatsappNote: 'Check availability',
    contactCall: 'Call',
    contactInstagram: 'Instagram',
    newTab: '(opens in a new tab)',
    footerLegal: 'Legal notice · Privacy · Cookies',
    footerLegalPending: 'Pending the owner’s details',
    footerCredit: 'Design proposal. Content verified on 5 October 2026.',
  },
} as const

export type UiCopy = (typeof ui)[Lang]
