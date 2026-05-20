import { useState, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import watchParts from '../../data/watchParts.json'

const TABS = [
  { id: 'modele',    label: 'Modèle' },
  { id: 'boitier',  label: 'Boîtier' },
  { id: 'cadran',   label: 'Cadran' },
  { id: 'mouvement',label: 'Mouvement' },
  { id: 'aiguilles',label: 'Aiguilles' },
  { id: 'bracelet', label: 'Bracelet' },
]

const CADRAN_CATS = [
  { id: 'modeles',  label: 'Modèles de cadran' },
  { id: 'couleurs', label: 'Couleur' },
  { id: 'styles',   label: 'Style' },
]

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

const Section = styled.section`
  padding: 120px 24px;
  background: #0C0A09;
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
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: #CA8A04; margin-bottom: 16px;
`
const H2 = styled.h2`
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 400; color: #F5F5F4; margin-bottom: 16px;
`
const Subtitle = styled.p`
  font-weight: 300; font-size: 16px; color: #78716C;
  max-width: 480px; margin: 0 auto;
`
const Layout = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 48px;
  align-items: start;
  @media (max-width: 960px) { grid-template-columns: 1fr; }
`

/* ── LEFT COLUMN ── */
const WatchPreview = styled.div`
  position: sticky;
  top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  @media (max-width: 960px) { position: static; }
`
const ImageWrap = styled.div`
  position: relative;
  width: 100%; max-width: 340px;
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  background: #242220;
  border-radius: 24px;
  border: 1px solid #3D3A36;
  overflow: hidden;
  isolation: isolate;
  @media (max-width: 960px) { max-width: 260px; margin: 0 auto; }
`
const CaseColorOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 40%, ${p => p.$hex}66 60%, ${p => p.$hex}99 86%);
  pointer-events: none;
`
const DialColorOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 48%, ${p => p.$hex}EE 0%, ${p => p.$hex}99 28%, transparent 52%);
  pointer-events: none;
`
const WatchImg = styled.img`
  width: 85%; height: 85%;
  object-fit: contain;
  filter: drop-shadow(0 8px 32px rgba(202,138,4,0.25)) drop-shadow(0 2px 8px rgba(0,0,0,0.8));
  animation: ${fadeIn} 300ms ease;
`
const WatchPlaceholder = styled.div`
  width: 85%; height: 85%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  color: #A8A29E; font-size: 13px; font-weight: 300;
  text-align: center;
`
const PriceBadge = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: #1C1917; border: 1px solid #292524;
  border-radius: 16px; padding: 20px 36px;
  width: 100%; max-width: 340px;
  @media (max-width: 960px) { max-width: 260px; }
`
const PriceLabel = styled.span`
  font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
  text-transform: uppercase; color: #57534E;
`
const PriceValue = styled.span`
  font-family: 'Bodoni Moda', serif;
  font-size: 32px; font-weight: 400; color: #CA8A04;
`
const PriceNote = styled.span`
  font-size: 11px; color: #44403C;
`
const AliBadge = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: rgba(234,88,12,0.1);
  border: 1px solid rgba(234,88,12,0.3);
  border-radius: 10px; padding: 10px 16px;
  width: 100%; max-width: 340px;
  font-size: 12px; color: #FB923C; font-weight: 300; line-height: 1.5;
  @media (max-width: 960px) { max-width: 260px; }
`
const SummaryList = styled.div`
  width: 100%; max-width: 340px;
  display: flex; flex-direction: column; gap: 6px;
  @media (max-width: 960px) { max-width: 260px; }
