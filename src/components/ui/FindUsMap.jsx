import MapEmbed from './MapEmbed';
import {
  SITE_HEAD_OFFICE_KIND,
  SITE_HEAD_OFFICE_LABEL,
  SITE_HEAD_OFFICE_MAPS_URL,
} from '../../data/siteContact';

/**
 * Minimal map block: thin frame; labelled venue, address, and directions link.
 */
function FindUsMap({
  embedUrl,
  title,
  addressOneLine,
  addressLines,
  officeKindLabel = SITE_HEAD_OFFICE_KIND,
  venueName = SITE_HEAD_OFFICE_LABEL,
  mapsShareUrl = SITE_HEAD_OFFICE_MAPS_URL,
}) {
  const lines =
    Array.isArray(addressLines) && addressLines.length > 0
      ? addressLines
      : addressOneLine
        ? [addressOneLine]
        : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/[0.03]">
        <MapEmbed
          embedUrl={embedUrl}
          title={title}
          iframeClassName="min-h-[240px] sm:min-h-[320px] md:min-h-[360px]"
          height={380}
        />
      </div>

      <div className="mt-6 flex flex-col gap-6 border-t border-charcoal/[0.08] pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-[11px]">
              {officeKindLabel}
            </p>
            <p className="mt-2 font-serif text-xl tracking-tight text-charcoal sm:text-2xl">{venueName}</p>
          </div>
          {lines.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
                Address
              </p>
              <address className="mt-2 space-y-0.5 text-sm leading-relaxed text-soft not-italic">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/45 sm:text-right">
            Directions
          </p>
          <a
            href={mapsShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-charcoal underline decoration-charcoal/25 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/50 sm:text-right"
            aria-label="Open directions to Luxe Adobes head office in Google Maps"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

export default FindUsMap;
