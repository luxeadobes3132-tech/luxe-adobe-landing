import { Helmet } from 'react-helmet-async';
import { getLcpPreloadAttrs } from '../../utils/responsiveImage';

/** Injects `<link rel="preload">` for a page's LCP image (runs as soon as the route chunk loads). */
export default function LcpImagePreload({ src, sizes = '100vw' }) {
  if (!src) return null;
  const { href, imageSrcSet, imageSizes } = getLcpPreloadAttrs(src, sizes);

  return (
    <Helmet>
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href={href}
        imageSrcSet={imageSrcSet}
        imageSizes={imageSizes}
        fetchpriority="high"
      />
    </Helmet>
  );
}
