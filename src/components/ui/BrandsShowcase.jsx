import { motion, useReducedMotion } from 'framer-motion';
import brandsData from '../../data/brands.json';

const easeLux = [0.25, 0.46, 0.45, 0.94];
const lineEase = [0.22, 1, 0.36, 1];

const view = { once: true, amount: 0.3, margin: '0px 0px -48px 0px' };

function listVariants(reduce) {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.14,
      },
    },
  };
}

function itemVariants(reduce) {
  return {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: easeLux },
    },
  };
}

function BrandsShowcase() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative py-14 lg:py-20 overflow-x-hidden bg-gradient-to-b from-sand via-warm to-sand border-t border-charcoal/[0.06]"
      aria-labelledby="brands-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(198, 167, 94, 0.1), transparent 55%)',
        }}
      />
      <div className="relative max-w-[90vw] mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-12">
          <motion.p
            className="font-sans text-gold tracking-[0.35em] uppercase text-xs sm:text-sm mb-4"
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ duration: reduce ? 0 : 0.65, ease: easeLux }}
          >
            Our group
          </motion.p>
          <motion.h2
            id="brands-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal tracking-tight mb-4"
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{
              duration: reduce ? 0 : 0.72,
              ease: easeLux,
              delay: reduce ? 0 : 0.07,
            }}
          >
            Companies &amp; brands
          </motion.h2>
          <motion.div
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent mx-auto origin-center"
            initial={{ opacity: reduce ? 1 : 0, scaleX: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={view}
            transition={{
              duration: reduce ? 0 : 0.85,
              ease: lineEase,
              delay: reduce ? 0 : 0.16,
            }}
          />
        </div>

        <motion.div
          className="rounded-2xl border border-charcoal/[0.08] bg-warm/80 backdrop-blur-sm px-6 py-10 lg:px-12 lg:py-12 shadow-[0_2px_24px_-8px_rgba(28,28,28,0.12)]"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{
            duration: reduce ? 0 : 0.78,
            ease: easeLux,
            delay: reduce ? 0 : 0.08,
          }}
        >
          <motion.ul
            className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 sm:gap-x-16 list-none p-0 m-0"
            role="list"
            variants={listVariants(reduce)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {brandsData.map((brand) => (
              <motion.li
                key={brand.id}
                className="flex shrink-0 justify-center"
                variants={itemVariants(reduce)}
              >
                <div className="flex h-24 w-44 sm:h-28 sm:w-52 lg:h-32 lg:w-60 items-center justify-center px-2">
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className={`max-h-full max-w-full object-contain object-center opacity-[0.9] hover:opacity-100 transition-opacity duration-300 ${
                      brand.id === 'emerzin' ? 'scale-[1.45] sm:scale-[1.5] lg:scale-[1.52]' : ''
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

export default BrandsShowcase;
