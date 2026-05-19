import { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'
import Loader from './components/Loader/Loader'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Catalogue from './components/Catalogue/Catalogue'
import Configurator from './components/Configurator/Configurator'
import SugargooCart from './components/Configurator/SugargooCart'
import Process from './components/Process/Process'
import MapSection from './components/Contact/MapSection'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

const CartOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #0C0A09;
  overflow-y: auto;
`

function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    const move = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', move)

    let raf
    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.left  = mx + 'px'
      dot.style.top   = my + 'px'
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" />
      <div id="cursor-ring" />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [configSelection, setConfigSelection] = useState(null)
  const [showCart, setShowCart] = useState(false)

  const handleCommander = (selection) => {
    setConfigSelection(selection)
    setShowCart(true)
  }

  const handleRetour = () => {
    setShowCart(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Cursor />
      {!ready && <Loader onDone={() => setReady(true)} />}
      {ready && (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Catalogue />
            <Configurator onCommander={handleCommander} />
            <Process />
            <MapSection />
            <Contact />
          </main>
          <Footer />
          {showCart && (
            <CartOverlay>
              <SugargooCart selection={configSelection} onRetour={handleRetour} />
            </CartOverlay>
          )}
        </>
      )}
    </ThemeProvider>
  )
}
