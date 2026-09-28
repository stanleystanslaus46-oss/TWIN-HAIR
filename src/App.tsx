/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';

// Section catalogue with high-fashion editorial metadata
interface SectionMeta {
  id: string;
  number: string;
  name: string;
}

const SECTIONS: SectionMeta[] = [
  { id: 'hero', number: '00', name: 'OVERVIEW' },
  { id: 'about', number: '01', name: 'PHILOSOPHY' },
  { id: 'services', number: '02', name: 'SERVICES' },
  { id: 'styles', number: '03', name: 'STYLE GALLERY' },
  { id: 'transformation', number: '04', name: 'TRANSFORMATION' },
  { id: 'social', number: '05', name: 'TIKTOK FEED' },
  { id: 'pillars', number: '06', name: 'PILLARS OF CARE' },
  { id: 'experience', number: '07', name: 'THE SANCTUARY' },
  { id: 'locations', number: '08', name: 'SALONS' },
  { id: 'booking', number: '09', name: 'RESERVATIONS' },
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<SectionMeta>(SECTIONS[0]);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [deviceType, setDeviceType] = useState<string>('desktop');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // 1. Device detection and responsive monitoring
  const updateDeviceMetrics = useCallback(() => {
    const width = window.innerWidth;
    let type = 'desktop';

    if (width < 360) {
      type = 'mobile-xs';
    } else if (width < 640) {
      type = 'mobile';
    } else if (width < 1024) {
      type = 'tablet';
    } else if (width < 1440) {
      type = 'desktop';
    } else {
      type = 'ultrawide';
    }

    setDeviceType(type);
    document.documentElement.setAttribute('data-device-type', type);
  }, []);

  // 2. React-Based Scroll Trigger Logic for 'reveal-on-scroll' elements
  useEffect(() => {
    updateDeviceMetrics();
    window.addEventListener('resize', updateDeviceMetrics, { passive: true });

    // Honor user accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Query all reveal targets in the DOM
    const targets = document.querySelectorAll('.reveal-on-scroll');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // Immediate fallback for reduced motion or legacy environments
      targets.forEach((elem) => {
        elem.classList.add('is-revealed', 'is-visible');
        const htmlEl = elem as HTMLElement;
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
      });
      setRevealedCount(targets.length);
      return () => {
        window.removeEventListener('resize', updateDeviceMetrics);
      };
    }

    // Configure IntersectionObserver for editorial pacing
    const isMobile = window.innerWidth < 768;
    const observerOptions: IntersectionObserverInit = {
      root: null,
      // On mobile viewports trigger slightly earlier for seamless reading flow
      rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px',
      threshold: [0, 0.1, 0.25],
    };

    let count = 0;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;

          // Compute gentle stagger delay if element has siblings in a grid
          const parent = el.parentElement;
          if (parent && parent.children.length > 1) {
            const index = Array.from(parent.children).indexOf(el);
            if (index > 0 && !el.dataset.revealDelay) {
              const delay = Math.min(index * 0.08, 0.35);
              el.style.transitionDelay = `${delay}s`;
            }
          }

          // Trigger reveal state
          el.classList.add('is-revealed', 'is-visible');
          count++;
          setRevealedCount(count);

          // Once revealed, unobserve to maintain high scrolling performance
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    targets.forEach((target) => {
      revealObserver.observe(target);
    });

    // Safety fallback: ensure any element not yet reached by observer is visible if jumped to
    const checkSafety = setTimeout(() => {
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          target.classList.add('is-revealed', 'is-visible');
        }
      });
    }, 800);

    return () => {
      clearTimeout(checkSafety);
      revealObserver.disconnect();
      window.removeEventListener('resize', updateDeviceMetrics);
    };
  }, [updateDeviceMetrics]);

  // 3. Scroll progress & active section tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;

          setScrollProgress(progress);
          setShowScrollTop(scrollTop > 450);

          // Calculate active section based on scroll offset
          const viewportMiddle = scrollTop + window.innerHeight * 0.38;
          let current = SECTIONS[0];

          for (const sec of SECTIONS) {
            const el = document.getElementById(sec.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (viewportMiddle >= top && viewportMiddle < top + height) {
                current = sec;
                break;
              }
            }
          }

          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll helper for quick navigation
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Calculate clean rounded percentage
  const roundedProgress = useMemo(() => Math.round(scrollProgress), [scrollProgress]);

  return (
    <div className="react-scroll-hud-root" aria-hidden="true">
      {/* Editorial Top Reading Progress Bar */}
      <div 
        className="editorial-progress-track"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          zIndex: 9999,
          pointerEvents: 'none',
          backgroundColor: 'transparent'
        }}
      >
        <div 
          className="editorial-progress-fill"
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            backgroundColor: 'var(--color-accent)',
            transition: 'width 0.12s linear',
            boxShadow: '0 0 8px var(--color-accent)'
          }}
        />
      </div>

      {/* Luxury Editorial Section Tracker (Desktop & Tablet) */}
      <aside 
        className="editorial-section-hud"
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 80,
          display: deviceType === 'mobile' || deviceType === 'mobile-xs' ? 'none' : 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '9999px',
          padding: '0.45rem 1rem 0.45rem 0.65rem',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          userSelect: 'none',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto'
        }}
      >
        {/* Accent indicator dot */}
        <span 
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            boxShadow: '0 0 6px var(--color-accent)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
            {activeSection.number}
          </span>
          <span style={{ opacity: 0.35 }}>/</span>
          <button
            type="button"
            onClick={() => scrollToSection(activeSection.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 600,
              letterSpacing: 'inherit',
              color: 'inherit',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
            title={`Jump to ${activeSection.name}`}
          >
            {activeSection.name}
          </button>
        </div>

        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', marginLeft: '0.35rem' }}>
          {roundedProgress}%
        </span>
      </aside>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        style={{
          position: 'fixed',
          bottom: deviceType === 'mobile' || deviceType === 'mobile-xs' ? 'calc(5rem + env(safe-area-inset-bottom, 0px))' : '2.25rem',
          left: deviceType === 'mobile' || deviceType === 'mobile-xs' ? '1rem' : 'auto',
          right: deviceType === 'mobile' || deviceType === 'mobile-xs' ? 'auto' : 'auto',
          transform: deviceType === 'mobile' || deviceType === 'mobile-xs' ? 'none' : 'none',
          display: showScrollTop ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          zIndex: 85,
          opacity: showScrollTop ? 1 : 0,
          transition: 'all 0.25s ease',
          pointerEvents: 'auto'
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
