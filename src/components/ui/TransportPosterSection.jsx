import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import ResponsiveImg from './ResponsiveImg';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  {
    key: 'cab',
    label: 'Taxi car',
    title: 'Private cab',
    description:
      'For everyday hops, local sightseeing, and airport transfers  -  point-to-point, quiet, punctual, and coordinated with your stay.',
    imageSrc: '/images/home/transport/cabs/cab-removebg-preview.png',
    imageAlt: 'Luxe Adobes private taxi vehicle',
  },
  {
    key: 'urbania',
    label: 'Force Urbania',
    title: 'Premium van',
    description:
      'A premium, spacious van with comfortable seating for families and small groups  -  ideal for scenic drives and longer transfers, door to door.',
    imageSrc: '/images/home/transport/cabs/force-urabania.webp',
    imageAlt: 'Luxe Adobes Force Urbania premium van',
    imageZoomClass: 'scale-[1.36] sm:scale-[1.48] lg:scale-[1.62] origin-bottom',
    imageSizeClass: 'max-h-[290px] sm:max-h-[350px] lg:max-h-[405px]',
  },
  {
    key: 'bus',
    label: 'Tourist bus',
    title: 'Group travel',
    description:
      'Safe, reliable coaches for group travel  -  tours, events, and larger parties on one schedule, with one team from start to finish.',
    imageSrc: '/images/home/transport/cabs/bus-removebg-preview.png',
    imageAlt: 'Luxe Adobes tourist bus for group travel',
    imageZoomClass: 'scale-[1.02] sm:scale-[1.1] lg:scale-[1.21] origin-center',
    imageSizeClass: 'max-h-[216px] sm:max-h-[258px] lg:max-h-[300px]',
  },
];

export default function TransportPosterSection() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const q = gsap.utils.selector(rootRef);
      const rows = q('[data-transport-row]');

      let mm;
      const ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        const buildRowTween = (row, img, w, scrollTrigger) => {
          const distance = Math.min(w * 0.34, 440);
          const baselineEndX = w >= 1024 ? -40 : -20;
          const key = row.dataset.transportKey;
          let endX = baselineEndX;
          if (key === 'cab') {
            endX = baselineEndX + (w >= 1024 ? 22 : 12);
          } else if (key === 'urbania') {
            endX = w >= 1024 ? baselineEndX : baselineEndX + 12;
          } else if (key === 'bus') {
            endX = w >= 1024 ? baselineEndX : baselineEndX + 12;
          }

          return gsap.fromTo(
            img,
            {
              x: distance,
              opacity: 0.75,
              transformOrigin: '50% 50%',
            },
            {
              x: endX,
              opacity: 1,
              transformOrigin: '50% 50%',
              ease: 'none',
              scrollTrigger,
            }
          );
        };

        mm.add('(max-width: 1023px)', () => {
          rows.forEach((row) => {
            const img = row.querySelector('[data-transport-img]');
            if (!img) return;

            const key = row.dataset.transportKey;
            /** Bus image reads early vs its visual mass — finish when center sits slightly above viewport center */
            const mobileEnd = key === 'bus' ? 'center 38%' : 'center center';

            buildRowTween(row, img, window.innerWidth, {
              trigger: img,
              start: 'top 92%',
              end: mobileEnd,
              scrub: 1,
              invalidateOnRefresh: true,
            });
          });
        });

        mm.add('(min-width: 1024px)', () => {
          rows.forEach((row) => {
            const img = row.querySelector('[data-transport-img]');
            if (!img) return;

            buildRowTween(row, img, window.innerWidth, {
              trigger: row,
              start: 'top 88%',
              end: 'top 42%',
              scrub: 0.85,
              invalidateOnRefresh: true,
            });
          });
        });
      }, rootRef);

      return () => {
        mm?.revert();
        ctx.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <Section
      flushRight
      className="isolate max-w-full overflow-x-hidden border-t border-sand/60 bg-warm !pt-10 !pb-6 lg:!pt-14 lg:!pb-8"
    >
      <div ref={rootRef} className="min-w-0 w-full max-w-full overflow-x-hidden">
        <header className="mb-6 max-w-2xl lg:mb-7">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
            Mobility
          </p>
          <h2 className="mt-1.5 font-serif text-3xl font-medium tracking-tight text-charcoal sm:text-4xl">
            On-the-ground transport
          </h2>
          <p className="mt-2.5 max-w-md font-sans text-[15px] leading-relaxed text-charcoal/55">
            Three ways to move  -  each arranged through Luxe Adobes so your journey stays seamless.
          </p>
          <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-charcoal/55">
            Comfortable seating, safe and reliable service, experienced drivers, and both local and
            outstation trips  -  available across the fleet whenever you need to travel.
          </p>
        </header>

        <div className="min-w-0 divide-y divide-sand/70">
          {ROWS.map((row) => (
            <div
              key={row.key}
              data-transport-row
              data-transport-key={row.key}
              className="grid min-w-0 grid-cols-1 items-start gap-5 py-5 first:pt-0 last:pb-0 lg:grid-cols-2 lg:gap-8 lg:py-6"
            >
              <div className="min-w-0 max-w-lg">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-charcoal/40">
                  {row.label}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-medium tracking-tight text-charcoal sm:text-[1.65rem]">
                  {row.title}
                </h3>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-charcoal/58">{row.description}</p>
              </div>

              <div className="relative flex min-h-0 min-w-0 w-full max-w-full justify-center overflow-hidden py-2 lg:justify-center lg:py-3">
                <div data-transport-img className="will-change-transform">
                  <ResponsiveImg
                    src={row.imageSrc}
                    alt={row.imageAlt}
                    sizes="(max-width: 1024px) 85vw, 360px"
                    className={`h-auto max-h-[230px] w-auto max-w-full object-contain object-center sm:max-h-[260px] lg:max-h-[300px] ${
                      row.imageSizeClass ?? ''
                    } ${
                      row.imageZoomClass ?? ''
                    }`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