`
const SummaryItem = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px;
  background: ${p => p.$done ? 'rgba(202,138,4,0.06)' : '#111110'};
  border: 1px solid ${p => p.$done ? 'rgba(202,138,4,0.2)' : '#1C1917'};
  border-radius: 8px;
  transition: all 200ms ease;
`
const SummaryKey = styled.span`
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: #57534E;
`
const SummaryVal = styled.span`
  font-size: 12px; color: ${p => p.$done ? '#CA8A04' : '#44403C'};
  font-weight: 300; max-width: 160px; text-align: right; line-height: 1.3;
`
const CommanderBtn = styled.button`
  width: 100%; max-width: 340px;
  font-size: 12px; font-weight: 500; letter-spacing: 0.2em;
  text-transform: uppercase;
  background: #CA8A04; color: #0C0A09;
  border: none; border-radius: 9999px; padding: 16px 32px;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
  &:hover:not(:disabled) {
    background: #D97706; transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(202,138,4,0.35);
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
  @media (max-width: 960px) { max-width: 260px; }
`
const DeliverySection = styled.div`
  width: 100%; max-width: 340px;
  display: flex; flex-direction: column; gap: 8px;
  @media (max-width: 960px) { max-width: 260px; }
`
const DeliveryTitle = styled.p`
  font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
  text-transform: uppercase; color: #57534E; margin-bottom: 2px;
`
const DeliveryOpt = styled.button`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px;
  background: ${p => p.$sel ? 'rgba(202,138,4,0.08)' : '#1C1917'};
  border: 1px solid ${p => p.$sel ? '#CA8A04' : '#292524'};
  border-radius: 10px; cursor: pointer; width: 100%; text-align: left;
  transition: border-color 200ms, background 200ms;
  &:hover { border-color: rgba(202,138,4,0.4); }
`
const DelivOptLeft = styled.span`
  display: flex; flex-direction: column; gap: 2px;
`
const DelivOptName = styled.span`
  font-size: 12px; color: #F5F5F4; font-weight: 400;
`
const DelivOptSub = styled.span`
  font-size: 10px; color: #78716C; font-weight: 300;
`
const DelivOptPrice = styled.span`
  font-family: 'Bodoni Moda', serif;
  font-size: 14px; color: ${p => p.$sel ? '#CA8A04' : '#78716C'};
  white-space: nowrap;
`

/* ── RIGHT COLUMN ── */
const SelectionPanel = styled.div`
  display: flex; flex-direction: column;
`
const TabsRow = styled.div`
  display: flex;
  border-bottom: 1px solid #292524;
  overflow-x: auto; scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`
const Tab = styled.button`
  font-size: 12px; font-weight: 400; letter-spacing: 0.08em;
  color: ${p => p.$active ? '#F5F5F4' : '#57534E'};
  padding: 14px 18px;
  border: none; border-bottom: 2px solid ${p => p.$active ? '#CA8A04' : 'transparent'};
  background: transparent; cursor: pointer; white-space: nowrap;
  margin-bottom: -1px;
  display: flex; align-items: center; gap: 6px;
  transition: color 200ms ease, border-color 200ms ease;
  &:hover { color: #A8A29E; }
`

const TabDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #CA8A04;
  flex-shrink: 0;
  opacity: 0.9;
`
const TabContent = styled.div`
  padding: 32px 0 0;
  display: flex; flex-direction: column; gap: 32px;
`
const CatSection = styled.div`
  display: flex; flex-direction: column; gap: 14px;
`
const CatLabel = styled.p`
  font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
  text-transform: uppercase; color: #57534E;
`
const EmptyState = styled.div`
  padding: 32px 20px; text-align: center;
  color: #44403C; font-size: 13px; font-weight: 300;
  background: #111110; border: 1px solid #1C1917; border-radius: 12px;
`

/* Color swatches */
const SwatchGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 14px; align-items: center;
`
const Swatch = styled.button`
  position: relative;
  width: 46px; height: 46px; border-radius: 50%;
  background: ${p => p.$hex};
  border: 3px solid ${p => p.$selected ? '#CA8A04' : 'transparent'};
  box-shadow: ${p => p.$selected
    ? '0 0 0 1px #CA8A04, inset 0 0 0 1px rgba(0,0,0,0.2)'
    : '0 0 0 1px #292524, inset 0 0 0 1px rgba(0,0,0,0.2)'};
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
  &:hover { transform: scale(1.12); box-shadow: 0 0 0 1px rgba(202,138,4,0.5), inset 0 0 0 1px rgba(0,0,0,0.2); }
`
const SwatchTooltip = styled.span`
  position: absolute; bottom: -22px; left: 50%;
  transform: translateX(-50%);
  font-size: 9px; color: #78716C; white-space: nowrap;
  pointer-events: none;
`

