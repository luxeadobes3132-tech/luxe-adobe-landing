import { Link } from 'react-router-dom';

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  to,
  href,
  ...props
}) {
  const baseClasses =
    'transition-all duration-300 font-sans inline-flex items-center justify-center text-center';

  const variantClasses = {
    primary:
      'text-white px-8 py-3 border border-white/50 bg-white/5 backdrop-blur-sm uppercase tracking-widest text-sm shadow-lg hover:bg-gold hover:border-gold hover:text-warm hover:scale-105 hover:shadow-xl',
    secondary:
      'text-white px-6 py-2.5 border border-white/50 bg-white/5 backdrop-blur-sm tracking-wide shadow-lg hover:bg-white/10 hover:border-white hover:scale-105 hover:shadow-xl',
    // For use on light backgrounds (e.g. About section): dark text, visible border, gold hover
    outline:
      'text-charcoal px-6 py-2.5 border-2 border-charcoal/60 bg-warm/30 backdrop-blur-sm tracking-wide shadow-md font-medium hover:bg-gold hover:border-gold hover:text-warm hover:scale-105 hover:shadow-lg transition-all duration-300',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
