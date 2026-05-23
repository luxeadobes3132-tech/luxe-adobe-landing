# Luxe Adobes  -  SEO Checklist

> Living document for the marketing site (React + Vite SPA).  
> **Brand:** Luxe Adobes  -  luxury resort collection in Kerala & Tamil Nadu (Wayanad Gate, Ubuntu Retreat Ooty, upcoming Stayaro & Cloud Veil).  
> **Primary domain (configure in `src/data/siteSeo.js`):** `https://luxeadobes.com`

Legend: ✅ Implemented in codebase · ⚠️ Partial / needs your input · 📋 Manual (off-site) · ⬜ Not started

---

## 1. Technical foundation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Valid HTML5 + `lang="en"` on `<html>` | ✅ | `index.html` |
| 1.2 | Mobile viewport meta | ✅ | `viewport-fit=cover` |
| 1.3 | Canonical URL per route | ✅ | `Seo` component |
| 1.4 | `robots.txt` | ✅ | `public/robots.txt` |
| 1.5 | XML sitemap | ✅ | `public/sitemap.xml` + `npm run seo:sitemap` |
| 1.6 | HTTPS in production | 📋 | Enforce at host (Vercel/Netlify/Cloudflare) |
| 1.7 | SPA prerender / SSR for crawlers | ⚠️ | SPA; consider prerender.io or SSR if rankings stall |
| 1.8 | Core Web Vitals (LCP, CLS, INP) | ⚠️ | Hero preload + WebP derivatives in place; monitor Search Console |
| 1.9 | 404 returns proper status | ⚠️ | Client redirect to `/`; host should serve `index.html` with 200  -  configure 404 page at CDN if needed |

---

## 2. On-page metadata (every indexable URL)

| # | Item | Status | Route |
|---|------|--------|-------|
| 2.1 | Unique `<title>` (50–60 chars) | ✅ | All pages via `Seo` |
| 2.2 | Unique meta description (140–160 chars) | ✅ | Tuned per page in `siteSeo.js` |
| 2.3 | One H1 per page | ✅ | Home hero; `PageHeader` on About/Properties/Contact; Property name on detail |
| 2.4 | Logical heading hierarchy (H2–H3) | ✅ | Section titles use H2 patterns |
| 2.5 | `meta robots` index,follow | ✅ | Default; `noindex` available on `Seo` |
| 2.6 | Open Graph (title, description, image, url, type) | ✅ | `Seo` component |
| 2.7 | Twitter Card (summary_large_image) | ✅ | `Seo` component |
| 2.8 | Absolute OG image URLs | ✅ | `absoluteUrl()` helper |
| 2.9 | Default OG image fallback | ✅ | Hero WebP in `siteSeo.js` |

### Target keywords (weave naturally  -  avoid stuffing)

- **Brand:** Luxe Adobes, luxury resorts India  
- **Properties:** Wayanad Gate resort, Ubuntu Retreat Ooty, luxury homestay Ooty  
- **Geo:** Wayanad Kerala resort, Nilgiris Tamil Nadu, Kottakkal Kerala  

---

## 3. Structured data (Schema.org JSON-LD)