/* Text cards (styles, modèles de cadran, bracelets) */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
`
const TextCard = styled.button`
  padding: 14px 12px;
  background: ${p => p.$selected ? 'rgba(202,138,4,0.08)' : '#1C1917'};
  border: 1px solid ${p => p.$selected ? '#CA8A04' : '#292524'};
  border-radius: 10px; cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'}; text-align: center;
  opacity: ${p => p.$disabled ? 0.38 : 1};
  transition: border-color 200ms ease, background 200ms ease, transform 200ms ease, opacity 200ms ease;
  &:hover:not([disabled]) {
    border-color: ${p => p.$selected ? '#CA8A04' : 'rgba(202,138,4,0.35)'};
    transform: ${p => p.$disabled ? 'none' : 'translateY(-2px)'};
  }
`
const CardName = styled.span`
  font-size: 12px; font-weight: 400; color: #F5F5F4;
  display: block; line-height: 1.35;
`
const CardSub = styled.span`
  font-size: 10px; color: #78716C; font-weight: 300;
  display: block; margin-top: 4px; line-height: 1.3;
`

/* Model cards (with image) */
const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`
const ModelCard = styled.button`
  padding: 16px 12px;
  background: ${p => p.$selected ? 'rgba(202,138,4,0.08)' : '#1C1917'};
  border: 1px solid ${p => p.$selected ? '#CA8A04' : '#292524'};
  border-radius: 12px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
  &:hover {
    border-color: ${p => p.$selected ? '#CA8A04' : 'rgba(202,138,4,0.35)'};
    transform: translateY(-2px);
  }
`
const ModelThumb = styled.div`
  width: 64px; height: 64px;
  border-radius: 8px; overflow: hidden;
  background: #111110;
  display: flex; align-items: center; justify-content: center;
`
const ModelThumbImg = styled.img`
  width: 100%; height: 100%; object-fit: contain;
`
const ModelName = styled.span`
  font-size: 12px; font-weight: 400; color: #F5F5F4;
  text-align: center; line-height: 1.3;
`
const ModelPrix = styled.span`
  font-family: 'Bodoni Moda', serif;
  font-size: 13px; color: #CA8A04;
`
const RecoBadge = styled.span`
  font-size: 9px; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase; color: #0C0A09;
  background: #CA8A04; border-radius: 4px; padding: 2px 6px;
`
const AlliChinaBuyBadge = styled.span`
  font-size: 9px; color: #FB923C; margin-top: 2px;
`

/* Boîtier swatch avec nom */
const BoitierGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 16px;
`
const BoitierItem = styled.button`
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer; background: none; border: none;
`
const BoitierSwatch = styled.div`
  width: 52px; height: 52px; border-radius: 50%;
  background: ${p => p.$hex};
  border: 3px solid ${p => p.$selected ? '#CA8A04' : 'transparent'};
  box-shadow: ${p => p.$selected
    ? '0 0 0 1px #CA8A04, inset 0 0 0 1px rgba(0,0,0,0.2)'
    : '0 0 0 1px #292524, inset 0 0 0 1px rgba(0,0,0,0.2)'};
  transition: transform 200ms ease, box-shadow 200ms ease;
  ${BoitierItem}:hover & {
    transform: scale(1.1);
    box-shadow: 0 0 0 1px rgba(202,138,4,0.5), inset 0 0 0 1px rgba(0,0,0,0.2);
  }
`
const BoitierName = styled.span`
  font-size: 10px; color: ${p => p.$selected ? '#CA8A04' : '#78716C'};
  font-weight: 300; text-align: center; max-width: 60px; line-height: 1.3;
  transition: color 200ms ease;
