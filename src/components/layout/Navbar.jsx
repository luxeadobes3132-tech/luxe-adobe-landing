import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { prefetchRoute } from '../../utils/routePrefetch';

const NAV_ITEMS = [
  { key: 'home', to: '/', label: 'Home' },
  { key: 'about', to: '/about', label: 'About' },
  { key: 'properties', to: '/properties', label: 'Properties' },
  { key: 'destinations', to: '/properties#destinations', label: 'Destinations' },
  { key: 'contact', to: '/contact', label: 'Contact' },
];

const LINE_H = 2;
const LINE_DURATION_MS = 420;

function measureUnderline(container, linkEl) {
  if (!container || !linkEl) return null;
  const c = container.getBoundingClientRect();
  const e = linkEl.getBoundingClientRect();
  return {
    left: e.left - c.left,
    top: e.bottom - c.top - LINE_H,
    width: e.width,
    visible: true,
  };
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const lenis = useLenis();
  const isHome = location.pathname === '/';
  const immersive = isHome && !scrolled;

  const navRowRef = useRef(null);
  const deskLinkRefs = useRef({});

  const [deskLine, setDeskLine] = useState({ left: 0, top: 0, width: 0, visible: false });

  useEffect(() => {
    const onScroll = () => {
      if (!isHome) {
        setScrolled(false);
        return;
      }
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    if (isHome) setScrolled(window.scrollY > 40);
  }, [location.pathname, isHome]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    lenis?.stop();
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      lenis?.start();
    };
  }, [isMenuOpen, lenis]);

  const goHomeTop = useCallback(
    (e) => {
      const onHome = matchPath({ path: '/', end: true }, location.pathname) != null;
      if (!onHome) {
        setIsMenuOpen(false);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setIsMenuOpen(false);
      lenis?.start();

      const snapTop = () => {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true, programmatic: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      snapTop();
      requestAnimationFrame(() => {
        requestAnimationFrame(snapTop);
      });
    },
    [location.pathname, lenis]
  );

  const navSurface = immersive
    ? 'bg-transparent border-b border-white/10'
    : 'bg-warm/95 backdrop-blur-md border-b border-sand supports-[backdrop-filter]:bg-warm/90';

  const path = location.pathname;
  const navActive = {
    home: path === '/',
    about: path === '/about',
    properties: path === '/properties' || path.startsWith('/property/'),
    contact: path === '/contact',
  };

  const activeKey =
    navActive.home ? 'home' : navActive.about ? 'about' : navActive.properties ? 'properties' : navActive.contact ? 'contact' : 'home';

  const linkClass = (key) => {
    const isActive = navActive[key];
    const base = 'font-sans transition-colors duration-200';
    if (isActive) {
      return `${base} text-gold`;
    }
    return immersive
      ? `${base} text-warm hover:text-gold`
      : `${base} text-charcoal hover:text-gold`;
  };

  const mobileLinkClass = (key) => {
    const active = navActive[key];
    const base =
      'block w-full border-l-2 py-3.5 pl-4 pr-2 text-left text-[15px] font-sans tracking-wide transition-colors';
    if (active) {
      return `${base} border-gold font-medium text-gold`;
    }
    return `${base} border-transparent ${
      immersive ? 'text-warm/90 hover:text-gold' : 'text-charcoal hover:text-gold'
    }`;
  };

  const updateDeskLine = useCallback(() => {
    const m = measureUnderline(navRowRef.current, deskLinkRefs.current[activeKey]);
    if (m) setDeskLine(m);
  }, [activeKey]);

  useLayoutEffect(() => {
    updateDeskLine();
    const el = navRowRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => updateDeskLine());
    ro.observe(el);
    window.addEventListener('resize', updateDeskLine);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDeskLine);
    };
  }, [updateDeskLine, location.pathname, immersive, scrolled]);

  const iconBtnClass = immersive
    ? 'md:hidden text-warm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
    : 'md:hidden text-charcoal';

  const lineTransitionClass =
    'pointer-events-none absolute z-0 h-[2px] rounded-full bg-gold motion-reduce:transition-none';
  const lineTransitionStyle = {
    transition: `left ${LINE_DURATION_MS}ms linear, width ${LINE_DURATION_MS}ms linear, opacity 160ms linear`,
  };

  const onNavIntent = (to) => () => prefetchRoute(to);

  const mobilePanelSurface = immersive
    ? 'bg-charcoal/98 supports-[backdrop-filter]:bg-charcoal/95'
    : 'bg-warm';
  const mobileMenuBarBorder = immersive ? 'border-white/10' : 'border-sand';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-300 ${navSurface}`}
      >
        <div className="mx-auto max-w-[90vw] px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link
              to="/"
              className="flex shrink-0 items-center rounded-sm py-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              onClick={goHomeTop}
            >
              <img
                src={
                  immersive
                    ? '/images/home/branding/luxe-adobes-white.png'
                    : '/images/home/branding/luxe-adobes-black.png'
                }
                alt="Luxe Adobes"
                className="h-10 w-auto shrink-0 object-contain object-left sm:h-[52px] lg:h-[60px]"
                width={3571}
                height={1999}
                decoding="async"
                fetchpriority="high"
              />
            </Link>

            <div ref={navRowRef} className="relative hidden items-end gap-8 pb-2 md:flex">
              <span
                aria-hidden
                className={lineTransitionClass}
                style={{
                  ...lineTransitionStyle,
                  left: deskLine.left,
                  top: deskLine.top,
                  width: deskLine.width,
                  opacity: deskLine.visible ? 1 : 0,
                }}
              />
              {NAV_ITEMS.map(({ key, to, label }) => (
                <Link
                  key={key}
                  to={to}
                  className={`relative z-10 py-1 ${linkClass(key)}`}
                  aria-current={navActive[key] ? 'page' : undefined}
                  onClick={key === 'home' ? goHomeTop : undefined}
                  onMouseEnter={onNavIntent(to)}
                  onFocus={onNavIntent(to)}
                >
                  <span
                    ref={(node) => {
                      deskLinkRefs.current[key] = node;
                    }}
                    className="inline-block"
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            <button
              type="button"
              className={iconBtnClass}
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className={`fixed inset-0 z-[60] flex min-h-[100dvh] flex-col md:hidden ${mobilePanelSurface}`}
        >
          <div className="flex min-h-0 flex-1 flex-col pt-[env(safe-area-inset-top,0px)]">
            <div
              className={`mx-auto flex h-16 w-full max-w-[90vw] shrink-0 items-center justify-between border-b px-4 lg:h-20 ${mobileMenuBarBorder}`}
            >
              <Link
                to="/"
                className="flex shrink-0 items-center rounded-sm py-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                onClick={goHomeTop}
              >
                <img
                  src={
                    immersive
                      ? '/images/home/branding/luxe-adobes-white.png'
                      : '/images/home/branding/luxe-adobes-black.png'
                  }
                  alt="Luxe Adobes"
                  className="h-10 w-auto shrink-0 object-contain object-left sm:h-[52px]"
                  width={3571}
                  height={1999}
                  decoding="async"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className={iconBtnClass}
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mx-auto w-full max-w-[90vw] flex-1 overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-4">
              <ul className={immersive ? 'divide-y divide-white/10' : 'divide-y divide-charcoal/10'}>
                {NAV_ITEMS.map(({ key, to, label }) => (
                  <li key={key}>
                    <Link
                      to={to}
                      className={mobileLinkClass(key)}
                      aria-current={navActive[key] ? 'page' : undefined}
                      onClick={key === 'home' ? goHomeTop : () => setIsMenuOpen(false)}
                      onMouseEnter={onNavIntent(to)}
                      onFocus={onNavIntent(to)}
                      onTouchStart={onNavIntent(to)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
