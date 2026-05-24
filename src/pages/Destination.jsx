import { Link, useParams } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import FaqSection from '../components/seo/FaqSection';
import { destinationJsonLd } from '../components/seo/jsonLd';
import { destinationSeo, getDestinationBySlug } from '../data/destinations';
import propertiesData from '../data/properties.json';
import Footer from '../components/layout/Footer';
import PageHeader from '../components/ui/PageHeader';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import ResponsiveImg from '../components/ui/ResponsiveImg';
import LcpImagePreload from '../components/seo/LcpImagePreload';
import NotFound from './NotFound';

const GALLERY_SIZES = '(max-width: 768px) 100vw, 33vw';

function DestinationView({ destination }) {
  const properties = propertiesData.filter((p) => destination.propertySlugs.includes(p.slug));
  const gridCols =
    properties.length >= 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : properties.length === 2
        ? 'md:grid-cols-2'
        : 'max-w-md mx-auto';

  return (
    <div className="min-h-screen bg-warm">
      <Seo {...destinationSeo(destination)} jsonLd={destinationJsonLd(destination)} />
      <LcpImagePreload src={destination.heroImage} sizes="(max-width: 768px) 100vw, 1200px" />

      <PageHeader
        title={destination.headline}
        subtitle={destination.subtitle}
        variant={destination.pageHeaderVariant}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8 lg:py-16">
        <p className="font-sans text-base lg:text-lg text-soft leading-relaxed">{destination.intro}</p>
        <p className="mt-6 font-sans text-sm text-soft">
          Part of{' '}
          <Link to="/" className="text-gold hover:underline">
            Luxe Adobes
          </Link>
          {' '}— a luxury resort collection in Kerala and Tamil Nadu.
        </p>
      </section>

      <section className="border-y border-sand/60 bg-charcoal/5 py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="font-serif text-2xl lg:text-3xl text-charcoal text-center mb-10">
            Why stay with Luxe Adobes in {destination.name}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {destination.highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-sand/70 bg-warm p-6 shadow-sm"
              >
                <h3 className="font-serif text-xl text-charcoal mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-soft leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {destination.galleryImages?.length ? (
        <section className="py-14 lg:py-16" aria-label={`${destination.name} gallery`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {destination.galleryImages.map((img) => (
                <div key={img.src} className="overflow-hidden rounded-xl lg:rounded-2xl aspect-[4/3]">
                  <ResponsiveImg
                    src={img.src}
                    alt={img.alt}
                    sizes={GALLERY_SIZES}
                    className="h-full w-full object-cover"
                    width={600}
                    height={450}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {properties.length ? (
        <section className="border-t border-sand/60 py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal text-center mb-3">
              {destination.name} resorts
            </h2>
            <p className="font-sans text-sm text-soft text-center mb-10 max-w-2xl mx-auto">
              All Luxe Adobes stays in {destination.regionLabel}. Open properties accept enquiries; upcoming resorts are listed below.
            </p>
            <div className={`grid gap-8 max-w-6xl mx-auto ${gridCols}`}>
              {properties.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FaqSection faqs={destination.faqs} />

      <section className="border-t border-sand/60 bg-charcoal py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl text-warm mb-4">Plan your {destination.name} stay</h2>
          <p className="font-sans text-sm text-warm/75 mb-8">
            Speak with the Luxe Adobes team for availability at our {destination.name} resorts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact" variant="primary">
              Contact us
            </Button>
            <Button to="/properties" variant="secondary" className="border-warm/30 text-warm hover:bg-warm/10">
              All properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Destination() {
  const { slug } = useParams();
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return <NotFound />;
  }

  return <DestinationView destination={destination} />;
}
