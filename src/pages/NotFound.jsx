import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-warm">
      <Seo
        title="Page Not Found | Luxe Adobes"
        description="This page does not exist. Explore our luxury resorts in Wayanad and Ooty, or contact us to plan your stay."
        path="/404"
        noindex
      />

      <main
        id="main-content"
        className="mx-auto flex flex-1 w-full max-w-lg flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:pt-32 lg:pt-36"
      >
        <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold">
          Error 404
        </p>
        <h1 className="mb-4 font-serif text-3xl text-charcoal sm:text-4xl lg:text-5xl">
          Page not found
        </h1>
        <p className="mb-10 max-w-md text-base leading-relaxed text-soft">
          The address may be mistyped, or the page has moved. You can return home or browse our
          resorts in Kerala and Tamil Nadu.
        </p>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button to="/" variant="outline" className="min-w-[10rem]">
            Back to home
          </Button>
          <Button to="/properties" variant="outline" className="min-w-[10rem]">
            View properties
          </Button>
        </div>

        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-soft"
          aria-label="Helpful links"
        >
          <Link to="/about" className="transition-colors hover:text-gold">
            About
          </Link>
          <Link to="/contact" className="transition-colors hover:text-gold">
            Contact
          </Link>
          <Link to="/property/wayanad-gate" className="transition-colors hover:text-gold">
            Wayanad Gate
          </Link>
          <Link to="/property/ubuntu-retreat-ooty" className="transition-colors hover:text-gold">
            Ubuntu Retreat
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
