/**
 * scrape-watchmodcustom.mjs
 * Scrape les cadrans Daytona depuis watchmodcustom.com
 */
import { chromium } from 'playwright'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  const images = []

  // Intercepte toutes les images chargées
  page.on('response', async (response) => {
    const url = response.url()
    const type = response.headers()['content-type'] || ''
    if (
      (type.includes('image/') || url.match(/\.(png|jpg|jpeg|webp)/i)) &&
      !url.includes('logo') && !url.includes('favicon') &&
      !url.includes('icon') && !url.includes('flag')
    ) {
      images.push(url)
      console.log('IMG:', url)
    }
  })

  console.log('Ouverture de watchmodcustom...')
  await page.goto('https://www.watchmodcustom.com/fr/configurateur/32-basic-watch.html', {
    waitUntil: 'networkidle',
    timeout: 60000,
  })

  // Attendre que le configurateur charge
  await page.waitForTimeout(3000)

  // Cherche tous les éléments d'options de cadran
  const optionEls = await page.$$eval('*', (els) => {
    return els
      .filter(el => {
        const style = window.getComputedStyle(el)
        const bg = style.backgroundImage
        return bg && bg !== 'none' && bg.includes('url')
      })
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        bg: window.getComputedStyle(el).backgroundImage,
        text: el.innerText?.slice(0, 100),
        title: el.title || el.alt || '',
      }))
  })

  console.log('\n=== Éléments avec background-image ===')
  optionEls.forEach(e => console.log(e))

  // Cherche les img tags
  const imgTags = await page.$$eval('img', imgs => imgs.map(img => ({
    src: img.src,
    alt: img.alt,
    class: img.className,
    width: img.width,
    height: img.height,
  })))

  console.log('\n=== Balises <img> ===')
  imgTags.forEach(i => console.log(i))

  // Snapshot du HTML
  const html = await page.content()
  await writeFile(path.join(ROOT, 'scripts/watchmodcustom-page.html'), html, 'utf-8')
  console.log('\nHTML sauvegardé dans scripts/watchmodcustom-page.html')

  // Sauvegarde toutes les images interceptées
  const result = {
    allImages: [...new Set(images)],
    imgTags,
    bgImages: optionEls,
  }
  await writeFile(
    path.join(ROOT, 'scripts/watchmodcustom-data.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  )
  console.log(`\nTotal images interceptées: ${images.length}`)
  console.log('Résultats dans scripts/watchmodcustom-data.json')

  await browser.close()
}

main().catch(console.error)
