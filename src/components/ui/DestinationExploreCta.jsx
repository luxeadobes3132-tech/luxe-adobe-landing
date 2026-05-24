import { Link } from 'react-router-dom';

/** Single destination CTA for the home page “Where We Are” sections. */
export default function DestinationExploreCta({ to, label, hint }) {
  return (
    <div className="mt-10 border-t border-gold/15 pt-8 lg:mt-12 lg:pt-10">
      <Link
        to={to}
        className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-7 py-3.5 font-sans text-xs sm:text-sm uppercase tracking-[0.22em] text-warm transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal hover:shadow-[0_10px_36px_-10px_rgba(198,167,94,0.55)] sm:px-9 sm:py-4"
      >
        <span>{label}</span>
        <svg
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      {hint ? (
        <p className="mt-3 font-sans text-[11px] sm:text-xs text-warm/45 tracking-wide">{hint}</p>
      ) : null}
    </div>
  );
}
