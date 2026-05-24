import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/seo/Seo';
import { PAGE_SEO } from '../data/siteSeo';
import Footer from '../components/layout/Footer';
import Section from '../components/ui/Section';
import SectionTitle from '../components/ui/SectionTitle';
import PageHeader from '../components/ui/PageHeader';
import PropertyCard from '../components/property/PropertyCard';
import LocationsMap from '../components/ui/LocationsMap';
import Button from '../components/ui/Button';
import propertiesData from '../data/properties.json';

/** Filter bucket: Indian state when set on the property, otherwise the location line (e.g. “Coming soon”). */
function getFilterRegion(property) {
  const s = property.state;
  if (typeof s === 'string' && s.trim().length > 0) return s.trim();
  return property.location;
}

function isComingSoonFilterLabel(label) {
  return /^coming soon$/i.test(String(label).trim());
}

function Properties() {
  const [properties] = useState(propertiesData);
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Filter pills: one per state (or per location when state is not set)
  const uniqueRegions = useMemo(() => {
    return [...new Set(properties.map(getFilterRegion))].sort((a, b) => {
      const aSoon = isComingSoonFilterLabel(a);
      const bSoon = isComingSoonFilterLabel(b);
      if (aSoon !== bSoon) return aSoon ? 1 : -1;
      return a.localeCompare(b);
    });
  }, [properties]);

  // Indian states for the Our Locations section (only properties with a state set)
  const uniqueStates = useMemo(() => {
    const states = properties
      .map((p) => p.state)
      .filter((s) => typeof s === 'string' && s.trim().length > 0);
    return [...new Set(states)].sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const propertyCountByState = useMemo(() => {
    return Object.fromEntries(
      uniqueStates.map((state) => [
        state,
        properties.filter((p) => p.state === state).length,
      ])
    );
  }, [properties, uniqueStates]);

  const filteredProperties = useMemo(() => {
    if (selectedRegion === 'all') return properties;
    return properties.filter((p) => getFilterRegion(p) === selectedRegion);
  }, [selectedRegion, properties]);

  const clearFilter = () => {
    setSelectedRegion('all');
  };

  return (
    <div className="min-h-screen">
      <Seo {...PAGE_SEO.properties} />

      <PageHeader
        title="Our Properties"
        subtitle="Discover our collection of luxury resorts"
        variant="properties"
      />

      {/* Step 3: Property Listing Grid */}
      <Section className="bg-warm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          {/* Filter by state (falls back to location when state is unset) */}
          {uniqueRegions.length > 1 && (
            <div className="mb-12 flex flex-wrap gap-4 justify-center">
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className={`px-6 py-2 rounded-full border transition font-sans text-sm ${
                  selectedRegion === 'all'
                    ? 'border-gold bg-gold text-warm'
                    : 'border-sand text-charcoal hover:border-gold'
                }`}
              >
                All properties
              </button>
              {uniqueRegions.map((region) => (
                <button
                  type="button"
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-6 py-2 rounded-full border transition font-sans text-sm ${
                    selectedRegion === region
                      ? 'border-gold bg-gold text-warm'
                      : 'border-sand text-charcoal hover:border-gold'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}

          {/* Step 10: Empty State */}
          {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-soft text-lg mb-4">
                    {selectedRegion !== 'all'
                      ? `No properties available in ${selectedRegion} at this time.`
                      : 'No properties available at this time.'}
                  </p>
                  {selectedRegion !== 'all' && (
                    <Button variant="secondary" onClick={clearFilter}>
                      Clear Filter
                    </Button>
                  )}
                </div>
              ) : (
                /* Step 7: Property Grid with Animations */
                <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                  {filteredProperties.map((property, idx) => (
                    <motion.div
                      key={property.slug}
                      className="h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>
              )}
        </motion.div>
      </Section>

      {/* Our Locations  -  India by state */}
      {properties.length > 0 && (
        <Section className="bg-sand">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-[90vw] mx-auto px-4 lg:px-8"
          >
            <SectionTitle title="Our Locations across India" align="center" />

            {uniqueStates.length > 0 ? (
              <LocationsMap
                locations={uniqueStates}
                propertyCountByLocation={propertyCountByState}
              />
            ) : (
              <p className="text-center text-soft text-sm lg:text-base max-w-xl mx-auto mt-4">
                We are preparing new addresses across India - check back as we announce each state.
              </p>
            )}
          </motion.div>
        </Section>
      )}

      <Section className="bg-sand/40 border-t border-sand/60" id="destinations">
        <div className="max-w-[90vw] mx-auto px-4 lg:px-8 text-center">
          <SectionTitle
            title="Explore by destination"
            subtitle="Luxury resort guides for Wayanad and Ooty"
            align="center"
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/destinations/wayanad" variant="primary">
              Wayanad resorts
            </Button>
            <Button to="/destinations/ooty" variant="secondary">
              Ooty resorts
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}

export default Properties;
