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
  color: #0C0A09;
  background: #CA8A04;
  padding: 10px 22px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;

  &:hover { background: #D97706; transform: translateY(-1px); }
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
      <CTA href="#contact">Commander</CTA>
    </Nav>
  )
}
