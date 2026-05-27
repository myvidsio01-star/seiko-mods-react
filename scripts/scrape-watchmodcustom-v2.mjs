/**
 * scrape-watchmodcustom-v2.mjs
 * Scrape les cadrans avec leurs noms depuis watchmodcustom.com
 * et télécharge les images directement
 */
import { chromium } from 'playwright'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim().replace(/\s+/g, '-').toLowerCase()
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', reject)
  })
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  console.log('Ouverture de watchmodcustom...')
  await page.goto('https://www.watchmodcustom.com/fr/configurateur/32-basic-watch.html', {
    waitUntil: 'networkidle',
    timeout: 60000,
  })
  await page.waitForTimeout(3000)

  // Cherche TOUTES les options du configurateur avec leur texte et image
  const options = await page.evaluate(() => {
    const results = []

    // 1. Cherche les éléments d'option du configurateur (boutons/labels avec images)
    document.querySelectorAll('[class*="option"], [class*="choice"], [class*="step"], [class*="item"]').forEach(el => {
      const img = el.querySelector('img')
      const text = el.innerText?.trim()
      if (img && text) {
        results.push({
          type: 'option',
          text: text.slice(0, 100),
          imgSrc: img.src,
          classes: el.className,
        })
      }
    })

    // 2. Cherche chaque paire label+image dans la page
    document.querySelectorAll('img').forEach(img => {
      if (!img.src.includes('/thumbs/')) return
      // Cherche le label le plus proche
      let el = img.parentElement
      let label = ''
      for (let i = 0; i < 5 && el; i++) {
        const texts = Array.from(el.querySelectorAll('span, p, div, label'))
          .map(e => e.innerText?.trim())
          .filter(t => t && t.length > 1 && t.length < 100 && !t.includes('\n'))
        if (texts.length) { label = texts[0]; break }
        el = el.parentElement
      }
      results.push({
        type: 'thumb',
        imgSrc: img.src,
        label,
        alt: img.alt,
      })
    })

    return results
  })

  console.log(`\n=== Options trouvées (${options.length}) ===`)
  options.forEach(o => console.log(JSON.stringify(o)))

  // Cherche aussi les sections / questions du configurateur
  const sections = await page.evaluate(() => {
    const results = []
    // Chaque question/étape du configurateur
    document.querySelectorAll('[class*="question"], [class*="step-name"], [class*="section"], h2, h3, h4').forEach(el => {
      const text = el.innerText?.trim()
      if (text && text.length < 100) {
        results.push({ tag: el.tagName, text, class: el.className })
      }
    })
    return results
  })

  console.log(`\n=== Sections/Questions (${sections.length}) ===`)
  sections.forEach(s => console.log(s))

  // Cherche les data-attributes sur les éléments cliquables
  const dataAttrs = await page.evaluate(() => {
    const results = []
    document.querySelectorAll('[data-id], [data-value], [data-name], [data-label]').forEach(el => {
      const img = el.querySelector('img')
      results.push({
        tag: el.tagName,
        dataId: el.dataset.id || el.dataset.value,
        dataName: el.dataset.name || el.dataset.label,
        hasImg: !!img,
        imgSrc: img?.src,
        text: el.innerText?.trim()?.slice(0, 80),
        classes: el.className,
      })
    })
    return results
  })

  console.log(`\n=== Data attributes (${dataAttrs.length}) ===`)
  dataAttrs.forEach(d => console.log(JSON.stringify(d)))

  // Cherche les items visibles avec image dans le configurateur
  // En scrollant sur les options de cadran
  const cadranSection = await page.evaluate(() => {
    // Cherche tous les éléments clickables avec thumbnail
    const items = []
    document.querySelectorAll('img[src*="thumbs"]').forEach(img => {
      let el = img
      // Remonter jusqu'à trouver le container avec le texte
      for (let i = 0; i < 8; i++) {
        el = el.parentElement
        if (!el) break
        const allText = el.innerText?.trim()
        if (allText && allText.length > 2 && allText.length < 200) {
          items.push({
            imgSrc: img.src,
            containerText: allText,
            containerClass: el.className,
          })
          break
        }
      }
    })
    return items
  })

  console.log(`\n=== Items cadran avec texte (${cadranSection.length}) ===`)
  cadranSection.forEach(item => {
    console.log('IMG:', item.imgSrc.split('/').pop())
    console.log('TEXT:', item.containerText)
    console.log('CLASS:', item.containerClass)
    console.log('---')
  })

  await browser.close()

  // Sauvegarde tout
  await writeFile(
    path.join(ROOT, 'scripts/watchmodcustom-v2.json'),
    JSON.stringify({ options, sections, dataAttrs, cadranSection }, null, 2),
    'utf-8'
  )
  console.log('\nRésultats dans scripts/watchmodcustom-v2.json')
}

main().catch(console.error)
