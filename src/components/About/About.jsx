import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 80px 24px;
  }
`

const ImgWrap = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 1/1;
  background: #F2EDE4;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 20px;
    transition: transform 600ms ease;
  }

  &:hover img { transform: scale(1.04); }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(202,138,4,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
`

const Badge = styled.div`
  position: absolute;
  bottom: 24px; right: 24px;
  background: rgba(12,10,9,0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(202,138,4,0.3);
  border-radius: 14px;
  padding: 16px 22px;
  text-align: center;

  .num {
    font-family: 'Bodoni Moda', serif;
    font-size: 36px;
    color: #CA8A04;
    line-height: 1;
  }
  .lbl {
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #A8A29E;
    text-transform: uppercase;
    margin-top: 4px;
  }
`

const TextSide = styled.div`
  display: flex; flex-direction: column; gap: 24px;
`

const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #CA8A04;
`

const H2 = styled.h2`
  font-size: clamp(30px, 3.5vw, 48px);
  font-weight: 400;
  color: #F5F5F4;
  line-height: 1.15;
`

const Body = styled.p`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.75;
  color: #A8A29E;
`

const Stats = styled.div`
  display: flex; gap: 40px; margin-top: 8px;
`

const Stat = styled.div`
  .num {
    font-family: 'Bodoni Moda', serif;
    font-size: 36px;
    color: #F5F5F4;
    line-height: 1;
  }
  .lbl {
    font-size: 12px;
    letter-spacing: 0.15em;
    color: #57534E;
    text-transform: uppercase;
    margin-top: 4px;
  }
`

const Divider = styled.div`
  width: 40px; height: 1px; background: #CA8A04; margin: 4px 0;
`

export default function About() {
  const ref  = useScrollReveal({ delay: '0ms' })
  const ref2 = useScrollReveal({ delay: '150ms' })

  return (
    <section id="about" style={{ background: '#0C0A09', overflow: 'hidden' }}>
      <Section>
        <div ref={ref}>
          <ImgWrap>
            <img src="/images/watch-seiko.png" alt="Seiko Mod Daytona Panda — vue de face" />
            <Badge>
              <div className="num">100%</div>
              <div className="lbl">Fait main</div>
            </Badge>
          </ImgWrap>
        </div>

        <TextSide ref={ref2}>
          <Eyebrow>À propos</Eyebrow>
          <H2>L'art du<br />Seiko Mod</H2>
          <Divider />
          <Body>
            On commande chaque composant auprès de fournisseurs premium — mouvement NH35,
            lunette céramique, cadran, bracelet oyster acier — et on les reçoit directement
            chez nous à La Réunion.
          </Body>
          <Body>
            Une fois les pièces en main, on assemble la montre entièrement à la main.
            Chaque mod est une déclaration d'élégance accessible, sans compromis sur la qualité.
          </Body>
          <Stats>
            <Stat><div className="num">48h</div><div className="lbl">par montre</div></Stat>
            <Stat><div className="num">12</div><div className="lbl">composants</div></Stat>
            <Stat><div className="num">∞</div><div className="lbl">style</div></Stat>
          </Stats>
        </TextSide>
      </Section>
    </section>
  )
}
