import {
  motion,
  LayoutGroup,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useReducedMotion,
  useAnimationControls,
} from 'framer-motion';
import Seo from '../components/seo/Seo';
import FaqSection from '../components/seo/FaqSection';
import { homeJsonLd } from '../components/seo/jsonLd';
import { PAGE_SEO } from '../data/siteSeo';
import { SITE_FAQS } from '../data/siteFaqs';
import { useRef, useEffect, useState, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
import Footer from '../components/layout/Footer';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import DestinationExploreCta from '../components/ui/DestinationExploreCta';
import PropertyCard from '../components/property/PropertyCard';
import SectionTitle from '../components/ui/SectionTitle';
import GuestTestimonialsCarousel from '../components/ui/GuestTestimonialsCarousel';
import MomentsPinnedGallery from '../components/ui/MomentsPinnedGallery';
import BrandsShowcase from '../components/ui/BrandsShowcase';
import TransportPosterSection from '../components/ui/TransportPosterSection';
import GuestExperiencesSection from '../components/ui/GuestExperiencesSection';
import MembershipCardsShowcase from '../components/ui/MembershipCardsShowcase';
import propertiesData from '../data/properties.json';
import { HOME_HERO_IMAGES } from '../data/criticalHeroImages';
import { OOTY_DESTINATION_IMAGES, WAYANAD_DESTINATION_IMAGES } from '../data/destinationImages';
import { getResponsiveImageAttrs, carouselNeighborIndices } from '../utils/responsiveImage';
import { preloadImage, resolveOptimizedHeroUrl } from '../utils/imageCache';
import ResponsiveImg from '../components/ui/ResponsiveImg';

/** Stable refs so hero crossfade timing updates don’t reset Ken Burns / counter-drift loops */
const HERO_CINEMATIC_EASE = [0.4, 0, 0.15, 1];
const HERO_SLIDE_OUT_TRANSITION = { duration: 1.35, ease: HERO_CINEMATIC_EASE };
/** First keyframe matches static state (0,0,1) so enabling the loop does not snap the frame. */
const HERO_KEN_BURNS_ACTIVE_ANIMATE = {
  scale: [1, 1.12, 1.2, 1.12, 1],
  x: [0, -8, -3, -8, 0],
  y: [0, -9, -2, -9, 0],
};
const HERO_KEN_BURNS_STATIC_OFF = { scale: 1, x: 0, y: 0 };
const HERO_KEN_BURNS_STATIC_REDUCED = { scale: 1.05, x: 0, y: 0 };
const HERO_KEN_TRANSITION_ACTIVE = {
  scale: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
  x: { duration: 34, repeat: Infinity, ease: 'easeInOut' },
  y: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
};
const HERO_KEN_TRANSITION_SLIDE = {
  scale: HERO_SLIDE_OUT_TRANSITION,
  x: HERO_SLIDE_OUT_TRANSITION,
  y: HERO_SLIDE_OUT_TRANSITION,
};
const HERO_COUNTER_ACTIVE_ANIMATE = { x: [0, 9, -10, 9, 0], y: [0, 6, -5, 6, 0] };
const HERO_COUNTER_OFF_ANIMATE = { x: 0, y: 0 };
const HERO_COUNTER_TRANSITION_ACTIVE = {
  x: { duration: 40, repeat: Infinity, ease: 'easeInOut' },
  y: { duration: 32, repeat: Infinity, ease: 'easeInOut' },
};
const HERO_COUNTER_TRANSITION_SLIDE = {
  x: HERO_SLIDE_OUT_TRANSITION,
  y: HERO_SLIDE_OUT_TRANSITION,
};
const HERO_FILTER_ACTIVE_ANIMATE = {
  filter: [
    'brightness(0.99) contrast(1.02) saturate(1.03)',
    'brightness(1.03) contrast(0.99) saturate(1.06)',
    'brightness(0.99) contrast(1.02) saturate(1.03)',
  ],
};
const HERO_FILTER_STATIC_ANIMATE = { filter: 'brightness(1) contrast(1) saturate(1)' };
const HERO_FILTER_LOOP_TRANSITION = { duration: 11, repeat: Infinity, ease: 'easeInOut' };
const HERO_FILTER_STATIC_TRANSITION = { duration: 0.35, ease: 'easeOut' };
const HERO_IMG_SIZES = '100vw';
const HOME_DESTINATION_IMG_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw';

// Floating particle component for ambient effect
const FloatingParticle = ({ delay, duration, size, initialX, initialY }) => (
  <motion.div
    className="absolute rounded-full bg-gold/20 blur-sm"
    style={{ width: size, height: size }}
    initial={{ x: initialX, y: initialY, opacity: 0 }}
    animate={{
      x: [initialX, initialX + 30, initialX - 20, initialX],
      y: [initialY, initialY - 40, initialY - 80, initialY - 120],
      opacity: [0, 0.6, 0.4, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Animated word reveal component
const AnimatedWord = ({ children, delay }) => (
  <motion.span
    className="inline-block"
    initial={{ opacity: 0, y: 40, rotateX: -90 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{
      duration: 0.8,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    {children}
  </motion.span>
);

/** Drives Ken Burns + counter-drift via `start()` so infinite loops run on first slide (declarative animate often skips first mount). */
function HeroCarouselSlideInner({
  image,
  index,
  isActive,
  prefersReducedMotion,
  liteMotion,
  effectsReady,
  imageMouseX,
  imageMouseY,
}) {
  const ken = useAnimationControls();
  const counter = useAnimationControls();
  const filter = useAnimationControls();
  const { webpSrcSet, sizes: respSizes, imgSrc } = useMemo(
    () => getResponsiveImageAttrs(image, HERO_IMG_SIZES),
    [image]
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion || liteMotion || !effectsReady) {
      void ken.start({
        ...(isActive ? HERO_KEN_BURNS_STATIC_OFF : HERO_KEN_BURNS_STATIC_OFF),
        transition: HERO_KEN_TRANSITION_SLIDE,
      });
      void counter.start({
        ...HERO_COUNTER_OFF_ANIMATE,
        transition: HERO_COUNTER_TRANSITION_SLIDE,
      });
      void filter.start({
        ...HERO_FILTER_STATIC_ANIMATE,
        transition: HERO_FILTER_STATIC_TRANSITION,
      });
      return undefined;
    }

    if (isActive) {
      // Defer `start()` one frame so `animate={ken}` is attached (fixes first slide on load).
      let cancelled = false;
      const id = requestAnimationFrame(() => {
        if (cancelled) return;
        void ken.start({
          ...HERO_KEN_BURNS_ACTIVE_ANIMATE,
          transition: HERO_KEN_TRANSITION_ACTIVE,
        });
        void counter.start({
          ...HERO_COUNTER_ACTIVE_ANIMATE,
          transition: HERO_COUNTER_TRANSITION_ACTIVE,
        });
        void filter.start({
          ...HERO_FILTER_ACTIVE_ANIMATE,
          transition: HERO_FILTER_LOOP_TRANSITION,
        });
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(id);
      };
    }

    void ken.start({
      ...HERO_KEN_BURNS_STATIC_OFF,
      transition: HERO_KEN_TRANSITION_SLIDE,
    });
    void counter.start({
      ...HERO_COUNTER_OFF_ANIMATE,
      transition: HERO_COUNTER_TRANSITION_SLIDE,
    });
    void filter.start({
      ...HERO_FILTER_STATIC_ANIMATE,
      transition: HERO_FILTER_STATIC_TRANSITION,
    });
    return undefined;
  }, [isActive, prefersReducedMotion, liteMotion, effectsReady, ken, counter, filter]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={HERO_KEN_BURNS_STATIC_OFF}
      animate={ken}
    >
      <motion.div className="absolute inset-0" initial={HERO_COUNTER_OFF_ANIMATE} animate={counter}>
        <picture className="absolute inset-0 block">
          {webpSrcSet ? (
            <source type="image/webp" srcSet={webpSrcSet} sizes={respSizes} />
          ) : null}
          <motion.img
            src={imgSrc}
            alt={`Luxe Adobes ${index + 1}`}
            className="absolute inset-0 max-w-none h-[112%] w-[112%] -left-[6%] -top-[6%] object-cover object-center hero-image"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding={index === 0 ? 'sync' : 'async'}
            fetchpriority={index === 0 ? 'high' : 'low'}
            style={{ x: imageMouseX, y: imageMouseY }}
            initial={HERO_FILTER_STATIC_ANIMATE}
            animate={filter}
          />
        </picture>
      </motion.div>
    </motion.div>
  );
}

function Home() {
  const featuredProperties = propertiesData.slice(0, 3);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  
  const heroImages = HOME_HERO_IMAGES;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeDestination, setActiveDestination] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const [isMobileCoarse, setIsMobileCoarse] = useState(false);
  const [heroEffectsReady, setHeroEffectsReady] = useState(false);
  /** After first paint, enable long crossfades; keeps initial slide at full opacity immediately */
  const [heroCrossfadeReady, setHeroCrossfadeReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const sync = () => setIsMobileCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const useLiteHeroMotion = prefersReducedMotion || isMobileCoarse;

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroCrossfadeReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Delay non-essential hero effects to reduce first-paint/LCP work.
  useEffect(() => {
    const id = window.setTimeout(() => setHeroEffectsReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const mountedHeroIndices = useMemo(
    () => carouselNeighborIndices(currentImageIndex, heroImages.length),
    [currentImageIndex, heroImages.length]
  );

  // Prefetch the next carousel frame (sized derivative only — not full originals).
  useEffect(() => {
    if (heroImages.length <= 1) return undefined;
    const nextIndex = (currentImageIndex + 1) % heroImages.length;
    preloadImage(resolveOptimizedHeroUrl(heroImages[nextIndex]), { priority: 'low' }).catch(() => {});
    return undefined;
  }, [currentImageIndex, heroImages]);

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToNext = () => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  const goToPrevious = () => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const goToSlide = (index) => setCurrentImageIndex(index);
  
  const { scrollY } = useScroll();
  const overlayOpacity = useTransform(scrollY, [0, 500], [0.3, useLiteHeroMotion ? 0.55 : 0.7], { clamp: true });
  const maskParallaxY = useTransform(scrollY, [0, 900], useLiteHeroMotion ? [0, 0] : [0, -32], { clamp: true });

  // Hero background parallax  -  moves slower than scroll for depth
  const backgroundParallaxY = useTransform(scrollY, [0, 800], useLiteHeroMotion ? [0, 0] : [0, 120], { clamp: true });

  // Hero scroll progress: 0 = hero fully in view, 1 = hero scrolled past
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Hero outro + scroll parallax for text (text moves slower, creating depth)
  const heroContentParallaxY = useTransform(scrollYProgress, [0, 0.8], useLiteHeroMotion ? [0, 0] : [0, 60]);
  const heroLineScale = useTransform(scrollYProgress, [0, 0.4], useLiteHeroMotion ? [1, 1] : [1, 0]);
  const heroCornerOpacity = useTransform(scrollYProgress, [0, 0.5], useLiteHeroMotion ? [1, 1] : [1, 0]);
  const heroParticlesOpacity = useTransform(scrollYProgress, [0, 0.4], useLiteHeroMotion ? [0, 0] : [1, 0]);
  const smoothHeroParallaxY = useSpring(heroContentParallaxY, { stiffness: 100, damping: 30 });
  const smoothLineScale = useSpring(heroLineScale, { stiffness: 150, damping: 30 });
  const smoothCornerOpacity = useSpring(heroCornerOpacity, { stiffness: 100, damping: 30 });
  const smoothParticlesOpacity = useSpring(heroParticlesOpacity, { stiffness: 120, damping: 32 });

  // GSAP ScrollTrigger  -  cinematic dissolve: gentle scale down + smooth fade
  useGSAP(() => {
    if (useLiteHeroMotion) return;
    if (!heroContentRef.current || !heroRef.current) return;
    gsap.fromTo(
      heroContentRef.current,
      { scale: 1, opacity: 1 },
      {
        scale: 0.94,
        opacity: 0,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '35% top',
          scrub: 2,
        },
      }
    );
  }, [useLiteHeroMotion]);

  const springConfig = { stiffness: 70, damping: 30, mass: 1 };
  const mouseX = useSpring(useMotionValue(0), springConfig);
  const mouseY = useSpring(useMotionValue(0), springConfig);
  const imageMouseX = useTransform(mouseX, (x) => x * 0.22);
  const imageMouseY = useTransform(mouseY, (y) => y * 0.22);

  // Handle mouse movement for parallax - reduced intensity for smoother feel
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      mouseX.set(x * 12);
      mouseY.set(y * 12);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToNext = () => {
    const h =
      typeof window !== 'undefined'
        ? window.visualViewport?.height ?? window.innerHeight
        : 0;
    window.scrollTo({ top: h, behavior: 'smooth' });
  };

  // Generate floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 8 + Math.random() * 4,
    size: 4 + Math.random() * 8,
    initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
    initialY: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
  }));

  return (
    <div className="relative min-h-screen">
      <Seo {...PAGE_SEO.home} jsonLd={homeJsonLd()} />

      {/* Enhanced Fullscreen Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-hero-viewport h-hero-viewport w-full flex items-center justify-center overflow-hidden bg-charcoal"
        style={{ willChange: 'transform' }}
      >
        {/* Carousel Background Images  -  scroll parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundParallaxY }}
        >
          {heroImages.map((image, index) => {
            if (!mountedHeroIndices.includes(index)) return null;

            const isActive = index === currentImageIndex;
            const heroOpacityMs = prefersReducedMotion
              ? 0.45
              : heroCrossfadeReady
                ? 2.35
                : 0;

            return (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{ zIndex: isActive ? 1 : 0 }}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{
                  opacity: {
                    duration: heroOpacityMs,
                    ease: HERO_CINEMATIC_EASE,
                  },
                }}
              >
                <HeroCarouselSlideInner
                  image={image}
                  index={index}
                  isActive={isActive}
                  prefersReducedMotion={prefersReducedMotion}
                  liteMotion={useLiteHeroMotion}
                  effectsReady={heroEffectsReady}
                  imageMouseX={imageMouseX}
                  imageMouseY={imageMouseY}
                />
              </motion.div>
            );
          })}
          {!useLiteHeroMotion && heroEffectsReady && (
            <div className="hero-cinematic-grain pointer-events-none absolute inset-0 z-[2]" aria-hidden />
          )}
        </motion.div>

        {/* Overlays + diagonal shadow  -  above slides (z ≤ 1), below hero copy (z-10).
            y uses backgroundParallaxY (no spring) so Lenis + useScroll don’t hold the layer off-screen on load. */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[8] isolate"
          style={{ y: backgroundParallaxY }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"
            style={{ opacity: overlayOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-charcoal/20 via-transparent to-gold/10"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(28,28,28,0.15) 50%, rgba(28,28,28,0.4) 100%),
                linear-gradient(to bottom, rgba(28,28,28,0.3) 0%, transparent 30%, transparent 65%, rgba(28,28,28,0.45) 100%),
                linear-gradient(120deg, rgba(198,167,94,0.08) 0%, transparent 40%, rgba(28,28,28,0.06) 100%)
              `,
            }}
          />
          {/* Moving sweep only; no fixed center band */}
          <motion.div className="absolute inset-0 z-[2] overflow-visible" style={{ y: maskParallaxY }}>
            <div
              className="hero-diagonal-sweep hero-diagonal-sweep-layer pointer-events-none absolute -left-[38%] -top-[46%] h-[235%] w-[230%] sm:-left-[32%] sm:-top-[40%] sm:h-[210%] sm:w-[182%]"
              aria-hidden
            />
          </motion.div>
        </motion.div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-warm/80 hover:text-gold transition-colors duration-300 bg-black/20 hover:bg-black/40 rounded-full p-3 backdrop-blur-sm"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-warm/80 hover:text-gold transition-colors duration-300 bg-black/20 hover:bg-black/40 rounded-full p-3 backdrop-blur-sm"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex
                  ? 'w-10 h-2 bg-gold'
                  : 'w-2 h-2 bg-warm/60 hover:bg-warm/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Floating Particles - fade out on scroll */}
        {!useLiteHeroMotion && heroEffectsReady && (
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ opacity: smoothParticlesOpacity }}
          >
            {particles.map((particle) => (
              <FloatingParticle key={particle.id} {...particle} />
            ))}
          </motion.div>
        )}
        
        {/* Decorative Corner Elements - scroll-based fade */}
        {heroEffectsReady && (
          <>
            <motion.div
              className="absolute top-20 left-8 w-24 h-24 border-l-2 border-t-2 border-gold/30"
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ opacity: smoothCornerOpacity }}
            />
            <motion.div
              className="absolute bottom-20 right-8 w-24 h-24 border-r-2 border-b-2 border-gold/30"
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              style={{ opacity: smoothCornerOpacity }}
            />
          </>
        )}
        
        {/* Hero content */}
        <div className="relative z-10 flex items-center justify-center px-6">
          <motion.div
            className="relative text-center max-w-4xl mx-auto origin-center"
            style={{ 
              x: useTransform(mouseX, (x) => x * -0.5),
              y: smoothHeroParallaxY,
            }}
          >
            <div ref={heroContentRef} className="relative">
          {/* Decorative line above title */}
          <motion.div
            className="w-16 h-0.5 bg-gold mx-auto mb-8 origin-center"
            style={{ scaleX: smoothLineScale }}
          />
          
          {/* Animated Title with Word Reveal */}
          <motion.div className="perspective-1000">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-warm mb-6 text-shadow-strong">
              <AnimatedWord delay={0.3}>Luxe</AnimatedWord>
              {' '}
              <AnimatedWord delay={0.5}>Adobes</AnimatedWord>
            </h1>
          </motion.div>
          
          {/* Animated tagline */}
          <motion.div
            className="overflow-hidden mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.p
              className="font-sans text-base sm:text-lg lg:text-xl xl:text-2xl text-warm/90 leading-relaxed tracking-wide text-shadow-readable"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            >
              <motion.span
                className="inline-block"
                animate={{ 
                  textShadow: [
                    "0 3px 6px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0px rgba(198, 167, 94, 0)",
                    "0 3px 6px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5), 0 0 10px rgba(198, 167, 94, 0.3)",
                    "0 3px 6px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0px rgba(198, 167, 94, 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Where luxury meets tranquility
              </motion.span>
            </motion.p>
          </motion.div>
          
          {/* Decorative line below tagline - scroll-based scale */}
          <motion.div
            className="w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-10 origin-center"
            style={{ scaleX: smoothLineScale }}
          />
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button to="/properties" variant="primary" className="relative overflow-hidden group">
                <span className="relative z-10">Explore Resorts</span>
                <motion.div
                  className="absolute inset-0 bg-gold/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button to="/about" variant="secondary">
                Our Story
              </Button>
            </motion.div>
          </motion.div>
            </div>
        </motion.div>
        </div>
        
        {/* Elegant bottom divider - diagonal cut design */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[9]">
          <svg 
            className="w-full h-24" 
            viewBox="0 0 1440 96" 
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Diagonal cut with subtle curve */}
            <path 
              d="M0,96 L0,60 Q720,40 1440,60 L1440,96 Z" 
              fill="#FAF9F7"
            />
          </svg>
        </div>
      </section>

      {/* Step 3: About Luxe Adobes Section */}
      <Section className="bg-warm">
        <div className="max-w-[90vw] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <SectionTitle 
                title="About Luxe Adobes"
                subtitle="Crafting exceptional experiences in the world's most beautiful destinations"
              />
              <div className="space-y-6 text-charcoal leading-relaxed">
                <p className="text-base lg:text-lg">
                  Luxe Adobes represents a collection of carefully curated luxury resorts, 
                  each designed to offer an unparalleled experience of tranquility and elegance.
                </p>
                <p className="text-base lg:text-lg">
                  Our properties are nestled in pristine locations, where nature's beauty 
                  meets sophisticated design and world-class hospitality.
                </p>
              </div>
              <div className="mt-8">
                <Button to="/about" variant="outline">
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* About image - minimal editorial card */}
            <motion.div
              className="group relative isolate w-full min-h-[260px] sm:min-h-[300px] lg:min-h-[400px] rounded-[2rem] bg-transparent transition-[transform,box-shadow] duration-500 ease-out hover:shadow-[0_36px_72px_-34px_rgba(8,10,14,0.32)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{
                y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
              }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="relative h-full min-h-[260px] sm:min-h-[300px] overflow-hidden rounded-[1.7rem] border border-black/[0.08] bg-[#f5f5f7] shadow-[0_20px_48px_-30px_rgba(8,10,14,0.28)] lg:min-h-[400px]">
                <ResponsiveImg
                  src="/images/home/about/luxe-adobes.webp"
                  alt="Luxe Adobes property exterior"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 block h-full w-full object-cover transition-[filter] duration-700 ease-out group-hover:brightness-[1.06]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.22)_0%,transparent_34%)]" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" />
                <div className="pointer-events-none absolute -left-[26%] top-0 h-full w-[40%] -skew-x-[16deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[108%] group-hover:opacity-100" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Destinations  -  luxury carousel-style switcher */}
      <Section className="bg-charcoal overflow-hidden">
        <div className="max-w-[90vw] mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12"
          >
            <p className="font-sans text-gold tracking-[0.35em] uppercase text-sm mb-4">Destinations</p>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-warm mb-4">
              Where We Are
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mb-6" />
            <p className="font-sans text-warm/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Curated escapes in India&apos;s most beautiful landscapes.
            </p>
          </motion.div>

          {/* Destination selector  -  pill style + prev/next */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-14"
          >
            <LayoutGroup id="destinations">
              <div className="relative flex items-center gap-1 rounded-full border border-gold/30 bg-charcoal/80 p-1.5 backdrop-blur-sm">
                {[
                  { index: 0, label: 'Kerala', region: 'India' },
                  { index: 1, label: 'Tamil Nadu', region: 'India' },
                ].map(({ index, label, region }) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveDestination(index)}
                    className="relative px-5 sm:px-8 py-3 rounded-full font-sans text-xs sm:text-sm uppercase tracking-[0.18em] sm:tracking-widest transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                    aria-label={`View ${label}`}
                    aria-pressed={activeDestination === index}
                  >
                    {activeDestination === index && (
                      <motion.span
                        layoutId="destination-pill"
                        className="absolute inset-0 rounded-full border border-gold/40 bg-gold/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className={activeDestination === index ? 'text-gold' : 'text-warm/70 hover:text-warm'}>
                        {label}
                      </span>
                      <span className="text-xs text-warm/50 hidden sm:inline">{region}</span>
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveDestination((prev) => (prev === 0 ? 1 : prev - 1))}
                className="p-2 rounded-full border border-gold/20 text-warm/60 hover:text-gold hover:border-gold/40 transition-colors duration-300"
                aria-label="Previous destination"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="font-sans text-xs text-warm/50 tabular-nums">
                {String(activeDestination + 1).padStart(2, '0')} / 02
              </span>
              <button
                type="button"
                onClick={() => setActiveDestination((prev) => (prev === 1 ? 0 : prev + 1))}
                className="p-2 rounded-full border border-gold/20 text-warm/60 hover:text-gold hover:border-gold/40 transition-colors duration-300"
                aria-label="Next destination"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              {activeDestination === 0 && (
                <motion.div
                  key="wayanad"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative w-full"
                >
                  <p className="font-sans text-gold/90 tracking-widest uppercase text-xs mb-2">State</p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-warm mb-2">Kerala</h3>
                  <p className="font-sans text-warm/70 text-sm lg:text-base mb-8 max-w-xl">
                    Misty hills, coffee estates, and timeless luxury in the Western Ghats.
                  </p>
          {/* Asymmetric luxury grid  -  Wayanad (beauty of Kerala)  -  fixed image dimensions */}
          <div className="grid grid-cols-12 gap-3 lg:gap-4 grid-rows-[160px_160px] sm:grid-rows-[190px_190px] lg:grid-rows-[240px_240px]">
            <div className="col-span-12 lg:col-span-7 row-span-2 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full min-h-0">
              <ResponsiveImg src={WAYANAD_DESTINATION_IMAGES.hero} alt="Wayanad  -  misty hills of Kerala" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={800} height={380} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="font-serif text-warm text-lg lg:text-xl">Wayanad</p>
                <p className="text-warm/80 text-xs">Misty hills &amp; timeless beauty  -  Kerala</p>
              </div>
            </div>
            <div className="col-span-6 lg:col-span-5 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-[160px] sm:h-[190px] lg:h-[240px]">
              <ResponsiveImg src={WAYANAD_DESTINATION_IMAGES.waterfall} alt="Wayanad  -  waterfalls of Kerala" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={500} height={240} loading="lazy" />
              <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
            </div>
            <div className="col-span-6 lg:col-span-5 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-[160px] sm:h-[190px] lg:h-[240px]">
              <ResponsiveImg src={WAYANAD_DESTINATION_IMAGES.mountains} alt="Wayanad  -  Western Ghats" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={500} height={240} loading="lazy" />
              <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-56 lg:h-64">
              <ResponsiveImg src={WAYANAD_DESTINATION_IMAGES.greenHills} alt="Wayanad  -  lush green hills" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={600} height={256} loading="lazy" />
              <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
            </div>
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-56 lg:h-64">
              <ResponsiveImg src={WAYANAD_DESTINATION_IMAGES.backwaters} alt="Kerala backwaters  -  houseboats and palm-lined waterways" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={600} height={256} loading="lazy" />
              <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
            </div>
          </div>

                  <DestinationExploreCta
                    to="/destinations/wayanad"
                    label="Explore Wayanad resorts"
                  />
                </motion.div>
              )}
              {activeDestination === 1 && (
                <motion.div
                  key="ooty"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative w-full"
                >
                  <p className="font-sans text-gold/90 tracking-widest uppercase text-xs mb-2">State</p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-warm mb-2">Tamil Nadu</h3>
                  <p className="font-sans text-warm/70 text-sm lg:text-base mb-8 max-w-xl">
                    The Queen of Hill Stations  -  tea gardens, misty Nilgiris, and colonial charm.
                  </p>
                  <div className="grid grid-cols-12 gap-3 lg:gap-4 grid-rows-[160px_160px] sm:grid-rows-[190px_190px] lg:grid-rows-[240px_240px]">
                    <div className="col-span-12 lg:col-span-7 row-span-2 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full min-h-0">
                      <ResponsiveImg src={OOTY_DESTINATION_IMAGES.hero} alt="Tea estates and hills, Coonoor  -  Nilgiris, Tamil Nadu" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={800} height={380} loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="font-serif text-warm text-lg lg:text-xl">Ooty</p>
                        <p className="text-warm/80 text-xs">Queen of Hill Stations, Tamil Nadu</p>
                      </div>
                    </div>
                    <div className="col-span-6 lg:col-span-5 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-[160px] sm:h-[190px] lg:h-[240px]">
                      <ResponsiveImg src={OOTY_DESTINATION_IMAGES.forestHouse} alt="Ooty  -  forest retreat" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={500} height={240} loading="lazy" />
                      <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
                    </div>
                    <div className="col-span-6 lg:col-span-5 relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-[160px] sm:h-[190px] lg:h-[240px]">
                      <ResponsiveImg src={OOTY_DESTINATION_IMAGES.lake} alt="Ooty Lake" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={500} height={240} loading="lazy" />
                      <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
                    <div className="relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-56 lg:h-64">
                      <ResponsiveImg src={OOTY_DESTINATION_IMAGES.gardens} alt="Ooty gardens" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={600} height={256} loading="lazy" />
                      <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl lg:rounded-2xl group w-full h-56 lg:h-64">
                      <ResponsiveImg src={OOTY_DESTINATION_IMAGES.tourism} alt="Shore Temple, Mamallapuram  -  UNESCO heritage site, Tamil Nadu" sizes={HOME_DESTINATION_IMG_SIZES} className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" width={600} height={256} loading="lazy" />
                      <div className="absolute inset-0 border border-gold/20 rounded-xl lg:rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                  <DestinationExploreCta
                    to="/destinations/ooty"
                    label="Explore Ooty resorts"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* Step 4: Featured Properties Section */}
      <Section className="bg-sand">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <SectionTitle 
            title="Featured Properties"
            subtitle="Discover our handpicked collection of luxury resorts"
            align="center"
          />
          
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <div key={property.slug} className="min-w-[min(80vw,260px)] shrink-0 snap-start md:min-w-0 md:shrink md:w-auto">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button to="/properties" variant="outline">
              View All Properties
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* Step 5: Signature Experiences Section */}
      <Section className="bg-warm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <SectionTitle 
            title="Signature Experiences"
            subtitle="Curated moments that define luxury"
            align="center"
          />
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              { title: "Mindful Renewal", description: "Find calm, clarity, and emotional balance" },
              { title: "Culinary Excellence", description: "World-class dining experiences" },
              { title: "Adventure & Nature", description: "Explore pristine landscapes" },
              { title: "Cultural Immersion", description: "Connect with local heritage" },
            ].map((experience, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-warm p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl text-center hover:shadow-lg transition duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-charcoal mb-1 sm:mb-2">{experience.title}</h3>
                <p className="text-soft text-[11px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed">{experience.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Step 6: Why Luxe Adobes Section */}
      <Section className="bg-sand">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <SectionTitle 
            title="Why Luxe Adobes"
            subtitle="What sets us apart"
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                title: "Built on Trust", 
                description: "Transparent standards, reliable quality, and consistent care at every property" 
              },
              { 
                title: "Thoughtful Design", 
                description: "Spaces that blend seamlessly with nature while offering modern comfort" 
              },
              { 
                title: "Exceptional Service", 
                description: "Warm, attentive hospitality tailored to every stage of your stay" 
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="font-serif text-2xl text-charcoal mb-4">{item.title}</h3>
                <p className="text-soft leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      <MembershipCardsShowcase prefersReducedMotion={prefersReducedMotion} />

      <TransportPosterSection />

      <GuestExperiencesSection prefersReducedMotion={prefersReducedMotion} />

      <section
        className="relative overflow-hidden"
        aria-label="Moments from our properties and guest testimonials"
      >
        <MomentsPinnedGallery prefersReducedMotion={prefersReducedMotion} />
        <div className="relative bg-warm pt-10 lg:pt-14">
          <div
            className="pointer-events-none absolute inset-x-0 -top-20 z-[1] h-24 bg-gradient-to-b from-white via-white/80 to-transparent"
            aria-hidden
          />
          <div className="relative z-[2] mx-auto max-w-[90vw] px-4 pb-16 lg:px-8 lg:pb-28">
            <GuestTestimonialsCarousel rootClassName="mt-0" />
          </div>
        </div>
      </section>

      <BrandsShowcase />

      <FaqSection title="Questions about Luxe Adobes resorts" faqs={SITE_FAQS} />

      <Footer />
    </div>
  );
}

export default Home;
