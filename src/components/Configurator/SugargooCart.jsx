import { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
`

/* ─── Auth ───────────────────────────────────────── */
const AuthWrap = styled.div`
  min-height: 100vh; background: #0C0A09;
  display: flex; align-items: center; justify-content: center;
  padding: 24px; font-family: 'Jost', sans-serif;
`
const AuthCard = styled.div`
  background: #1C1917; border: 1px solid #292524; border-radius: 20px;
  padding: 48px 40px; width: 100%; max-width: 400px;
  text-align: center; animation: ${fadeIn} 0.5s ease both;
  @media (max-width: 480px) { padding: 36px 24px; }
`
const AuthLogo = styled.div`
  font-family: 'Bodoni Moda', serif; font-size: 22px; font-weight: 400;
  color: #CA8A04; letter-spacing: 0.12em; margin-bottom: 8px;
`
const AuthSub = styled.p`
  font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #57534E; margin-bottom: 36px;
`
const AuthLabel = styled.label`
  display: block; font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: #78716C;
  margin-bottom: 10px; text-align: left;
`
const AuthInput = styled.input`
  width: 100%; background: #0C0A09;
  border: 1px solid ${p => p.$error ? '#EF4444' : '#292524'};
  border-radius: 10px; padding: 14px 16px;
  font-family: 'Jost', sans-serif; font-size: 15px; color: #F5F5F4;
  letter-spacing: 0.15em; outline: none;
  transition: border-color 0.25s ease; box-sizing: border-box;
  &:focus { border-color: ${p => p.$error ? '#EF4444' : 'rgba(202,138,4,0.6)'}; }
  &::placeholder { color: #44403C; letter-spacing: 0.1em; }
  animation: ${p => p.$shake ? shake : 'none'} 0.4s ease;
`
const AuthBtn = styled.button`
  width: 100%; margin-top: 20px; padding: 14px;
  background: #CA8A04; color: #0C0A09;
  font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase;
  border: none; border-radius: 10px; cursor: pointer;
  transition: background 0.25s ease, transform 0.15s ease;
  &:hover { background: #B07D04; }
  &:active { transform: scale(0.98); }
`
const AuthError = styled.p`
  margin-top: 14px; font-size: 13px; color: #EF4444; min-height: 18px;
`

const _k = ['K','U','L','L','S','9','7','4'].join('')

function AuthScreen({ onSuccess }) {
  const [code, setCode]   = useState('')
  const [error, setError] = useState('')
  const [doShake, setDoShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (code === _k) {
      sessionStorage.setItem('adminAuth', 'true')
      onSuccess()
    } else {
      setError('Code incorrect. Accès refusé.')
      setDoShake(true)
      setCode('')
      setTimeout(() => setDoShake(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <AuthWrap>
      <AuthCard>
        <AuthLogo>SEIKO MODS</AuthLogo>
        <AuthSub>Espace admin</AuthSub>
        <form onSubmit={handleSubmit}>
          <AuthLabel htmlFor="admin-code">Code d'accès</AuthLabel>
          <AuthInput ref={inputRef} id="admin-code" type="password"
            placeholder="••••••••" value={code}
            onChange={e => { setCode(e.target.value); setError('') }}
            $error={!!error} $shake={doShake} autoComplete="off" />
          <AuthBtn type="submit">Accéder</AuthBtn>
          <AuthError>{error}</AuthError>
        </form>
      </AuthCard>
    </AuthWrap>
  )
}

/* ─── Main page ──────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh; background: #0C0A09;
  font-family: 'Jost', sans-serif; color: #F5F5F4;
  padding: 40px 24px 80px; animation: ${fadeIn} 0.5s ease both;
  @media (max-width: 600px) { padding: 24px 16px 60px; }
`
const Inner = styled.div`
  max-width: 760px; margin: 0 auto;
`
const PageHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 40px; flex-wrap: wrap; gap: 12px;
`
const PageTitle = styled.h1`
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(22px, 3vw, 34px); font-weight: 400;
  color: #F5F5F4; letter-spacing: 0.04em;
`
const BtnRetour = styled.button`
  display: flex; align-items: center; gap: 8px;
  font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #CA8A04;
  border: 1px solid rgba(202,138,4,0.4); background: transparent;
  padding: 10px 20px; border-radius: 9999px; cursor: pointer;
  transition: all 0.25s ease;
  &:hover { background: rgba(202,138,4,0.08); }
`

/* Watch visual */
const WatchVisual = styled.div`
  display: flex; justify-content: center; margin-bottom: 40px;
`
const WatchImg = styled.img`
  width: 280px; height: 280px; object-fit: contain;
  border-radius: 20px;
  filter: drop-shadow(0 0 40px rgba(202,138,4,0.25)) drop-shadow(0 20px 60px rgba(0,0,0,0.7));
  @media (max-width: 480px) { width: 200px; height: 200px; }
`
const WatchImgPlaceholder = styled.div`
  width: 280px; height: 280px; border-radius: 20px;
  background: #1C1917; border: 1px solid #292524;
  display: flex; align-items: center; justify-content: center;
  color: #44403C; font-size: 14px; letter-spacing: 0.1em;
`

/* Price block */
const PriceBlock = styled.div`
  text-align: center; margin-bottom: 40px;
`
const PriceSub = styled.p`
  font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
  color: #57534E; margin-bottom: 6px;
`
const PriceVal = styled.p`
  font-family: 'Bodoni Moda', serif; font-size: 42px;
  color: #CA8A04; line-height: 1;
`
const PriceNote = styled.p`
  font-size: 11px; color: #44403C; margin-top: 6px;
`

/* Summary */
const SectionTitle = styled.h2`
  font-family: 'Bodoni Moda', serif; font-size: 16px; font-weight: 400;
  color: #78716C; letter-spacing: 0.15em; text-transform: uppercase;
  margin-bottom: 16px;
`
const SummaryGrid = styled.div`
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px;
`
const SummaryRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: #1C1917; border: 1px solid #292524; border-radius: 12px;
  padding: 16px 20px; gap: 16px; flex-wrap: wrap;
  transition: border-color 0.25s ease;
  &:hover { border-color: rgba(202,138,4,0.2); }
`
const RowLabel = styled.span`
  font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #57534E; display: block; margin-bottom: 4px;
`
const RowValue = styled.span`
  font-size: 15px; font-weight: 300; color: #F5F5F4;
`
const ColorDot = styled.span`
  display: inline-block; width: 12px; height: 12px;
  border-radius: 50%; background: ${p => p.$hex};
  border: 1px solid rgba(255,255,255,0.15);
  vertical-align: middle; margin-right: 6px;
`

/* Links section */
const LinksBox = styled.div`
  background: rgba(202,138,4,0.04);
  border: 1px solid rgba(202,138,4,0.2);
  border-radius: 14px; padding: 28px; margin-bottom: 32px;
`
const LinksTitle = styled.h3`
  font-family: 'Bodoni Moda', serif; font-size: 15px; font-weight: 400;
  color: #CA8A04; letter-spacing: 0.1em; margin-bottom: 8px;
`
const LinksDesc = styled.p`
  font-size: 13px; color: #78716C; font-weight: 300; line-height: 1.6;
  margin-bottom: 20px;
`
const LinkRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid #1C1917; gap: 12px;
  flex-wrap: wrap;
  &:last-child { border-bottom: none; padding-bottom: 0; }
`
const LinkLabel = styled.span`
  font-size: 12px; color: #A8A29E; font-weight: 300;
`
const BadgeMissing = styled.span`
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: #57534E; background: #292524; border-radius: 9999px; padding: 5px 12px;
`
const BtnSugargoo = styled.a`
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
  color: #0C0A09; background: #CA8A04; border: none; border-radius: 9999px;
  padding: 8px 16px; cursor: pointer; text-decoration: none;
  transition: background 0.25s ease;
  &:hover { background: #B07D04; }
`

function getSugargooUrl(lien) {
  return `https://www.sugargoo.com/index/item/index.html?tp=taobao&url=${encodeURIComponent(lien)}`
}

const PARTS_LABELS = [
  { key: 'boitier',       label: 'Boîtier' },
  { key: 'cadranCouleur', label: 'Couleur cadran' },
  { key: 'cadranStyle',   label: 'Style cadran' },
  { key: 'cadranModele',  label: 'Modèle cadran' },
  { key: 'mouvement',     label: 'Mouvement' },
  { key: 'bracelet',      label: 'Bracelet' },
]

export default function SugargooCart({ selection = {}, onRetour }) {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('adminAuth') === 'true')

  if (!auth) return <AuthScreen onSuccess={() => setAuth(true)} />

  const modele = selection.modele

  return (
    <Page>
      <Inner>

        <PageHeader>
          <PageTitle>Récapitulatif commande</PageTitle>
          {onRetour && <BtnRetour onClick={onRetour}>← Modifier</BtnRetour>}
        </PageHeader>

        {/* Photo */}
        <WatchVisual>
          {modele?.image
            ? <WatchImg src={modele.image} alt={modele.nom} loading="lazy" />
            : <WatchImgPlaceholder>Aucune photo</WatchImgPlaceholder>
          }
        </WatchVisual>

        {/* Prix */}
        {modele && (
          <PriceBlock>
            <PriceSub>Prix indicatif</PriceSub>
            <PriceVal>{modele.prix}</PriceVal>
            <PriceNote>Livraison incluse à La Réunion</PriceNote>
          </PriceBlock>
        )}

        {/* Sélection */}
        <SectionTitle>Sélection client</SectionTitle>
        <SummaryGrid>
          {modele && (
            <SummaryRow>
              <div>
                <RowLabel>Modèle</RowLabel>
                <RowValue>{modele.nom}</RowValue>
              </div>
            </SummaryRow>
          )}
          {PARTS_LABELS.map(({ key, label }) => {
            const val = selection[key]
            if (!val) return null
            return (
              <SummaryRow key={key}>
                <div>
                  <RowLabel>{label}</RowLabel>
                  <RowValue>
                    {val.hex && <ColorDot $hex={val.hex} />}
                    {val.nom}
                  </RowValue>
                </div>
                {key === 'mouvement' && val.desc && (
                  <span style={{ fontSize: 12, color: '#57534E', fontWeight: 300 }}>{val.desc}</span>
                )}
              </SummaryRow>
            )
          })}
        </SummaryGrid>

        {/* Liens Sugargoo */}
        <LinksBox>
          <LinksTitle>Liens Taobao / Sugargoo</LinksTitle>
          <LinksDesc>
            Les liens seront ajoutés dans <code style={{ color: '#CA8A04', background: '#1C1917', padding: '2px 6px', borderRadius: 4 }}>watchParts.json</code> une fois les références Taobao renseignées.
          </LinksDesc>
          {PARTS_LABELS.map(({ key, label }) => {
            const val = selection[key]
            if (!val) return null
            const lien = val.lienTaobao
            return (
              <LinkRow key={key}>
                <LinkLabel>{label} — {val.nom}</LinkLabel>
                {lien && lien !== 'LIEN_A_REMPLIR'
                  ? <BtnSugargoo href={getSugargooUrl(lien)} target="_blank" rel="noopener noreferrer">↗ Sugargoo</BtnSugargoo>
                  : <BadgeMissing>Lien manquant</BadgeMissing>
                }
              </LinkRow>
            )
          })}
        </LinksBox>

      </Inner>
    </Page>
  )
}
