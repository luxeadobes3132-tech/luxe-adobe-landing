import ContactForm from './ContactForm';

const BENEFITS = [
  { title: 'Tailored stays', body: 'We match you with the right property and season.' },
  { title: 'Direct access', body: 'Packages and availability when it matters.' },
  { title: 'Groups & events', body: 'Celebrations and buyouts, handled with care.' },
  { title: 'Human replies', body: 'Thoughtful answers from our team  -  not a queue.' },
];

/**
 * Enquiry block  -  modern editorial card, on-brand (warm / sand / gold / charcoal).
 */
function EnquiryStudio({ properties }) {
  return (
    <div className="relative mx-auto max-w-3xl lg:max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl border border-charcoal/[0.09] bg-gradient-to-br from-warm via-white to-sand/50 shadow-[0_20px_60px_-28px_rgba(28,28,28,0.2)] ring-1 ring-white/60 sm:rounded-[1.35rem]">
        {/* Quiet corner wash  -  theme colours only */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-charcoal/[0.04] blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-0 lg:grid-cols-12">
          <div className="border-b border-charcoal/[0.06] p-8 sm:p-10 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-12 lg:pr-10">
            <header className="mb-9 max-w-lg">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-[11px]">
                Concierge
              </p>
              <h2 className="font-serif text-[1.65rem] font-normal leading-[1.15] tracking-tight text-charcoal sm:text-3xl lg:text-[2rem]">
                Send an enquiry
              </h2>
              <div className="mt-4 h-px w-12 bg-gradient-to-r from-gold/70 to-transparent" aria-hidden />
              <p className="mt-4 text-[15px] leading-relaxed text-soft">
                A few details are enough  -  we read every message and reply as soon as we can.
              </p>
            </header>
            <ContactForm properties={properties} variant="studio" />
          </div>

          <aside
            className="flex flex-col justify-center bg-charcoal/[0.02] p-8 sm:p-10 lg:col-span-5 lg:p-12"
            aria-label="What you can expect"
          >
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
              When you reach out
            </p>
            <ul className="space-y-6">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/55 ring-4 ring-gold/10"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-serif text-[1.05rem] text-charcoal">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-soft">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EnquiryStudio;
