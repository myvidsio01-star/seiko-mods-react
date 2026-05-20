import styled from 'styled-components'

const Foot = styled.footer`
  border-top: 1px solid #1C1917;
  padding: 48px 24px 36px;
  background: #0C0A09;
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`

const Logo = styled.div`
  font-family: 'Bodoni Moda', serif;
  font-size: 20px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #F5F5F4;
  span { color: #CA8A04; }
`

const Links = styled.div`
  display: flex; gap: 32px; flex-wrap: wrap;
`

const Link = styled.a`
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #57534E;
  cursor: pointer;
  transition: color 200ms ease;
  &:hover { color: #CA8A04; }
`

const Copy = styled.p`
  font-size: 12px;
  color: #44403C;
  letter-spacing: 0.05em;
`

const LegalBar = styled.div`
  max-width: 1100px;
  margin: 28px auto 0;
  padding-top: 24px;
  border-top: 1px solid #1C1917;
`

const LegalText = styled.p`
  font-size: 10px;
  color: #3D3935;
  line-height: 1.7;
  letter-spacing: 0.03em;

  strong { color: #57534E; font-weight: 500; }
`

export default function Footer() {
  return (
    <Foot>
      <Inner>
        <Logo>SEIKO <span>MODS</span></Logo>
        <Links>
          <Link href="#catalogue">Collection</Link>
          <Link href="#process">Processus</Link>
          <Link href="#configurateur">Commander</Link>
        </Links>
        <Copy>© 2026 Seiko Mods — Artisanat Horloger</Copy>
      </Inner>

      <LegalBar>
        <LegalText>
          <strong>Mentions légales &amp; transparence —</strong> Seiko Mods Réunion crée des montres artisanales personnalisées sur base de <strong>mouvements Seiko authentiques</strong> (NH35, NH36, NH38, NH34, etc.).
          Le boîtier, le cadran, le bracelet et les aiguilles sont des <strong>pièces de modification (« mods ») aftermarket indépendantes</strong>, sélectionnées et assemblées à la main — sans lien avec les marques d'origine.
          Ces montres ne sont pas des produits Rolex, Patek Philippe, Audemars Piguet, Cartier ou tout autre fabricant officiel, et Seiko Mods Réunion n'est affilié à aucune de ces marques.
          Les noms de modèles (Submariner, Nautilus, etc.) servent uniquement à décrire le style inspiré de la pièce.
        </LegalText>
      </LegalBar>
    </Foot>
  )
}
