import { motion } from 'framer-motion';
import { PAGE_HEADER_IMAGES } from '../../data/criticalHeroImages';
import LcpImagePreload from '../seo/LcpImagePreload';
import ResponsiveImg from './ResponsiveImg';

const PAGE_HEADER_SIZES = '(max-width: 768px) 100vw, 1200px';

export default function PageHeader({ title, subtitle, variant = 'about', className = '' }) {
  const bgImage = PAGE_HEADER_IMAGES[variant] || PAGE_HEADER_IMAGES.about;

  return (
    <>
      <LcpImagePreload src={bgImage} sizes={PAGE_HEADER_SIZES} />
      <section
      className={`relative w-full overflow-hidden bg-charcoal mt-16 lg:mt-20 ${className}`}
      style={{ aspectRatio: '21 / 9', minHeight: '180px', maxHeight: '280px' }}
    >
      <div className="absolute inset-0">
        <ResponsiveImg
          src={bgImage}
          alt=""
          sizes={PAGE_HEADER_SIZES}
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={823}
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Light overlay so photo stays visible; slightly darker at bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-2xl sm:text-4xl lg:text-5xl text-warm font-medium tracking-tight mb-3"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-sans text-sm sm:text-lg text-warm/80"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
