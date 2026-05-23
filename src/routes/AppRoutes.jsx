import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import PageLoader from '../components/ui/PageLoader';
import Home from '../pages/Home';
const About = lazy(() => import('../pages/About'));
const Properties = lazy(() => import('../pages/Properties'));
const PropertyDetail = lazy(() => import('../pages/PropertyDetail'));
const Contact = lazy(() => import('../pages/Contact'));
const NotFound = lazy(() => import('../pages/NotFound'));

function AppRoutes() {
  return (
    <div className="relative min-h-full w-full">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:slug" element={<PropertyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default AppRoutes;
