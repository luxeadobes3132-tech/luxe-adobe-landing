import { motion, useInView } from 'framer-motion';
import Seo from '../components/seo/Seo';
import { PAGE_SEO } from '../data/siteSeo';
import { useRef } from 'react';
import Footer from '../components/layout/Footer';
import Section from '../components/ui/Section';
import SectionTitle from '../components/ui/SectionTitle';
import PageHeader from '../components/ui/PageHeader';
import teamData from '../data/team.json';
import ResponsiveImg from '../components/ui/ResponsiveImg';

const gridItemVariants = {
  hiddenLeft: { opacity: 0, x: -32 },
  hiddenRight: { opacity: 0, x: 32 },
  hiddenUp: { opacity: 0, y: 24 },
  visible: { opacity: 1, x: 0, y: 0 },
};

const GridImage = ({ src, alt, className, direction = 'up', delay = 0 }) => (
  <motion.div
    initial={direction === 'left' ? 'hiddenLeft' : direction === 'right' ? 'hiddenRight' : 'hiddenUp'}
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    variants={gridItemVariants}
    className={`overflow-hidden min-h-[110px] sm:min-h-[120px] lg:min-h-0 ${className}`}
  >
    <motion.img
      src={src}
      alt={alt}
      className="w-full h-full min-h-[130px] sm:min-h-[150px] object-cover"
      loading="lazy"
      initial={{ scale: 1.05 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: delay + 0.2 }}
    />
  </motion.div>
);

