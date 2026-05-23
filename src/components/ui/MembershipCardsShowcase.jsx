import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import Section from './Section';

/** ISO/IEC 7810 ID-1 proportions (credit card) */
const CARD_ASPECT = 85.6 / 53.98;

const MEMBERSHIP_TIERS = [
  {
    id: 'silver',
    tierLabel: 'Silver card',
    imageSrc: '/images/member-cards/PRIVILEGE%20MEMBER.png',
    swatchName: 'Neutral Medium Gray',
    swatch: '#8f949d',
    accentGlow: 'rgba(143, 148, 157, 0.45)',
    stageTop: '#2b3139',
    stageMid: '#1e242b',
    stageBottom: '#0f1319',
    stripeA: '#202733',
    stripeB: '#323b49',
    stripeC: '#161c25',
    points: [
      'Core member benefits across Luxe Adobes stays and services',
      'Multiple-entry access to participating properties',
      'Loyalty reward points on qualifying spends',
    ],
  },
  {
    id: 'golden',
    tierLabel: 'Golden card',
    imageSrc: '/images/member-cards/ELITE%20MEMBER.png',
    swatchName: 'Mustard Yellow',
    swatch: '#c59a2a',
    accentGlow: 'rgba(197, 154, 42, 0.5)',
    stageTop: '#3d2f14',
    stageMid: '#2a220f',
    stageBottom: '#120f08',
    stripeA: '#2b2212',
    stripeB: '#4b3a1a',
    stripeC: '#1b160c',
    points: [
      'Everything in Silver - core benefits, multiple entry, and loyalty points',
      'Priority booking with early check-in and late check-out when availability allows',
      'Complimentary dining or selected food and beverage perks where offered',
    ],
  },
  {
    id: 'diamond',
    tierLabel: 'Diamond card',
    imageSrc: '/images/member-cards/PREMIUM-MEMBER.png',
    swatchName: 'Navy Blue',
    swatch: '#1f2f5f',
    accentGlow: 'rgba(31, 47, 95, 0.5)',
    stageTop: '#1a274a',
    stageMid: '#121c34',
    stageBottom: '#080c16',
    stripeA: '#1a2438',
    stripeB: '#243252',
    stripeC: '#111827',
    points: [
      'Everything in Golden - Silver stack plus priorities, flexibility, and dining perks',
      'VIP treatment with premium access and enhanced upgrades when we can extend them',
      'Preferential rates, seasonal gifts, and bonus loyalty rewards',
    ],
  },
];

const N = MEMBERSHIP_TIERS.length;

/** Lower index = “previous” in the row → flip the other way (e.g. 2→1, 2→0, 1→0). */
function shouldFlipReverse(fromIndex, toIndex) {
  return toIndex < fromIndex;
}

function getTierBackground(tier) {
  return `
    radial-gradient(130% 118% at 50% -6%, #fcfbf8 0%, #f2ede3 34%, #e7dfd0 70%, #ddd3c0 100%),
    radial-gradient(72% 52% at 14% 92%, rgba(255,255,255,0.4) 0%, transparent 76%),
    radial-gradient(80% 60% at 88% 86%, ${tier.swatch}2e 0%, transparent 76%),
    linear-gradient(180deg, #f8f4ed 0%, #ebe4d8 54%, #e1d8c8 100%)
  `;
}

