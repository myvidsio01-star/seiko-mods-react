import { useState, useRef } from 'react'
import styled from 'styled-components'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const Section = styled.section`
  padding: 120px 24px;
  background: #111110;
`
const Inner = styled.div`
  max-width: 680px;
  margin: 0 auto;
`
const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`
const Eyebrow = styled.p`
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: #CA8A04; margin-bottom: 16px;
`
const H2 = styled.h2`
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 400; color: #F5F5F4;
  margin-bottom: 16px;
`
const Sub = styled.p`
  font-size: 15px; font-weight: 300;
  color: #78716C; line-height: 1.6;
`
const Form = styled.form`
  display: flex; flex-direction: column; gap: 20px;
`
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`
const Field = styled.div`
  display: flex; flex-direction: column; gap: 8px;

  label {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #78716C;
  }

  input, select, textarea {
    background: #1C1917;
    border: 1px solid #292524;
    border-radius: 10px;
    padding: 14px 18px;
    color: #F5F5F4;
    font-family: 'Jost', sans-serif;
    font-size: 15px; font-weight: 300;
    outline: none;
    transition: border-color 250ms ease;
    resize: none;

    &::placeholder { color: #57534E; }
    &:focus { border-color: rgba(202,138,4,0.5); }
  }

  textarea { min-height: 130px; }
`
const Submit = styled.button`
  background: #CA8A04; color: #0C0A09;
  font-family: 'Jost', sans-serif;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.25em; text-transform: uppercase;
  padding: 16px 32px; border-radius: 9999px;
  border: none; cursor: pointer;
  transition: all 300ms ease;
  align-self: center; min-width: 200px;

  &:hover:not(:disabled) {
    background: #D97706;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(202,138,4,0.35);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const Msg = styled.div`
  text-align: center; padding: 16px; border-radius: 10px; font-size: 14px;

  ${p => p.$ok ? `
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    color: #4ade80;
  ` : `
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
  `}
`

const WEB3FORMS_KEY = 'bbc46495-c9a1-4eb3-9e75-91b11c5f6c82'

const models = ['Submariner', 'Panda Daytona', 'GMT-Master', 'Royal Oak', 'Nautilus', 'Santos']

export default function Contact() {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const hRef = useScrollReveal()
  const fRef = useScrollReveal({ delay: '150ms' })

  const send = async e => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const data = new FormData(formRef.current)
    data.append('access_key', WEB3FORMS_KEY)
    data.append('subject', `Nouvelle commande Seiko Mods — ${data.get('model')}`)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setStatus('ok')
        formRef.current.reset()
      } else {
        setStatus('err')
      }
    } catch {
      setStatus('err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section id="contact">
      <Inner>
        <Header ref={hRef}>
          <Eyebrow>Commander</Eyebrow>
          <H2>Votre montre unique</H2>
          <Sub>Décrivez votre projet — on vous répond par téléphone ou WhatsApp au <strong style={{ color: '#CA8A04' }}>06 92 42 15 19</strong></Sub>
        </Header>

        <Form ref={el => { formRef.current = el; fRef.current = el }} onSubmit={send}>
          <Row>
            <Field>
              <label htmlFor="name">Nom</label>
              <input id="name" name="name" type="text" placeholder="Mathis" required />
            </Field>
            <Field>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="mathis@mail.com" required />
            </Field>
          </Row>

          <Field>
            <label htmlFor="model">Modèle souhaité</label>
            <select id="model" name="model">
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          <Field>
            <label htmlFor="message">Votre projet</label>
            <textarea id="message" name="message" placeholder="Décrivez vos envies — cadran, bracelet, finitions…" required />
          </Field>

          {status === 'ok'  && <Msg $ok>Message envoyé ! On vous répond sous 24h.</Msg>}
          {status === 'err' && <Msg>Une erreur est survenue. Réessayez ou appelez le 06 92 42 15 19.</Msg>}

          <Submit type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Envoyer la demande'}
          </Submit>
        </Form>
      </Inner>
    </Section>
  )
}
