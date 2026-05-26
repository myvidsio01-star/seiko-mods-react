/**
 * setup-lunettes.mjs — v2
 */
import { readdir, copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')
const PARTS_DIR = path.join(ROOT, 'scripts/yans-captures/parts')
const OUT_BASE  = path.join(ROOT, 'public/images/parts')

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ').trim().replace(/\s+/g, '-').toLowerCase()
}

async function copy(file, model, type) {
  const outDir = path.join(OUT_BASE, model, type)
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
  const rawName = file.replace('.png','').replace(/_/g,' ')
  const slug = slugify(rawName)
  await copyFile(path.join(PARTS_DIR, file), path.join(outDir, `${slug}.png`))
  return { id: slug, nom: rawName, img: `/images/parts/${model}/${type}/${slug}.png` }
}

async function main() {
  const files = await readdir(PARTS_DIR)
  const data  = JSON.parse(await readFile(path.join(ROOT, 'src/data/watchParts.json'), 'utf-8'))

  const gmtLunettes = []
  for (const f of files.filter(f => f.startsWith('LUNETTE_GMT_') && f.endsWith('.png'))) {
    const rawName = f.replace('LUNETTE_GMT_','').replace('.png','').replace(/_/g,' ')
    const slug    = slugify(rawName)
    const outDir  = path.join(OUT_BASE, 'gmt', 'lunettes')
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
    await copyFile(path.join(PARTS_DIR, f), path.join(outDir, `${slug}.png`))
    gmtLunettes.push({ id: slug, nom: rawName, img: `/images/parts/gmt/lunettes/${slug}.png` })
    console.log('gmt/lunettes/', slug)
  }

  const daytonaLunettes = []
  for (const f of files.filter(f => f.startsWith('LUNETTE_DAYTONA_') && f.endsWith('.png'))) {
    const rawName = f.replace('LUNETTE_DAYTONA_','').replace('.png','').replace(/_/g,' ')
    const slug    = slugify(rawName)
    const outDir  = path.join(OUT_BASE, 'daytona', 'lunettes')
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
    await copyFile(path.join(PARTS_DIR, f), path.join(outDir, `${slug}.png`))
    daytonaLunettes.push({ id: slug, nom: rawName, img: `/images/parts/daytona/lunettes/${slug}.png` })
    console.log('daytona/lunettes/', slug)
  }

  // Fuseau GMT (déjà copié mais recopy proprement)
  const gmtFuseau = []
  for (const f of files.filter(f => f.startsWith('AIGUILLE_SECOND_FUSEAU_HORAIRE_GMT_') && f.endsWith('.png'))) {
    const rawName = f.replace('AIGUILLE_SECOND_FUSEAU_HORAIRE_GMT_','').replace('.png','').replace(/_/g,' ')
    const slug    = slugify(rawName)
    gmtFuseau.push({ id: slug, nom: rawName, img: `/images/parts/gmt/fuseau/${slug}.png` })
  }

  const gmt = data.modeles.find(m => m.id === 'gmt')
  if (gmt) {
    if (gmtLunettes.length) gmt.lunettes = gmtLunettes
    if (gmtFuseau.length)   gmt.aiguilleFuseau = gmtFuseau
    console.log(`\nGMT: ${gmtLunettes.length} lunettes, ${gmtFuseau.length} fuseau`)
  }
  const daytona = data.modeles.find(m => m.id === 'daytona')
  if (daytona && daytonaLunettes.length) {
    daytona.lunettes = daytonaLunettes
    console.log(`Daytona: ${daytonaLunettes.length} lunettes`)
  }

  await writeFile(path.join(ROOT, 'src/data/watchParts.json'), JSON.stringify(data, null, 2), 'utf-8')
  console.log('watchParts.json mis à jour !')
}

main().catch(console.error)
