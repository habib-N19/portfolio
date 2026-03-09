import { useState, useEffect, useRef, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Loader from '#/components/portfolio/Loader'
import CustomCursor from '#/components/portfolio/CustomCursor'
import FloatingNav from '#/components/portfolio/FloatingNav'
import SectionCounter from '#/components/portfolio/SectionCounter'
import FilmGrain from '#/components/portfolio/FilmGrain'
import HeroSection from '#/components/portfolio/HeroSection'
import AboutSection from '#/components/portfolio/AboutSection'
import WorkSection from '#/components/portfolio/WorkSection'
import TimelineSection from '#/components/portfolio/TimelineSection'
import ResumeSection from '#/components/portfolio/ResumeSection'
import BlogSection from '#/components/portfolio/BlogSection'
import ContactSection from '#/components/portfolio/ContactSection'
import SmoothScroll from '#/components/portfolio/SmoothScroll'
import WebGLBackground from '#/components/portfolio/WebGLBackground'

export const Route = createFileRoute('/')({ component: PortfolioPage })

const sections = ['hero', 'about', 'work', 'timeline', 'resume', 'blog', 'contact']

function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const onLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    const visited = sessionStorage.getItem('portfolio-visited')
    if (visited) {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: [0.3], rootMargin: '-10% 0px -10% 0px' },
    )

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [loading])

  return (
    <SmoothScroll>
      <div className="portfolio-theme">
        <WebGLBackground />
        
        {loading && <Loader onComplete={onLoadComplete} />}

        {!loading && (
          <>
            <CustomCursor />
          <FloatingNav activeSection={activeSection} />
          <SectionCounter activeSection={activeSection} />
          <FilmGrain />

          <main>
            <HeroSection />
            <AboutSection />
            <WorkSection />
            <TimelineSection />
            <ResumeSection />
            <BlogSection />
            <ContactSection />
          </main>
        </>
      )}
      </div>
    </SmoothScroll>
  )
}
