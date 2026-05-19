import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const fadeOut = keyframes`
  to { opacity: 0; pointer-events: none; }
`

const Wrap = styled.div`
  position: fixed; inset: 0; z-index: 9000;
  background: #0C0A09;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 32px;
  animation: ${p => p.$done ? fadeOut : 'none'} 0.8s ease forwards;
`

const Logo = styled.div`
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(28px, 5vw, 48px);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #F5F5F4;
`

const Gold = styled.span`color: #CA8A04;`

const Bar = styled.div`
  width: clamp(160px, 30vw, 280px);
  height: 1px;
  background: #292524;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; height: 100%;
    width: ${p => p.$pct}%;
    background: linear-gradient(90deg, #CA8A04, #D97706);
    transition: width 0.1s linear;
  }
`

const Num = styled.div`
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: #78716C;
`

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let v = 0
    const id = setInterval(() => {
      v += Math.random() * 18
      if (v >= 100) {
        v = 100
        clearInterval(id)
        setTimeout(() => {
          setDone(true)
          setTimeout(onDone, 800)
        }, 300)
      }
      setPct(Math.floor(v))
    }, 80)
    return () => clearInterval(id)
  }, [onDone])

  return (
    <Wrap $done={done}>
      <Logo>SEIKO <Gold>MODS</Gold></Logo>
      <Bar $pct={pct} />
      <Num>{String(pct).padStart(3, '0')} %</Num>
    </Wrap>
  )
}
