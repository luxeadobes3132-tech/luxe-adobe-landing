import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ResponsiveImg from '../ui/ResponsiveImg';

const ACCOMM_LIGHTBOX_SIZES = '(max-width: 1280px) 92vw, min(1200px, 90vw)';
const ACCOMM_THUMB_ROW_SIZES = '(max-width: 768px) 28vw, 18vw';

const WAYANAD_SUITE_PHOTOS = [
  '/images/properties/wayanadGate/suit-rooms/suit-1.jpeg',
  '/images/properties/wayanadGate/suit-rooms/suit-2.jpeg',
  '/images/properties/wayanadGate/suit-rooms/suit-3.jpeg',
  '/images/properties/wayanadGate/suit-rooms/suit5.jpeg',
];

const WAYANAD_DELUXE_PHOTOS = [
  '/images/properties/wayanadGate/deluxe-rooms/Deluxe-1.jpeg',
  '/images/properties/wayanadGate/deluxe-rooms/Deluxe-2.jpeg',
  '/images/properties/wayanadGate/deluxe-rooms/Deluxe-3.jpeg',
  '/images/properties/wayanadGate/deluxe-rooms/Deluxe-4.jpeg',
  '/images/properties/wayanadGate/deluxe-rooms/Deluxe5.jpeg',
];

const WAYANAD_DORMITORY_PHOTOS = [
  '/images/properties/wayanadGate/Dormitory-rooms/Dormitory1.jpeg',
  '/images/properties/wayanadGate/Dormitory-rooms/Dormitory2.jpeg',
];

const WAYANAD_COTTAGE_PHOTOS = [
  '/images/properties/wayanadGate/cottage/cottage2.jpeg',
  '/images/properties/wayanadGate/cottage/cottage1.jpeg',
  '/images/properties/wayanadGate/cottage/cottage3.jpeg',
];

const UBUNTU_ROOM_PHOTOS = [
  '/images/properties/ubuntu/room/room1.webp',
  '/images/properties/ubuntu/room/room2.webp',
  '/images/properties/ubuntu/room/room3.webp',
  '/images/properties/ubuntu/room/broom4.webp',
  '/images/properties/ubuntu/room/room5.webp',
  '/images/properties/ubuntu/room/room6.webp',
];

function getRoomPhotos(property, room, roomIndex) {
  if (Array.isArray(room.photos) && room.photos.length > 0) return room.photos;

  const roomName = typeof room.name === 'string' ? room.name.toLowerCase() : '';

  if (
    property.slug === 'wayanad-gate' &&
    roomName.includes('suite')
  ) {
    return WAYANAD_SUITE_PHOTOS;
  }

  if (property.slug === 'wayanad-gate' && roomName.includes('deluxe')) {
    return WAYANAD_DELUXE_PHOTOS;
  }

  if (property.slug === 'wayanad-gate' && roomName.includes('dormitory')) {
    return WAYANAD_DORMITORY_PHOTOS;
  }

  if (
    property.slug === 'wayanad-gate' &&
    (roomName.includes('cottage') || roomName.includes('tiny'))
  ) {
    return WAYANAD_COTTAGE_PHOTOS;
  }

  if (
    property.slug === 'ubuntu-retreat-ooty' &&
    (roomName.includes('room') || roomName.includes('homestay') || roomName.includes('villa'))
  ) {
    return UBUNTU_ROOM_PHOTOS;
  }

  const galleryFallback = Array.isArray(property.gallery)
    ? property.gallery.filter(Boolean).slice(roomIndex, roomIndex + 4)
    : [];
  if (galleryFallback.length > 0) return galleryFallback;

  return property.heroImages?.filter(Boolean).slice(0, 4) || [];
}

