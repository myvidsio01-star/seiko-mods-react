/**
 * setup-cadrans.mjs
 * Copie toutes les images CADRAN de parts/ vers public/images/cadrans/
 * et génère la structure JSON pour watchParts.json
 */
import { readdir, copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PARTS_DIR = path.join(ROOT, 'scripts/yans-captures/parts')
const OUT_BASE = path.join(ROOT, 'public/images/cadrans')

// Supprime les accents et slugifie
function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // enlève les accents
    .replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')  // remplace les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

// Correspondance préfixe fichier → id modèle
const MODEL_MAP = [
  { prefix: 'CADRAN_NAUTILUS_',   id: 'nautilus' },
  { prefix: 'CADRAN_ROYAL_OAK_',  id: 'royaloak' },
  { prefix: 'CADRAN_DAYTONA_',    id: 'daytona' },
  { prefix: 'CADRAN_GMT_',        id: 'gmt' },
  { prefix: 'CADRAN_DATE_JUST_',  id: 'datejust' },
  { prefix: 'CADRAN_DAY_DATE_',   id: 'daydate' },
]

// Catégorisation automatique pour Nautilus
function categNautilus(nom) {
  if (nom.startsWith('Squelette')) return 'squelette'
  if (nom.includes('Diamants'))   return 'diamants'
  if (nom.startsWith('Arabic'))   return 'arabic'
  if (nom.includes('Ouvert'))     return 'ouvert'
  return 'index'
}

// Catégorisation pour Royal Oak
function categRoyalOak(nom) {
  if (nom.startsWith('Squelette')) return 'squelette'
  if (nom.startsWith('Arabic'))   return 'arabic'
  return 'baton'
}

async function main() {
  const files = await readdir(PARTS_DIR)
  const cadranFiles = files.filter(f => f.startsWith('CADRAN_') && f.endsWith('.png'))

  const byModel = {}

  for (const file of cadranFiles) {
    const match = MODEL_MAP.find(m => file.startsWith(m.prefix))
    if (!match) { console.log('SKIP:', file); continue }

    const rawName = file.slice(match.prefix.length).replace('.png', '')  // "Noir_Index_Argentés_Ouvert"
    const displayName = rawName.replace(/_/g, ' ')                        // "Noir Index Argentés Ouvert"
    const slug = slugify(displayName)                                      // "noir-index-argentes-ouvert"

    const outDir = path.join(OUT_BASE, match.id)
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

    const outFile = path.join(outDir, `${slug}.png`)
    await copyFile(path.join(PARTS_DIR, file), outFile)

    if (!byModel[match.id]) byModel[match.id] = []
    byModel[match.id].push({
      nom: displayName,
      slug,
      img: `/images/cadrans/${match.id}/${slug}.png`
    })
    process.stdout.write('.')
  }
  console.log('\n')

  // ─── Génère le JSON par modèle ───────────────────────────────────────────

  function genSection(label, items, surcharge, requiredMvt) {
    const sec = { id: slugify(label), label, couleurs: items.map(i => ({
      id: i.slug,
      nom: i.nom,
      img: i.img
    }))}
    if (surcharge) sec.surcharge = surcharge
    if (requiredMvt) sec.requiredMouvement = requiredMvt
    return sec
  }

  const result = {}

  // ── NAUTILUS ──────────────────────────────────────────────────────────────
  if (byModel.nautilus) {
    const n = byModel.nautilus
    const ouvert   = n.filter(i => categNautilus(i.nom) === 'ouvert')
    const index    = n.filter(i => categNautilus(i.nom) === 'index')
    const arabic   = n.filter(i => categNautilus(i.nom) === 'arabic')
    const diamants = n.filter(i => categNautilus(i.nom) === 'diamants')
    const squelette= n.filter(i => categNautilus(i.nom) === 'squelette')
    result.nautilus = { sections: [
      genSection('Cadrans Ouverts', ouvert),
      genSection('Index Argentés', index),
      genSection('Arabic Dial', arabic),
      genSection('Diamants', diamants, 20),
      genSection('Squelette', squelette, 20, 'nh70'),
    ].filter(s => s.couleurs.length > 0) }
    console.log(`Nautilus: ${n.length} cadrans → ${result.nautilus.sections.length} sections`)
  }

  // ── ROYAL OAK ─────────────────────────────────────────────────────────────
  if (byModel.royaloak) {
    const ro = byModel.royaloak
    const baton    = ro.filter(i => categRoyalOak(i.nom) === 'baton')
    const arabic   = ro.filter(i => categRoyalOak(i.nom) === 'arabic')
    const squelette= ro.filter(i => categRoyalOak(i.nom) === 'squelette')
    result.royaloak = { sections: [
      genSection('Cadrans', baton),
      genSection('Arabic Dial', arabic),
      genSection('Squelette', squelette, 20, 'nh70'),
    ].filter(s => s.couleurs.length > 0) }
    console.log(`Royal Oak: ${ro.length} cadrans → ${result.royaloak.sections.length} sections`)
  }

  // ── DAYTONA ───────────────────────────────────────────────────────────────
  if (byModel.daytona) {
    const d = byModel.daytona
    result.daytona = { sections: [ genSection('Cadrans', d) ] }
    console.log(`Daytona: ${d.length} cadrans`)
  }

  // ── GMT ───────────────────────────────────────────────────────────────────
  if (byModel.gmt) {
    const g = byModel.gmt
    result.gmt = { sections: [ genSection('Cadrans GMT', g) ] }
    console.log(`GMT: ${g.length} cadrans`)
  }

  // ── DATE JUST ─────────────────────────────────────────────────────────────
  if (byModel.datejust) {
    const dj = byModel.datejust
    result.datejust = { sections: [ genSection('Cadrans', dj) ] }
    console.log(`Date Just: ${dj.length} cadrans`)
  }

  // ── DAY DATE ──────────────────────────────────────────────────────────────
  if (byModel.daydate) {
    const dd = byModel.daydate
    result.daydate = { sections: [ genSection('Cadrans', dd) ] }
    console.log(`Day Date: ${dd.length} cadrans`)
  }

  // Sauvegarde le JSON de référence
  const outJson = path.join(ROOT, 'scripts/yans-captures/cadrans-sections.json')
  await writeFile(outJson, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`\nJSON sauvegarde: scripts/yans-captures/cadrans-sections.json`)
  console.log('Total images copiees:', Object.values(byModel).flat().length)
}

main().catch(console.error)
