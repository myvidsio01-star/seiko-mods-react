import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsonPath = path.join(__dirname, '../src/data/watchParts.json')

// Mapping id → hex color
const hexMap = {
  // Submariner
  'mercedes-noir':    '#1A1A1A',
  'mercedes-acier':   '#C8CACA',
  'mercedes-or':      '#D4A437',
  'baton-or':         '#D4A437',
  'baton-acier':      '#C8CACA',
  'baton-acier-2':    '#8B96A0',
  // Communs
  'argent':           '#C8CACA',
  'noir':             '#1A1A1A',
  'or-jaune':         '#D4A437',
  'or-rose':          '#C9856A',
  // Fuseau GMT
  'bleue':            '#1D4ED8',
  'rouge':            '#DC2626',
  'verte':            '#16A34A',
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'))

// Image de référence fixe pour le preview gauche
const REF_IMG = '/images/submariner/aiguilles/baton-acier.png'

for (const modele of data.modeles) {
  // Ajouter aiguilleSrc (une seule image de référence)
  modele.aiguilleSrc = REF_IMG

  // Ajouter hex à chaque aiguille, retirer img
  if (modele.aiguilles) {
    modele.aiguilles = modele.aiguilles.map(a => {
      const hex = hexMap[a.id] ?? '#C8CACA'
      const { img, ...rest } = a  // on retire l'img (on garde le reste)
      return { ...rest, hex }
    })
  }

  // Ajouter hex aux aiguilles fuseau aussi (sans retirer img si pas d'img)
  if (modele.aiguilleFuseau) {
    modele.aiguilleFuseau = modele.aiguilleFuseau.map(f => {
      const hex = hexMap[f.id] ?? '#C8CACA'
      return { ...f, hex }
    })
  }
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8')
console.log('Done - hex ajoute a toutes les aiguilles')
