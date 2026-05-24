import { useState } from 'react';

export default function FaqSection({ title = 'Frequently asked questions', faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  return (
    <section className="border-t border-sand/60 bg-warm py-16 lg:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 id="faq-heading" className="font-serif text-2xl lg:text-3xl text-charcoal text-center mb-10">
          {title}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={faq.question} className="rounded-xl border border-sand/80 bg-white/60 overflow-hidden">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans text-sm sm:text-base font-medium text-charcoal hover:text-gold transition-colors"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="text-gold shrink-0" aria-hidden>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <div className="px-5 pb-4 font-sans text-sm sm:text-base text-soft leading-relaxed">
                    {faq.answer}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
