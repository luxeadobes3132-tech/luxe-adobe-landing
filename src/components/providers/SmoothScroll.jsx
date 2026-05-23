import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollToTopButton from '../layout/ScrollToTopButton';
import { COARSE_POINTER_MQ, isCoarsePointer } from '../../utils/coarsePointer';
import {
  bindScrollTriggerMobileResize,
  syncScrollTriggerMobileConfig,
} from '../../utils/scrollTriggerMobile';

gsap.registerPlugin(ScrollTrigger);

const lenisRootOptions = {
  duration: 1.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.1,
  autoRaf: false,
  stopInertiaOnNavigate: true,
};

function useScrollTriggerMobileSync() {
  useEffect(() => {
    syncScrollTriggerMobileConfig();
    const unbindResize = bindScrollTriggerMobileResize();
    const mq = window.matchMedia(COARSE_POINTER_MQ);
    const onPointerEnvChange = () => syncScrollTriggerMobileConfig();
    mq.addEventListener('change', onPointerEnvChange);
    return () => {
      unbindResize();
      mq.removeEventListener('change', onPointerEnvChange);
      ScrollTrigger.normalizeScroll(false);
      ScrollTrigger.config({ ignoreMobileResize: false });
    };
  }, []);
}

function useRouteScrollReset(lenis) {
  const location = useLocation();

  useLayoutEffect(() => {
    lenis?.reset?.();
    lenis?.scrollTo?.(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    ScrollTrigger.clearScrollMemory(undefined, true);

    let frameA = 0;
    let frameB = 0;
    frameA = requestAnimationFrame(() => {
      frameB = requestAnimationFrame(() => {
        lenis?.resize?.();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(frameA);
      if (frameB) cancelAnimationFrame(frameB);
    };
  }, [lenis, location.pathname, location.search]);
}

/** Mobile / touch: native scroll + normalizeScroll (matches Brewingleads — no Lenis). */
function NativeScrollBridge({ children }) {
  useScrollTriggerMobileSync();
  useRouteScrollReset(null);

  useEffect(() => {
    let tick = 0;
    const onScroll = () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        ScrollTrigger.update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (tick) cancelAnimationFrame(tick);
    };
  }, []);

  return (
    <div className="relative min-h-full w-full">
      {children}
      <ScrollToTopButton />
    </div>
  );
}

/** Desktop: Lenis smooth wheel + GSAP ticker. */
function LenisGsapBridge({ children }) {
  const lenis = useLenis();
  useScrollTriggerMobileSync();
  useRouteScrollReset(lenis);

  useEffect(() => {
    if (!lenis) return undefined;

    let scrollTriggerTick = 0;
    const onScroll = () => {
      if (scrollTriggerTick) return;
      scrollTriggerTick = requestAnimationFrame(() => {
        scrollTriggerTick = 0;
        ScrollTrigger.update();
      });
    };
    lenis.on('scroll', onScroll);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      if (scrollTriggerTick) cancelAnimationFrame(scrollTriggerTick);
      gsap.ticker.remove(onTick);
    };
  }, [lenis]);

  return (
    <div className="relative min-h-full w-full">
      {children}
      <ScrollToTopButton />
    </div>
  );
}

export default function SmoothScroll({ children }) {
  const [useNativeTouchScroll, setUseNativeTouchScroll] = useState(isCoarsePointer);

  useEffect(() => {
    const mq = window.matchMedia(COARSE_POINTER_MQ);
    const sync = () => setUseNativeTouchScroll(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (useNativeTouchScroll) {
    return <NativeScrollBridge>{children}</NativeScrollBridge>;
  }

  return (
    <ReactLenis root options={lenisRootOptions}>
      <LenisGsapBridge>{children}</LenisGsapBridge>
    </ReactLenis>
  );
}
