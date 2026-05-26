/**
 * setup-all-parts.mjs
 * Copie TOUTES les images de parts/ vers public/images/parts/{model}/{type}/
 * et génère la structure complète pour watchParts.json
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
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim().replace(/\s+/g, '-').toLowerCase()
}

// Préfixes de fichiers → { model, type }
const PREFIX_MAP = [
  // Nautilus
  { prefix: 'BOÎTIER_NAUTILUS_',    model: 'nautilus',  type: 'boitiers' },
  { prefix: 'BRACELET_NAUTILUS_',   model: 'nautilus',  type: 'bracelets' },
  { prefix: 'AIGUILLES_NAUTILUS_',  model: 'nautilus',  type: 'aiguilles' },
  { prefix: 'TROTTEUSE_NAUTILUS_',  model: 'nautilus',  type: 'trotteuses' },
  { prefix: 'CADRAN_NAUTILUS_',     model: 'nautilus',  type: 'cadrans' },
  // Royal Oak
  { prefix: 'BOÎTIER_ROYAL_OAK_',   model: 'royaloak', type: 'boitiers' },
  { prefix: 'BRACELET_ROYAL_OAK_',  model: 'royaloak', type: 'bracelets' },
  { prefix: 'AIGUILLES_ROYAL_OAK_', model: 'royaloak', type: 'aiguilles' },
  { prefix: 'TROTTEUSE_ROYAL_OAK_', model: 'royaloak', type: 'trotteuses' },
  { prefix: 'CADRAN_ROYAL_OAK_',    model: 'royaloak', type: 'cadrans' },
  // Daytona
  { prefix: 'BOÎTIER_DAYTONA_',     model: 'daytona',  type: 'boitiers' },
  { prefix: 'BRACELET_DAYTONA_',    model: 'daytona',  type: 'bracelets' },
  { prefix: 'AIGUILLES_DAYTONA_',   model: 'daytona',  type: 'aiguilles' },
  { prefix: 'CADRAN_DAYTONA_',      model: 'daytona',  type: 'cadrans' },
  // GMT
  { prefix: 'BOÎTIER_GMT_',         model: 'gmt',      type: 'boitiers' },
  { prefix: 'BRACELET_GMT_',        model: 'gmt',      type: 'bracelets' },
  { prefix: 'AIGUILLES_GMT_',       model: 'gmt',      type: 'aiguilles' },
  { prefix: 'CADRAN_GMT_',          model: 'gmt',      type: 'cadrans' },
  // Day Date
  { prefix: 'BOÎTIER_DAY_DATE_',    model: 'daydate',  type: 'boitiers' },
  { prefix: 'BRACELET_DAY_DATE_',   model: 'daydate',  type: 'bracelets' },
  { prefix: 'AIGUILLES_DAY_DATE_',  model: 'daydate',  type: 'aiguilles' },
  { prefix: 'CADRAN_DAY_DATE_',     model: 'daydate',  type: 'cadrans' },
]

async function main() {
  const files = await readdir(PARTS_DIR)
  const data = {}  // model → type → [{nom, slug, img}]

  for (const file of files) {
    if (!file.endsWith('.png')) continue
    const match = PREFIX_MAP.find(p => file.startsWith(p.prefix))
    if (!match) continue

    const rawName    = file.slice(match.prefix.length).replace('.png', '')
    const displayName = rawName.replace(/_/g, ' ')
    const slug       = slugify(displayName)
    const imgPath    = `/images/parts/${match.model}/${match.type}/${slug}.png`

    const outDir = path.join(OUT_BASE, match.model, match.type)
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
    await copyFile(path.join(PARTS_DIR, file), path.join(outDir, `${slug}.png`))

    if (!data[match.model])             data[match.model] = {}
    if (!data[match.model][match.type]) data[match.model][match.type] = []
    data[match.model][match.type].push({ id: slug, nom: displayName, img: imgPath })
    process.stdout.write('.')
  }
  console.log('\n')

  // ── Lit watchParts.json ──────────────────────────────────────────────────
  const parts = JSON.parse(await readFile(path.join(ROOT, 'src/data/watchParts.json'), 'utf-8'))

  // ── Pour chaque modèle yansmode, reconstruit boitiers/bracelets/aiguilles ─
  for (const modele of parts.modeles) {
    const d = data[modele.id]
    if (!d) continue  // Submariner, Santos → pas de données yansmode

    console.log(`\n── ${modele.nom} ──`)

    // BOITIERS
    if (d.boitiers) {
      // Couleurs hex par convention
      const HEX = {
        'argent': '#B8BBBA', 'noir': '#222222', 'or-rose': '#C9856A',
        'or-jaune': '#D4A437', 'argent-diamant': '#D0D8E4',
        'or-rose-diamant': '#C9856A', 'noir-diamant': '#333333',
        'argent-or-rose': '#C9A088', 'argent-or-jaune': '#C8B870',
      }
      modele.boitiers = d.boitiers.map(b => ({
        id: b.id,
        nom: b.nom,
        hex: HEX[b.id] || '#B8BBBA',
        img: b.img,   // image yansmode (pour compositing)
      }))
      console.log(`  boitiers: ${modele.boitiers.length}`)
    }

    // BRACELETS
    if (d.bracelets) {
      modele.bracelets = d.bracelets.map(b => ({
        id: b.id,
        nom: b.nom,
        img: b.img,   // image yansmode (pour compositing)
      }))
      console.log(`  bracelets: ${modele.bracelets.length}`)
    }

    // AIGUILLES
    if (d.aiguilles) {
      modele.aiguilles = d.aiguilles.map(a => ({
        id: a.id,
        nom: a.nom,
        img: a.img,   // image yansmode (pour compositing)
      }))
      console.log(`  aiguilles: ${modele.aiguilles.length}`)
    }

    // CADRANS : on garde les sections déjà générées (cadrans-sections.json),
    // mais on les met à jour pour pointer vers /images/parts/model/cadrans/
    if (d.cadrans && modele.cadrans?.sections) {
      const cadranMap = {}
      for (const c of d.cadrans) cadranMap[c.id] = c.img
      for (const section of modele.cadrans.sections) {
        for (const couleur of section.couleurs) {
          if (cadranMap[couleur.id]) couleur.img = cadranMap[couleur.id]
        }
      }
      console.log(`  cadrans: paths mis a jour`)
    }
  }

  await writeFile(
    path.join(ROOT, 'src/data/watchParts.json'),
    JSON.stringify(parts, null, 2), 'utf-8'
  )
  console.log('\nwatchParts.json mis à jour !')
}

main().catch(console.error)
