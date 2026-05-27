/**
 * setup-datejust-and-fixes.mjs
 * 1. Télécharge les images manquantes pour Datejust (bracelets, aiguilles)
 * 2. Supprime les fonds blancs des renders Day-Date et Datejust
 * 3. Met à jour watchParts.json avec Datejust complet + corrections Day-Date
 */
import { writeFile, mkdir, copyFile, readFile } from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'
const { Jimp } = await import('jimp')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public/images')
const PARTS = path.join(PUBLIC, 'parts')

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) { resolve(); return }
    const file = createWriteStream(dest)
    const get = url.startsWith('https') ? https.get : http.get
    const req = get(url.trim(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        return reject(new Error(`HTTP ${res.statusCode} pour ${url}`))
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
      file.on('error', reject)
    })
    req.on('error', (err) => { file.close(); reject(err) })
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })
}

// ═══════════════════════════════════════════════════════════
// 1. REMOVE WHITE BACKGROUND (jimp flood-fill)
// ═══════════════════════════════════════════════════════════

async function removeWhiteBackground(inputPath, outputPath, tolerance = 30) {
  console.log(`  🎨 Suppression fond blanc: ${path.basename(inputPath)}`)
  const image = await Jimp.read(inputPath)
  const { width, height, data } = image.bitmap

  function getIdx(x, y) { return (y * width + x) * 4 }
  function colorDiff(idx, r, g, b) {
    return Math.abs(data[idx] - r) + Math.abs(data[idx+1] - g) + Math.abs(data[idx+2] - b)
  }

  // Flood fill depuis les 4 coins
  const corners = [[0,0], [width-1,0], [0,height-1], [width-1,height-1]]

  for (const [sx, sy] of corners) {
    const startIdx = getIdx(sx, sy)
    const tr = data[startIdx], tg = data[startIdx+1], tb = data[startIdx+2]

    const queue = [[sx, sy]]
    const visited = new Set()

    while (queue.length > 0) {
      const [cx, cy] = queue.pop()
      const key = cx + cy * width
      if (visited.has(key)) continue
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue

      const idx = getIdx(cx, cy)
      if (colorDiff(idx, tr, tg, tb) > tolerance) continue
      if (data[idx+3] === 0) { visited.add(key); continue } // déjà transparent

      visited.add(key)

      // Transparence progressive selon la blancheur
      const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3
      const alpha = brightness > 240 ? 0 : brightness > 220 ? Math.round((240 - brightness) * 6.375) : 255
      data[idx+3] = alpha

      queue.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1])
    }
  }

  await image.write(outputPath)
  console.log(`  ✅ Sauvé: ${path.basename(outputPath)}`)
}

// ═══════════════════════════════════════════════════════════
// 2. TÉLÉCHARGEMENTS DATEJUST
// ═══════════════════════════════════════════════════════════

