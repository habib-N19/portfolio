import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Loader from '#/components/portfolio/Loader'
import CustomCursor from '#/components/portfolio/CustomCursor'
import FloatingNav from '#/components/portfolio/FloatingNav'
import SectionCounter from '#/components/portfolio/SectionCounter'
import FilmGrain from '#/components/portfolio/FilmGrain'
import HeroSection from '#/components/portfolio/HeroSection'
import AboutSection from '#/components/portfolio/AboutSection'
import SmoothScroll from '#/components/portfolio/SmoothScroll'

// Lazy loaded heavy components
const WebGLBackground = lazy(() => import('#/components/portfolio/WebGLBackground'))
const WorkSection = lazy(() => import('#/components/portfolio/WorkSection'))
const TimelineSection = lazy(() => import('#/components/portfolio/TimelineSection'))
const GitHubSection = lazy(() => import('#/components/portfolio/GitHubSection'))
const ResumeSection = lazy(() => import('#/components/portfolio/ResumeSection'))
const BlogSection = lazy(() => import('#/components/portfolio/BlogSection'))
const ContactSection = lazy(() => import('#/components/portfolio/ContactSection'))

export const Route = createFileRoute('/')({ component: PortfolioPage })

const sections = ['hero', 'about', 'work', 'blog', 'timeline', 'github', 'resume', 'contact']

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

    let maxIntersectionRatio = 0;
    let mostVisibleSection = '';

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (entry.intersectionRatio > maxIntersectionRatio) {
              maxIntersectionRatio = entry.intersectionRatio;
              mostVisibleSection = entry.target.id;
            }
          }
        }
        
        // Only update if we found a clearly visible section and it's different
        if (mostVisibleSection && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
        }
        
        // Reset for next batch of entries
        maxIntersectionRatio = 0;
      },
      { threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: '-10% 0px -20% 0px' },
    )

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    }

    // Fallback for returning to absolute top
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('hero');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    }
  }, [loading])

  return (
    <SmoothScroll>
      <div className="portfolio-theme">
        <Suspense fallback={null}>
          <WebGLBackground />
        </Suspense>
        
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
              <Suspense fallback={null}>
                <WorkSection />
                <BlogSection />
                <TimelineSection />
                <GitHubSection />
                <ResumeSection />
                <ContactSection />
              </Suspense>
            </main>
          </>
        )}
      </div>
    </SmoothScroll>
  )
}
