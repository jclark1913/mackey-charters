import { useEffect, useState } from 'react'
import './App.css'

const navLinks = [
  { href: '#captain', label: 'Captain' },
  { href: '#boat', label: 'Boat' },
  { href: '#route', label: 'Route' },
]

function HelmIcon({ className }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return (
          <line
            key={deg}
            x1={16 + c * 3.5}
            y1={16 + s * 3.5}
            x2={16 + c * 13}
            y2={16 + s * 13}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        return (
          <circle
            key={`k-${deg}`}
            cx={16 + c * 13}
            cy={16 + s * 13}
            r="1.75"
            fill="currentColor"
          />
        )
      })}
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
    </svg>
  )
}

/** Stock photos via Unsplash — swap for your own files in `/public` anytime. */
const photos = {
  banner: {
    src: '/images/main.jfif',
    alt: 'Captain Mackey at sea',
  },
  boat: {
    src: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1200&q=80',
    alt: 'Open motorboat on the water',
  },
  route: {
    src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    alt: 'Coastal water and shoreline from above',
  },
}

function MediaImage({ variant, src, alt }) {
  return (
    <figure className={`media-placeholder media-placeholder--${variant}`}>
      <img
        className="media-placeholder__img"
        src={src}
        alt={alt}
        loading={variant === 'banner' ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  )
}

/** Bump this when you replace files in /public/images so the browser loads new files (same URL cache). */
const SLIDESHOW_ASSET_VERSION = '1'

/** Mixed aspect ratios; shown with object-fit: contain inside a fixed viewport. */
const captainSlides = [
  {
    src: '/images/captain1.jfif',
    alt: 'Captain Mackey at the helm',
  },
  {
    src: '/images/captain2.jfif',
    alt: 'Looking out over clear water from the deck',
  },
  {
    src: '/images/captain3.jfif',
    alt: 'Open ocean under a wide sky',
  },
  {
    src: '/images/captain4.jfif',
    alt: 'Calm water near the shore',
  },
]

const SLIDE_INTERVAL_MS = 5500
/** Slower advance when the OS requests reduced motion (still cycles; use arrows anytime). */
const SLIDE_INTERVAL_REDUCED_MS = 5500

function slideUrl(src) {
  if (src.startsWith('/') && !src.includes('?')) {
    return `${src}?v=${SLIDESHOW_ASSET_VERSION}`
  }
  return src
}

function CaptainSlideshow({ slides }) {
  const [index, setIndex] = useState(0)

  const len = slides.length
  const go = (delta) => {
    setIndex((i) => (i + delta + len) % len)
  }

  useEffect(() => {
    if (len < 2) return
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ms = reduced ? SLIDE_INTERVAL_REDUCED_MS : SLIDE_INTERVAL_MS
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % len)
    }, ms)
    return () => window.clearInterval(id)
  }, [len])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  return (
    <div className="captain-slideshow">
      <div
        className="captain-slideshow__frame"
        role="region"
        aria-roledescription="carousel"
        aria-label="Captain photos"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="captain-slideshow__viewport">
          <img
            key={`${index}-${slides[index].src}`}
            src={slideUrl(slides[index].src)}
            alt={slides[index].alt}
            className="captain-slideshow__img"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
        <p className="sr-only" aria-live="polite">
          Photo {index + 1} of {len}
        </p>
        <button
          type="button"
          className="captain-slideshow__arrow captain-slideshow__arrow--prev"
          onClick={() => go(-1)}
          aria-label="Previous photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="captain-slideshow__arrow captain-slideshow__arrow--next"
          onClick={() => go(1)}
          aria-label="Next photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="captain-slideshow__dots" role="tablist" aria-label="Choose slide">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1}`}
            className={`captain-slideshow__dot${i === index ? ' captain-slideshow__dot--active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}

function NavMenuIcon({ open }) {
  return (
    <svg
      className="nav-toggle-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {open ? (
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (!navOpen) return
    const onResize = () => {
      if (window.matchMedia('(min-width: 640px)').matches) {
        setNavOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [navOpen])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('nav-drawer-open')
    } else {
      document.body.classList.remove('nav-drawer-open')
    }
    return () => document.body.classList.remove('nav-drawer-open')
  }, [navOpen])

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo" href="#top" onClick={() => setNavOpen(false)}>
            <HelmIcon className="logo-icon" />
            <span className="logo-text">Mackey Charters</span>
          </a>
          <button
            type="button"
            className="nav-toggle"
            id="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="sr-only">{navOpen ? 'Close menu' : 'Open menu'}</span>
            <NavMenuIcon open={navOpen} />
          </button>
          <nav
            className={`nav${navOpen ? ' nav--open' : ''}`}
            id="primary-nav"
            aria-label="Primary"
          >
            <ul>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} onClick={() => setNavOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="wrap hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">Private charter · Day trips</p>
              <h1 id="hero-heading" className="hero-title">
                Calm water, local knowledge, room to breathe
              </h1>
              <p className="hero-lead">
                We run small-group charters focused on safety, comfort, and the
                stretch of coast we know best. Read on for who runs the boat, what
                you&apos;ll board, and where we typically cruise.
              </p>
            </div>
            <MediaImage variant="banner" {...photos.banner} />
          </div>
        </section>

        <div className="wrap sections">
          <section id="captain" className="panel" aria-labelledby="captain-heading">
            <div className="panel-accent" aria-hidden="true" />
            <h2 id="captain-heading">The captain</h2>
            <CaptainSlideshow slides={captainSlides} />
            <p className="lead">
              Replace this with your captain&apos;s name, credentials (e.g. USCG
              license class), and years on the water.
            </p>
            <ul className="facts">
              <li>
                <span className="fact-label">Experience</span>
                <span className="fact-value">Brief summary of sea time and local waters</span>
              </li>
              <li>
                <span className="fact-label">Focus</span>
                <span className="fact-value">
                  Guest comfort, weather judgment, wildlife awareness
                </span>
              </li>
              <li>
                <span className="fact-label">Background</span>
                <span className="fact-value">
                  Optional: fishing, sailing, marine science, hospitality, etc.
                </span>
              </li>
            </ul>
          </section>

          <section id="boat" className="panel" aria-labelledby="boat-heading">
            <div className="panel-accent" aria-hidden="true" />
            <h2 id="boat-heading">The boat</h2>
            <MediaImage variant="section" {...photos.boat} />
            <p className="lead">
              Describe your vessel: make, model, length, year, and what makes it
              a good charter platform (shade, seating, head, swim ladder, etc.).
            </p>
            <dl className="specs">
              <div>
                <dt>Name</dt>
                <dd>Your vessel name</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>Center console / sportfish / cruiser / etc.</dd>
              </div>
              <div>
                <dt>Length</dt>
                <dd>— ft</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>Up to — passengers (per USCG certificate)</dd>
              </div>
              <div>
                <dt>Amenities</dt>
                <dd>Cooler, Bluetooth audio, life jackets, safety gear — list yours</dd>
              </div>
            </dl>
          </section>

          <section id="route" className="panel panel-wide" aria-labelledby="route-heading">
            <div className="panel-accent" aria-hidden="true" />
            <h2 id="route-heading">The route</h2>
            <MediaImage variant="section" {...photos.route} />
            <p className="lead">
              Outline your usual cruising area: harbors, islands, wildlife spots,
              or sunset runs. Seasonal notes and typical trip length help guests
              picture the day.
            </p>
            <div className="route-grid">
              <div className="route-block">
                <h3>Departure</h3>
                <p>
                  Marina or dock name, general area, and any parking or meet-up
                  details you want public.
                </p>
              </div>
              <div className="route-block">
                <h3>On the water</h3>
                <p>
                  North/south along…, loop around…, optional swim stop at… — keep
                  it flexible if trips vary with weather.
                </p>
              </div>
              <div className="route-block">
                <h3>Timing</h3>
                <p>
                  Half-day vs full-day, typical hours, and how far offshore or
                  along the coast you usually run.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <p className="footer-brand">
            <HelmIcon className="footer-brand-icon" />
            <span>Mackey Charters</span>
          </p>
          <p className="footer-note">
            Informational site only. Add a phone or email here when you&apos;re ready
            for inquiries. Photos from{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer noopener">
              Unsplash
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  )
}
