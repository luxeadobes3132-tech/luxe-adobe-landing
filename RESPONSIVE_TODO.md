## Responsive TODO Status

Goal: improve responsiveness without changing visual design language; only sizing/stacking behavior was adjusted.

### 1) Home page
- [x] Hero heading + tagline responsive type steps added.
- [x] About split image min-heights reduced on smaller screens.
- [x] Destination mosaic fixed heights reduced at base/sm breakpoints.
- [x] Destination selector button paddings/text tightened for narrow widths.
- [ ] Manual device QA for pinned gallery + transport animation behavior.
- [ ] Manual device QA for hero animation readability at all breakpoints.

### 2) About page
- [x] Grid image/card minimum heights reduced for smaller screens.
- [x] Sustainability grid now starts at 1 column and scales upward.
- [x] Hospitality image minimum heights reduced on small screens.
- [ ] Manual QA for team-card behavior with varying member counts.

### 3) Properties page
- [x] Property card media height reduced at mobile/sm breakpoints (shared `PropertyCard`).
- [ ] Manual QA for filter chip wrapping and map readability.

### 4) Property detail page
- [x] Hero viewport heights/min-heights reduced for small/short screens.
- [x] Empty/fallback hero section aligned with same responsive height behavior.
- [x] Accommodation gallery placeholder heights reduced at mobile/sm breakpoints.
- [ ] Manual QA for lightbox controls in portrait + landscape phones.

### 5) Contact page
- [x] 24/7 numerals resized down on smallest breakpoints.
- [ ] Manual QA for channel card stacking, QR scan size, and map/form flow.

### 6) Header + Navbar
- [x] Navbar logo base height reduced (desktop + mobile menu header rows).
- [x] PageHeader min-height and smallest type step adjusted.
- [ ] Manual QA for underline alignment and sticky behavior after resize.

### 7) Global QA / sign-off
- [ ] Test at: 360x640, 414x896, 768x1024, 1024x600, 1366x768, 1440x900.
- [ ] Verify no horizontal overflow on all main pages.
- [ ] Verify no clipped text/image cards at breakpoint transitions.