const GridContent = ({ pillar, className, direction = 'up', delay = 0 }) => (
  <motion.div
    initial={direction === 'left' ? 'hiddenLeft' : direction === 'right' ? 'hiddenRight' : 'hiddenUp'}
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    variants={gridItemVariants}
    className={`${pillar.bg} ${pillar.text} p-6 sm:p-7 lg:p-10 flex flex-col overflow-hidden min-h-[220px] lg:min-h-0 relative ${className}`}
  >
    {pillar.goldAccent && <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-gold/60 to-gold/30 rounded-r" />}
    <div className={`flex flex-col gap-5 ${pillar.goldAccent ? 'pl-5' : ''}`}>
      <h3 className="font-serif text-xl lg:text-2xl font-medium tracking-tight">{pillar.title}</h3>
      <p className={`${pillar.accent} text-sm lg:text-base leading-loose flex-1`}>{pillar.desc}</p>
      <ul className="space-y-2.5 text-sm lg:text-base">
        {pillar.items.map((item, j) => (
          <li key={j} className="flex items-start gap-3">
            <span className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${pillar.text === 'text-warm' ? 'bg-warm/70' : pillar.goldAccent ? 'bg-gold/60' : 'bg-charcoal/40'}`} />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

function About() {
  const visionValuesRef = useRef(null);
  const visionValuesInView = useInView(visionValuesRef, { amount: 0.15 });

  return (
    <div className="min-h-screen">
      <Seo {...PAGE_SEO.about} />

      <PageHeader
        title="About Luxe Adobes"
        subtitle="Crafting exceptional experiences, one destination at a time"
        variant="about"
      />

      {/* Step 3: Brand Story Section */}
      <Section className="bg-warm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <SectionTitle 
              title="Our Story"
              subtitle="A journey of passion and purpose"
              align="center"
            />
            
            <div className="space-y-6 text-charcoal leading-relaxed">
              <p className="text-base lg:text-lg">
                Luxe Adobes was born from a simple yet profound vision: to create 
                sanctuaries where luxury and nature coexist in perfect harmony. 
                Founded by a team of passionate hospitality professionals and 
                design enthusiasts, we set out to curate a collection of properties 
                that offer more than just accommodation - they offer transformation.
              </p>
              
              <p className="text-base lg:text-lg">
                Each resort in our collection is carefully selected for its unique 
                character, breathtaking location, and potential to provide guests 
                with unforgettable experiences. We believe that true luxury lies 
                not in opulence, but in the thoughtful details, the connection 
                with nature, and the genuine care we extend to every guest.
              </p>
              
              <p className="text-base lg:text-lg">
                From the pristine beaches of tropical paradises to the serene 
                mountainside retreats, every Luxe Adobes property tells a story 
                of its destination, inviting you to become part of that narrative.
              </p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Step 4: Vision & Values Section */}
      <Section className="bg-sand">
        <div ref={visionValuesRef}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={
            visionValuesInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 24, scale: 0.98 }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <SectionTitle 
            title="Vision & Values"
            subtitle="The principles that guide us"
            align="center"
          />
          
          <motion.div
            initial="hidden"
            animate={visionValuesInView ? 'visible' : 'hidden'}
            variants={{
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
              hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                title: "Excellence",
                description: "We pursue excellence in every detail, from the design of our spaces to the quality of service we provide."
              },
              {
                title: "Authenticity",
                description: "Each property reflects the authentic character of its location, celebrating local culture and heritage."
              },
              {
                title: "Sustainability",
                description: "We are committed to responsible tourism that preserves and protects the natural environments we call home."
              },
              {
                title: "Connection",
                description: "We believe in fostering genuine connections - with nature, with local communities, and with oneself."
              },
              {
                title: "Innovation",
                description: "While honoring tradition, we embrace innovation in design, technology, and guest experiences."
              },
              {
                title: "Care",
                description: "Every guest is treated with the utmost care and attention, ensuring personalized and memorable stays."
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={{
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                  },
                  hidden: {
                    opacity: 0,
                    x: idx % 2 === 0 ? -20 : 20,
                    y: 16,
                    scale: 0.97,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="bg-warm p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="font-serif text-2xl text-charcoal mb-4">{value.title}</h3>
                <p className="text-soft leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        </div>
      </Section>

      {/* Step 5: Hospitality Philosophy Section */}
      <Section className="bg-warm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image  -  premium framed treatment */}
            <div className="relative order-2 lg:order-1 group">
              {/* Decorative frame */}
              <div className="absolute -inset-3 lg:-inset-4 rounded-2xl bg-gradient-to-br from-gold/5 via-transparent to-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full aspect-[4/3] min-h-[220px] sm:min-h-[260px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-charcoal/5 ring-inset">
                <ResponsiveImg
                  src="/images/about/hospitality.webp"
                  alt="Luxury hospitality  -  warm guest experience"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  width={1200}
                  height={900}
                  loading="lazy"
                />
                {/* Subtle vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent pointer-events-none" />
                {/* Gold accent corner */}
                <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-gold/60 to-transparent" />
              </div>
            </div>
            
            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="w-12 h-px bg-gold/50 mb-6" />
              <SectionTitle 
                title="Our Hospitality Philosophy"
                subtitle="Service with heart and soul"
              />
              
              <div className="space-y-6 text-charcoal leading-relaxed">
                <p className="text-base lg:text-lg">
                  At Luxe Adobes, hospitality is not just a service - it's a philosophy 
                  rooted in genuine care and attention to detail. We understand that 
                  every guest arrives with unique expectations, and it is our privilege 
                  to exceed them.
                </p>
                
                <p className="text-base lg:text-lg">
                  Our team is carefully selected and trained to anticipate needs, 
                  create moments of delight, and ensure that your stay is seamless 
                  from arrival to departure. We believe in the power of small gestures -  
                  a personalized welcome, a thoughtfully prepared space, a moment of 
                  quiet reflection.
                </p>
                
                <p className="text-base lg:text-lg">
                  Whether you seek adventure, relaxation, or inspiration, our 
                  dedicated staff is here to curate experiences that resonate with 
                  your personal journey.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Step 6: Sustainability & Responsibility  -  6x6 grid with content and images */}
      <section className="py-16 lg:py-32 bg-sand">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[90vw] mx-auto px-4 lg:px-8"
        >
          <SectionTitle 
            title="Sustainability & Responsibility"
            subtitle="Our commitment to the planet and communities"
            align="center"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-2 w-full mt-12 min-h-[360px] sm:min-h-[420px] lg:min-h-[520px] gap-px bg-sand"
        >
          {/* Row 1: Image | Content | Image */}
          <GridImage src="/images/about/sustainability/forest-nature.webp" alt="Forest nature" className="col-span-6 sm:col-span-2" direction="left" delay={0} />
          <GridContent pillar={{ title: "Environmental Stewardship", desc: "We minimize our environmental footprint through renewable energy, water conservation, waste reduction, and conservation efforts.", items: ["Renewable energy", "Water conservation", "Waste reduction", "Ecosystem protection"], bg: "bg-olive", text: "text-warm", accent: "text-warm/90" }} className="col-span-6 sm:col-span-2" direction="up" delay={0.08} />
          <GridImage src="/images/about/sustainability/environmental-stewardship.webp" alt="Sustainability" className="col-span-6 sm:col-span-2" direction="right" delay={0.16} />
          {/* Row 2: Content | Image | Content */}
          <GridContent pillar={{ title: "Community Engagement", desc: "We partner with local artisans, suppliers, and organizations so tourism benefits everyone  -  including the flavours and traditions that make each place distinct.", items: ["Regional food culture woven into the guest experience", "Local ingredients and specialties, wherever we operate", "Support for home cooks, growers and small producers", "Cultural respect alongside fair, transparent sourcing"], bg: "bg-warm", text: "text-charcoal", accent: "text-soft", goldAccent: true }} className="col-span-6 sm:col-span-2 border border-sand/60" direction="left" delay={0.1} />
          <GridImage src="/images/about/sustainability/community.webp" alt="Community" className="col-span-6 sm:col-span-2" direction="up" delay={0.18} />
          <GridContent pillar={{ title: "Guest Education", desc: "We invite guests into our sustainability story through learning outdoors, quiet renewal, and meaningful contact with each landscape.", items: ["Adventures  -  guided outings and outdoor programmes that spark curiosity and discovery", "Unhurried rhythms and space to rest, reflect and feel whole again", "Conservation walks and learning alongside those who care for the land", "In-room guides and local partners who deepen how you read a place"], bg: "bg-charcoal", text: "text-warm", accent: "text-warm/90" }} className="col-span-6 sm:col-span-2" direction="right" delay={0.26} />
        </motion.div>
      </section>

      {/* Step 7: Our Team Section  -  premium card layout */}
      {teamData && teamData.length > 0 && (
        <Section className="bg-sand">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[90vw] mx-auto px-4 lg:px-8"
          >
            <div className="text-center mb-14">
              <div className="w-16 h-px bg-gold/50 mx-auto mb-6" />
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mb-3">Our Team</h2>
              <p className="font-sans text-soft text-base lg:text-lg max-w-xl mx-auto tracking-wide">
                The passionate individuals who bring the Luxe Adobes experience to life
              </p>
            </div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
                hidden: {},
              }}
              className={`grid gap-8 max-w-5xl mx-auto ${
                teamData.length === 1 ? 'grid-cols-1 max-w-md' :
                teamData.length === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {teamData.map((member) => (
                <motion.div
                  key={member.id}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="group flex h-full flex-col"
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-warm shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-charcoal/5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <ResponsiveImg
                        src={member.image}
                        alt={member.name}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        width={400}
                        height={533}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <p className="text-warm text-sm leading-relaxed line-clamp-4 drop-shadow-sm">{member.bio}</p>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex min-h-[128px] flex-col justify-center p-6 text-center lg:min-h-[140px] lg:p-7">
                      <div className="w-10 h-px bg-gold/60 mx-auto mb-4" />
                      <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-2 tracking-tight">{member.name}</h3>
                      <p className="font-sans text-gold text-sm uppercase tracking-[0.2em] font-medium">{member.role}</p>
                    </div>
                  </div>
                  {/* Bio visible on mobile (hidden on desktop where hover shows it) */}
                  <p className="mt-4 text-soft text-sm leading-relaxed text-center lg:hidden">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Section>
      )}

      <Footer />
    </div>
  );
}

export default About;
