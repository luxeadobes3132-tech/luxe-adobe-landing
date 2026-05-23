import { motion } from 'framer-motion';
import Seo from '../components/seo/Seo';
import { contactJsonLd } from '../components/seo/jsonLd';
import { PAGE_SEO } from '../data/siteSeo';
import Footer from '../components/layout/Footer';
import Section from '../components/ui/Section';
import PageHeader from '../components/ui/PageHeader';
import EnquiryStudio from '../components/ui/EnquiryStudio';
import FindUsMap from '../components/ui/FindUsMap';
import ResponsiveImg from '../components/ui/ResponsiveImg';
import propertiesData from '../data/properties.json';
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_HEAD_OFFICE_MAP_EMBED_URL,
  SITE_INSTAGRAM,
  SITE_PHONES,
  siteWhatsAppUrl,
} from '../data/siteContact';

const cardBase =
  'group relative flex flex-col rounded-2xl border border-charcoal/[0.08] bg-white/50 p-6 text-left shadow-[0_1px_0_rgba(28,28,28,0.04)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-gold/25 hover:bg-white/75 hover:shadow-[0_16px_48px_-28px_rgba(28,28,28,0.14)] sm:p-7';

const iconWrap =
  'mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/[0.1] text-gold transition-colors duration-300 group-hover:bg-gold/[0.16]';

function Contact() {
  return (
    <div className="min-h-screen bg-warm">
      <Seo {...PAGE_SEO.contact} jsonLd={contactJsonLd()} />

      <PageHeader
        title="Get in Touch"
        subtitle="We're here to help you plan your perfect stay"
        variant="contact"
      />

      {/* Channels */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-warm via-sand/30 to-warm pb-14 pt-12 lg:pb-20 lg:pt-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-10 text-center lg:mb-14">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-[11px]">
              Reach us
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-charcoal sm:text-4xl">Contact</h2>
            <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-soft">
              Choose the channel that suits you  -  we respond with the same care everywhere.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className={cardBase}
            >
              <div className={iconWrap} aria-hidden>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-charcoal">Phone</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm text-soft">
                {SITE_PHONES.map(({ tel, display }) => (
                  <a
                    key={tel}
                    href={`tel:${tel}`}
                    className="font-medium text-charcoal/85 transition-colors hover:text-gold"
                  >
                    {display}
                  </a>
                ))}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={cardBase}
            >
              <div className={iconWrap} aria-hidden>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-charcoal">Email</h3>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="mt-3 break-all text-sm font-medium text-charcoal/85 transition-colors hover:text-gold"
              >
                {SITE_EMAIL}
              </a>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className={cardBase}
            >
              <div className={iconWrap} aria-hidden>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-charcoal">WhatsApp</h3>
              <a
                href={siteWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-medium text-charcoal/85 transition-colors hover:text-gold"
              >
                Chat with us
              </a>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className={cardBase}
            >
              <div className={iconWrap} aria-hidden>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-charcoal">Address</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft">
                {SITE_ADDRESS.lines.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </motion.article>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className={`${cardBase} md:col-span-2 md:flex-row md:items-center md:gap-10 lg:gap-14`}
            >
              <div className="relative inline-flex shrink-0 items-baseline" aria-hidden>
                <div
                  className="pointer-events-none absolute -inset-3 rounded-2xl border border-gold/15 sm:-inset-4"
                  aria-hidden
                />
                <span className="relative font-serif text-4xl leading-none tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
                  24
                </span>
                <span className="relative font-serif text-4xl leading-none text-gold/80 sm:text-6xl lg:text-7xl">
                  /
                </span>
                <span className="relative font-serif text-4xl leading-none tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
                  7
                </span>
              </div>
              <span className="sr-only">24/7</span>
              <div className="mt-6 min-w-0 max-w-md md:mt-1 md:flex-1">
                <h3 className="font-serif text-2xl tracking-tight text-charcoal sm:text-[1.85rem] sm:leading-snug">
                  Office hours
                </h3>
                <div
                  className="mt-2.5 h-px w-12 bg-gradient-to-r from-gold/55 to-transparent sm:w-14"
                  aria-hidden
                />
                <p className="mt-3.5 text-[15px] leading-relaxed text-soft">
                  Always open  -  reach us on phone, email, or WhatsApp whenever it suits you.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={`${cardBase} items-center text-center`}
            >
              <div className="mx-auto flex flex-col items-center">
                <h3 className="font-serif text-lg text-charcoal">Follow</h3>
                <a
                  href={SITE_INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-xl border border-charcoal/10 bg-warm/80 p-2.5 transition-colors hover:border-gold/30"
                  aria-label="Open Instagram via QR code"
                >
                  <ResponsiveImg
                    src="/images/contact/instaQR.jpeg"
                    alt="Instagram QR code for Luxe Adobes"
                    sizes="128px"
                    className="h-28 w-28 rounded-md object-cover sm:h-32 sm:w-32"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <a
                  href={SITE_INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-charcoal/85 transition-colors hover:text-gold"
                  aria-label={`Instagram  -  ${SITE_INSTAGRAM.handle}`}
                >
                  {SITE_INSTAGRAM.handle}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Enquiry */}
      <Section className="bg-sand/80 py-14 lg:py-20">
        <EnquiryStudio properties={propertiesData.filter((p) => p.hasDetailPage === true)} />
      </Section>

      {/* Map */}
      <Section className="relative bg-warm pb-16 pt-12 lg:pb-24 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-10 text-center lg:mb-12">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-[11px]">
              Location
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-charcoal sm:text-4xl">
              Visit our head office
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold/55 to-transparent sm:w-20" />
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-soft">
              Our main office is in Kottakkal, Kerala. Use the map for directions, or reach out first if you
              would like to arrange a visit.
            </p>
          </div>

          <FindUsMap
            embedUrl={SITE_HEAD_OFFICE_MAP_EMBED_URL}
            title="Luxe Adobes head office map  -  Kottakkal, Kerala"
            addressLines={SITE_ADDRESS.lines}
          />
        </motion.div>
      </Section>

      <Footer />
    </div>
  );
}

export default Contact;
