import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import testimonialsData from '../../data/testimonials.json';

const easeLux = [0.25, 0.46, 0.45, 0.94];
const GAP_PX = 24;
/** Short interval between automatic slides (ms) */
const AUTO_SCROLL_INTERVAL_MS = 4000;

function getStride(scrollEl) {
  if (!scrollEl) return 364;
  const first = scrollEl.querySelector('[data-testimonial-slide]');
  if (!first) return 364;
  return first.getBoundingClientRect().width + GAP_PX;
}

export default function GuestTestimonialsCarousel({ rootClassName = 'mt-14 lg:mt-16' }) {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();

  const syncActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const stride = getStride(el);
    if (stride <= GAP_PX) return;
    const i = Math.round(el.scrollLeft / stride);
    setActiveIdx(Math.max(0, Math.min(i, testimonialsData.length - 1)));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncActiveIndex();
    el.addEventListener('scroll', syncActiveIndex, { passive: true });
    const ro = new ResizeObserver(syncActiveIndex);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', syncActiveIndex);
      ro.disconnect();
    };
  }, [syncActiveIndex]);

  useEffect(() => {
    if (testimonialsData.length <= 1 || reduce) return;
    const id = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const stride = getStride(el);
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + stride;
      el.scrollTo({ left: next >= max - 2 ? 0 : next, behavior: 'smooth' });
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const scrollByDir = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const stride = getStride(el);
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const delta = direction === 'next' ? stride : -stride;
    let nextLeft = el.scrollLeft + delta;
    if (nextLeft > max) nextLeft = max;
    if (nextLeft < 0) nextLeft = 0;
    el.scrollTo({ left: nextLeft, behavior: 'smooth' });
  };

  const goToIndex = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * getStride(el), behavior: 'smooth' });
  };

  const multi = testimonialsData.length > 1;

  return (
    <div className={rootClassName}>
      <motion.div
        className="text-center"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduce ? 0 : 0.65, ease: easeLux }}
      >
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-soft">Testimonials</p>
        <h3 className="mt-3 font-serif text-2xl text-charcoal sm:text-3xl lg:text-[2rem]">What our guests say</h3>
        <div className="mx-auto mt-5 h-px w-12 bg-gold/50" />
      </motion.div>

      <div className="relative mt-10 lg:mt-12">
        {multi && (
          <>
            <button
              type="button"
              onClick={() => scrollByDir('prev')}
              className="absolute left-0 top-1/2 z-[1] hidden -translate-y-1/2 text-charcoal/35 transition-colors hover:text-charcoal sm:flex sm:-left-1"
              aria-label="Previous"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-warm/90 text-charcoal">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 18l-6-6 6-6" />
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={() => scrollByDir('next')}
              className="absolute right-0 top-1/2 z-[1] hidden -translate-y-1/2 text-charcoal/35 transition-colors hover:text-charcoal sm:flex sm:-right-1"
              aria-label="Next"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-warm/90 text-charcoal">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className={`scrollbar-hide scroll-smooth ${
            multi ? 'snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-2 sm:px-12' : 'overflow-x-auto'
          }`}
        >
          <motion.div
            className="flex gap-5 py-1"
            style={{ width: 'max-content' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: {
                transition: reduce
                  ? { staggerChildren: 0, delayChildren: 0 }
                  : { staggerChildren: 0.05, delayChildren: 0.06 },
              },
            }}
          >
            {testimonialsData.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                data-testimonial-slide
                className="w-[min(calc(100vw-2.5rem),320px)] shrink-0 snap-center sm:w-[320px]"
                variants={{
                  hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: reduce
                      ? { duration: 0 }
                      : { duration: 0.5, ease: easeLux },
                  },
                }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {multi && (
          <div className="mt-8 flex justify-center gap-2">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                aria-current={i === activeIdx ? 'true' : undefined}
                onClick={() => goToIndex(i)}
                className={`rounded-full transition-[width,background-color] duration-300 ${
                  i === activeIdx ? 'h-1 w-6 bg-charcoal/45' : 'h-1 w-1 bg-charcoal/20 hover:bg-charcoal/35'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
