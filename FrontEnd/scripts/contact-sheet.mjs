// Research helper: dedupes downloaded images and builds a numbered contact sheet.
// Usage: node scripts/contact-sheet.mjs <dir> <out.jpg>
import sharp from 'sharp'
import { readdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const [dir, out] = process.argv.slice(2)
const files = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).sort((a, b) => parseInt(a) - parseInt(b))
const seen = new Set()
const uniq = []
for (const f of files) {
  const buf = await readFile(`${dir}/${f}`)
  const hash = createHash('md5').update(buf).digest('hex')
  if (seen.has(hash)) continue
  const meta = await sharp(buf).metadata().catch(() => null)
  if (!meta) continue
  seen.add(hash)
  uniq.push({ f, w: meta.width, h: meta.height, buf })
}
console.log(uniq.map((u) => `${u.f} ${u.w}x${u.h}`).join('\n'))

const T = 200
const cols = 8
const rows = Math.ceil(uniq.length / cols)
const label = (text) =>
  Buffer.from(`<svg width="70" height="26"><rect width="70" height="26" fill="black"/><text x="5" y="19" font-size="17" fill="white" font-family="Arial">${text}</text></svg>`)
const tiles = await Promise.all(
  uniq.map(async (u, i) => ({
    input: await sharp(u.buf)
      .resize(T, T, { fit: 'cover' })
      .composite([{ input: label(u.f.split('-')[0]), gravity: 'northwest' }])
      .toBuffer(),
    left: (i % cols) * T,
    top: Math.floor(i / cols) * T,
  })),
)
await sharp({ create: { width: cols * T, height: rows * T, channels: 3, background: '#fff' } })
  .composite(tiles)
  .jpeg({ quality: 72 })
  .toFile(out)
