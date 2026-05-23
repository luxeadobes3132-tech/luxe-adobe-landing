function MapEmbed({
  embedUrl,
  title = 'Location Map',
  className = '',
  iframeClassName = '',
  height = 450,
}) {
  if (!embedUrl) {
    return (
      <div className="w-full rounded-2xl bg-sand p-12 text-center shadow-sm">
        <p className="text-soft">Map information not available</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`.trim()}>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className={`block w-full ${iframeClassName}`.trim()}
      />
    </div>
  );
}

export default MapEmbed;
