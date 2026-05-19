import { useRef, useEffect } from 'react'
import { useGLTF, Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

useGLTF.preload('/images/watch.glb')

export default function WatchModel() {
  const groupRef = useRef()
  const { scene } = useGLTF('/images/watch.glb')

  useEffect(() => {
    if (!groupRef.current) return

    // Start: far, angled
    groupRef.current.position.z = -12
    groupRef.current.rotation.set(0.45, -1.3, 0.1)

    const tl = gsap.timeline({ delay: 0.3 })

    // Fly in rotating
    tl.to(groupRef.current.position, { z: 0, duration: 2.2, ease: 'power3.out' })
    tl.to(groupRef.current.rotation, { x: 0, y: 0, z: 0, duration: 2.2, ease: 'power2.out' }, '<')

    // Showcase depth
    tl.to(groupRef.current.rotation, { y: 0.45, duration: 0.7, ease: 'power1.inOut' }, '+=0.2')
    tl.to(groupRef.current.rotation, { y: -0.2, duration: 0.6, ease: 'power1.inOut' })
    tl.to(groupRef.current.rotation, { y: 0.06, duration: 0.5, ease: 'power2.out' })
  }, [])

  // Subtle float
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.04
  })

  return (
    <>
      {/* Studio HDRI — makes steel actually look like steel */}
      <Environment preset="studio" />

      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 8, 8]}  intensity={1.8} color="#fff8f0" />
      <directionalLight position={[-6, 2, 4]} intensity={0.5} color="#c0d0ff" />
      <directionalLight position={[0, -5, -5]} intensity={0.6} color="#ffeedd" />
      <pointLight position={[2, 4, 7]} intensity={1.5} color="#ffffff" />

      <group ref={groupRef} scale={0.72} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
      </group>
    </>
  )
}
