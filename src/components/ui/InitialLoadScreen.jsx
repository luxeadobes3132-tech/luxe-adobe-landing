export default function InitialLoadScreen({ progress = 0, exiting = false }) {
  const clamped = Math.min(1, Math.max(0, progress));
  const pct = Math.round(clamped * 100);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal transition-opacity duration-300 motion-reduce:transition-none ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label="Loading Luxe Adobes"
    >
      <img
        src="/images/home/branding/luxe-adobes-white.png"
        alt="Luxe Adobes"
        className="h-14 w-auto object-contain sm:h-16"
        width={3571}
        height={1999}
        decoding="sync"
        fetchpriority="high"
      />
      <p className="mt-8 font-serif text-lg tracking-wide text-warm/90 sm:text-xl">
        Preparing your experience
      </p>
      <div
        className="mt-8 w-48 sm:w-56"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Loading progress"
      >
        <div className="h-1 overflow-hidden rounded-full bg-warm/20">
          <div
            className="h-full rounded-full bg-gold will-change-[width] motion-reduce:transition-none"
            style={{
              width: `${pct}%`,
              transition: 'width 120ms linear',
            }}
          />
        </div>
        <p className="mt-3 text-center font-sans text-xs tabular-nums tracking-widest text-warm/50">
          {pct}%
        </p>
      </div>
    </div>
  );
}
