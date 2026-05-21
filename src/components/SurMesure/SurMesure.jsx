import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { waMsg } from '../../utils/contact'

const WA_MESSAGE = "Bonjour ! J'ai une photo d'une montre que j'aimerais reproduire en Seiko Mod. Pouvez-vous m'aider ?"

const Wrapper = styled.section`
  background: #111110;
  padding: 120px 24px;

  @media (max-width: 640px) {
    padding: 72px 20px;
  }
`

const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 28px;
`

const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #CA8A04;
`

const H2 = styled.h2`
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 400;
  color: #F5F5F4;
  line-height: 1.2;
  margin: 0;
`

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: #CA8A04;
`

const Body = styled.p`
  font-family: 'Jost', sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  color: #A8A29E;
  max-width: 580px;
  margin: 0;
`

const WaButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #25D366;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 17px;
  font-weight: 500;
  padding: 18px 36px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.35);
  transition: transform 200ms ease, box-shadow 200ms ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(37, 211, 102, 0.5);
  }

  @media (max-width: 640px) {
    font-size: 15px;
    padding: 16px 26px;
  }
`

const Note = styled.p`
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  color: #57534E;
  margin: 0;
  letter-spacing: 0.03em;
`

const Badges = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`

const BadgeItem = styled.div`
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #A8A29E;
  background: rgba(202, 138, 4, 0.08);
  border: 1px solid rgba(202, 138, 4, 0.25);
  border-radius: 50px;
  padding: 8px 20px;
  letter-spacing: 0.04em;
`

export default function SurMesure() {
  const ref = useScrollReveal({ delay: '0ms' })
  const ref2 = useScrollReveal({ delay: '150ms' })

  return (
    <Wrapper id="sur-mesure">
      <Inner>
        <div ref={ref} style={{ display: 'contents' }}>
          <Eyebrow>Sur Mesure</Eyebrow>
          <H2>Vous avez une montre en tête ?</H2>
          <Divider />
        </div>
        <div ref={ref2} style={{ display: 'contents' }}>
          <Body>
            Vous avez vu une montre qui vous fait craquer — que ce soit une Rolex, une Audemars
            Piguet, une Cartier ou n'importe quelle autre marque ? On peut essayer de créer une
            version Seiko Mod qui s'en inspire. Il suffit de nous envoyer une photo sur WhatsApp,
            et on vous dit ce qu'on peut faire.
          </Body>
          <WaButton
            href={waMsg(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            📸 Envoyer une photo sur WhatsApp
          </WaButton>
          <Note>On analyse votre photo et on vous répond sous 24h</Note>
          <Badges>
            <BadgeItem>Toute marque acceptée</BadgeItem>
            <BadgeItem>Réponse sous 24h</BadgeItem>
            <BadgeItem>Devis gratuit</BadgeItem>
          </Badges>
        </div>
      </Inner>
    </Wrapper>
  )
}
