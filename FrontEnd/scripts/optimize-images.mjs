// Turns the selected research images into optimized WebP files in public/images.
// Each entry: [source, output name, optional crop {left, top, width, height}].
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp'

const WIDTHS = [640, 1200]
const selection = [
  ['research/maps/00-maps.jpg', 'manicura-verde-girasoles', { left: 0, top: 0, width: 1800, height: 2060 }],
  ['research/raw/88-DJElTtLNvLL.jpg', 'manicura-nude-manos'],
  ['research/raw/68-DOttpvCDayO.jpg', 'manicura-francesa'],
  ['research/raw/11-DU00F5djBYa.jpg', 'lifting-pestanas-coreano'],
  ['research/raw/12-DU00F5djBYa.jpg', 'mirada-pestanas-cejas'],
  ['research/raw/98-DIJPR_sNZ7h.jpg', 'masaje-craneo-facial'],
  ['research/raw/08-Db-HI2tNZj3.jpg', 'masaje-aceite-espalda'],
  ['research/raw/48-DRe5orVDBkZ.jpg', 'cabina-velas-aceite'],
  ['research/raw/38-DSFdSRcjCil.jpg', 'fitocosmetica-serum'],
  ['research/raw/108-DIBNGGDNX0-.jpg', 'pedicura-piernas'],
  ['research/raw/118-DHdchKSNfGZ.jpg', 'crema-manos'],
]

for (const [src, name, crop] of selection) {
  let base = sharp(src)
  if (crop) base = base.extract(crop)
  const buf = await base.toBuffer()
  const { width, height } = await sharp(buf).metadata()
  const sizes = WIDTHS.filter((w) => w < width).concat(width <= 1200 ? [width] : [])
  const out = []
  for (const w of [...new Set(sizes)]) {
    await sharp(buf).resize({ width: w }).webp({ quality: 78 }).toFile(`public/images/${name}-${w}.webp`)
    out.push(w)
  }
  console.log(`${name}: ${width}x${height} -> [${out.join(', ')}]`)
}
