/**
 * download-wmc-cadrans.mjs
 * Télécharge les thumbnails cadrans depuis watchmodcustom.com
 * et les organise par modèle dans public/images/parts/{model}/cadrans/
 */
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_BASE = path.join(ROOT, 'public/images/parts')

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&amp;/g, 'et').replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim().replace(/\s+/g, '-').toLowerCase()
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    const get = url.startsWith('https') ? https.get : http.get
    const req = get(url.trim(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.watchmodcustom.com/',
      },
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
    req.setTimeout(15000, () => { req.abort(); reject(new Error('Timeout')) })
  })
}

// ═══════════════════════════════════════════════════════
// MAPPING : label WMC → modèle + section
// ═══════════════════════════════════════════════════════
const WMC_CADRANS = {
  // ── DAYTONA (chrono style - sous-cadrans) ─────────────
  daytona: [
    // Cadrans panda / racing
    { id: '747', nom: 'Or Rose avec indices',  slug: 'or-rose-avec-indices' },
    { id: '748', nom: 'Or avec indices',        slug: 'or-avec-indices' },
    { id: '749', nom: 'Noir avec indices',      slug: 'noir-avec-indices' },
    { id: '750', nom: 'Noir et Blanc',          slug: 'noir-et-blanc' },
    { id: '751', nom: 'Double Noir',            slug: 'double-noir' },
    { id: '752', nom: 'Orange et Noir',         slug: 'orange-et-noir' },
    { id: '763', nom: 'Or Rose Brossé',         slug: 'or-rose-brosse' },
    { id: '764', nom: 'Or Brossé',              slug: 'or-brosse' },
    { id: '765', nom: 'Noir Mat',               slug: 'noir-mat' },
    { id: '766', nom: 'Bleu et Noir',           slug: 'bleu-et-noir' },
    { id: '767', nom: 'Jaune et Noir',          slug: 'jaune-et-noir' },
    { id: '768', nom: 'Vert et Noir',           slug: 'vert-et-noir' },
    { id: '769', nom: 'Rouge et Noir',          slug: 'rouge-et-noir' },
    // Bezel styles
    { id: '598', nom: 'Blanc Céramique',        slug: 'blanc-ceramique' },
  ],

  // ── GMT ───────────────────────────────────────────────
  gmt: [
    { id: '455', nom: 'Noir',                   slug: 'noir' },
    { id: '518', nom: 'Batman',                 slug: 'batman' },
    { id: '835', nom: 'Black & Tiffany Blue',   slug: 'black-tiffany-blue' },
    { id: '836', nom: 'Tiffany Blue',           slug: 'tiffany-blue' },
    { id: '476', nom: 'Rootbeer',               slug: 'rootbeer' },
    { id: '482', nom: 'Cola',                   slug: 'cola' },
    { id: '519', nom: 'Pepsi',                  slug: 'pepsi' },
    { id: '481', nom: 'Sprite',                 slug: 'sprite' },
    { id: '597', nom: 'Gris Noir Or',           slug: 'gris-noir-or' },
    { id: '663', nom: 'YM Noir',                slug: 'ym-noir' },
    { id: '693', nom: 'Gris Noir',              slug: 'gris-noir' },
    { id: '664', nom: 'Carbon Forgé',           slug: 'carbon-forge' },
    { id: '662', nom: 'Vert',                   slug: 'vert' },
    { id: '475', nom: 'Violet et Noir',         slug: 'violet-et-noir' },
    { id: '514', nom: 'Arabic Noir',            slug: 'arabic-noir' },
    { id: '515', nom: 'Arabic Bleu',            slug: 'arabic-bleu' },
    { id: '838', nom: 'Arabic Bleu Electric',   slug: 'arabic-bleu-electric' },
    { id: '516', nom: 'Arabic Vert',            slug: 'arabic-vert' },
    { id: '471', nom: 'Vert et Noir Double Fuseau', slug: 'vert-noir-double-fuseau' },
  ],

  // ── SUBMARINER ────────────────────────────────────────
  submariner: [
    { id: '493', nom: 'Noir WMC',               slug: 'noir-wmc' },
    { id: '492', nom: 'Bleu Soleillé',          slug: 'bleu-soleil' },
    { id: '833', nom: 'Météorite',              slug: 'meteorite' },
    { id: '635', nom: 'Carbon Forgé',           slug: 'carbon-forge' },
    { id: '489', nom: 'Vert Soleillé',          slug: 'vert-soleil' },
    { id: '488', nom: 'Gris Soleillé',          slug: 'gris-soleil' },
    { id: '329', nom: 'Blanc',                  slug: 'blanc' },
    { id: '323', nom: 'Or Rose',                slug: 'or-rose' },
    { id: '596', nom: 'Or',                     slug: 'or' },
    { id: '327', nom: 'Vintage',                slug: 'vintage' },
    { id: '669', nom: 'Blanc SEIKO',            slug: 'blanc-seiko' },
    { id: '670', nom: 'Bleu Ciel SEIKO',        slug: 'bleu-ciel-seiko' },
    { id: '671', nom: 'Bleu SEIKO',             slug: 'bleu-seiko' },
    { id: '668', nom: 'Gris SEIKO',             slug: 'gris-seiko' },
    { id: '494', nom: 'Noir SEIKO',             slug: 'noir-seiko' },
    { id: '666', nom: 'Or Rose SEIKO',          slug: 'or-rose-seiko' },
    { id: '667', nom: 'Or SEIKO',               slug: 'or-seiko' },
    { id: '845', nom: 'Rouge SEIKO',            slug: 'rouge-seiko' },
    { id: '672', nom: 'Vert SEIKO',             slug: 'vert-seiko' },
    { id: '469', nom: 'Sub Noir',               slug: 'sub-noir' },
    { id: '470', nom: 'Sub Noir et Rouge',      slug: 'sub-noir-rouge' },
    { id: '480', nom: 'Sub Bleu',               slug: 'sub-bleu' },
    { id: '497', nom: 'Sub Bleu Pétrole',       slug: 'sub-bleu-petrole' },
    { id: '491', nom: 'Sub Vert Starbucks',     slug: 'sub-vert-starbucks' },
    { id: '498', nom: 'Sub Marron',             slug: 'sub-marron' },
    { id: '587', nom: 'Blanc Céramique',        slug: 'blanc-ceramique' },
    { id: '588', nom: 'Carbon Forgé Premium',   slug: 'carbon-forge-premium' },
    { id: '467', nom: 'Noir Mat',               slug: 'noir-mat' },
    { id: '847', nom: 'Noir et Rouge WMC',      slug: 'noir-rouge-wmc' },
    { id: '848', nom: 'Noir et Vert WMC',       slug: 'noir-vert-wmc' },
    { id: '692', nom: 'Open Heart',             slug: 'open-heart' },
    { id: '803', nom: 'Deep S Noir',            slug: 'deep-s-noir' },
  ],

  // ── NAUTILUS ──────────────────────────────────────────
  nautilus: [
    { id: '459', nom: 'Flash Bleu',             slug: 'flash-bleu' },
    { id: '456', nom: 'Flash Orange',           slug: 'flash-orange' },
    { id: '457', nom: 'Flash Rouge',            slug: 'flash-rouge' },
    { id: '586', nom: 'Orange',                 slug: 'orange' },
    { id: '460', nom: 'Flash Or Rose',          slug: 'flash-or-rose' },
    { id: '591', nom: 'Benz Bleu',              slug: 'benz-bleu' },
    { id: '504', nom: 'Benz Bleu Turquoise',    slug: 'benz-bleu-turquoise' },
    { id: '592', nom: 'Benz Orange',            slug: 'benz-orange' },
    { id: '593', nom: 'Benz Rouge',             slug: 'benz-rouge' },
    { id: '595', nom: 'Benz Vert',              slug: 'benz-vert' },
    { id: '430', nom: 'Nautilus Or Rose',       slug: 'nautilus-or-rose' },
    { id: '429', nom: 'Nautilus Or',            slug: 'nautilus-or' },
    { id: '432', nom: 'Nautilus Noir',          slug: 'nautilus-noir' },
    { id: '440', nom: 'Baton Acier',            slug: 'baton-acier' },
    { id: '441', nom: 'Baton Or Rose',          slug: 'baton-or-rose' },
    { id: '442', nom: 'Baton Or',               slug: 'baton-or' },
    { id: '443', nom: 'Baton Noir',             slug: 'baton-noir' },
    { id: '436', nom: 'Benz Or Rose',           slug: 'benz-or-rose' },
    { id: '437', nom: 'Benz Or',                slug: 'benz-or' },
    { id: '438', nom: 'Benz Noir',              slug: 'benz-noir' },
    { id: '844', nom: 'Flash Bleu Alt',         slug: 'flash-bleu-alt' },
    { id: '809', nom: 'Benz Skeleton N&B',      slug: 'benz-skeleton' },
    { id: '699', nom: 'Dolphin Or Rose',        slug: 'dolphin-or-rose' },
  ],

  // ── ROYAL OAK ─────────────────────────────────────────
  royaloak: [
    { id: '495', nom: 'Baton Bleu',             slug: 'baton-bleu' },
    { id: '486', nom: 'Gris Sunburst',          slug: 'gris-sunburst' },
    { id: '334', nom: 'Meteor Baton',           slug: 'meteor-baton' },
    { id: '328', nom: 'Baton Blanc',            slug: 'baton-blanc' },
    { id: '665', nom: 'Carbon Forgé',           slug: 'carbon-forge' },
    { id: '631', nom: 'Baton Marron',           slug: 'baton-marron' },
    { id: '723', nom: 'Baton Rose',             slug: 'baton-rose' },
    { id: '490', nom: 'Baton Vert',             slug: 'baton-vert' },
    { id: '632', nom: 'Baton Violet',           slug: 'baton-violet' },
    { id: '331', nom: 'Tiffany Bleu',           slug: 'tiffany-bleu' },
    { id: '513', nom: 'Baton Noir',             slug: 'baton-noir' },
    { id: '627', nom: 'Skeleton Baton Acier',   slug: 'skeleton-baton-acier' },
    { id: '625', nom: 'Skeleton Bleu',          slug: 'skeleton-bleu' },
    { id: '509', nom: 'Skeleton Vert',          slug: 'skeleton-vert' },
    { id: '511', nom: 'Skeleton Noir',          slug: 'skeleton-noir' },
    { id: '656', nom: 'Pilote Noir',            slug: 'pilote-noir' },
    { id: '807', nom: 'Rainbow Blanc',          slug: 'rainbow-blanc' },
    { id: '806', nom: 'Rainbow Noir',           slug: 'rainbow-noir' },
  ],

  // ── DAY-DATE ──────────────────────────────────────────
  daydate: [
    { id: '417', nom: 'Benz Vintage Acier',     slug: 'benz-vintage-acier' },
    { id: '413', nom: 'Benz Or',                slug: 'benz-or' },
    { id: '407', nom: 'Benz Or Rose',           slug: 'benz-or-rose' },
    { id: '414', nom: 'Benz Noir',              slug: 'benz-noir' },
    { id: '829', nom: 'Benz Noir Complet',      slug: 'benz-noir-complet' },
    { id: '416', nom: 'Snowflakes Or Rose',     slug: 'snowflakes-or-rose' },
    { id: '418', nom: 'Snowflakes Noir',        slug: 'snowflakes-noir' },
    { id: '420', nom: 'Index Or Rose',          slug: 'index-or-rose' },
    { id: '421', nom: 'Index Or',               slug: 'index-or' },
    { id: '422', nom: 'Index Noir',             slug: 'index-noir' },
    { id: '423', nom: 'Baton Acier',            slug: 'baton-acier' },
    { id: '424', nom: 'Baton Or Rose',          slug: 'baton-or-rose' },
    { id: '425', nom: 'Baton Or',               slug: 'baton-or' },
    { id: '426', nom: 'Baton Noir',             slug: 'baton-noir' },
    { id: '808', nom: 'Benz Skeleton N&B',      slug: 'benz-skeleton' },
  ],
}

