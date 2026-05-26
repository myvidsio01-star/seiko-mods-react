import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { WA_URL, waMsg, PHONE_TEL, PHONE_DISPLAY, FB_URL } from '../../utils/contact'

const Section = styled.section`
  padding: 120px 24px;
  background: #111110;
  @media (max-width: 640px) { padding: 64px 20px; }
`
const Inner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
`
const Eyebrow = styled.p`
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: #CA8A04; margin-bottom: 16px;
`
const H2 = styled.h2`
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 400; color: #F5F5F4; margin-bottom: 16px;
`
const Sub = styled.p`
  font-size: 15px; font-weight: 300;
  color: #78716C; line-height: 1.7; margin-bottom: 48px;
`
const BtnRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 16px;
  justify-content: center; margin-bottom: 24px;
`
const BtnWa = styled.a`
  display: inline-flex; align-items: center; gap: 12px;
  background: #25D366; color: white;
  font-size: 15px; font-weight: 500; letter-spacing: 0.1em;
  padding: 18px 40px; border-radius: 9999px;
  text-decoration: none;
  transition: background 250ms ease, transform 250ms ease, box-shadow 250ms ease;
  box-shadow: 0 4px 24px rgba(37,211,102,0.35);
  &:hover { background: #1ebe5d; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(37,211,102,0.5); }
`
const BtnFb = styled.a`
  display: inline-flex; align-items: center; gap: 12px;
  background: #0099FF; color: white;
  font-size: 15px; font-weight: 500; letter-spacing: 0.1em;
  padding: 18px 40px; border-radius: 9999px;
  text-decoration: none;
  transition: background 250ms ease, transform 250ms ease, box-shadow 250ms ease;
  box-shadow: 0 4px 24px rgba(0,153,255,0.35);
  &:hover { background: #007acc; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,153,255,0.5); }
`
const PhoneLink = styled.a`
  display: block;
  font-size: 13px; letter-spacing: 0.2em; color: #57534E;
  text-decoration: none; margin-bottom: 64px;
  transition: color 200ms ease;
  &:hover { color: #CA8A04; }
`
const Divider = styled.div`
  width: 48px; height: 1px; background: #292524; margin: 0 auto 48px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`
const InfoCard = styled.div`
  background: #1C1917; border: 1px solid #292524;
  border-radius: 16px; padding: 28px 20px;
  display: flex; flex-direction: column; gap: 8px;
`
const InfoLabel = styled.span`
  font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
  text-transform: uppercase; color: #CA8A04;
`
const InfoValue = styled.span`
  font-size: 14px; color: #F5F5F4; font-weight: 300; line-height: 1.5;
`

export default function Contact() {
  const ref = useScrollReveal()
  const ref2 = useScrollReveal({ delay: '150ms' })

  return (
    <Section id="contact">
      <Inner>
        <div ref={ref}>
          <Eyebrow>Contact</Eyebrow>
          <H2>Parlons de votre projet</H2>
          <Sub>
            Décrivez-nous votre montre idéale — on vous répond rapidement
            et on vous guide du choix des pièces jusqu'à la livraison.
          </Sub>

          <BtnRow>
            <BtnWa
              href={waMsg("Bonjour ! Je suis intéressé(e) par une Seiko Mod. Pouvez-vous me renseigner ?")}
              target="_blank" rel="noopener noreferrer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </BtnWa>
            <BtnFb href={FB_URL} target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.84 1.255 5.381 3.261 7.172.168.15.27.361.277.587l.055 1.836c.017.582.62.962 1.15.726l2.047-.903c.168-.074.357-.091.536-.049.662.182 1.367.28 2.093.28 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm.94 12.452l-2.541-2.707-4.957 2.707 5.455-5.789 2.603 2.707 4.895-2.707-5.455 5.789z"/>
              </svg>
              Messenger
            </BtnFb>
          </BtnRow>

          <PhoneLink href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</PhoneLink>
        </div>

        <Divider />

        <Grid ref={ref2}>
          <InfoCard>
            <InfoLabel>Réponse</InfoLabel>
            <InfoValue>Sous 24h en semaine</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Livraison</InfoLabel>
            <InfoValue>Gratuite à Saint-Denis et La Possession · 15 € toute La Réunion</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Délai</InfoLabel>
            <InfoValue>4 à 6 semaines après confirmation</InfoValue>
          </InfoCard>
        </Grid>
      </Inner>
    </Section>
  )
}
