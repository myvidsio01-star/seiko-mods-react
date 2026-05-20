import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 0 24px 120px;
  background: #111110;
`
const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`
const Header = styled.div`
  text-align: center;
  padding-bottom: 56px;
`
const Eyebrow = styled.p`
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: #CA8A04; margin-bottom: 16px;
`
const H2 = styled.h2`
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 400; color: #F5F5F4;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 32px;
  align-items: stretch;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`
const Info = styled.div`
  background: #1C1917; border: 1px solid #292524;
  border-radius: 20px; padding: 40px 36px;
  display: flex; flex-direction: column; gap: 32px;
`
const InfoBlock = styled.div`
  display: flex; flex-direction: column; gap: 8px;

  .label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #CA8A04;
  }
  .value {
    font-size: 15px; color: #F5F5F4; font-weight: 300; line-height: 1.6;
  }
  .note {
    font-size: 12px; color: #57534E; margin-top: 4px;
  }
`
const DeliveryBadge = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`
const DeliveryLine = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(202,138,4,0.06);
  border: 1px solid rgba(202,138,4,0.15);
  border-radius: 10px; padding: 12px 16px;

  .zone { font-size: 14px; color: #F5F5F4; font-weight: 300; }
  .prix { font-family: 'Bodoni Moda', serif; font-size: 16px; color: #CA8A04; }
`
const MapWrap = styled.div`
  border-radius: 20px;
  overflow: hidden;
  height: 400px;
  border: 1px solid #292524;
  background: #1a1917;
`
const MapFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  filter: invert(90%) hue-rotate(180deg) saturate(0.4) brightness(0.85);
  display: block;
`

export default function MapSection() {
  const hRef = useScrollReveal()
  const gRef = useScrollReveal({ delay: '100ms' })

  return (
    <Section id="livraison">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>La Réunion 974</Eyebrow>
          <H2>Livraison & Contact</H2>
        </Header>

        <Grid ref={gRef}>
          <Info>
            <InfoBlock>
              <div className="label">Livraison</div>
              <DeliveryBadge>
                <DeliveryLine>
                  <span className="zone">Saint-Denis · La Possession</span>
                  <span className="prix">Gratuit</span>
                </DeliveryLine>
                <DeliveryLine>
                  <span className="zone">Toute La Réunion</span>
                  <span className="prix">15 €</span>
                </DeliveryLine>
              </DeliveryBadge>
              <div className="note">Livraison uniquement à La Réunion</div>
            </InfoBlock>

            <InfoBlock>
              <div className="label">Téléphone</div>
              <div className="value">
                <a href="tel:0692421519" style={{ color: '#F5F5F4', textDecoration: 'none' }}>
                  06 92 42 15 19
                </a>
              </div>
              <div className="note">WhatsApp disponible</div>
            </InfoBlock>

            <InfoBlock>
              <div className="label">Délai de fabrication</div>
              <div className="value">4 à 6 semaines<br />après confirmation de commande</div>
            </InfoBlock>

            <InfoBlock>
              <div className="label">Inclus avec chaque montre</div>
              <div className="value">Boîte de présentation offerte</div>
              <div className="note">Livraison uniquement à La Réunion</div>
            </InfoBlock>
          </Info>

          <MapWrap>
            <MapFrame
              src="https://www.openstreetmap.org/export/embed.html?bbox=55.21%2C-21.42%2C55.86%2C-20.86&layer=mapnik&marker=-20.8823%2C55.4508"
              title="La Réunion — Saint-Denis"
              loading="lazy"
              allowFullScreen
            />
          </MapWrap>
        </Grid>
      </Inner>
    </Section>
  )
}