async function main() {
  const BASE_THUMB = 'https://www.watchmodcustom.com/img/scenes/ndkcf/thumbs/'
  let total = 0
  let errors = 0

  // Compte les items
  for (const model of Object.keys(WMC_CADRANS)) {
    total += WMC_CADRANS[model].length
  }
  console.log(`\n🎯 Téléchargement de ${total} cadrans watchmodcustom...\n`)

  const results = {} // model → [{id, nom, img}]

  for (const [model, items] of Object.entries(WMC_CADRANS)) {
    const outDir = path.join(OUT_BASE, model, 'cadrans', 'wmc')
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

    results[model] = []

    for (const item of items) {
      const url = `${BASE_THUMB}${item.id}-texture.jpg`
      const dest = path.join(outDir, `${item.slug}.jpg`)
      const imgPath = `/images/parts/${model}/cadrans/wmc/${item.slug}.jpg`

      try {
        await downloadImage(url, dest)
        results[model].push({ id: item.slug, nom: item.nom, img: imgPath })
        process.stdout.write('✓')
      } catch (err) {
        process.stdout.write('✗')
        errors++
        // Essaie avec -home_default.jpg
        try {
          const url2 = `${BASE_THUMB}${item.id}-home_default.jpg`
          await downloadImage(url2, dest)
          results[model].push({ id: item.slug, nom: item.nom, img: imgPath })
          process.stdout.write('↩')
        } catch {}
      }
    }
    console.log(` — ${model} (${items.length})`)
  }

  console.log(`\n✅ Fini ! ${errors} erreurs sur ${total} images`)

  // ── Met à jour watchParts.json ──────────────────────
  const partsPath = path.join(ROOT, 'src/data/watchParts.json')
  const data = JSON.parse(await readFile(partsPath, 'utf-8'))

  for (const modele of data.modeles) {
    const wmcItems = results[modele.id]
    if (!wmcItems || wmcItems.length === 0) continue

    // Ajoute les cadrans WMC dans une section dédiée
    if (!modele.cadrans) modele.cadrans = { sections: [] }
    if (!modele.cadrans.sections) modele.cadrans.sections = []

    // Supprime l'ancienne section WMC si elle existe
    modele.cadrans.sections = modele.cadrans.sections.filter(s => s.id !== 'wmc')

    // Ajoute la nouvelle section
    modele.cadrans.sections.push({
      id: 'wmc',
      nom: 'Cadrans Custom',
      couleurs: wmcItems,
    })

    console.log(`✓ ${modele.nom}: +${wmcItems.length} cadrans WMC`)
  }

  await writeFile(partsPath, JSON.stringify(data, null, 2), 'utf-8')
  console.log('\n📦 watchParts.json mis à jour !')

  // Sauvegarde le mapping pour référence
  await writeFile(
    path.join(ROOT, 'scripts/wmc-cadrans-downloaded.json'),
    JSON.stringify(results, null, 2), 'utf-8'
  )
}

main().catch(console.error)
