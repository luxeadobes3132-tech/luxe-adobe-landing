import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import momentsGallery from '../../data/momentsGallery.json';
import ResponsiveImg from './ResponsiveImg';

gsap.registerPlugin(ScrollTrigger);

const LANDSCAPE_MAX_HEIGHTS = [
  'min(50dvh, 420px)',
  'min(58dvh, 500px)',
  'min(64dvh, 560px)',
  'min(72dvh, 640px)',
  'min(78dvh, 720px)',
  'min(54dvh, 460px)',
  'min(62dvh, 540px)',
  'min(68dvh, 600px)',
  'min(76dvh, 680px)',
];

const LANDSCAPE_MAX_WIDTHS = [
  'min(78vw, 580px)',
  'min(86vw, 680px)',
  'min(90vw, 740px)',
  'min(80vw, 620px)',
  'min(84vw, 660px)',
];

const PORTRAIT_MAX_HEIGHTS = [
  'min(72dvh, 660px)',
  'min(78dvh, 720px)',
  'min(84dvh, 800px)',
  'min(88dvh, 860px)',
  'min(68dvh, 620px)',
  'min(76dvh, 700px)',
  'min(82dvh, 780px)',
  'min(86dvh, 840px)',
];

const PORTRAIT_MAX_WIDTHS = [
  'min(58vw, 420px)',
  'min(62vw, 460px)',
  'min(66vw, 500px)',
  'min(54vw, 400px)',
  'min(70vw, 520px)',
];

const FIRST_LANDSCAPE_HERO = {
  maxHeight: 'min(86dvh, 820px)',
  maxWidth: 'min(96vw, 920px)',
};

const FIRST_PORTRAIT_HERO = {
  maxHeight: 'min(92dvh, 900px)',
  maxWidth: 'min(70vw, 540px)',
};

function buildAdjacentSizeStyles(maxHeights, maxWidths, count) {
  const out = [];
  let prevH = -1;
  for (let i = 0; i < count; i += 1) {
    let h = (i * 5 + (i >> 1) * 3) % maxHeights.length;
    if (h === prevH) {
      h = (h + 1) % maxHeights.length;
      if (h === prevH) h = (h + 1) % maxHeights.length;
    }
    prevH = h;
    const w = (i * 11 + h * 2) % maxWidths.length;
    out.push({
      maxHeight: maxHeights[h],
      maxWidth: maxWidths[w],
    });
  }
  return out;
}

function applyFirstHero(styles, firstHero, heightFallbackPool) {
  if (styles.length === 0) return styles;
  const out = styles.map((s) => ({ ...s }));
  out[0] = { ...firstHero };
  if (out.length > 1 && out[1].maxHeight === out[0].maxHeight) {
    const alt = heightFallbackPool.find((s) => s !== out[0].maxHeight) ?? heightFallbackPool[0];
    out[1] = { ...out[1], maxHeight: alt };
  }
  return out;
}

const MOMENT_IMG_CLASS = 'block h-auto w-auto shrink-0 rounded-sm select-none';

function MomentImage({ item, priority, landscapeStyle, portraitStyle }) {
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    if (orientation === null) return undefined;
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    return () => window.clearTimeout(timer);
  }, [orientation]);

  const onLoad = (e) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    setOrientation(img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape');
  };

  const sizeStyle = orientation === 'portrait' ? portraitStyle : landscapeStyle;

  return (
    <ResponsiveImg
      src={item.src}
      alt={item.alt}
      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 82vw, 920px"
      className={MOMENT_IMG_CLASS}
      style={{
        maxHeight: sizeStyle.maxHeight,
        maxWidth: sizeStyle.maxWidth,
      }}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'low'}
      draggable={false}
      onLoad={onLoad}
    />
  );
}

function preloadMomentImages() {
  return new Promise((resolve) => {
    if (!momentsGallery.length) {
      resolve();
      return;
    }

    let loaded = 0;
    const total = momentsGallery.length;

    const mark = () => {
      loaded += 1;
      if (loaded >= total) resolve();
    };

    momentsGallery.forEach((item) => {
      const img = new Image();
      const done = () => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
        mark();
      };
      img.addEventListener('load', done);
      img.addEventListener('error', done);
      img.src = item.src;
      if (img.complete) done();
    });
  });
}

/**
 * Pinned viewport: vertical scroll scrubs a horizontal image track.
 * Setup follows Brewingleads (preload, refreshInit, pinSpacing) + normalizeScroll on mobile via SmoothScroll.
 */
