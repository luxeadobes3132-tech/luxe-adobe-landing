import { motion } from 'framer-motion';
import Section from './Section';
import SectionTitle from './SectionTitle';
import { getDefaultOptimizedSrc } from '../../utils/responsiveImage';

const GUEST_EXPERIENCE_VIDEO_URL =
  'https://res.cloudinary.com/dppvbteec/video/upload/q_auto/f_auto/v1778216159/Luxeadobes_rqx9vb.mp4';

function GuestExperiencesSection({ prefersReducedMotion }) {
  return (
    <Section className="bg-warm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[90vw] px-4 lg:px-8"
      >
        <SectionTitle title="Guest Experiences" subtitle="Stories from our guests" align="center" />

        <p className="mx-auto mb-12 max-w-2xl text-center text-soft">
          From serene spa retreats to adventurous explorations, discover what makes a stay at Luxe
          Adobes unforgettable.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.9rem] border border-gold/20 bg-gradient-to-b from-[#f4ebdb]/80 via-warm to-[#efe3cf]/75 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/45 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-charcoal/10 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-3xl items-center justify-center gap-4 sm:gap-6">
              <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-gold/35 to-transparent sm:block" />

              <div className="relative w-[clamp(260px,78vw,330px)] sm:w-[clamp(290px,42vw,350px)]">
                <div className="relative rounded-[2.7rem] border border-[#2e2f34] bg-gradient-to-b from-[#22242a] via-[#15161b] to-[#0e0f12] p-[8px] shadow-[0_30px_65px_-24px_rgba(0,0,0,0.62)]">
                  <div className="relative w-full aspect-[9/16] overflow-hidden rounded-[2.35rem] bg-black ring-1 ring-white/10">
                    <div className="pointer-events-none absolute inset-x-0 top-2 z-[2] flex justify-center" aria-hidden>
                      <div className="h-6 w-[116px] rounded-full bg-black/95 ring-1 ring-white/15" />
                    </div>
                    <video
                      className="h-full w-full object-cover object-center"
                      poster={getDefaultOptimizedSrc('/images/home/experiences/wayanad-gate-resort.jpg')}
                      autoPlay={!prefersReducedMotion}
                      muted
                      loop
                      controls
                      controlsList="nofullscreen noremoteplayback nodownload"
                      disablePictureInPicture
                      playsInline
                      preload="metadata"
                    >
                      <source src={GUEST_EXPERIENCE_VIDEO_URL} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="pointer-events-none absolute -left-[2px] top-24 h-11 w-[2px] rounded-full bg-white/25" aria-hidden />
                  <div className="pointer-events-none absolute -left-[2px] top-38 h-16 w-[2px] rounded-full bg-white/25" aria-hidden />
                  <div className="pointer-events-none absolute -right-[2px] top-32 h-20 w-[2px] rounded-full bg-white/25" aria-hidden />
                </div>
                <div
                  className="pointer-events-none absolute inset-x-10 -bottom-3 h-5 rounded-full bg-black/55 blur-lg"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-4 -bottom-10 h-12 rounded-[999px] bg-black/35 blur-2xl"
                  aria-hidden
                />
              </div>

              <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-gold/35 to-transparent sm:block" />
            </div>
            <p className="relative mt-6 text-center font-serif text-sm italic tracking-wide text-charcoal/75 sm:text-base">
              Quiet luxury, captured in motion.
            </p>
          </div>
          <p className="mt-3 text-center text-sm text-soft">
            Muted autoplay preview enabled. Use controls for sound.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default GuestExperiencesSection;
