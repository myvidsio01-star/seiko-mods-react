import { Jimp, ResizeStrategy } from 'jimp'
import { promises as fs } from 'fs'
import path from 'path'

const CANVAS  = 600
const PADDING = 0.08

const MODELS = ['submariner', 'gmt', 'royaloak', 'nautilus', 'santos', 'daytona', 'daydate']

function getBounds(img) {
  const w = img.width, h = img.height
  let minX = w, minY = h, maxX = 0, maxY = 0
  img.scan((x, y, idx) => {
    const alpha = img.bitmap.data[idx + 3]
    if (alpha > 10) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  })
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

async function normalizeImage(srcPath, dstPath) {
  const img = await Jimp.read(srcPath)
  const b = getBounds(img)
  if (b.w <= 0 || b.h <= 0) return

  const cropped = img.clone().crop({ x: b.minX, y: b.minY, w: b.w, h: b.h })
  const maxSize = Math.round(CANVAS * (1 - PADDING * 2))
  const scale = Math.min(maxSize / b.w, maxSize / b.h)
  const newW = Math.round(b.w * scale)
  const newH = Math.round(b.h * scale)
  cropped.resize({ w: newW, h: newH, mode: ResizeStrategy.BEZIER })

  const canvas = new Jimp({ width: CANVAS, height: CANVAS, color: 0x00000000 })
  const x = Math.round((CANVAS - newW) / 2)
  const y = Math.round((CANVAS - newH) / 2)
  canvas.composite(cropped, x, y)

  await fs.mkdir(path.dirname(dstPath), { recursive: true })
  await canvas.write(dstPath)
}

async function processDir(srcDir, dstDir) {
  let entries
  try { entries = await fs.readdir(srcDir, { withFileTypes: true }) }
  catch { return }
  for (const e of entries) {
    const src = path.join(srcDir, e.name)
    const dst = path.join(dstDir, e.name)
    if (e.isDirectory()) {
      await processDir(src, dst)
    } else if (e.name.endsWith('.png')) {
      process.stdout.write(`  → ${path.relative('public/images', src).padEnd(60)} `)
      await normalizeImage(src, dst)
      console.log('✓')
    }
  }
}

console.log('🔧 Normalisation 600×600px\n')
for (const model of MODELS) {
  console.log(`📁 ${model}`)
  await processDir(path.join('public/images', model), path.join('public/images/layers', model))
}
console.log('\n✅ Terminé → public/images/layers/')
