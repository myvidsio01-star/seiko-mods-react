import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  background: #111110;
  @media (max-width: 640px) { padding: 72px 20px; }
`

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 64px;
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
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 400;
  color: #F5F5F4;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #292524;
  border-radius: 20px;
  overflow: hidden;
`

const Item = styled.div`
  border-bottom: 1px solid #292524;
  &:last-child { border-bottom: none; }
`

const Question = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px;
  background: ${p => p.$open ? '#1C1917' : '#181614'};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 200ms ease;

  &:hover { background: #1C1917; }

  @media (max-width: 640px) { padding: 22px 20px; }
`

const QText = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${p => p.$open ? '#F5F5F4' : '#D4CFC9'};
  line-height: 1.4;
  transition: color 200ms ease;
`

const Icon = styled.span`
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid ${p => p.$open ? 'rgba(202,138,4,0.5)' : '#292524'};
  background: ${p => p.$open ? 'rgba(202,138,4,0.1)' : 'transparent'};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 200ms ease;
  color: ${p => p.$open ? '#CA8A04' : '#57534E'};
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
`

const Answer = styled.div`
  max-height: ${p => p.$open ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 350ms ease;
`

const AnswerInner = styled.div`
  padding: 0 32px 28px;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.75;
  color: #A8A29E;
  background: #1C1917;

  ol {
    padding-left: 20px;
    margin: 8px 0 0;
    li { margin-bottom: 6px; }
  }

  @media (max-width: 640px) { padding: 0 20px 22px; }
`

const faqs = [
  {
    q: "Est-ce que c'est légal ?",
    a: "Oui, entièrement. Les Seiko Mods sont des montres artisanales légalement assemblées à partir de composants aftermarket. Nous utilisons de vrais mouvements Seiko (NH35, NH36, NH34…) et des pièces de modification indépendantes. Ces montres ne portent aucune marque Rolex, Patek ou AP — ce sont des créations originales.",
  },
  {
    q: "Quelle est la qualité des mouvements ?",
    a: "On utilise exclusivement de vrais mouvements Seiko : le NH35A, le NH36A, le NH34 GMT… Ce sont les mêmes calibres japonais qui équipent des montres vendues plusieurs centaines d'euros en neuf. Fiables, robustes, avec une réserve de marche de 41 à 42 heures.",
  },
  {
    q: "Comment se passe une commande ?",
    a: (
      <ol>
        <li>Vous configurez votre montre directement sur le site</li>
        <li>Vous envoyez le récapitulatif sur WhatsApp</li>
        <li>On confirme ensemble les détails et le devis final</li>
        <li>Fabrication artisanale en 4 à 6 semaines</li>
        <li>Livraison à domicile ou remise en main propre à La Réunion</li>
      </ol>
    ),
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fait à la livraison ou lors de la remise en main propre. On accepte les virements bancaires et les espèces. Aucun acompte n'est demandé à la commande.",
  },
  {
    q: "Y a-t-il une garantie ?",
    a: "Chaque montre est testée et vérifiée avant livraison. En cas de problème dans les 30 premiers jours (défaut de mouvement, problème d'assemblage), on s'engage à réparer ou remplacer la pièce défectueuse sans frais supplémentaires.",
  },
  {
    q: "Livrez-vous en dehors de La Réunion ?",
    a: "Pour l'instant, nous livrons uniquement à La Réunion (974). La livraison est gratuite à Saint-Denis et La Possession. Pour toute autre commune de l'île, les frais de port sont de 15 €.",
  },
]

function FaqItem({ item, delay }) {
  const [open, setOpen] = useState(false)
  const ref = useScrollReveal({ delay: `${delay}ms` })

  return (
    <Item ref={ref}>
      <Question $open={open} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <QText $open={open}>{item.q}</QText>
        <Icon $open={open}>{open ? '−' : '+'}</Icon>
      </Question>
      <Answer $open={open}>
        <AnswerInner>{item.a}</AnswerInner>
      </Answer>
    </Item>
  )
}

export default function FAQ() {
  const hRef = useScrollReveal()

  return (
    <Section id="faq">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>Questions fréquentes</Eyebrow>
          <H2>Tout ce que vous voulez savoir</H2>
        </Header>

        <List>
          {faqs.map((f, i) => (
            <FaqItem key={i} item={f} delay={i * 60} />
          ))}
        </List>
      </Inner>
    </Section>
  )
}
