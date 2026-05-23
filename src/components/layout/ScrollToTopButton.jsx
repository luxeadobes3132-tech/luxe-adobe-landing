import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';

const SHOW_AFTER_PX = 400;
const SCROLL_DURATION = 1.05;

export default function ScrollToTopButton() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sync = (scrollY) => {
      const next = scrollY > SHOW_AFTER_PX;
      setVisible((prev) => (prev === next ? prev : next));
    };

    if (lenis) {
      const onScroll = () => sync(lenis.scroll);
      lenis.on('scroll', onScroll);
      onScroll();
      return () => lenis.off('scroll', onScroll);
    }

    const onScroll = () =>
      sync(window.scrollY ?? document.documentElement.scrollTop ?? 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lenis]);

  const goTop = useCallback(() => {
    if (lenis) lenis.scrollTo(0, { duration: SCROLL_DURATION });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lenis]);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={goTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-6 right-5 z-[58] flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/[0.1] bg-warm/95 text-charcoal shadow-[0_8px_30px_-12px_rgba(28,28,28,0.16)] backdrop-blur-md transition-[opacity,transform,box-shadow,background-color,border-color,color] duration-200 ease-out supports-[backdrop-filter]:bg-warm/88 hover:border-gold/45 hover:bg-white/95 hover:text-gold hover:shadow-[0_10px_36px_-12px_rgba(28,28,28,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-warm md:bottom-8 md:right-8 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-1.5 opacity-0'
      }`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[17px] w-[17px] opacity-95"
        aria-hidden
      >
        <path d="M6 14 12 8l6 6" />
      </svg>
    </button>,
    document.body
  );
}
