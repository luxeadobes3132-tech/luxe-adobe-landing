/** Full-page loader while route chunks load (navbar + page mount together). */
export default function PageLoader() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-warm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-sand border-t-gold motion-reduce:animate-none motion-reduce:border-gold"
        aria-hidden
      />
      <p className="mt-5 font-sans text-sm tracking-wide text-soft">Loading</p>
    </div>
  );
}
