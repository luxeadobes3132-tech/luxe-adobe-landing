function TestimonialCard({ testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-sm border border-charcoal/[0.08] bg-warm/90 px-8 py-9 text-left lg:px-10 lg:py-10">
      <div className="mb-6 flex gap-1" aria-label={`${testimonial.rating || 5} out of 5`}>
        {[...Array(testimonial.rating || 5)].map((_, i) => (
          <span key={i} className="text-[13px] leading-none text-gold">
            ★
          </span>
        ))}
      </div>
      <blockquote className="flex-1">
        <p className="font-serif text-[17px] leading-[1.65] text-charcoal lg:text-lg">
          {testimonial.text}
        </p>
      </blockquote>
      <figcaption className="mt-8 border-t border-charcoal/[0.06] pt-6">
        <cite className="not-italic">
          <span className="block font-sans text-sm font-medium text-charcoal">{testimonial.name}</span>
          <span className="mt-1 block font-sans text-sm text-soft">{testimonial.location}</span>
        </cite>
      </figcaption>
    </figure>
  );
}

export default TestimonialCard;