function PhotoTile({ src, alt, className, onClick, label, imgClassName = 'h-full w-full object-cover' }) {
  return (
    <button
      type="button"
      className={`block overflow-hidden rounded-xl bg-charcoal/[0.04] ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <ResponsiveImg
        src={src}
        alt={alt}
        sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 40vw"
        className={imgClassName}
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}

export default function AccommodationGallerySection({ property, viewportReveal }) {
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState(null);

  const photosByRoom = useMemo(
    () => (property.rooms || []).map((room, roomIndex) => getRoomPhotos(property, room, roomIndex)),
    [property]
  );

  const activePhotos = useMemo(() => {
    if (!lightbox) return [];
    return getRoomPhotos(property, lightbox.room, lightbox.roomIndex);
  }, [lightbox, property]);

  useEffect(() => {
    if (!lightbox) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null);
        return;
      }
      if (!activePhotos.length) return;
      if (event.key === 'ArrowRight') {
        setLightbox((prev) => (prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % activePhotos.length } : prev));
      } else if (event.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev ? { ...prev, photoIndex: (prev.photoIndex - 1 + activePhotos.length) % activePhotos.length } : prev
        );
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox, activePhotos.length]);

  if (!property.rooms || property.rooms.length === 0) {
    return (
      <motion.div className="py-12 text-center" initial={false} whileInView={{ opacity: 1 }} viewport={viewportReveal}>
        <p className="text-soft">Room information coming soon.</p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="mb-8 text-center lg:mb-10"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={viewportReveal}
      >
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
          Accommodations
        </p>
        <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-charcoal sm:text-[2.2rem]">
          Stay spaces, reimagined
        </h2>
      </motion.div>

      <div className="space-y-7 lg:space-y-8">
        {property.rooms.map((room, roomIndex) => {
          const roomPhotos = photosByRoom[roomIndex] || [];
          const indices = roomPhotos.map((_, idx) => idx);
          const total = indices.length;
          const secondaryIndices = total > 2 ? indices.slice(1) : [];
          const roomName = typeof room.name === 'string' ? room.name.toLowerCase() : '';
          const isTinyCottage = roomName.includes('tiny') || roomName.includes('cottage');

          return (
            <motion.article
              key={`${room.name}-${roomIndex}`}
              className="overflow-hidden rounded-2xl border border-charcoal/[0.08] bg-warm shadow-[0_18px_45px_-30px_rgba(28,28,28,0.35)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1], delay: roomIndex * 0.03 }}
              viewport={viewportReveal}
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
                <div className="p-4 pb-2 lg:col-span-5 lg:p-5 lg:pb-3">
                  <h3 className="font-serif text-2xl font-medium tracking-tight text-charcoal">{room.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-charcoal/65">{room.description}</p>
                  {Array.isArray(room.features) && room.features.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {room.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[14px] text-charcoal/62">
                          <span className="mt-[0.46rem] inline-block h-1.5 w-1.5 rounded-full bg-gold/70" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-sand/30 p-4 lg:col-span-7 lg:p-5">
                  {total > 0 ? (
                    <div className="space-y-3">
                      {total === 1 && (
                        <PhotoTile
                          src={roomPhotos[0]}
                          alt={`${property.name} ${room.name} view 1`}
                          className="aspect-[16/9] w-full"
                          onClick={() => setLightbox({ room, roomIndex, photoIndex: 0 })}
                          label={`Open ${room.name} photo 1`}
                        />
                      )}

                      {total === 2 && (
                        <div className="grid grid-cols-1 gap-3">
                          {[0, 1].map((photoIndex) => (
                            <PhotoTile
                              key={`${roomPhotos[photoIndex]}-${photoIndex}`}
                              src={roomPhotos[photoIndex]}
                              alt={`${property.name} ${room.name} view ${photoIndex + 1}`}
                              className="mx-auto aspect-[16/9] w-full max-w-[88%] lg:max-w-[84%]"
                              onClick={() => setLightbox({ room, roomIndex, photoIndex })}
                              label={`Open ${room.name} photo ${photoIndex + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {total > 2 && (
                        <PhotoTile
                          src={roomPhotos[0]}
                          alt={`${property.name} ${room.name} view 1`}
                          className="aspect-[16/9] w-full"
                          imgClassName={
                            isTinyCottage
                              ? 'h-full w-full object-contain scale-[0.94] bg-charcoal/[0.02]'
                              : undefined
                          }
                          onClick={() => setLightbox({ room, roomIndex, photoIndex: 0 })}
                          label={`Open ${room.name} photo 1`}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-charcoal/15 bg-warm text-soft sm:h-[220px] lg:h-[320px]">
                      Photos coming soon
                    </div>
                  )}
                </div>

                {secondaryIndices.length > 0 && (
                  <div className="px-4 pb-4 lg:col-span-12 lg:px-5 lg:pb-5">
                    <div
                      className="grid grid-flow-col gap-3"
                      style={{ gridTemplateColumns: `repeat(${secondaryIndices.length}, minmax(0, 1fr))` }}
                    >
                      {secondaryIndices.map((photoIndex, index) => {
                        const src = roomPhotos[photoIndex];
                        return (
                          <button
                            key={`${src}-${index}`}
                            type="button"
                            className="block overflow-hidden rounded-lg bg-charcoal/[0.04]"
                            onClick={() => setLightbox({ room, roomIndex, photoIndex })}
                            aria-label={`Open ${room.name} photo ${photoIndex + 1}`}
                          >
                            <ResponsiveImg
                              src={src}
                              alt={`${property.name} ${room.name} view ${photoIndex + 1}`}
                              sizes={ACCOMM_THUMB_ROW_SIZES}
                              className="aspect-square w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {lightbox && activePhotos.length > 0 && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/78 p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setLightbox(null)}
            aria-label="Close gallery"
          />
          <div className="relative z-[1] w-full max-w-5xl">
            <button
              type="button"
              className="absolute right-0 top-[-2.4rem] rounded-full bg-white/90 px-3 py-1 text-sm text-charcoal shadow"
              onClick={() => setLightbox(null)}
              aria-label="Close gallery"
            >
              Close
            </button>

            <div className="relative overflow-hidden rounded-xl bg-black">
              <ResponsiveImg
                src={activePhotos[lightbox.photoIndex]}
                alt={`${property.name} ${lightbox.room.name} enlarged view ${lightbox.photoIndex + 1}`}
                sizes={ACCOMM_LIGHTBOX_SIZES}
                className="max-h-[76vh] w-full object-contain"
                decoding="async"
              />
            </div>

            {activePhotos.length > 1 && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-md bg-white/90 px-3 py-2 text-sm text-charcoal"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? { ...prev, photoIndex: (prev.photoIndex - 1 + activePhotos.length) % activePhotos.length }
                        : prev
                    )
                  }
                >
                  Previous
                </button>
                <p className="text-xs text-white/85 sm:text-sm">
                  {lightbox.photoIndex + 1} / {activePhotos.length}
                </p>
                <button
                  type="button"
                  className="rounded-md bg-white/90 px-3 py-2 text-sm text-charcoal"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % activePhotos.length } : prev
                    )
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
