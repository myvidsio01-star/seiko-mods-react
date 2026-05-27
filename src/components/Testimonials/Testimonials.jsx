import styled, { keyframes } from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  background: #0C0A09;
  overflow: hidden;
  @media (max-width: 640px) { padding: 72px 20px; }
`

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 72px;
`

const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #CA8A04;
  margin-bottom: 16px;
`

const H2 = styled.h2`
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 400;
  color: #F5F5F4;
  line-height: 1.15;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`

const Card = styled.article`
  background: #1C1917;
  border: 1px solid #292524;
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color 350ms ease, box-shadow 350ms ease;

  &:hover {
    border-color: rgba(202,138,4,0.3);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }
`

const QuoteMark = styled.div`
  font-family: 'Bodoni Moda', serif;
  font-size: 64px;
  line-height: 0.7;
  color: #CA8A04;
  opacity: 0.35;
  user-select: none;
`

const Stars = styled.div`
  display: flex;
  gap: 3px;

  span {
    font-size: 15px;
    color: #CA8A04;
  }
`

const QuoteText = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.75;
  color: #D4CFC9;
  flex: 1;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #292524;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Avatar = styled.div`
  width: 42px; height: 42px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #F5F5F4;
`

const AuthorLoc = styled.span`
  font-size: 11px;
  color: #57534E;
  letter-spacing: 0.05em;
`

const WatchBadge = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #CA8A04;
  background: rgba(202,138,4,0.08);
  border: 1px solid rgba(202,138,4,0.2);
  border-radius: 9999px;
  padding: 4px 10px;
  white-space: nowrap;
`

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 56px;
  padding: 24px;
  background: rgba(202,138,4,0.04);
  border: 1px solid rgba(202,138,4,0.12);
  border-radius: 16px;
`

const RatingNum = styled.span`
  font-family: 'Bodoni Moda', serif;
  font-size: 40px;
  color: #CA8A04;
  line-height: 1;
