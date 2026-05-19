import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  background: #111110;
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
  overflow: hidden;
  cursor: pointer;
  transition: transform 400ms ease, border-color 400ms ease, box-shadow 400ms ease;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(202,138,4,0.4);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(202,138,4,0.08);
  }
`

const ImgWrap = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #141412;

  img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 600ms ease;
    filter: ${p => p.$filter || 'none'};
  }

  ${Card}:hover & img { transform: scale(1.06); }
`

const Tag = styled.span`
  position: absolute;
  top: 16px; left: 16px;
  background: rgba(12,10,9,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(202,138,4,0.3);
  border-radius: 9999px;
  padding: 5px 14px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #CA8A04;
`

const CardBody = styled.div`
  padding: 24px 24px 28px;
`

const CardTitle = styled.h3`
  font-family: 'Bodoni Moda', serif;
  font-size: 20px;
  font-weight: 400;
  color: #F5F5F4;
  margin-bottom: 8px;
`

const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`

const PopLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #57534E;
`

const Stars = styled.div`
  display: flex;
  gap: 3px;

  span {
    font-size: 13px;
    color: #CA8A04;
    opacity: 0.25;

    &.active { opacity: 1; }
  }
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Price = styled.span`
  font-family: 'Bodoni Moda', serif;
  font-size: 20px;
  color: #F5F5F4;
`

const PriceNote = styled.span`
  display: block;
  font-size: 10px;
  color: #57534E;
  letter-spacing: 0.1em;
  margin-top: 2px;
`

const BtnCard = styled.a`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: #25D366;
  border: none;
  padding: 9px 18px;
  border-radius: 9999px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover { background: #1ebe5d; transform: translateY(-1px); }
`

const watches = [
  { name: 'Panda Daytona',  price: '280–350 €', stars: 5, tag: 'Best-seller', img: '/images/watch-seiko.png',      filter: 'none' },
  { name: 'Submariner',     price: '250–320 €', stars: 5, tag: 'Signature',   img: '/images/watch-submariner.jpg', filter: 'none' },
  { name: 'GMT-Master',     price: '280–380 €', stars: 4, tag: 'Populaire',   img: '/images/watch-gmt.jpg',        filter: 'none' },
  { name: 'Royal Oak',      price: '300–400 €', stars: 4, tag: 'Exclusif',    img: '/images/watch-royaloak.png',   filter: 'none' },
  { name: 'Nautilus',       price: '320–420 €', stars: 4, tag: 'Premium',     img: '/images/watch-nautilus.png',   filter: 'none' },
  { name: 'Santos',         price: '300–400 €', stars: 4, tag: 'Exclusif',    img: '/images/watch-santos.png',     filter: 'none' },
]

function StarRow({ count }) {
  return (
    <StarsRow>
      <PopLabel>Popularité</PopLabel>
      <Stars>
        {[1,2,3,4,5].map(i => (
          <span key={i} className={i <= count ? 'active' : ''}>★</span>
        ))}
      </Stars>
    </StarsRow>
  )
}

function WatchCard({ watch, delay }) {
  const ref = useScrollReveal({ delay: `${delay}ms` })
  return (
    <Card ref={ref}>
      <ImgWrap $filter={watch.filter}>
        <img src={watch.img} alt={watch.name} loading="lazy" />
        <Tag>{watch.tag}</Tag>
      </ImgWrap>
      <CardBody>
        <CardTitle>{watch.name}</CardTitle>
        <StarRow count={watch.stars} />
        <CardFooter>
          <div>
            <Price>{watch.price}</Price>
            <PriceNote>Prix indicatif</PriceNote>
          </div>
          <BtnCard
            href={`https://wa.me/262692421519?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par la ${watch.name}. Pouvez-vous me donner plus d'infos ?`)}`}
            target="_blank" rel="noopener noreferrer"
          >
            WhatsApp
          </BtnCard>
        </CardFooter>
      </CardBody>
    </Card>
  )
}

export default function Catalogue() {
  const hRef = useScrollReveal()
  return (
    <Section id="catalogue">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>Collection</Eyebrow>
          <H2>Nos montres</H2>
        </Header>
        <Grid>
          {watches.map((w, i) => <WatchCard key={w.name} watch={w} delay={i * 80} />)}
        </Grid>
      </Inner>
    </Section>
  )
}
