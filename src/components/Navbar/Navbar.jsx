import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Nav = styled.nav`
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  z-index: 1000;
  width: min(900px, calc(100vw - 40px));
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 28px;
  background: ${p => p.$scrolled ? 'rgba(12,10,9,0.85)' : 'rgba(12,10,9,0.4)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  transition: background 400ms ease, box-shadow 400ms ease;
  box-shadow: ${p => p.$scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : 'none'};
`

const Logo = styled.a`
  font-family: 'Bodoni Moda', serif;
  font-size: 18px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #F5F5F4;
  cursor: pointer;
  span { color: #CA8A04; }
`

const Links = styled.div`
  display: flex; gap: 36px; align-items: center;

  @media (max-width: 640px) { display: none; }
`

const Link = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #A8A29E;
  cursor: pointer;
  transition: color 200ms ease;

  &:hover { color: #F5F5F4; }
`

const CTA = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: #25D366;
  padding: 10px 22px;
  border-radius: 9999px;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: background 200ms ease, transform 200ms ease;
  text-decoration: none;

  &:hover { background: #1ebe5d; transform: translateY(-1px); }
`

const links = [
  { label: 'Montres', href: '#catalogue' },
  { label: 'Processus', href: '#process' },
  { label: 'Créer', href: '#configurateur' },
  { label: 'Livraison', href: '#livraison' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <Nav $scrolled={scrolled}>
      <Logo href="#hero">SEIKO <span>MODS</span></Logo>
      <Links>
        {links.map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}
      </Links>
      <CTA href="https://wa.me/262692421519" target="_blank" rel="noopener noreferrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </CTA>
    </Nav>
  )
}
