import { getResponsiveImageAttrs } from '../../utils/responsiveImage';

/**
 * WebP srcset + original raster fallback. Pass the same `/images/...` paths used elsewhere.
 */
export default function ResponsiveImg({
  src,
  sizes = '100vw',
  alt,
  className,
  loading,
  decoding,
  fetchPriority,
  fetchpriority,
  width,
  height,
  style,
  ...rest
}) {
  const { webpSrcSet, sizes: sz, imgSrc } = getResponsiveImageAttrs(src, sizes);
  const priority = fetchPriority ?? fetchpriority;

  if (!webpSrcSet) {
    return (
      <img
        src={imgSrc}
        alt={alt ?? ''}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchpriority={priority}
        width={width}
        height={height}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={webpSrcSet} sizes={sz} />
      <img
        src={imgSrc}
        alt={alt ?? ''}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchpriority={priority}
        width={width}
        height={height}
        style={style}
        {...rest}
      />
    </picture>
  );
}
