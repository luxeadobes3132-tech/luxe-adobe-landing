import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Seo from '../components/seo/Seo';
import { propertyJsonLd } from '../components/seo/jsonLd';
import { propertySeo } from '../data/siteSeo';
import Footer from '../components/layout/Footer';
import Section from '../components/ui/Section';
import SectionTitle from '../components/ui/SectionTitle';
import AccommodationGallerySection from '../components/property/AccommodationGallerySection';
import ImageGallery from '../components/ui/ImageGallery';
import MapEmbed from '../components/ui/MapEmbed';
import Button from '../components/ui/Button';
import PropertyCard from '../components/property/PropertyCard';
import propertiesData from '../data/properties.json';
import { getResponsiveImageAttrs } from '../utils/responsiveImage';
import LcpImagePreload from '../components/seo/LcpImagePreload';
import { siteWhatsAppUrl } from '../data/siteContact';

const viewportReveal = {
  once: true,
  amount: 0.28,
  margin: '0px 0px -12% 0px',
};

function PropertyDetailView({ property, relatedProperties }) {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress: pageProgress } = useScroll();
  const progressScaleX = useTransform(pageProgress, [0, 1], [0, 1]);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(
    heroProgress,
    [0, 1],
    ['0%', prefersReducedMotion ? '0%' : '22%']
  );
  const heroImgScale = useTransform(
    heroProgress,
    [0, 1],
    [1, prefersReducedMotion ? 1 : 1.08]
  );
  const heroOverlayOpacity = useTransform(heroProgress, [0, 1], [0.3, 0.52]);

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ['start end', 'end start'],
  });
  const aboutSlideX = useTransform(
    aboutProgress,
    [0, 0.35, 0.7, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [36, 0, 0, -6]
  );

  const reduced = Boolean(prefersReducedMotion);
  const childFadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.12 : 0.52, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.09,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  };
  const staggerTight = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.06,
        delayChildren: reduced ? 0 : 0.04,
      },
    },
  };

  const aboutParas = property.about?.trim()
    ? property.about.trim().split(/\n\n+/)
    : [
        'Every space here is composed for unhurried days - architecture, landscape, and hospitality working as one. Our team shapes each stay around the pace you choose.',
      ];

  const aboutImageSrc =
    property.heroImages?.length > 1
      ? property.heroImages[1]
      : property.heroImages?.[0];
  const hasAboutImage = Boolean(aboutImageSrc);
  const heroLeadSrc = property.heroImages?.[0] ?? '';
  const heroResponsive = useMemo(
    () =>
      heroLeadSrc
        ? getResponsiveImageAttrs(heroLeadSrc, '100vw')
        : { webpSrcSet: undefined, sizes: undefined, fallbackSrc: '', imgSrc: '' },
    [heroLeadSrc]
  );
  const aboutResponsive = useMemo(
    () =>
      aboutImageSrc
        ? getResponsiveImageAttrs(aboutImageSrc, '(max-width: 1024px) 100vw, 45vw')
        : { webpSrcSet: undefined, sizes: undefined, fallbackSrc: '', imgSrc: '' },
    [aboutImageSrc]
  );

  return (
    <div className="relative min-h-screen">
      {!reduced && (
        <motion.div
          className="pointer-events-none fixed left-0 right-0 top-16 z-[55] h-0.5 origin-left bg-gold/50 lg:top-20"
          style={{ scaleX: progressScaleX }}
          aria-hidden
        />
      )}

      <Seo {...propertySeo(property)} jsonLd={propertyJsonLd(property)} />
      {heroLeadSrc ? <LcpImagePreload src={heroLeadSrc} sizes="100vw" /> : null}

      <nav className="mt-16 border-b border-sand bg-warm py-4 lg:mt-20">
        <div className="mx-auto max-w-[90vw] px-4 lg:px-8">
          <motion.div
            className="flex items-center gap-2 text-sm"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" className="text-soft transition hover:text-gold">
              Home
            </Link>
            <span className="text-soft">/</span>
            <Link to="/properties" className="text-soft transition hover:text-gold">
              Properties
            </Link>
            <span className="text-soft">/</span>
            <span className="text-charcoal">{property.name}</span>
          </motion.div>
        </div>
      </nav>

      {property.heroImages && property.heroImages.length > 0 ? (
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[56vh] min-h-[320px] w-full overflow-hidden bg-charcoal sm:h-[60vh] sm:min-h-[380px] lg:h-[80vh]"
        >
          <motion.div className="absolute left-0 right-0 top-[-10%] h-[120%] w-full">
            <picture className="contents">
              {heroResponsive.webpSrcSet ? (
                <source type="image/webp" srcSet={heroResponsive.webpSrcSet} sizes={heroResponsive.sizes} />
              ) : null}
              <motion.img
                src={heroResponsive.imgSrc || property.heroImages[0]}
                alt={`${property.name}  -  hero`}
                width={1920}
                height={1080}
                fetchpriority="high"
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
                style={{ y: heroImgY, scale: heroImgScale }}
              />
            </picture>
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-black will-change-[opacity]"
            style={{ opacity: heroOverlayOpacity }}
            aria-hidden
          />
        </motion.section>
      ) : (
        <section
          ref={heroRef}
          className="relative h-[56vh] min-h-[320px] w-full overflow-hidden sm:h-[60vh] sm:min-h-[380px] lg:h-[80vh]"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-sand">
            <p className="text-soft">No images available</p>
          </div>
        </section>
      )}

      <Section className="bg-warm">
        <motion.div
          className="mx-auto max-w-[90vw] px-4 lg:px-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1 variants={childFadeUp} className="mb-4 font-serif text-4xl text-charcoal lg:text-5xl">
              {property.name}
            </motion.h1>
            <motion.p variants={childFadeUp} className="mb-6 text-lg text-gold">
              {property.address || property.location}
            </motion.p>
            {property.tagline && (
              <motion.p
                variants={childFadeUp}
                className="mb-8 font-serif text-xl italic text-charcoal lg:text-2xl"
              >
                {property.tagline}
              </motion.p>
            )}
            {property.description && (
              <motion.p
                variants={childFadeUp}
                className="mx-auto max-w-3xl text-base leading-relaxed text-soft lg:text-lg"
              >
                {property.description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </Section>

      <div ref={aboutRef} className="relative">
        <Section className="bg-sand !py-14 lg:!py-24">
          <div
            className={`mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-10 lg:gap-12 xl:gap-14 ${hasAboutImage ? 'lg:grid-cols-12' : ''}`}
          >
            {hasAboutImage && (
              <motion.div
                className="mx-auto w-full max-w-sm lg:col-span-5 lg:mx-0 lg:max-w-none"
                variants={childFadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportReveal}
              >
                <div
                  className="overflow-hidden rounded-lg bg-charcoal/[0.04] shadow-[0_20px_50px_-24px_rgba(28,28,28,0.25)] ring-1 ring-charcoal/[0.06]"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  <picture className="contents">
                    {aboutResponsive.webpSrcSet ? (
                      <source type="image/webp" srcSet={aboutResponsive.webpSrcSet} sizes={aboutResponsive.sizes} />
                    ) : null}
                    <img
                      src={aboutResponsive.imgSrc || aboutImageSrc}
                      alt={`${property.name}  -  grounds`}
                      className="h-full w-full object-cover object-center"
                      width={720}
                      height={960}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-soft">
                  {property.address || property.location}
                </p>
              </motion.div>
            )}

            <motion.div
              className={`w-full text-left ${hasAboutImage ? 'lg:col-span-7' : 'mx-auto flex max-w-xl justify-center lg:justify-start'}`}
              style={{ x: aboutSlideX }}
            >
              <motion.div
                variants={staggerTight}
                initial="hidden"
                whileInView="show"
                viewport={viewportReveal}
                className={hasAboutImage ? '' : 'max-w-xl'}
              >
                <motion.h2
                  variants={childFadeUp}
                  className="mb-7 flex items-center gap-3 text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-soft"
                >
                  <span className="h-px w-7 shrink-0 bg-charcoal/18" aria-hidden />
                  About this property
                </motion.h2>
                <motion.div
                  variants={childFadeUp}
                  className="space-y-5 border-l border-charcoal/[0.08] pl-6 font-serif text-[1.0625rem] leading-[1.82] text-charcoal/75 md:pl-7"
                >
                  {aboutParas.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </Section>
      </div>

      <Section className="bg-warm !py-10 lg:!py-20">
        <div className="mx-auto max-w-[90vw] px-4 lg:px-8">
          <AccommodationGallerySection property={property} viewportReveal={viewportReveal} />
        </div>
      </Section>

      <Section className="bg-sand">
        <motion.div
          className="mx-auto max-w-[90vw] px-4 lg:px-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
        >
          <motion.div variants={childFadeUp}>
            <SectionTitle
              title="Amenities & Services"
              subtitle="Everything you need for a perfect stay"
              align="center"
            />
          </motion.div>

          {property.amenities && property.amenities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {property.amenities.map((amenity, idx) => (
                <motion.div
                  key={idx}
                  variants={childFadeUp}
                  whileHover={reduced ? undefined : { y: -3, transition: { duration: 0.22 } }}
                  className="flex items-start gap-4 rounded-xl bg-warm p-6 shadow-sm ring-1 ring-charcoal/[0.04] transition-shadow duration-300 hover:shadow-md hover:ring-charcoal/[0.07]"
                >
                  <div className="mt-1 h-6 w-6 flex-shrink-0">
                    <svg className="h-full w-full text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-charcoal">{amenity}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div variants={childFadeUp} className="py-12 text-center">
              <p className="text-soft">Amenity information coming soon.</p>
            </motion.div>
          )}
        </motion.div>
      </Section>

      {property.gallery && property.gallery.length > 0 && (
        <Section className="bg-warm">
          <motion.div
            className="mx-auto max-w-[90vw] px-4 lg:px-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
          >
            <motion.div variants={childFadeUp}>
              <SectionTitle title="Gallery" subtitle="A glimpse into your stay" align="center" />
            </motion.div>
            <motion.div variants={childFadeUp}>
              <ImageGallery images={property.gallery} title={property.name} />
            </motion.div>
          </motion.div>
        </Section>
      )}

      <Section className="bg-sand">
        <motion.div
          className="mx-auto max-w-[90vw] px-4 lg:px-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
        >
          <motion.div variants={childFadeUp}>
            <SectionTitle
              title="Location"
              subtitle={
                property.location ? `Discover ${property.location}` : `Discover ${property.name}`
              }
              align="center"
            />
          </motion.div>

          {property.mapEmbedUrl ? (
            <motion.div variants={childFadeUp} className="mb-8">
              <motion.div
                className="overflow-hidden rounded-lg shadow-[0_20px_50px_-20px_rgba(28,28,28,0.2)] ring-1 ring-charcoal/[0.06]"
                whileInView={
                  reduced ? undefined : { scale: [0.97, 1], opacity: [0.92, 1] }
                }
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <MapEmbed embedUrl={property.mapEmbedUrl} title={`${property.name} Location`} />
              </motion.div>
              {property.mapShareUrl && (
                <p className="mt-4 text-center">
                  <a
                    href={property.mapShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-gold underline-offset-4 transition-colors hover:text-charcoal hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div variants={childFadeUp} className="mb-8 py-12 text-center">
              <p className="text-soft">Map information coming soon.</p>
            </motion.div>
          )}

          <motion.div variants={childFadeUp} className="mt-8 text-center">
            <p className="mb-2 font-medium text-charcoal">Address</p>
            <p className="mx-auto max-w-2xl leading-relaxed text-soft">
              {property.address || property.location}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      <Section className="bg-charcoal">
        <motion.div
          className="mx-auto max-w-4xl px-4 text-center lg:px-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
        >
          <motion.h2
            variants={childFadeUp}
            className="mb-4 font-serif text-3xl text-warm lg:text-4xl"
          >
            Ready to Experience {property.name}?
          </motion.h2>
          <motion.p variants={childFadeUp} className="mb-8 text-lg leading-relaxed text-warm/80">
            Contact us to learn more or make an enquiry
          </motion.p>
          <motion.div
            variants={staggerTight}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <motion.div variants={childFadeUp}>
              <Button
                href={siteWhatsAppUrl(`Hi, I'm interested in ${property.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                Contact via WhatsApp
              </Button>
            </motion.div>
            <motion.div variants={childFadeUp}>
              <Button to="/contact" variant="secondary">
                Send Enquiry
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Section>

      {relatedProperties.length > 0 && (
        <Section className="bg-warm">
          <motion.div
            key={`related-${property.slug}`}
            className="mx-auto max-w-[90vw] px-4 lg:px-8"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={childFadeUp}>
              <SectionTitle
                title="Explore Other Properties"
                subtitle="Discover more luxury destinations"
                align="center"
              />
            </motion.div>
            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {relatedProperties.map((relatedProperty) => (
                <motion.div key={relatedProperty.slug} variants={childFadeUp} className="min-h-0">
                  <PropertyCard property={relatedProperty} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>
      )}

      <Footer />
    </div>
  );
}

function PropertyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = useMemo(
    () => propertiesData.find((p) => p.slug === slug),
    [slug]
  );

  useEffect(() => {
    if (!property) {
      navigate('/properties', { replace: true });
    }
  }, [property, navigate]);

  if (!property) {
    return (
      <Seo
        title="Property Not Found | Luxe Adobes"
        description="This property is not available. Browse our luxury resorts in Kerala and Tamil Nadu."
        path="/properties"
        noindex
      />
    );
  }

  const relatedProperties = propertiesData.filter((p) => p.slug !== property.slug).slice(0, 3);

  return (
    <PropertyDetailView
      key={property.slug}
      property={property}
      relatedProperties={relatedProperties}
    />
  );
}

export default PropertyDetail;
