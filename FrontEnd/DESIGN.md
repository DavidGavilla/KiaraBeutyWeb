# DESIGN.md — Kiara Beauty Estética

Propuesta comercial · versión local · 5 de octubre de 2026

Estructura adaptada de [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md) (los 9 apartados de cada ficha). La referencia compatible elegida es la ficha de **Airbnb**: fotografía protagonista, interfaz redondeada y un único acento cálido. De ella se toman las reglas (foto primero, un solo color de acción, radios generosos), no su estética ni sus colores.

## 1. Atmósfera visual

**Cálida, natural, cercana y cuidada.** Es un estudio pequeño, atendido por una sola profesional, en un piso de la Plaza de España. La web debe sentirse como entrar al centro: tranquila, limpia y sin prisas.

**Detalle memorable:** la manicura verde oliva entre girasoles, la foto que el propio negocio publicó en Google Maps. Ese verde es el acento de toda la interfaz y conecta con el 🌱 de su identidad vegana.

| Fuente de identidad | Qué se extrajo |
| --- | --- |
| Logo de Instagram (dorado sobre crema, ramita central, «Belleza · Bienestar · Cuidado personal») | Crema y dorado champán; «ESTÉTICA» en versalitas espaciadas |
| Foto de portada en Google Maps | Verde oliva como único acento de acción |
| Publicaciones (velas, toallas, aceites, piedra) | Arena, marrón y espresso para superficies y pie |
| Tono de sus textos («Te esperamos», «Relájate. Respira.») | Tuteo, frases cortas y cercanas, sin promesas médicas |

## 2. Paleta y roles (`src/style.css`)

| Token | Hex | Rol | Contraste WCAG medido |
| --- | --- | --- | --- |
| `--cream` | `#F5EFE6` | Fondo general | — |
| `--paper` | `#FBF8F3` | Tarjetas y paneles | — |
| `--sand` / `--line` | `#E8DDCC` / `#D9CBB6` | Separadores, hover | Decorativo |
| `--ink` | `#2A241F` | Texto principal | 13,4 : 1 sobre crema |
| `--ink-soft` | `#5B5148` | Texto secundario | 6,8 : 1 crema · 7,3 : 1 paper |
| `--olive` | `#4C5A37` | Botón principal, eyebrows | 7,4 : 1 con blanco · 6,5 : 1 sobre crema |
| `--olive-deep` | `#36412A` | Hover, tarjeta de contacto | 10,8 : 1 con blanco |
| `--gold` / `--gold-soft` | `#A8834F` / `#CFB68C` | Estrellas, filetes, punteado de precios | 3,05 : 1, **solo decorativo** |
| `--espresso` | `#3B2F27` | Barra de propuesta y pie | 10,5 : 1 con `#EFE6D8` |

Regla: el dorado nunca lleva texto ni información por sí solo.

## 3. Tipografía

- **Fraunces** (variable, eje `opsz`) para titulares: serif suave con personalidad, de gran presencia a tamaño display; evoca el logotipo sin copiarlo.
- **Figtree** (variable) para texto e interfaz: humanista y muy legible en móvil.
- Ambas autoalojadas con `@fontsource`: sin peticiones a Google Fonts, mejor para el RGPD y el rendimiento.
- Escala fluida con `clamp()`: H1 de 2,5 a 4,6 rem, H2 de 2 a 3,1 rem y cuerpo de 17 px. Precios y horas con `tabular-nums`.

## 4. Componentes

- **Botones:** píldora de 48 px de alto mínimo. El primario es oliva con texto blanco; el secundario, contorno tinta. Foco visible con un anillo oliva de 2 px.
- **Pestañas de tratamientos:** patrón ARIA `tablist`, con flechas, Inicio y Fin. Lista lateral fija en escritorio; chips desplazables en móvil.
- **Carta de precios:** nombre, punteado dorado, duración y precio, como la carta de un spa.
- **Tarjetas de opinión:** cinco estrellas, extracto breve, traducción cuando el idioma no coincide, autor abreviado, año y fuente.
- **Lightbox:** `<dialog>` nativo con anterior y siguiente (botones y flechas), cierre con Escape y devolución del foco.
- **Selector de idioma:** dos botones `aria-pressed`. Recuerda la elección y admite `?lang=en`.

## 5. Principios de composición

- **Portada:** texto a la izquierda y foto en arco a la derecha (en móvil, la foto primero). Tres datos verificados: 5,0 en Google, vegana y horario.
- **Ritmo:** secciones de 72 a 128 px, ancho máximo de 1200 px y margen lateral fluido de 16 a 40 px.
- **Galería:** retícula editorial de 4 columnas con piezas grandes, altas y anchas, y `grid-auto-flow: dense` para que no queden huecos.
- **Visítanos:** tres tarjetas (dirección y cómo llegar, horario y canales de contacto).

## 6. Profundidad

Una sola sombra suave (`--shadow`) para la tarjeta activa, la portada y la insignia. El resto se separa con filetes `--line`. No hay degradados ni manchas decorativas.

## 7. Qué hacer y qué evitar

**Sí:** fotos reales del negocio; datos con fuente; «Consultar disponibilidad» para WhatsApp y «Reservar online» solo para Koibox; dejar los textos legales como pendientes.
**No:** fotos de stock o de otros centros; cifras inventadas; promesas de resultados; presentar una consulta como reserva confirmada; usar el dorado como color de texto.

## 8. Comportamiento adaptable

- ≤ 1080 px: el panel de tratamientos pasa a una columna, las opiniones a dos columnas y Visítanos a 2 + 1.
- ≤ 960 px: menú hamburguesa a pantalla completa, foto de portada arriba, pestañas en chips y **barra inferior fija «Pedir cita · WhatsApp · Llamar»**.
- ≤ 640 px: la duración y el precio pasan bajo el nombre y todo se apila en una columna.
- Movimiento: aparición suave (opacidad + 18 px) y zoom leve en la galería, ambos desactivados con `prefers-reduced-motion`.

## 9. Patrones de las referencias estudiadas

| Referencia | Patrón observado | Adaptación a Kiara |
| --- | --- | --- |
| **Addendum Salon** (Riot Atelier) | Mucho aire, tipografía protagonista, servicios en módulos repetibles con su propio CTA y secciones «meet the team / meet the salon» | Titular serif grande con espacio; cada categoría con su botón «Reservar online»; sección «El centro» centrada en Kiara como única profesional |
| **The Cove Spa** (Bond Media) | Pocas categorías de tratamiento con imagen y enlace, listas de precios accesibles y «Book Online» siempre en la cabecera | Seis categorías en pestañas con la carta completa de Koibox a un clic; «Pedir cita» fijo en la cabecera |
| **Sugar & Wax Haven** (SEOs Hut) | Reserva en dos toques desde el móvil y prueba social arriba, donde se decide | Barra inferior fija en móvil; «5,0 en Google · 19 reseñas» en la portada |

Las referencias aportan patrones, no contenido: ningún texto, servicio, testimonio o imagen procede de ellas.

## Mantenimiento

1. Todo el contenido (servicios, precios, horario, enlaces, fotos, textos ES/EN y FAQ) vive en `src/content.ts`.
2. Fotos nuevas: guardarlas en `research/`, añadirlas a `scripts/optimize-images.mjs`, ejecutar `npm run images` y registrarlas en `photos`.
3. Ningún color fuera de los tokens; el oliva es el único acento de acción.
4. Cada dato nuevo necesita una fuente en `research/SOURCES.md`.