`

const RatingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const RatingStars = styled.div`
  display: flex;
  gap: 3px;
  span { font-size: 18px; color: #CA8A04; }
`

const RatingCount = styled.span`
  font-size: 12px;
  color: #57534E;
  letter-spacing: 0.1em;
`

const SavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 56px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const SavCard = styled.div`
  background: #1C1917;
  border: 1px solid #292524;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SavIcon = styled.div`
  font-size: 28px;
  line-height: 1;
`

const SavLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #CA8A04;
`

const SavTitle = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: #F5F5F4;
`

const SavDesc = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #78716C;
  line-height: 1.6;
  margin: 0;
`

const reviews = [
  {
    name:    'Kevin Hoarau',
    loc:     'Saint-Denis · La Réunion',
    initials:'KH',
    color:   '#EA580C',
    watch:   'Submariner',
    text:    "Vraiment bluffant. La qualité est bien au rendez-vous et le rendu est identique à ce qu'on voit sur le site. Mathis répond rapidement sur WhatsApp, la livraison était dans les délais. Je recommande sans hésiter.",
    stars:   5,
  },
  {
    name:    'Camille Payet',
    loc:     'Saint-Pierre · La Réunion',
    initials:'CP',
    color:   '#7C3AED',
    watch:   'Daytona Panda',
    text:    "J'avais des doutes au départ mais les photos envoyées pendant la fabrication m'ont convaincu. Ma Daytona est parfaite, mes amis ne croient pas que c'est une mod. La boîte de présentation est un vrai plus.",
    stars:   5,
  },
  {
    name:    'Jordan Rivière',
    loc:     'Le Tampon · La Réunion',
    initials:'JR',
    color:   '#0D9488',
    watch:   'Royal Oak',
    text:    "Le suivi est top, on sent que c'est fait avec passion. La Royal Oak est arrivée dans un emballage soigné, les finitions sont impeccables. Mon entourage me demande souvent où je l'ai achetée.",
    stars:   5,
  },
  {
    name:    'Stéphanie Fontaine',
    loc:     'Sainte-Marie · La Réunion',
    initials:'SF',
    color:   '#DB2777',
    watch:   'Nautilus',
    text:    "Je cherchais quelque chose d'élégant à offrir pour un anniversaire. La Nautilus est magnifique, l'assemblage est impeccable. Mon frère l'a adorée. On recommandera à toute notre famille.",
    stars:   5,
  },
  {
    name:    'Mickaël Grondin',
    loc:     'Saint-André · La Réunion',
    initials:'MG',
    color:   '#2563EB',
    watch:   'GMT-Master',
    text:    "J'ai commandé la GMT Batman, le résultat est dingue. Le mouvement NH34 GMT fonctionne parfaitement, on peut vraiment gérer deux fuseaux. Rapport qualité/prix imbattable à La Réunion.",
    stars:   5,
  },
  {
    name:    'Aurelio Rivière',
    loc:     'Saint-Leu · La Réunion',
    initials:'AR',
    color:   '#D97706',
    watch:   'Day-Date',
    text:    "Troisième montre que je commande chez Seiko Mods. Chaque fois c'est le même niveau de qualité, la même attention aux détails. La Day-Date Or est la plus belle de ma collection.",
    stars:   5,
  },
]

function ReviewCard({ review, delay }) {
  const ref = useScrollReveal({ delay: `${delay}ms` })
  return (
    <Card ref={ref}>
      <QuoteMark>❝</QuoteMark>
      <Stars>
        {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
      </Stars>
      <QuoteText>{review.text}</QuoteText>
      <Divider />
      <Footer>
        <AuthorRow>
          <Avatar $color={review.color}>{review.initials}</Avatar>
          <AuthorInfo>
            <AuthorName>{review.name}</AuthorName>
            <AuthorLoc>{review.loc}</AuthorLoc>
          </AuthorInfo>
        </AuthorRow>
        <WatchBadge>{review.watch}</WatchBadge>
      </Footer>
    </Card>
  )
}

export default function Testimonials() {
  const hRef = useScrollReveal()
  const rRef = useScrollReveal({ delay: '300ms' })

  return (
    <Section id="avis">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>Avis clients</Eyebrow>
          <H2>Ce que disent nos clients</H2>
        </Header>

        <Grid>
          {reviews.map((r, i) => (
            <ReviewCard key={r.name} review={r} delay={i * 80} />
          ))}
        </Grid>

        <RatingBar ref={rRef}>
          <RatingNum>5.0</RatingNum>
          <RatingInfo>
            <RatingStars>{[1,2,3,4,5].map(i => <span key={i}>★</span>)}</RatingStars>
            <RatingCount>Basé sur 40+ commandes · La Réunion</RatingCount>
          </RatingInfo>
        </RatingBar>

        <SavGrid>
          <SavCard>
            <SavIcon>🛡️</SavIcon>
            <SavLabel>Garantie</SavLabel>
            <SavTitle>30 jours satisfait</SavTitle>
            <SavDesc>
              Chaque montre est testée avant livraison. En cas de défaut dans les 30 premiers jours, on répare ou remplace sans frais.
            </SavDesc>
          </SavCard>
          <SavCard>
            <SavIcon>🔧</SavIcon>
            <SavLabel>SAV</SavLabel>
            <SavTitle>Suivi après-vente</SavTitle>
            <SavDesc>
              Un problème après livraison ? Contactez-nous sur WhatsApp. On vous accompagne et on trouve une solution, toujours.
            </SavDesc>
          </SavCard>
          <SavCard>
            <SavIcon>📦</SavIcon>
            <SavLabel>Livraison</SavLabel>
            <SavTitle>Boîte de présentation offerte</SavTitle>
            <SavDesc>
              Chaque montre arrive dans sa boîte de présentation. Livraison gratuite à Saint-Denis et La Possession, 15 € partout à La Réunion.
            </SavDesc>
          </SavCard>
        </SavGrid>
      </Inner>
    </Section>
  )
}
