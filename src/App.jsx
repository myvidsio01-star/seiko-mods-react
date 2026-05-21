import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from 'styled-components'
import styled, { keyframes } from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'
import { WA_URL } from './utils/contact'
import Loader from './components/Loader/Loader'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Catalogue from './components/Catalogue/Catalogue'
import Configurator from './components/Configurator/Configurator'
import Process from './components/Process/Process'
import MapSection from './components/Contact/MapSection'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
  50%       { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
`

const WaFab = styled.a`
  position: fixed;
  bottom: 28px; right: 28px;
  z-index: 998;
  width: 58px; height: 58px;
  border-radius: 50%;
  background: #25D366;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.45);
  animation: ${pulse} 2.5s ease infinite;
  transition: transform 200ms ease;
  text-decoration: none;
  &:hover { transform: scale(1.1); }
`

function Cursor() {
  const dotRef  = useRef()
  const ringRef = useRef()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    const move = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', move)

    let raf
    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform  = `translate3d(${mx - 4}px, ${my - 4}px, 0)`
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`
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
      <div ref={dotRef}  id="cursor-dot" />
      <div ref={ringRef} id="cursor-ring" />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

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
            <Configurator />
            <Process />
            <MapSection />
            <Contact />
          </main>
          <Footer />
          <WaFab href={WA_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </WaFab>
        </>
      )}
    </ThemeProvider>
  )
}
