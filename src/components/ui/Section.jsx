function Section({ children, className = '', flushRight = false }) {
  const innerClass = flushRight
    ? 'w-full min-w-0 overflow-x-hidden pr-0 pl-[calc(5vw+1rem)] lg:pl-[calc(5vw+2rem)]'
    : 'mx-auto max-w-[90vw] px-4 lg:px-8';

  return (
    <section className={`relative py-16 lg:py-32 ${className}`}>
      <div className={innerClass}>{children}</div>
    </section>
  );
}

export default Section;
