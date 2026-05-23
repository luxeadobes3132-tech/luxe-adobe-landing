function SectionTitle({ title, subtitle, align = 'left', theme = 'light', compact = false }) {
  const isDark = theme === 'dark';
  const alignCls = align === 'center' ? 'text-center' : '';
  return (
    <div className={compact ? `mb-6 ${alignCls}` : `mb-12 ${alignCls}`}>
      <h2
        className={`font-serif ${compact ? 'mb-2 text-2xl lg:text-3xl' : 'mb-4 text-3xl lg:text-4xl'} ${
          isDark ? 'text-warm' : 'text-charcoal'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-sans max-w-2xl ${compact ? 'text-base' : 'text-lg'} ${align === 'center' ? 'mx-auto' : ''} ${
            isDark ? 'text-warm/70' : 'text-soft'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
