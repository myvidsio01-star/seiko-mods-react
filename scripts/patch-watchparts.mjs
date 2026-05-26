/**
 * patch-watchparts.mjs
 * Injecte les sections cadrans (avec vraies photos yansmode) dans watchParts.json
 */
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const PARTS_FILE    = path.join(ROOT, 'src/data/watchParts.json')
const SECTIONS_FILE = path.join(ROOT, 'scripts/yans-captures/cadrans-sections.json')

async function main() {
  const parts    = JSON.parse(await readFile(PARTS_FILE, 'utf-8'))
  const sections = JSON.parse(await readFile(SECTIONS_FILE, 'utf-8'))

  for (const modele of parts.modeles) {
    if (!sections[modele.id]) continue

    // Remplace la section cadrans par les vraies photos
    const newSections = sections[modele.id].sections

    // Préserve les anciens champs utiles (catalogue note, etc.) mais utilise les nouvelles sections
    modele.cadrans = {
      sections: newSections
    }

    console.log(`✓ ${modele.nom}: ${newSections.length} sections, ${newSections.flatMap(s => s.couleurs).length} cadrans`)
  }

  await writeFile(PARTS_FILE, JSON.stringify(parts, null, 2), 'utf-8')
  console.log('\nwatchParts.json mis à jour !')
}

main().catch(console.error)
