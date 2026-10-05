# Kiara Beauty Estética — propuesta web

Propuesta de diseño para [Kiara Beauty Estética](https://www.instagram.com/kiara.beauty.estetica/) (Plaça d'Espanya 4, Palma). No es la web oficial del negocio.

## Arrancar

```bash
cd FrontEnd
npm install
npm run dev        # http://localhost:5174 (?lang=en para inglés)
```

| Script | Qué hace |
| --- | --- |
| `npm run build` | Comprobación de tipos + build de producción en `dist/` |
| `npm run check:e2e` | Comprobación con Playwright (con `npm run dev` arrancado); guarda capturas en `screenshots/` |
| `npm run images` | Regenera las imágenes WebP de `public/images/` |

## Estructura

- `FrontEnd/src/content.ts`: todo el contenido (servicios, precios, horario, contacto, fotos, textos ES/EN, FAQ).
- `FrontEnd/src/main.ts`: renderizado y comportamiento. `src/style.css`: tokens y diseño.
- `FrontEnd/DESIGN.md`: decisiones visuales.
- `FrontEnd/research/SOURCES.md`: fuentes, datos verificados, imágenes y pendientes.

Las fotografías las publicó el propio negocio en Instagram y Google Maps. Su reutilización está pendiente de autorización.
