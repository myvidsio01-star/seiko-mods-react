import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    )

    el.style.opacity = '0'
    el.style.transform = `translateY(${options.y || 40}px)`
    el.style.transition = `opacity ${options.duration || 700}ms ease, transform ${options.duration || 700}ms ease`
    el.style.transitionDelay = options.delay || '0ms'

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}
