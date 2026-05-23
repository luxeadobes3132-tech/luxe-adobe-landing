import { Link } from 'react-router-dom';
import { SITE_EMAIL, SITE_INSTAGRAM, SITE_PHONES } from '../../data/siteContact';

const footerLogoSrc = `/images/logo/${encodeURIComponent('LUXE ADOBES - WHITE.png')}`;

function IconMail({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconPhone({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function IconInstagram({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} fill="none" />
      <circle cx="12" cy="12" r="4" strokeWidth={2} fill="none" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" strokeWidth={0} />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal text-warm">
      <div className="max-w-[90vw] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div>
            <Link
              to="/"
              className="inline-block mb-4 hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded-sm"
            >
              <img
                src={footerLogoSrc}
                alt="Luxe Adobes"
                className="h-14 w-auto max-h-16 sm:h-16 sm:max-h-[68px] lg:h-[72px] lg:max-h-[84px] object-contain object-left max-w-[min(100%,380px)] lg:max-w-[460px]"
                width={460}
                height={92}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-warm/80 text-sm leading-relaxed">
              Where luxury meets tranquility. Discover our collection of premium resorts in the world's most beautiful destinations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-warm/80 hover:text-gold transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-warm/80 hover:text-gold transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-warm/80 hover:text-gold transition text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-warm/80 hover:text-gold transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-warm/80 text-sm">
              <li className="flex items-start gap-3">
                <IconMail className="mt-0.5 h-5 w-5 shrink-0 text-gold/75" />
                <a href={`mailto:${SITE_EMAIL}`} className="hover:text-gold transition pt-0.5">
                  {SITE_EMAIL}
                </a>
              </li>
              {SITE_PHONES.map(({ tel, display }) => (
                <li key={tel} className="flex items-start gap-3">
                  <IconPhone className="mt-0.5 h-5 w-5 shrink-0 text-gold/75" />
                  <a href={`tel:${tel}`} className="hover:text-gold transition pt-0.5">
                    {display}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <IconInstagram className="mt-0.5 h-5 w-5 shrink-0 text-gold/75" />
                <a
                  href={SITE_INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold transition pt-0.5"
                >
                  <span className="sr-only">Instagram  -  </span>
                  {SITE_INSTAGRAM.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-warm/20 mt-8 pt-8 text-center text-warm/60 text-sm">
          <p>&copy; 2023 Luxe Adobes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
