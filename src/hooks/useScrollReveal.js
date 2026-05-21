import { useLayoutEffect, useRef } from 'react'

export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px',
  y = 40,
  duration = 700,
  delay = '0ms',
} = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = `translateY(${y}px)`
    el.style.transition = `opacity ${duration}ms ease ${delay}, transform ${duration}ms ease ${delay}`

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, y, duration, delay])

  return ref
}
