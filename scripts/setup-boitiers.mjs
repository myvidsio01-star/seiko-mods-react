/**
 * setup-boitiers.mjs
 * Copie les images BOÎTIER de parts/ vers public/images/boitiers/
 * et met à jour les boitiers dans watchParts.json avec un champ yansImg
 */
import { readdir, copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT       = path.join(__dirname, '..')
const PARTS_DIR  = path.join(ROOT, 'scripts/yans-captures/parts')
const OUT_BASE   = path.join(ROOT, 'public/images/boitiers')

function slugify(str) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim().replace(/\s+/g, '-').toLowerCase()
}

// Préfixe fichier → id modèle
const MODEL_MAP = [
  { prefix: 'BOÎTIER_NAUTILUS_', id: 'nautilus' },
  { prefix: 'BOÎTIER_ROYAL_OAK_', id: 'royaloak' },
  { prefix: 'BOÎTIER_DAYTONA_',  id: 'daytona'  },
  { prefix: 'BOÎTIER_GMT_',      id: 'gmt'       },
  { prefix: 'BOÎTIER_DATE_JUST_',id: 'datejust'  },
  { prefix: 'BOÎTIER_DAY_DATE_', id: 'daydate'   },
]

// Correspondance nom yansmode → id boitier dans watchParts.json
const BOITIER_ID_MAP = {
  nautilus: {
    'Argent':         'acier',
    'Noir':           'black',
    'Or_Rose':        'or-rose',
  },
  royaloak: {
    'Argent':         'acier',
    'Noir':           'black',
    'Or_Rose':        'or-rose',
    'Or_Jaune':       'or',
  },
  daytona: {
    'Argent':         'acier',
    'Or_Rose':        'or-rose-caoutchouc',
    'Or_Jaune':       'or',
  },
  gmt: {
    // GMT a des boitiers très spécifiques, on utilisera les images comme preview générique
    'Argent':         'argent-jubilee',
    'Or_Rose':        'or-rose',
    'Or_Jaune':       'or-jubilee',
  },
}

async function main() {
  const files = await readdir(PARTS_DIR)
  const boitierFiles = files.filter(f => f.startsWith('BOÎT') && f.endsWith('.png'))

  const copied = {}  // modelId → { rawName, slug, img }[]

  for (const file of boitierFiles) {
    const match = MODEL_MAP.find(m => file.startsWith(m.prefix))
    if (!match) { console.log('SKIP:', file); continue }

    const rawName = file.slice(match.prefix.length).replace('.png', '') // "Argent", "Or_Rose"
    const slug    = slugify(rawName.replace(/_/g, ' '))

    const outDir = path.join(OUT_BASE, match.id)
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

    const outFile = path.join(outDir, `${slug}.png`)
    await copyFile(path.join(PARTS_DIR, file), outFile)

    if (!copied[match.id]) copied[match.id] = []
    copied[match.id].push({ rawName, slug, img: `/images/boitiers/${match.id}/${slug}.png` })
    console.log(`${match.id}/${slug}.png`)
  }

  // ── Met à jour watchParts.json ───────────────────────────────────────────
  const parts = JSON.parse(await readFile(path.join(ROOT, 'src/data/watchParts.json'), 'utf-8'))

  for (const modele of parts.modeles) {
    const items   = copied[modele.id]
    const idMap   = BOITIER_ID_MAP[modele.id]
    if (!items || !idMap) continue

    for (const item of items) {
      const boitierId = idMap[item.rawName]
      if (!boitierId) continue
      const boitier = modele.boitiers.find(b => b.id === boitierId)
      if (!boitier) { console.log(`  SKIP boitier ${boitierId} pour ${modele.id}`); continue }
      boitier.yansImg = item.img
      console.log(`  ✓ ${modele.nom} / ${boitier.nom} → ${item.img}`)
    }
  }

  await writeFile(path.join(ROOT, 'src/data/watchParts.json'), JSON.stringify(parts, null, 2), 'utf-8')
  console.log('\nwatchParts.json mis à jour !')
}

main().catch(console.error)
