import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Button from '../ui/Button';

const springHover = { type: 'spring', stiffness: 420, damping: 28, mass: 0.85 };
const springTilt = { stiffness: 320, damping: 28, mass: 0.45 };

function PropertyCard({ property, featured = false }) {
  const canOpenDetail = property.hasDetailPage === true;
  const reduce = useReducedMotion();
  const cardRef = useRef(null);
  const disableTilt = reduce || featured;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, springTilt);
  const smoothY = useSpring(my, springTilt);

  const rotateX = useTransform(smoothY, [0, 1], [7.5, -7.5]);
  const rotateY = useTransform(smoothX, [0, 1], [-7.5, 7.5]);

  const handlePointerMove = (e) => {
    if (disableTilt || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const handlePointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const btnBase =
    'w-full min-h-[34px] sm:min-h-[46px] text-[11px] sm:text-sm font-semibold border-2 backdrop-blur-sm tracking-wide shadow-md transition-all duration-300';

  return (
    <motion.article
      ref={cardRef}
      className={`group flex h-full min-h-0 flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-charcoal/[0.08] bg-warm shadow-[0_2px_16px_-4px_rgba(28,28,28,0.08)]${featured ? ' touch-pan-x' : ''}`}
      style={{ perspective: disableTilt ? undefined : 1000 }}
      initial={false}
      whileHover={
        disableTilt
          ? undefined
          : {
              y: -12,
              scale: 1.02,
              boxShadow:
                '0 28px 56px -12px rgba(28,28,28,0.22), 0 14px 32px -10px rgba(198,167,94,0.18)',
            }
      }
      transition={springHover}
      onPointerMove={disableTilt ? undefined : handlePointerMove}
      onPointerLeave={disableTilt ? undefined : handlePointerLeave}
    >
      <motion.div
        className="flex h-full min-h-0 flex-col"
        style={
          disableTilt
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
      >
        {/* Media  -  fixed height on all cards */}
        <div
          className={`relative w-full flex-shrink-0 overflow-hidden border-b border-gold/20 bg-gradient-to-br from-white via-warm to-sand/80 ${
            featured ? 'h-[220px] lg:h-[300px]' : 'h-[132px] sm:h-[220px] lg:h-[300px]'
          }`}
          style={{ transform: 'translateZ(14px)' }}
        >
          <div className="absolute inset-3 sm:inset-5 rounded-xl sm:rounded-2xl border border-gold/25 bg-white/70 backdrop-blur-sm" />
          {property.nameAsLogo ? (
            <div className="absolute inset-0 z-[1] flex items-center justify-center px-3 sm:px-6">
              <h3 className="m-0 max-w-[92%] text-center font-serif text-lg sm:text-2xl leading-tight tracking-tight text-charcoal transition-colors duration-500 ease-out sm:text-3xl lg:text-[2.125rem] group-hover:text-gold">
                {property.name}
              </h3>
            </div>
          ) : (
            <motion.img
              src={property.logo || '/images/home/branding/luxe-adobes-black.png'}
              alt={`${property.name} logo`}
              className="absolute inset-0 z-[1] m-auto max-h-[68%] max-w-[80%] sm:max-h-[72%] sm:max-w-[78%] object-contain"
              width={500}
              height={280}
              loading="lazy"
              whileHover={reduce ? undefined : { scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
            aria-hidden
          />
        </div>

        {/* Body */}
        <div
          className={`flex flex-1 flex-col transition-colors duration-500 group-hover:bg-warm/[0.97] ${
            featured
              ? 'px-6 pb-6 pt-6 lg:px-8 lg:pb-8 lg:pt-8'
              : 'px-3 pb-3 pt-3 sm:px-6 sm:pb-6 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-8'
          }`}
          style={{ transform: 'translateZ(6px)' }}
        >
          <div
            className={`mb-2 ${
              featured ? 'min-h-[2.75rem] lg:min-h-[3.25rem]' : 'mb-1 sm:mb-2 min-h-[1.1rem] sm:min-h-[2.75rem] lg:min-h-[3.25rem]'
            }`}
          >
            <h3
              className={`m-0 font-serif text-charcoal transition-colors duration-500 ease-out group-hover:text-gold ${
                featured
                  ? 'text-xl lg:text-2xl'
                  : 'text-[10px] sm:text-xl lg:text-2xl whitespace-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              }`}
            >
              {property.name}
            </h3>
          </div>

          <p
            className={`mb-4 flex items-center gap-2 text-soft ${
              featured
                ? 'text-sm'
                : 'mb-2 sm:mb-4 gap-1.5 sm:gap-2 text-[10px] sm:text-sm whitespace-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            }`}
          >
            <svg className={`shrink-0 ${featured ? 'h-4 w-4' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          <p className={`mb-6 min-h-[3.25rem] leading-relaxed text-charcoal line-clamp-2${featured ? '' : ' hidden sm:block'}`}>
            {property.tagline}
          </p>

          <div className="mt-auto w-full">
            {canOpenDetail ? (
              featured ? (
                <Button
                  to={`/property/${property.slug}`}
                  variant="outline"
                  className={`${btnBase} w-full border-charcoal/60 bg-warm/50 text-charcoal hover:border-gold hover:bg-gold hover:text-warm hover:shadow-lg`}
                >
                  View Details
                </Button>
              ) : (
                <>
                  <Button
                    to={`/property/${property.slug}`}
                    variant="outline"
                    className="sm:hidden h-7 min-h-[28px] px-1.5 !py-0 border-charcoal/60 bg-warm/50 text-charcoal text-[9px] leading-none whitespace-nowrap hover:border-gold hover:bg-gold hover:text-warm"
                    aria-label={`View details of ${property.name}`}
                  >
                    View Details
                  </Button>
                  <Button
                    to={`/property/${property.slug}`}
                    variant="outline"
                    className={`${btnBase} hidden sm:inline-flex w-full border-charcoal/60 bg-warm/50 text-charcoal hover:border-gold hover:bg-gold hover:text-warm hover:shadow-lg`}
                  >
                    View Details
                  </Button>
                </>
              )
            ) : featured ? (
              <Button
                type="button"
                disabled
                variant="outline"
                className={`${btnBase} cursor-not-allowed border-charcoal/30 bg-warm/45 text-charcoal/50 shadow-none hover:scale-100`}
              >
                Coming soon
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  disabled
                  variant="outline"
                  className="sm:hidden h-7 min-h-[28px] px-1.5 !py-0 cursor-not-allowed border-charcoal/30 bg-warm/45 text-charcoal/50 text-[9px] leading-none whitespace-nowrap shadow-none"
                  aria-label={`${property.name} coming soon`}
                >
                  Coming Soon
                </Button>
                <Button
                  type="button"
                  disabled
                  variant="outline"
                  className={`${btnBase} hidden sm:inline-flex cursor-not-allowed border-charcoal/30 bg-warm/45 text-charcoal/50 shadow-none hover:scale-100`}
                >
                  Coming soon
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default PropertyCard;
