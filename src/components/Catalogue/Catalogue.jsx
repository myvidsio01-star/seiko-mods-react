import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { WA_URL, waMsg, FB_URL } from '../../utils/contact'

const Section = styled.section`
  padding: 120px 24px;
  background: #111110;
  @media (max-width: 640px) { padding: 64px 20px; }
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
const CardBtns = styled.div`
  display: flex;
  gap: 8px;
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

const SoldOutBar = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(12,10,9,0.82);
  backdrop-filter: blur(8px);
  padding: 7px 14px;
  display: flex; align-items: center; justify-content: space-between;
`
const SoldOutLabel = styled.span`
  font-size: 9px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: #EF4444;
`
const SoldOutSub = styled.span`
  font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
  color: #78716C; font-weight: 300;
`

const PhotoBanner = styled.a`
  display: flex; align-items: center; gap: 18px;
  margin-top: 56px;
  padding: 24px 32px;
  background: rgba(202,138,4,0.05);
  border: 1px solid rgba(202,138,4,0.2);
  border-radius: 20px;
  text-decoration: none;
  transition: background 250ms ease, border-color 250ms ease;
  &:hover { background: rgba(202,138,4,0.1); border-color: rgba(202,138,4,0.4); }
  @media (max-width: 640px) { flex-direction: column; text-align: center; }
`
const PhotoBannerIcon = styled.span`
  font-size: 36px; flex-shrink: 0;
`
const PhotoBannerText = styled.div`
  display: flex; flex-direction: column; gap: 4px;
`
const PhotoBannerTitle = styled.span`
  font-size: 15px; font-weight: 400; color: #F5F5F4; line-height: 1.3;
  strong { color: #CA8A04; }
`
const PhotoBannerSub = styled.span`
  font-size: 12px; color: #78716C; font-weight: 300;
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
const BtnCardFb = styled.a`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: #0099FF;
  border: none;
  padding: 9px 18px;
  border-radius: 9999px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s ease;
  &:hover { background: #007acc; transform: translateY(-1px); }
`

const watches = [
  { name: 'Panda Daytona',  price: '235 €', stars: 5, tag: 'Best-seller', img: '/images/watch-seiko.png'      },
  { name: 'Submariner',     price: '230 €', stars: 5, tag: 'Signature',   img: '/images/watch-submariner.png' },
  { name: 'GMT-Master',     price: '235 €', stars: 4, tag: 'Populaire',   img: '/images/watch-gmt.png'        },
  { name: 'Royal Oak',      price: '240 €', stars: 5, tag: 'Exclusif',    img: '/images/watch-royaloak.png'   },
  { name: 'Nautilus',       price: '270 €', stars: 4, tag: 'Premium',     img: '/images/watch-nautilus.png'   },
  { name: 'Day-Date',       price: '240 €', stars: 5, tag: 'Prestige',    img: '/images/watch-daydate.png'    },
  { name: 'Datejust',       price: '220 €', stars: 4, tag: 'Classique',   img: '/images/renders/datejust-preview.png' },
  { name: 'Santos',         price: '240 €', stars: 4, tag: 'Exclusif',    img: '/images/watch-santos.png'     },
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
      <ImgWrap>
        <img src={watch.img} alt={watch.name} loading="lazy" />
        <Tag>{watch.tag}</Tag>
        <SoldOutBar>
          <SoldOutLabel>Rupture de stock</SoldOutLabel>
          <SoldOutSub>Sur commande</SoldOutSub>
        </SoldOutBar>
      </ImgWrap>
      <CardBody>
        <CardTitle>{watch.name}</CardTitle>
        <StarRow count={watch.stars} />
        <CardFooter>
          <div>
            <Price>{watch.price}</Price>
          </div>
          <CardBtns>
            <BtnCard
              href={waMsg(`Bonjour ! Je suis intéressé(e) par la ${watch.name}. Pouvez-vous me donner plus d'infos ?`)}
              target="_blank" rel="noopener noreferrer"
            >
              WhatsApp
            </BtnCard>
            <BtnCardFb href={FB_URL} target="_blank" rel="noopener noreferrer">
              Messenger
            </BtnCardFb>
          </CardBtns>
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

        <PhotoBanner
          href={waMsg("Bonjour ! J'ai une photo d'une montre que j'aimerais vous envoyer pour que vous la reproduisiez. Pouvez-vous m'aider ?")}
          target="_blank" rel="noopener noreferrer"
        >
          <PhotoBannerIcon>📸</PhotoBannerIcon>
          <PhotoBannerText>
            <PhotoBannerTitle>Vous avez vu une montre qui vous plaît ? <strong>Envoyez-nous la photo sur WhatsApp</strong></PhotoBannerTitle>
            <PhotoBannerSub>On peut reproduire presque n'importe quel modèle — même s'il ne figure pas dans notre catalogue.</PhotoBannerSub>
          </PhotoBannerText>
        </PhotoBanner>
      </Inner>
    </Section>
  )
}