export default function MomentsPinnedGallery({ prefersReducedMotion }) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  const landscapeSizeStyles = useMemo(() => {
    const base = buildAdjacentSizeStyles(
      LANDSCAPE_MAX_HEIGHTS,
      LANDSCAPE_MAX_WIDTHS,
      momentsGallery.length
    );
    return applyFirstHero(base, FIRST_LANDSCAPE_HERO, LANDSCAPE_MAX_HEIGHTS);
  }, [momentsGallery.length]);

  const portraitSizeStyles = useMemo(() => {
    const base = buildAdjacentSizeStyles(
      PORTRAIT_MAX_HEIGHTS,
      PORTRAIT_MAX_WIDTHS,
      momentsGallery.length
    );
    return applyFirstHero(base, FIRST_PORTRAIT_HERO, PORTRAIT_MAX_HEIGHTS);
  }, [momentsGallery.length]);

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined;

      const root = rootRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!root || !pin || !track) return undefined;

      let scrollTween = null;
      let isMounted = true;
      let resizeTimer = 0;

      const maxX = () => {
        const cw = pin.offsetWidth || window.innerWidth;
        return Math.max(0, track.scrollWidth - cw);
      };

      const endScroll = () => Math.max(360, maxX());

      const cleanupTween = () => {
        scrollTween?.scrollTrigger?.kill();
        scrollTween?.kill();
        scrollTween = null;
      };

      const setupPinnedScroll = () => {
        if (!isMounted) return;

        cleanupTween();
        gsap.set(track, { x: 0 });

        const distance = endScroll();
        if (distance <= 0) return;

        scrollTween = gsap.to(track, {
          x: () => -maxX(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${distance}`,
            pin,
            scrub: 1,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });
      };

      track.style.willChange = 'transform';

      preloadMomentImages().then(() => {
        if (!isMounted) return;
        setupPinnedScroll();
        ScrollTrigger.refresh();
      });

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
      };

      ScrollTrigger.addEventListener('refreshInit', setupPinnedScroll);
      window.addEventListener('resize', onResize);

      return () => {
        isMounted = false;
        window.clearTimeout(resizeTimer);
        ScrollTrigger.removeEventListener('refreshInit', setupPinnedScroll);
        window.removeEventListener('resize', onResize);
        cleanupTween();
        track.style.removeProperty('will-change');
        gsap.set(track, { clearProps: 'transform' });
      };
    },
    { dependencies: [prefersReducedMotion], scope: rootRef }
  );

  if (prefersReducedMotion) {
    return (
      <div className="bg-white py-14 lg:py-20">
        <div className="px-4 text-center lg:px-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-charcoal/40">Gallery</p>
          <h2
            id="moments-gallery-heading"
            className="mx-auto mt-4 max-w-4xl font-sans text-3xl font-semibold leading-[1.05] tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
          >
            <span className="block">Moments</span>
            <span className="block">from our</span>
            <span className="block">properties</span>
          </h2>
        </div>
        <div className="mt-10 overflow-x-auto px-4 pb-4 lg:px-8 scrollbar-hide">
          <div className="flex w-max gap-6 md:gap-8">
            {momentsGallery.map((item, idx) => (
              <MomentImage
                key={`${item.src}-${idx}`}
                item={item}
                priority={idx < 2}
                landscapeStyle={landscapeSizeStyles[idx]}
                portraitStyle={portraitSizeStyles[idx]}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative bg-white">
      <div
        ref={pinRef}
        className="relative isolate flex h-[100svh] max-h-[920px] min-h-[min(100svh,520px)] w-full flex-col items-center justify-center overflow-hidden bg-white md:h-[100dvh] md:min-h-[520px]"
      >
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-center gap-6 pl-5 pr-5 will-change-transform md:gap-8 md:pl-10 md:pr-10"
          >
            {momentsGallery.map((item, idx) => (
              <MomentImage
                key={`${item.src}-${idx}`}
                item={item}
                priority={idx < 2}
                landscapeStyle={landscapeSizeStyles[idx]}
                portraitStyle={portraitSizeStyles[idx]}
              />
            ))}
          </div>
        </div>

        <div className="pointer-events-none relative z-10 flex flex-col items-center justify-center px-4 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-charcoal/45">
            Gallery
          </p>
          <h2
            id="moments-gallery-heading"
            className="mt-4 max-w-[min(92vw,56rem)] font-sans text-[clamp(2rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white mix-blend-difference"
          >
            <span className="block">Moments</span>
            <span className="block">from our</span>
            <span className="block">properties</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