| # | Item | Status | Where |
|---|------|--------|-------|
| 3.1 | `Organization` + `WebSite` | ✅ | Home |
| 3.2 | `LodgingBusiness` / `Hotel` per property | ✅ | Property detail (with `hasDetailPage`) |
| 3.3 | `BreadcrumbList` on property pages | ✅ | Property detail |
| 3.4 | `LocalBusiness` head office | ✅ | Contact |
| 3.5 | `FAQPage` | ⬜ | Add if FAQ section is built |
| 3.6 | `Review` / aggregate rating | ⬜ | Only when verified reviews are published |
| 3.7 | Validate in [Rich Results Test](https://search.google.com/test/rich-results) | 📋 | After deploy |

---

## 4. Content & E-E-A-T (luxury hospitality)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Unique copy per property (Wayanad Gate, Ubuntu) | ✅ | `properties.json` |
| 4.2 | Location-specific landing content (Kerala / Tamil Nadu) | ✅ | Home destinations section |
| 4.3 | About / team credibility | ✅ | About page + `team.json` |
| 4.4 | Contact NAP consistency (name, address, phone) | ✅ | `siteContact.js`  -  match Google Business Profile |
| 4.5 | “Coming soon” properties not indexed as thin pages | ✅ | No detail routes for Stayaro / Cloud Veil |
| 4.6 | Blog / guides (Wayanad travel, Ooty stays) | ⬜ | High-value for organic; future phase |
| 4.7 | Membership / experiences copy uniqueness | ✅ | On-site sections |
| 4.8 | Internal links property ↔ properties hub | ✅ | Cards, CTAs, breadcrumbs |

---

## 5. Images & media SEO

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | Descriptive `alt` on content images | ⚠️ | Audit hero alts; property alts in galleries |
| 5.2 | Responsive WebP derivatives | ✅ | `images:build` pipeline |
| 5.3 | Descriptive file names | ⚠️ | Prefer `wayanad-gate-pool.jpg` over `IMG_001` for new uploads |
| 5.4 | Image sitemap | ⬜ | Optional; add if image search is a priority |
| 5.5 | Video (Guest Experiences)  -  title/description if public | ⚠️ | If hosted externally, link with context |

---

## 6. Local SEO (critical for resorts)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | Google Business Profile  -  Luxe Adobes head office | 📋 | Kottakkal address in `siteContact.js` |
| 6.2 | Separate GBP for Wayanad Gate & Ubuntu (if applicable) | 📋 | Use `mapShareUrl` per property |
| 6.3 | NAP match website ↔ GBP ↔ directories | 📋 | |
| 6.4 | Embedded Google Maps on property + contact | ✅ | `MapEmbed`, `FindUsMap` |
| 6.5 | LocalBusiness schema with geo | ✅ | Contact + property pages |
| 6.6 | Instagram link (`@luxeadobes`) | ✅ | Footer + Contact |

---

## 7. Links & crawlability

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7.1 | Clean URL slugs (`/property/wayanad-gate`) | ✅ | |
| 7.2 | Internal nav links crawlable (`<a href>`) | ✅ | React Router `Link` |
| 7.3 | Footer links to main sections | ✅ | |
| 7.4 | No broken internal links | 📋 | Run Screaming Frog / Ahrefs after deploy |
| 7.5 | Backlink / PR strategy | 📋 | Travel editors, Kerala tourism, wedding planners |
| 7.6 | `rel="noopener noreferrer"` on external links | ✅ | Contact / social |

---

## 8. Performance & UX signals

| # | Item | Status | Notes |
|---|------|--------|-------|
| 8.1 | Lazy-loaded routes | ✅ | `AppRoutes.jsx` |
| 8.2 | Hero image preload | ✅ | `index.html` + `preloadHeroImages` |
| 8.3 | Font display strategy | ⚠️ | Google Fonts  -  consider `display=swap` (already in URL) |
| 8.4 | Reduce motion accessibility | ✅ | `prefers-reduced-motion` |
| 8.5 | Enquiry / WhatsApp CTAs above fold on mobile | ✅ | Contact, property detail |

---

## 9. Analytics & Search Console

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9.1 | Google Search Console property verified | 📋 | Add DNS or HTML tag to `index.html` when ready |
| 9.2 | Submit sitemap in GSC | 📋 | `https://luxeadobes.com/sitemap.xml` |
| 9.3 | GA4 or privacy-friendly analytics | 📋 | Not in repo  -  add with consent banner if EU traffic |
| 9.4 | Conversion events (form, WhatsApp click) | 📋 | Tag in GTM/GA4 |
| 9.5 | Bing Webmaster Tools | 📋 | Optional |

---

## 10. Social & sharing

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10.1 | OG tags for link previews | ✅ | |
| 10.2 | Branded share image 1200×630 | ⚠️ | Using hero; create dedicated `og-share.jpg` for campaigns |
| 10.3 | Instagram bio link to site | 📋 | |
| 10.4 | WhatsApp share preview | ✅ | OG tags help |

---

## 11. Legal & trust

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11.1 | Privacy policy page | ⬜ | Recommended before ad spend |
| 11.2 | Terms / cancellation (hospitality) | ⬜ | |
| 11.3 | Cookie notice if tracking EU users | ⬜ | |

---

## Implementation log

| Date | Change |
|------|--------|
| 2026-05-15 | Initial checklist + `Seo` component, `robots.txt`, sitemap generator, JSON-LD on Home / Contact / Property detail |

---

## Quick commands

```bash
npm run seo:sitemap   # Regenerate public/sitemap.xml from routes + properties.json
npm run build         # Production build (runs sitemap via prebuild if wired)
```

## After deploy (marketing team)

1. Set `VITE_SITE_URL` to production URL in hosting env.  
2. Verify all URLs in [Rich Results Test](https://search.google.com/test/rich-results).  
3. Submit sitemap in Google Search Console.  
4. Align Google Business Profile with `siteContact.js` NAP.  
5. Request indexing for `/property/wayanad-gate` and `/property/ubuntu-retreat-ooty`.
