import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Keeping original ease but ensuring it reaches exactly 1
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2, // Keep standard touch mult
    })
    lenisRef.current = lenis
    ;(window as any).lenis = lenis

    // 2. Sync Lenis with GSAP Ticker using the official recommended pattern
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // 3. Disable GSAP's lag smoothing to prevent fighting with Lenis smooth scroll
    gsap.ticker.lagSmoothing(0)

    return () => {
      // 4. Clean up
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  return <>{children}</>
}