`

function ImgWithFallback({ src, alt, style }) {
  const [err, setErr] = useState(false)
  if (err || !src) return (
    <WatchPlaceholder>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="1">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Sélectionnez un modèle
    </WatchPlaceholder>
  )
  return <WatchImg src={src} alt={alt} style={style} onError={() => setErr(true)} />
}

export default function Configurator({ onCommander }) {
  const [tab, setTab] = useState('modele')
  const [imgKey, setImgKey] = useState(0)
  const [livraison, setLivraison] = useState(null)
  const [sel, setSel] = useState({
    modele:        null,
    boitier:       null,
    cadranModele:  null,
    cadranCouleur: null,
    cadranStyle:   null,
    mouvement:     null,
    aiguilles:     null,
    bracelet:      null,
  })

  const set = useCallback((key, val, advance) => {
    setSel(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'modele') {
        next.boitier       = null
        next.cadranModele  = null
        next.cadranCouleur = null
        next.cadranStyle   = null
        next.mouvement     = null
        next.aiguilles     = null
        next.bracelet      = null
        if (val) setImgKey(k => k + 1)
      }
      if (key === 'mouvement') {
        const aig = prev.aiguilles
        if (aig?.mouvements && !aig.mouvements.includes(val?.id)) {
          next.aiguilles = null
        }
      }
      return next
    })
    if (key === 'modele') setLivraison(null)
    if (advance) setTab(advance)
  }, [])

  const mvtDefs = watchParts.mouvements
  const modeles = watchParts.modeles
  const modele  = sel.modele

  const compatMvts = modele
    ? modele.mouvements.map(id => ({ id, ...mvtDefs[id] })).filter(Boolean)
    : []

  const isComplete = sel.modele && sel.boitier && sel.cadranCouleur && sel.cadranStyle && sel.mouvement && sel.aiguilles && sel.bracelet && livraison

  function buildWaUrl() {
    const livraisonText = livraison === 'remise'
      ? 'Remise en main propre (Saint-Denis ou La Possession)'
      : 'Envoi postal (+15 €)'
    const lines = [
      'Bonjour ! Je viens de configurer ma montre sur votre site 👇',
      '',
      `• Modèle : ${sel.modele?.nom}`,
      `• Boîtier : ${sel.boitier?.nom}`,
      sel.cadranModele ? `• Cadran : ${sel.cadranCouleur?.nom} · ${sel.cadranStyle?.nom} · ${sel.cadranModele?.nom}` : `• Cadran : ${sel.cadranCouleur?.nom} · ${sel.cadranStyle?.nom}`,
      `• Mouvement : ${sel.mouvement?.nom}`,
      `• Aiguilles : ${sel.aiguilles?.nom}`,
      `• Bracelet : ${sel.bracelet?.nom}`,
      `• Livraison : ${livraisonText}`,
      '',
      'Je suis intéressé(e), pouvez-vous me donner plus d\'infos ? 🙏',
    ]
    return `https://wa.me/262692421519?text=${encodeURIComponent(lines.join('\n'))}`
  }

  const tabDone = {
    modele:    !!sel.modele,
    boitier:   !!sel.boitier,
    cadran:    !!(sel.cadranCouleur && sel.cadranStyle),
    mouvement: !!sel.mouvement,
    aiguilles: !!sel.aiguilles,
    bracelet:  !!sel.bracelet,
  }

  const TAB_ORDER = ['modele', 'boitier', 'cadran', 'mouvement', 'aiguilles', 'bracelet']
  function nextTab(id) {
    const idx = TAB_ORDER.indexOf(id)
    return idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null
  }

  function cadranSummary() {
    const parts = [sel.cadranCouleur?.nom, sel.cadranStyle?.nom, sel.cadranModele?.nom].filter(Boolean)
    return parts.length ? parts.join(' · ') : null
  }

  function renderTab() {
    switch (tab) {

      case 'modele':
        return (
          <TabContent>
            <CatSection>
              <CatLabel>Choisissez votre style de montre</CatLabel>
              <ModelGrid>
                {modeles.map(m => (
                  <ModelCard key={m.id} $selected={sel.modele?.id === m.id} onClick={() => set('modele', m, 'boitier')}>
                    <ModelThumb>
                      <ModelThumbImg src={m.image} alt={m.nom} onError={e => e.target.style.opacity = 0.3} />
                    </ModelThumb>
                    <ModelName>{m.nom}</ModelName>
                    <ModelPrix>{m.prix}</ModelPrix>
                  </ModelCard>
                ))}
              </ModelGrid>
            </CatSection>
          </TabContent>
        )

      case 'boitier':
        return (
          <TabContent>
            {!modele ? (
              <EmptyState>Sélectionnez d'abord un modèle.</EmptyState>
            ) : (
              <CatSection>
                <CatLabel>Couleur & finition du boîtier</CatLabel>
                <BoitierGrid>
                  {modele.boitiers.map(b => (
                    <BoitierItem key={b.id} onClick={() => set('boitier', b, 'cadran')}>
                      <BoitierSwatch $hex={b.hex} $selected={sel.boitier?.id === b.id} />
                      <BoitierName $selected={sel.boitier?.id === b.id}>{b.nom}</BoitierName>
                    </BoitierItem>
                  ))}
                </BoitierGrid>
              </CatSection>
            )}
          </TabContent>
        )

      case 'cadran':
        return (
          <TabContent>
            {!modele ? (
              <EmptyState>Sélectionnez d'abord un modèle.</EmptyState>
            ) : (
              <>
                {modele.cadrans.modeles.length > 0 && (
                  <CatSection>
                    <CatLabel>Modèle de cadran <span style={{fontSize:'9px',color:'#44403C',letterSpacing:'0.05em',textTransform:'none',fontWeight:300}}>— optionnel</span></CatLabel>
                    <CardsGrid>
                      {modele.cadrans.modeles.map(c => (
                        <TextCard key={c.id} $selected={sel.cadranModele?.id === c.id} onClick={() => set('cadranModele', c)}>
                          <CardName>{c.nom}</CardName>
                        </TextCard>
                      ))}
                    </CardsGrid>
                  </CatSection>
                )}

                <CatSection>
                  <CatLabel>Couleur du cadran</CatLabel>
                  <SwatchGrid>
                    {modele.cadrans.couleurs.map(c => (
                      <Swatch key={c.id} $hex={c.hex} $selected={sel.cadranCouleur?.id === c.id}
                        onClick={() => set('cadranCouleur', c, sel.cadranStyle ? 'mouvement' : null)}>
                        <SwatchTooltip>{c.nom}</SwatchTooltip>
                      </Swatch>
                    ))}
                  </SwatchGrid>
                </CatSection>

                <CatSection>
                  <CatLabel>Style du cadran</CatLabel>
                  <CardsGrid>
                    {modele.cadrans.styles.map(s => (
                      <TextCard key={s.id} $selected={sel.cadranStyle?.id === s.id}
                        onClick={() => set('cadranStyle', s, sel.cadranCouleur ? 'mouvement' : null)}>
                        <CardName>{s.nom}</CardName>
                      </TextCard>
                    ))}
                  </CardsGrid>
                </CatSection>
              </>
            )}
          </TabContent>
        )

      case 'mouvement':
        return (
          <TabContent>
            {!modele ? (
              <EmptyState>Sélectionnez d'abord un modèle.</EmptyState>
            ) : (
              <CatSection>
                <CatLabel>Mouvements compatibles avec {modele.nom}</CatLabel>
                <CardsGrid>
                  {compatMvts.map(m => (
                    <TextCard key={m.id} $selected={sel.mouvement?.id === m.id} onClick={() => set('mouvement', m, 'aiguilles')}>
                      <CardName style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {m.nom}
                        {m.id === modele.mouvementRecommande && <RecoBadge>Recommandé</RecoBadge>}
                      </CardName>
                      <CardSub>{m.desc}</CardSub>
                    </TextCard>
                  ))}
                </CardsGrid>
              </CatSection>
            )}
          </TabContent>
        )

      case 'aiguilles':
        return (
          <TabContent>
            {!modele ? (
              <EmptyState>Sélectionnez d'abord un modèle.</EmptyState>
            ) : (
              <CatSection>
                <CatLabel>Style d'aiguilles</CatLabel>
                <CardsGrid>
                  {modele.aiguilles.map(a => {
                    const compatible = !a.mouvements || a.mouvements.includes(sel.mouvement?.id)
                    return (
                      <TextCard
                        key={a.id}
                        $selected={sel.aiguilles?.id === a.id}
                        $disabled={!compatible}
                        disabled={!compatible}
                        onClick={compatible ? () => set('aiguilles', a, 'bracelet') : undefined}
                      >
                        <CardName>{a.nom}</CardName>
                        {!compatible && <CardSub>Requiert NH34</CardSub>}
                      </TextCard>
                    )
                  })}
                </CardsGrid>
              </CatSection>
            )}
          </TabContent>
        )

      case 'bracelet':
        return (
          <TabContent>
            {!modele ? (
              <EmptyState>Sélectionnez d'abord un modèle.</EmptyState>
            ) : (
              <CatSection>
                <CatLabel>Bracelet</CatLabel>
                <CardsGrid>
                  {modele.bracelets.map(b => (
                    <TextCard key={b.id} $selected={sel.bracelet?.id === b.id} onClick={() => set('bracelet', b)}>
                      <CardName>{b.nom}</CardName>
                    </TextCard>
                  ))}
                </CardsGrid>
              </CatSection>
            )}
          </TabContent>
        )

      default: return null
    }
  }

  const summaryRows = [
    { label: 'Modèle',    val: sel.modele?.nom },
    { label: 'Boîtier',   val: sel.boitier?.nom },
    { label: 'Cadran',    val: cadranSummary() },
    { label: 'Mouvement', val: sel.mouvement?.nom },
    { label: 'Aiguilles', val: sel.aiguilles?.nom },
    { label: 'Bracelet',  val: sel.bracelet?.nom },
    { label: 'Livraison', val: livraison === 'remise' ? 'Remise main propre' : livraison === 'envoi' ? 'Envoi postal +15 €' : null },
  ]

  return (
    <Section id="configurateur">
      <Inner>
        <Header>
          <Eyebrow>Configurateur</Eyebrow>
          <H2>Construisez votre montre</H2>
          <Subtitle>Choisissez chaque pièce et commandez sur mesure.</Subtitle>
        </Header>

        <Layout>
          <WatchPreview>
            <ImageWrap>
              <ImgWithFallback key={imgKey} src={modele?.image} alt={modele?.nom} />
              {sel.boitier && <CaseColorOverlay $hex={sel.boitier.hex} />}
              {sel.cadranCouleur && <DialColorOverlay $hex={sel.cadranCouleur.hex} />}
            </ImageWrap>

            {modele && (
              <PriceBadge>
                <PriceLabel>Prix indicatif</PriceLabel>
                <PriceValue>{modele.prix}</PriceValue>
                {livraison === 'envoi' && <PriceNote style={{color:'#CA8A04'}}>+ 15 € d'envoi</PriceNote>}
              </PriceBadge>
            )}

            {modele && (
              <DeliverySection>
                <DeliveryTitle>Mode de remise</DeliveryTitle>
                <DeliveryOpt $sel={livraison === 'remise'} onClick={() => setLivraison('remise')}>
                  <DelivOptLeft>
                    <DelivOptName>Remise en main propre</DelivOptName>
                    <DelivOptSub>Saint-Denis · La Possession</DelivOptSub>
                  </DelivOptLeft>
                  <DelivOptPrice $sel={livraison === 'remise'}>Gratuit</DelivOptPrice>
                </DeliveryOpt>
                <DeliveryOpt $sel={livraison === 'envoi'} onClick={() => setLivraison('envoi')}>
                  <DelivOptLeft>
                    <DelivOptName>Envoi postal</DelivOptName>
                    <DelivOptSub>Livraison à domicile · Réunion</DelivOptSub>
                  </DelivOptLeft>
                  <DelivOptPrice $sel={livraison === 'envoi'}>+15 €</DelivOptPrice>
                </DeliveryOpt>
              </DeliverySection>
            )}

            <SummaryList>
              {summaryRows.map(r => (
                <SummaryItem key={r.label} $done={!!r.val}>
                  <SummaryKey>{r.label}</SummaryKey>
                  <SummaryVal $done={!!r.val}>{r.val || '—'}</SummaryVal>
                </SummaryItem>
              ))}
            </SummaryList>

            <CommanderBtn
              as={isComplete ? 'a' : 'button'}
              href={isComplete ? buildWaUrl() : undefined}
              target={isComplete ? '_blank' : undefined}
              rel={isComplete ? 'noopener noreferrer' : undefined}
              disabled={!isComplete}
              style={isComplete ? { background: '#25D366', textDecoration: 'none' } : {}}
            >
              {isComplete ? '💬 Envoyer sur WhatsApp' : 'Complétez la sélection'}
            </CommanderBtn>
          </WatchPreview>

          <SelectionPanel>
            <TabsRow>
              {TABS.map(t => (
                <Tab key={t.id} $active={tab === t.id} onClick={() => setTab(t.id)}>
                  {t.label}
                  {tabDone[t.id] && <TabDot />}
                </Tab>
              ))}
            </TabsRow>
            {renderTab()}
          </SelectionPanel>
        </Layout>
      </Inner>
    </Section>
  )
}