function FlipCard3D({
  frontTier,
  backTier,
  flipperRef,
  cardMaxClass = 'w-[min(88vw,340px)]',
}) {
  return (
    <div
      className={`relative mx-auto ${cardMaxClass} [transform-style:preserve-3d]`}
      style={{
        aspectRatio: `${CARD_ASPECT}`,
        transformStyle: 'preserve-3d',
        perspective: 1400,
      }}
    >
      <div
        ref={flipperRef}
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-[1.15rem]"
          style={{
            transform: 'translateZ(0.5px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img
            src={frontTier.imageSrc}
            alt={frontTier.tierLabel}
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-[1.15rem]"
          style={{
            transform: 'rotateY(180deg) translateZ(0.5px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img
            src={backTier.imageSrc}
            alt=""
            aria-hidden
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        </div>
      </div>
    </div>
  );
}

const HIGHLIGHT_PAD = 5;

function ColorNodes({ activeIndex, onSelect, busy, prefersReducedMotion }) {
  const trackRef = useRef(null);
  const btnRefs = useRef([]);
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    const btn = btnRefs.current[activeIndex];
    if (!track || !btn) return;
    const tr = track.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({
      x: br.left - tr.left - HIGHLIGHT_PAD,
      y: br.top - tr.top - HIGHLIGHT_PAD,
      w: br.width + HIGHLIGHT_PAD * 2,
      h: br.height + HIGHLIGHT_PAD * 2,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();
  }, [measure, activeIndex]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  const spring = prefersReducedMotion
    ? { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
    : { type: 'spring', stiffness: 380, damping: 32, mass: 0.52 };

  return (
    <div className="relative z-[2] flex flex-col items-center gap-3.5 pt-2">
      <p
        key={MEMBERSHIP_TIERS[activeIndex].tierLabel}
        className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-charcoal/72 sm:text-sm"
        aria-live="polite"
      >
        {MEMBERSHIP_TIERS[activeIndex].tierLabel}
      </p>

      <div
        ref={trackRef}
        role="tablist"
        aria-label="Membership card style"
        aria-busy={busy}
        className={`relative isolate flex items-center gap-3 rounded-[999px] border border-white/70 bg-white/48 px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.52),0_14px_34px_-20px_rgba(28,28,28,0.35)] backdrop-blur-xl sm:gap-3.5 sm:px-4 sm:py-2.5 ${busy ? 'pointer-events-none' : ''}`}
      >
        {pill.w > 0 && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-0 rounded-full bg-gradient-to-b from-white/[0.95] via-white/[0.78] to-white/[0.62] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.45),0_0_0_1px_rgba(255,255,255,0.58),0_10px_24px_-16px_rgba(28,28,28,0.3)]"
            initial={false}
            animate={{
              left: pill.x,
              top: pill.y,
              width: pill.w,
              height: pill.h,
              opacity: 1,
            }}
            transition={spring}
            style={{ position: 'absolute' }}
          />
        )}

        {MEMBERSHIP_TIERS.map((tier, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={tier.id}
              ref={(el) => {
                btnRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${tier.tierLabel} card`}
              onClick={() => onSelect(idx)}
              className="relative z-10 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-[transform,opacity] duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-charcoal/25 focus-visible:ring-offset-2 focus-visible:ring-offset-warm sm:h-[52px] sm:w-[52px]"
            >
              <span
                className={`relative h-9 w-9 rounded-full border sm:h-11 sm:w-11 ${
                  active ? 'border-charcoal/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]' : 'border-charcoal/12'
                }`}
                style={{
                  backgroundColor: tier.swatch,
                  boxShadow: active
                    ? `0 0 0 2px rgba(255,255,255,0.9), 0 0 22px ${tier.accentGlow}`
                    : 'inset 0 1px 1px rgba(255,255,255,0.3)',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MembershipCardsShowcase({ prefersReducedMotion }) {
  const reduce = useReducedMotion() || prefersReducedMotion;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backOverride, setBackOverride] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const flipperRef = useRef(null);
  const tlRef = useRef(null);

  const backIndex = backOverride !== null ? backOverride : (currentIndex + 1) % N;

  useEffect(() => () => tlRef.current?.kill(), []);

  const runFlipTo = useCallback(
    (nextIdx) => {
      if (nextIdx === currentIndex || busy) return;
      if (reduce) {
        setCurrentIndex(nextIdx);
        setActiveIndex(nextIdx);
        setBackOverride(null);
        return;
      }

      if (!flipperRef.current) return;

      tlRef.current?.kill();
      setBusy(true);
      setBackOverride(nextIdx);
      setActiveIndex(nextIdx);

      const targetRotationY = shouldFlipReverse(currentIndex, nextIdx) ? -180 : 180;

      const finish = () => {
        const el = flipperRef.current;
        flushSync(() => {
          setCurrentIndex(nextIdx);
          setActiveIndex(nextIdx);
          setBackOverride(null);
        });
        if (el) {
          gsap.set(el, {
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            scale: 1,
            z: 0,
            transformPerspective: 1600,
            force3D: true,
          });
        }
        setBusy(false);
        tlRef.current = null;
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const flipEl = flipperRef.current;
          if (!flipEl) {
            setBusy(false);
            return;
          }

          gsap.set(flipEl, {
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            scale: 1,
            z: 0,
            transformPerspective: 1600,
            force3D: true,
          });

          const tl = gsap.timeline({
            defaults: { force3D: true },
            onComplete: finish,
          });
          tlRef.current = tl;

          tl.to(flipEl, {
            rotationY: targetRotationY,
            duration: 1.22,
            ease: 'sine.inOut',
          });
        });
      });
    },
    [busy, currentIndex, reduce]
  );

  const frontTier = MEMBERSHIP_TIERS[currentIndex];
  const backTier = MEMBERSHIP_TIERS[backIndex];
  const visualTier = MEMBERSHIP_TIERS[activeIndex];

  return (
    <Section className="relative overflow-hidden border-t border-sand/90 !py-14 lg:!py-20">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={visualTier.id}
          className="pointer-events-none absolute inset-0 -z-10"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: reduce ? 0.28 : 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: getTierBackground(visualTier),
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_520px_at_50%_-10%,rgba(255,255,255,0.56)_0%,transparent_64%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_50%_100%,rgba(28,28,28,0.12)_0%,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(130deg, rgba(28,28,28,0.22) 0 1px, transparent 1px 11px)' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.06] to-charcoal/[0.12]" />

      <div className="relative z-[1] mx-auto max-w-[92vw] px-4 lg:max-w-[960px] lg:px-8">
        <div className="relative mx-auto flex min-h-[min(56vh,560px)] flex-col items-center justify-center rounded-[32px] border border-white/55 bg-white/42 px-4 pb-8 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.45),0_30px_75px_-34px_rgba(28,28,28,0.42)] backdrop-blur-[14px] sm:px-6">
          <header className="relative z-[2] mb-4 flex w-full max-w-[640px] flex-col items-center text-center">
            <h2 className="font-serif text-[clamp(1.65rem,3.6vw,2.45rem)] leading-[1.08] tracking-[-0.02em] text-charcoal">
              Luxe Adobes Membership
            </h2>
            <p className="mt-2 max-w-[52ch] font-sans text-sm leading-relaxed text-charcoal/65 sm:text-[15px]">
              Three tiers. One standard of care.
            </p>
          </header>

          <div
            className="relative z-[2] mt-1 flex w-full justify-center [perspective:1600px] [perspective-origin:50%_40%]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <FlipCard3D
              frontTier={frontTier}
              backTier={backTier}
              flipperRef={flipperRef}
            />
          </div>

          <div className="relative z-[2] mt-9 w-full max-w-md">
            <ColorNodes
              activeIndex={activeIndex}
              onSelect={runFlipTo}
              busy={busy}
              prefersReducedMotion={reduce}
            />
          </div>

          <div className="relative z-[2] mt-7 w-full max-w-xl rounded-2xl border border-charcoal/[0.07] bg-white/50 px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_16px_40px_-28px_rgba(28,28,28,0.22)] backdrop-blur-xl sm:px-8 sm:py-7">
            <ul className="mx-auto flex max-w-lg flex-col gap-0.5">
              {visualTier.points.map((point, idx) => (
                <li
                  key={`${visualTier.id}-${idx}-${point}`}
                  className="group flex items-start gap-3.5 rounded-xl py-2.5 pl-1 pr-2 transition-[background-color,box-shadow] duration-200 sm:gap-4 sm:py-3 sm:pl-1.5 sm:pr-3 hover:bg-white/70 hover:shadow-[inset_0_0_0_1px_rgba(198,167,94,0.12)]"
                >
                  <span
                    className="mt-[0.4rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-b from-gold/[0.14] to-gold/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-[11px] w-[11px] text-gold"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 6.2 5 8.7 9.5 3.3" />
                    </svg>
                  </span>
                  <p className="min-w-0 flex-1 font-sans text-[13.5px] font-normal leading-[1.58] tracking-[-0.012em] text-charcoal/[0.82] antialiased sm:text-[14.5px] sm:leading-[1.55]">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

