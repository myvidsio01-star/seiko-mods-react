import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { WA_URL, FB_URL } from '../../utils/contact'

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

const CTAGroup = styled.div`
  display: flex; align-items: center; gap: 8px;
  margin-left: 24px; flex-shrink: 0;
  @media (max-width: 640px) { display: none; }
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
  flex-shrink: 0;
  transition: background 200ms ease, transform 200ms ease;
  text-decoration: none;
  &:hover { background: #1ebe5d; transform: translateY(-1px); }
`

const CTAFb = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: #0099FF;
  padding: 10px 22px;
  border-radius: 9999px;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0;
  transition: background 200ms ease, transform 200ms ease;
  text-decoration: none;
  &:hover { background: #007acc; transform: translateY(-1px); }
`

const HamBtn = styled.button`
  display: none;
  flex-direction: column; justify-content: center; gap: 5px;
  width: 36px; height: 36px; padding: 4px;
  background: none; border: none; cursor: pointer;

  @media (max-width: 640px) { display: flex; }

  span {
    display: block; width: 22px; height: 1.5px;
    background: #F5F5F4; border-radius: 2px;
    transition: all 250ms ease;
  }

  ${p => p.$open && `
    span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  `}
`

const Overlay = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    position: fixed; inset: 0; z-index: 999;
    background: rgba(12,10,9,0.97);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px;
    opacity: ${p => p.$open ? 1 : 0};
    pointer-events: ${p => p.$open ? 'auto' : 'none'};
    transition: opacity 300ms ease;
  }
`

const MobileLink = styled.a`
  font-size: 20px; font-weight: 400;
  letter-spacing: 0.25em; text-transform: uppercase;
  color: #F5F5F4; padding: 14px 32px;
  text-decoration: none;
  transition: color 200ms ease;
  &:hover { color: #CA8A04; }
`

const MobileWa = styled.a`
  margin-top: 24px;
  display: flex; align-items: center; gap: 10px;
  background: #25D366; color: white;
  font-size: 14px; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 14px 32px; border-radius: 9999px;
  text-decoration: none;
  transition: background 200ms ease;
  &:hover { background: #1ebe5d; }
`
const MobileFb = styled.a`
  margin-top: 8px;
  display: flex; align-items: center; gap: 10px;
  background: #0099FF; color: white;
  font-size: 14px; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 14px 32px; border-radius: 9999px;
  text-decoration: none;
  transition: background 200ms ease;
  &:hover { background: #007acc; }
`

const links = [
  { label: 'Montres',       href: '#catalogue' },
  { label: 'Processus',     href: '#process' },
  { label: 'Configurateur', href: '#configurateur' },
  { label: 'Livraison',     href: '#livraison' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#hero">SEIKO <span>MODS</span></Logo>
        <Links>
          {links.map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}
        </Links>
        <CTAGroup>
          <CTA href={WA_URL} target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </CTA>
          <CTAFb href={FB_URL} target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.84 1.255 5.381 3.261 7.172.168.15.27.361.277.587l.055 1.836c.017.582.62.962 1.15.726l2.047-.903c.168-.074.357-.091.536-.049.662.182 1.367.28 2.093.28 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm.94 12.452l-2.541-2.707-4.957 2.707 5.455-5.789 2.603 2.707 4.895-2.707-5.455 5.789z"/></svg>
            Messenger
          </CTAFb>
        </CTAGroup>
        <HamBtn $open={open} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </HamBtn>
      </Nav>

      <Overlay $open={open}>
        {links.map(l => (
          <MobileLink key={l.label} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </MobileLink>
        ))}
        <MobileWa href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </MobileWa>
        <MobileFb href={FB_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.84 1.255 5.381 3.261 7.172.168.15.27.361.277.587l.055 1.836c.017.582.62.962 1.15.726l2.047-.903c.168-.074.357-.091.536-.049.662.182 1.367.28 2.093.28 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm.94 12.452l-2.541-2.707-4.957 2.707 5.455-5.789 2.603 2.707 4.895-2.707-5.455 5.789z"/></svg>
          Messenger
        </MobileFb>
      </Overlay>
    </>
  )
}
