import { motion, useReducedMotion } from 'framer-motion';

const easeLux = [0.22, 1, 0.36, 1];

function countLabel(count) {
  if (count === 0) return 'Coming soon';
  if (count === 1) return '1 property';
  return `${count} properties`;
}

export default function LocationsMap({ locations, propertyCountByLocation, eyebrow }) {
  const reduceMotion = useReducedMotion();

  const listVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.1,
            delayChildren: 0.08,
            when: 'beforeChildren',
          },
    },
  };

  const rowVariants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 28, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: easeLux },
    },
  };

  return (
    <div className="relative w-full">
      {/* Soft radial backdrop  -  minimal depth, no heavy chrome */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(520px,70vh)] w-[min(900px,95%)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(198,167,94,0.06) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: easeLux }}
        className="relative mx-auto max-w-2xl"
      >
        {eyebrow ? (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeLux, delay: 0.12 }}
            className="mb-16 text-center font-sans text-[11px] uppercase tracking-[0.35em] text-charcoal/45"
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="relative"
        >
          {locations.map((location, i) => {
            const count = propertyCountByLocation?.[location] ?? 0;
            const indexLabel = String(i + 1).padStart(2, '0');

            return (
              <motion.li
                key={location}
                variants={rowVariants}
                className="group relative list-none first:border-t first:border-charcoal/[0.08]"
              >
                <div className="relative flex gap-6 border-b border-charcoal/[0.08] py-11 transition-[transform] duration-200 ease-out will-change-transform group-hover:translate-x-0.5 md:gap-10 md:py-14 lg:py-16 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                  {/* Growing accent stem */}
                  <div className="relative flex w-10 shrink-0 justify-center md:w-12">
                    <motion.div
                      initial={reduceMotion ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.55,
                        ease: easeLux,
                        delay: 0.15 + i * 0.06,
                      }}
                      className="absolute left-1/2 top-2 bottom-2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold/0 via-gold/35 to-gold/0 opacity-70 transition-opacity duration-200 group-hover:opacity-100 md:top-3 md:bottom-3 motion-reduce:transition-none"
                      aria-hidden
                    />
                    <span className="relative z-[1] pt-0.5 font-mono text-[10px] font-medium tabular-nums tracking-[0.22em] text-charcoal/25 transition-colors duration-200 group-hover:text-charcoal/38 md:text-[11px] motion-reduce:transition-none">
                      {indexLabel}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                      <div className="min-w-0 space-y-3">
                        <h3 className="font-sans text-[1.65rem] font-normal leading-[1.15] tracking-[-0.02em] text-charcoal transition-[font-weight] duration-200 ease-out group-hover:font-bold md:text-[2rem] motion-reduce:transition-none">
                          {location}
                        </h3>
                      </div>

                      <motion.p
                        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          ease: easeLux,
                          delay: 0.28 + i * 0.08,
                        }}
                        className="shrink-0 font-sans text-[15px] text-soft transition-colors duration-200 group-hover:text-charcoal/60 motion-reduce:transition-none"
                      >
                        {countLabel(count)}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Closing flourish  -  minimal */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeLux, delay: 0.2 }}
          className="mt-10 flex justify-center md:mt-14"
          aria-hidden
        >
          <span className="h-1 w-1 rounded-full bg-gold/35 ring-[6px] ring-gold/[0.06]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
