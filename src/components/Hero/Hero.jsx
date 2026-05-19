import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import styled, { keyframes } from 'styled-components'

function Particles({ count = 2500 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 28
      arr[i * 3 + 2] = (Math.random() - 0.5) * 28
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.022
    ref.current.rotation.x = clock.elapsedTime * 0.010
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#CA8A04" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Wrap = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: #0C0A09;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse at center, transparent 30%, #0C0A09 85%);
  pointer-events: none;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 760px;
  padding: 0 24px;
`

const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #CA8A04;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.8s ease 0.2s both;
`

const Title = styled.h1`
  font-size: clamp(42px, 7vw, 96px);
  font-weight: 400;
  color: #F5F5F4;
  line-height: 1.02;
  letter-spacing: 0.03em;
  animation: ${fadeUp} 0.9s ease 0.4s both;

  span { color: #CA8A04; font-style: italic; }
`

const Sub = styled.p`
  margin-top: 28px;
  font-size: clamp(13px, 1.5vw, 17px);
  font-weight: 300;
  color: #78716C;
  letter-spacing: 0.1em;
  line-height: 1.7;
  animation: ${fadeUp} 0.9s ease 0.6s both;
`

const CTARow = styled.div`
  margin-top: 44px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.9s ease 0.8s both;
`

const Btn = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 14px 36px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? `
    background: #CA8A04;
    color: #0C0A09;
    &:hover { background: #D97706; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(202,138,4,0.35); }
  ` : `
    background: transparent;
    color: #F5F5F4;
    border: 1px solid rgba(255,255,255,0.15);
    &:hover { border-color: rgba(202,138,4,0.5); color: #CA8A04; transform: translateY(-2px); }
  `}
`

const ScrollLine = keyframes`
  0%   { transform: scaleY(0); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: top; }
  51%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
`

const Scroll = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: ${fadeUp} 1s ease 1.2s both;

  span {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #57534E;
  }
`

const Line = styled.div`
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, #CA8A04, transparent);
  animation: ${ScrollLine} 1.8s ease-in-out infinite;
`

export default function Hero() {
  return (
    <Wrap id="hero">
      <CanvasWrap>
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <Particles />
        </Canvas>
      </CanvasWrap>

      <Vignette />

      <Content>
        <Eyebrow>Artisanat Horloger Premium</Eyebrow>
        <Title>Chaque montre<br />est une <span>œuvre</span></Title>
        <Sub>Submariner, Royal Oak, Daytona et plus — faits à la main.<br />Livré directement chez toi à La Réunion.</Sub>
        <CTARow>
          <Btn href="#catalogue" $primary>Voir les montres</Btn>
          <Btn href="#process">Notre processus</Btn>
        </CTARow>
      </Content>

      <Scroll>
        <Line />
        <span>Scroll</span>
      </Scroll>
    </Wrap>
  )
}