const DATEJUST_IMAGES = {
  boitiers: [
    { nom: 'argent',   url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68x3a7.png',  src: path.join(PUBLIC, 'boitiers/datejust/argent.png') },
    { nom: 'or-rose',  url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68x6n3.png',  src: path.join(PUBLIC, 'boitiers/datejust/or-rose.png') },
    { nom: 'or-jaune', url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68x9zz.png',  src: path.join(PUBLIC, 'boitiers/datejust/or-jaune.png') },
  ],
  bracelets: [
    { nom: 'argent',   url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68xgpr.png' },
    { nom: 'or-rose',  url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68xk2n.png' },
    { nom: 'or-jaune', url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/68xgbz.png' },
  ],
  aiguilles: [
    { nom: 'argent',   url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/4nv0k1.png' },
    { nom: 'or-rose',  url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/5ze6ov.png' },
    { nom: 'or-jaune', url: 'https://cdnv2.mycustomizer.com/a39ee3-ac/4o0635.jpg' },
  ],
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log('\n🚀 Setup Datejust + corrections Day-Date\n')

  // ── Créer dossiers ────────────────────────────────────────
  const dirs = [
    path.join(PARTS, 'datejust/boitiers'),
    path.join(PARTS, 'datejust/cadrans'),
    path.join(PARTS, 'datejust/bracelets'),
    path.join(PARTS, 'datejust/aiguilles'),
    path.join(PARTS, 'daydate/aiguilles'),
  ]
  for (const d of dirs) await ensureDir(d)
  console.log('✅ Dossiers créés')

  // ── Télécharger / copier boîtiers ─────────────────────────
  console.log('\n📥 Boîtiers Datejust...')
  for (const item of DATEJUST_IMAGES.boitiers) {
    const dest = path.join(PARTS, `datejust/boitiers/${item.nom}.png`)
    if (existsSync(item.src) && !existsSync(dest)) {
      await copyFile(item.src, dest)
      console.log(`  ✓ copié ${item.nom}`)
    } else if (!existsSync(dest)) {
      await downloadImage(item.url, dest)
      console.log(`  ✓ téléchargé ${item.nom}`)
    } else {
      console.log(`  - ${item.nom} déjà présent`)
    }
  }

  // ── Copier cadrans (déjà en public/images/cadrans/datejust) ──
  console.log('\n📥 Cadrans Datejust...')
  const cadranFiles = [
    'noir-index-argentes', 'blanc-index-argentes', 'bleu-clair-index-argentes',
    'bleu-fonce-index-argentes', 'vert-index-argentes', 'jaune-index-argentes',
    'gris-index-argentes', 'or-rose-index-or-rose', 'blanc-index-or-rose',
    'blanc-index-or-jaune', 'noir-index-or-jaune'
  ]
  for (const f of cadranFiles) {
    const src = path.join(PUBLIC, `cadrans/datejust/${f}.png`)
    const dest = path.join(PARTS, `datejust/cadrans/${f}.png`)
    if (existsSync(src) && !existsSync(dest)) {
      await copyFile(src, dest)
      console.log(`  ✓ copié ${f}`)
    } else if (!existsSync(dest)) {
      console.log(`  ✗ introuvable: ${f}`)
    } else {
      console.log(`  - ${f} déjà présent`)
    }
  }

  // ── Télécharger bracelets ─────────────────────────────────
  console.log('\n📥 Bracelets Datejust...')
  for (const item of DATEJUST_IMAGES.bracelets) {
    const dest = path.join(PARTS, `datejust/bracelets/${item.nom}.png`)
    try {
      await downloadImage(item.url, dest)
      console.log(`  ✓ ${item.nom}`)
    } catch (e) {
      console.log(`  ✗ ${item.nom}: ${e.message}`)
    }
  }

  // ── Télécharger aiguilles Datejust ────────────────────────
  console.log('\n📥 Aiguilles Datejust...')
  for (const item of DATEJUST_IMAGES.aiguilles) {
    const ext = item.url.endsWith('.jpg') ? 'jpg' : 'png'
    const dest = path.join(PARTS, `datejust/aiguilles/${item.nom}.${ext}`)
    try {
      await downloadImage(item.url, dest)
      console.log(`  ✓ ${item.nom}`)
    } catch (e) {
      console.log(`  ✗ ${item.nom}: ${e.message}`)
    }
  }

  // ── Télécharger aiguilles Day-Date (mêmes images) ─────────
  console.log('\n📥 Aiguilles Day-Date...')
  for (const item of DATEJUST_IMAGES.aiguilles) {
    const ext = item.url.endsWith('.jpg') ? 'jpg' : 'png'
    const dest = path.join(PARTS, `daydate/aiguilles/${item.nom}.${ext}`)
    try {
      await downloadImage(item.url, dest)
      console.log(`  ✓ ${item.nom}`)
    } catch (e) {
      console.log(`  ✗ ${item.nom}: ${e.message}`)
    }
  }

  // ── Supprimer fonds blancs des renders ────────────────────
  console.log('\n🎨 Suppression fonds blancs...')
  const renders = [
    { src: path.join(PUBLIC, 'renders/daydate-preview.png'),   dest: path.join(PUBLIC, 'renders/daydate-preview.png') },
    { src: path.join(PUBLIC, 'renders/datejust-preview.png'),  dest: path.join(PUBLIC, 'renders/datejust-preview.png') },
    { src: path.join(PUBLIC, 'images/watch-daydate.png'),      dest: path.join(PUBLIC, 'images/watch-daydate.png') },
  ]
  for (const r of renders) {
    const realSrc = r.src.includes('/images/images/')
      ? r.src.replace('/images/images/', '/images/')
      : r.src
    const realSrcAlt = path.join(ROOT, 'public/images', path.basename(r.src))
    const actualSrc = existsSync(r.src) ? r.src : existsSync(realSrcAlt) ? realSrcAlt : null
    if (actualSrc) {
      try {
        await removeWhiteBackground(actualSrc, r.dest)
      } catch(e) {
        console.log(`  ✗ ${path.basename(r.src)}: ${e.message}`)
      }
    } else {
      console.log(`  - ${path.basename(r.src)}: introuvable (${r.src})`)
    }
  }

  // Render + catalogue Day-Date
  const watchDaydate = path.join(ROOT, 'public/images/watch-daydate.png')
  if (existsSync(watchDaydate)) {
    try {
      await removeWhiteBackground(watchDaydate, watchDaydate)
    } catch(e) {
      console.log(`  ✗ watch-daydate.png: ${e.message}`)
    }
  }

  // ── Mettre à jour watchParts.json ─────────────────────────
  console.log('\n📝 Mise à jour watchParts.json...')
  const partsPath = path.join(ROOT, 'src/data/watchParts.json')
  const data = JSON.parse(await readFile(partsPath, 'utf-8'))

  // --- Fix Day-Date aiguilles (ajouter img + corriger aiguilleSrc) ---
  const daydate = data.modeles.find(m => m.id === 'daydate')
  if (daydate) {
    daydate.aiguilles = [
      { id: 'argent',   nom: 'Argent',   img: '/images/parts/daydate/aiguilles/argent.png' },
      { id: 'or-rose',  nom: 'Or Rose',  img: '/images/parts/daydate/aiguilles/or-rose.png' },
      { id: 'or-jaune', nom: 'Or Jaune', img: '/images/parts/daydate/aiguilles/or-jaune.jpg' },
    ]
    daydate.aiguilleSrc = '/images/parts/daydate/aiguilles/argent.png'
    console.log('  ✓ Day-Date: aiguilles et aiguilleSrc corrigés')
  }

  // --- Ajouter Datejust si pas déjà présent ---
  const existingDJ = data.modeles.find(m => m.id === 'datejust')
  if (!existingDJ) {
    const datejust = {
      id: 'datejust',
      nom: 'Datejust',
      prix: '220 €',
      image: '/images/renders/datejust-preview.png',
      render: '/images/renders/datejust-preview.png',
      mouvements: ['nh35'],
      mouvementRecommande: 'nh35',
      boitiers: [
        { id: 'argent',   nom: 'Argent',   hex: '#B8BBBA', img: '/images/parts/datejust/boitiers/argent.png' },
        { id: 'or-jaune', nom: 'Or Jaune', hex: '#D4A437', img: '/images/parts/datejust/boitiers/or-jaune.png' },
        { id: 'or-rose',  nom: 'Or Rose',  hex: '#C9856A', img: '/images/parts/datejust/boitiers/or-rose.png' },
      ],
      cadrans: {
        sections: [
          {
            id: 'cadrans-datejust',
            label: 'Cadrans',
            couleurs: [
              { id: 'noir-index-argentes',       nom: 'Noir Index Argentés',       img: '/images/parts/datejust/cadrans/noir-index-argentes.png' },
              { id: 'blanc-index-argentes',      nom: 'Blanc Index Argentés',      img: '/images/parts/datejust/cadrans/blanc-index-argentes.png' },
              { id: 'bleu-clair-index-argentes', nom: 'Bleu Clair Index Argentés', img: '/images/parts/datejust/cadrans/bleu-clair-index-argentes.png' },
              { id: 'bleu-fonce-index-argentes', nom: 'Bleu Foncé Index Argentés', img: '/images/parts/datejust/cadrans/bleu-fonce-index-argentes.png' },
              { id: 'vert-index-argentes',       nom: 'Vert Index Argentés',       img: '/images/parts/datejust/cadrans/vert-index-argentes.png' },
              { id: 'jaune-index-argentes',      nom: 'Jaune Index Argentés',      img: '/images/parts/datejust/cadrans/jaune-index-argentes.png' },
              { id: 'gris-index-argentes',       nom: 'Gris Index Argentés',       img: '/images/parts/datejust/cadrans/gris-index-argentes.png' },
              { id: 'or-rose-index-or-rose',     nom: 'Or Rose Index Or Rose',     img: '/images/parts/datejust/cadrans/or-rose-index-or-rose.png' },
              { id: 'blanc-index-or-rose',       nom: 'Blanc Index Or Rose',       img: '/images/parts/datejust/cadrans/blanc-index-or-rose.png' },
              { id: 'blanc-index-or-jaune',      nom: 'Blanc Index Or Jaune',      img: '/images/parts/datejust/cadrans/blanc-index-or-jaune.png' },
              { id: 'noir-index-or-jaune',       nom: 'Noir Index Or Jaune',       img: '/images/parts/datejust/cadrans/noir-index-or-jaune.png' },
            ]
          }
        ]
      },
      aiguilles: [
        { id: 'argent',   nom: 'Argent',   img: '/images/parts/datejust/aiguilles/argent.png' },
        { id: 'or-rose',  nom: 'Or Rose',  img: '/images/parts/datejust/aiguilles/or-rose.png' },
        { id: 'or-jaune', nom: 'Or Jaune', img: '/images/parts/datejust/aiguilles/or-jaune.jpg' },
      ],
      aiguilleSrc: '/images/parts/datejust/aiguilles/argent.png',
      bracelets: [
        { id: 'argent',   nom: 'Jubilé Argent',   img: '/images/parts/datejust/bracelets/argent.png' },
        { id: 'or-rose',  nom: 'Jubilé Or Rose',  img: '/images/parts/datejust/bracelets/or-rose.png' },
        { id: 'or-jaune', nom: 'Jubilé Or Jaune', img: '/images/parts/datejust/bracelets/or-jaune.png' },
      ]
    }

    // Insérer AVANT daydate (ou à la fin)
    const ddIdx = data.modeles.findIndex(m => m.id === 'daydate')
    if (ddIdx >= 0) {
      data.modeles.splice(ddIdx, 0, datejust)
    } else {
      data.modeles.push(datejust)
    }
    console.log('  ✓ Datejust ajouté au configurateur (11 cadrans)')
  } else {
    console.log('  - Datejust déjà présent')
  }

  await writeFile(partsPath, JSON.stringify(data, null, 2), 'utf-8')
  console.log('  ✅ watchParts.json sauvegardé')

  console.log('\n🎉 Tout est prêt !')
  console.log('   • Datejust: 11 cadrans, 3 boîtiers, 3 bracelets, 3 aiguilles')
  console.log('   • Day-Date: aiguilles corrigées')
  console.log('   • Fonds blancs: supprimés')
  console.log('\n▶ Lance npm run dev pour tester\n')
}

main().catch(console.error)
