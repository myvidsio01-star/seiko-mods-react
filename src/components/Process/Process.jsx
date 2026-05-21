import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  background: #0C0A09;
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
`

const Eyebrow = styled.p`
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: #CA8A04; margin-bottom: 16px;
`

const H2 = styled.h2`
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 400; color: #F5F5F4;
`

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`

const Step = styled.div`
  padding: 40px 32px;
  background: #111110;
  border: 1px solid #1C1917;
  position: relative;
  transition: background 400ms ease, border-color 400ms ease;

  &:first-child { border-radius: 20px 0 0 20px; }
  &:last-child  { border-radius: 0 20px 20px 0; }

  @media (max-width: 900px) {
    &:first-child, &:nth-child(2) { border-radius: 0; }
    &:first-child { border-radius: 20px 20px 0 0; }
  }

  &:hover {
    background: #1C1917;
    border-color: rgba(202,138,4,0.25);
  }
`

const StepNum = styled.div`
  font-family: 'Bodoni Moda', serif;
  font-size: 48px;
  color: rgba(202,138,4,0.2);
  line-height: 1;
  margin-bottom: 20px;
  font-weight: 400;
`

const Icon = styled.div`
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(202,138,4,0.1);
  border: 1px solid rgba(202,138,4,0.2);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;

  svg { width: 20px; height: 20px; stroke: #CA8A04; fill: none; }
`

const StepTitle = styled.h3`
  font-family: 'Bodoni Moda', serif;
  font-size: 18px; font-weight: 400;
  color: #F5F5F4; margin-bottom: 12px;
`

const StepBody = styled.p`
  font-size: 14px; line-height: 1.65;
  color: #78716C; font-weight: 300;
`

const steps = [
  {
    num: '01', title: 'Consultation',
    body: 'On discute de ta vision — cadran, bracelet, finitions. Chaque projet est unique.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
  },
  {
    num: '02', title: 'Commande des pièces',
    body: 'On sélectionne et commande chaque composant — mouvement automatique, lunette céramique, cadran, bracelet. Les colis arrivent directement chez nous à La Réunion.',
    icon: <><circle cx="11" cy="11" r="8" strokeWidth={1.5}/><path d="m21 21-4.35-4.35" strokeWidth={1.5} strokeLinecap="round"/></>,
  },
  {
    num: '03', title: 'Assemblage',
    body: '48h de travail minutieux à la main — démontage, modification, remontage et contrôle qualité complet.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  },
  {
    num: '04', title: 'Livraison',
    body: 'Emballage premium, livraison gratuite à Saint-Denis. 15 € pour le reste de La Réunion.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
  },
]

function StepCard({ step: s, delay }) {
  const ref = useScrollReveal({ delay: `${delay}ms` })
  return (
    <Step ref={ref}>
      <StepNum>{s.num}</StepNum>
      <Icon><svg viewBox="0 0 24 24">{s.icon}</svg></Icon>
      <StepTitle>{s.title}</StepTitle>
      <StepBody>{s.body}</StepBody>
    </Step>
  )
}

export default function Process() {
  const hRef = useScrollReveal()
  return (
    <Section id="process">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>Comment ça marche</Eyebrow>
          <H2>Le processus</H2>
        </Header>
        <Steps>
          {steps.map((s, i) => <StepCard key={s.num} step={s} delay={i * 100} />)}
        </Steps>
      </Inner>
    </Section>
  )
}
