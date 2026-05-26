/**
 * fix-daytona-submariner.mjs
 * Restaure Daytona (10 cadrans) et convertit Submariner en sections avec photos
 */
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PARTS_FILE = path.join(ROOT, 'src/data/watchParts.json')

async function main() {
  const parts = JSON.parse(await readFile(PARTS_FILE, 'utf-8'))

  // ── DAYTONA : restaure les 10 cadrans originaux ──────────────────────────
  const daytona = parts.modeles.find(m => m.id === 'daytona')
  if (daytona) {
    daytona.cadrans = {
      sections: [
        {
          id: 'noir',
          label: 'Cadrans Noirs',
          couleurs: [
            { id: 'noir-argent',  nom: 'Noir Argent',  img: '/images/daytona/cadran-noir-argent.png' },
            { id: 'noir-or-rose', nom: 'Noir Or Rose',  img: '/images/daytona/cadran-noir-or-rose.png' },
            { id: 'noir-or',      nom: 'Noir Or',       img: '/images/daytona/cadran-noir-or.png' },
          ]
        },
        {
          id: 'blanc',
          label: 'Cadrans Blancs',
          couleurs: [
            { id: 'blanc-panda',  nom: 'Blanc Panda',  img: '/images/daytona/cadran-blanc-panda.png' },
            { id: 'blanc-or',     nom: 'Blanc Or',     img: '/images/daytona/cadran-blanc-or.png' },
            { id: 'blanc-argent', nom: 'Blanc Argent', img: '/images/daytona/cadran-blanc-argent.png' },
          ]
        },
        {
          id: 'couleurs',
          label: 'Cadrans Colorés',
          couleurs: [
            { id: 'champagne', nom: 'Champagne', img: '/images/daytona/cadran-champagne.png' },
            { id: 'vert',      nom: 'Vert',      img: '/images/daytona/cadran-vert.png' },
            { id: 'bleu-glace',nom: 'Bleu Glacé',img: '/images/daytona/cadran-bleu-glace.png' },
            { id: 'irise',     nom: 'Irisé',     img: '/images/daytona/cadran-irise.png' },
          ]
        }
      ]
    }
    console.log('✓ Daytona: 10 cadrans restaurés en sections')
  }

  // ── SUBMARINER : convertit en sections avec photos ────────────────────────
  const submariner = parts.modeles.find(m => m.id === 'submariner')
  if (submariner) {
    submariner.cadrans = {
      sections: [
        {
          id: 'submariner',
          label: 'Submariner',
          couleurs: [
            { id: 'noir',           nom: 'Noir',              img: '/images/submariner/cadran-noir.png' },
            { id: 'bleu-marine',    nom: 'Bleu Marine Or',    img: '/images/submariner/cadran-bleu-marine.png' },
            { id: 'bleu-acier',     nom: 'Bleu Marine Acier', img: '/images/submariner/cadran-bleu-acier.png' },
            { id: 'bleu-clair',     nom: 'Bleu Clair',        img: '/images/submariner/cadran-bleu-clair.png' },
            { id: 'vert',           nom: 'Vert Forêt',        img: '/images/submariner/cadran-vert.png' },
            { id: 'gris-anthracite',nom: 'Gris Anthracite',   img: '/images/submariner/cadran-gris-anthracite.png' },
          ]
        },
        {
          id: 'yacht-master',
          label: 'Yacht Master',
          couleurs: [
            { id: 'blanc', nom: 'Blanc',      img: '/images/submariner/cadran-blanc.png' },
            { id: 'rose',  nom: 'Rose',       img: '/images/submariner/cadran-rose.png' },
          ]
        }
      ]
    }
    console.log('✓ Submariner: 8 cadrans convertis en sections')
  }

  await writeFile(PARTS_FILE, JSON.stringify(parts, null, 2), 'utf-8')
  console.log('watchParts.json mis à jour !')
}

main().catch(console.error)
