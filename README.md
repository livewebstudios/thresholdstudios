# Threshold Recording Studios NYC: demo

Three-page sales demo for Threshold Recording Studios (James), built by Live Web Studios.
Pages: Home, Services, The Space, plus a branded 404 and the `/dev/` component kit.
Every page is `noindex` (meta tag and `X-Robots-Tag` header). Do not remove that until the
full build replaces the live site.

Stack: Astro 7.4.4, Node 24, four React islands (VU meters, mobile nav, services filter,
lightbox), GSAP for motion. Fonts are self-hosted (no Google Fonts requests).

---

## Run it

```sh
npm install
npm run dev        # http://localhost:4321 (pass --port 4323 if 4321 is taken)
npm run build      # OG images, astro build, then relativize
npm run preview    # serve dist/
```

`npm run build` runs three steps:
1. `scripts/og.mjs` renders the three Open Graph cards into `public/og/`.
2. `astro build` writes `dist/`.
3. `scripts/relativize.mjs` rewrites every internal `href`, `src`, `srcset`, `poster` and CSS
   `url()` in `dist/` to a path relative to its page (the LWS path rule). It fails the build if
   a root-relative reference is left. Only canonical, `og:url`, `og:image` and JSON-LD URLs stay
   absolute.

### Environment

Copy `.env.example` to `.env`. One variable:

| Variable | Use |
|---|---|
| `PUBLIC_GA4_ID` | GA4 measurement ID (`G-XXXXXXXXXX`). Leave blank for the demo: the GA4 tag only renders when it is set. |

### Checks

| Command | What it does |
|---|---|
| `npm run killlist` | Banned phrases and dashes, `src/` and `dist/`. Must be 0. |
| `npm run contrast` | 34 token color pairs. Must be all PASS. |
| `node scripts/overlay-contrast.mjs` | Real-pixel text contrast over the hero poster and video frames, including the feature flanks. |
| `node scripts/layout-audit.mjs` | Overflow, clipping, tap targets, image sizes and anchor clearance at 320, 375, 768, 1024 and 1440. |
| `npm run qa` | Full Playwright suite (138 checks), axe included. `--no-shots` skips screenshots. |
| `node scripts/shots.mjs ../qa/screens 375,1440 /,/services/` | Quick screenshots. |

The Playwright scripts need `astro preview` running (port 4322) after a build. They use the
installed headless shell through `scripts/browser.mjs`.

---

## Add gallery photos (The Space)

1. Drop the JPG into `src/assets/photos/` (max 1600px long edge). Or put the original in
   `../images/` and run `npm run assets` to resize and strip metadata.
2. Add a line to `src/data/gallery.ts`:
   `{ key: 'file-name-without-extension', caption: 'LIVE ROOM · DRUMS' }`
   Captions are ALL CAPS, short, room first.
3. Add alt text (8 to 16 words, what is in the frame) under the same key in `photoAlt` in
   `src/data/photos.ts`.

That is the whole job: the grid, the lightbox and the "more photos coming" tile pick it up.
No photos with identifiable people unless James owns and approves them.

## Swap the hero video

1. Put the new clip at `../images/raw/hero-console.mp4` (the project's raw media folder, not
   committed).
2. From `build/`, run `npm run video`. `scripts/encode-video.sh` trims 0.2s off each end,
   plays it forward then reversed for a seamless loop, scales to 1280px wide, and writes
   `public/media/hero-console.mp4` and `.webm`. Keep each under 2.5 MB.
3. If the new clip opens on a different frame, replace the poster still
   `src/assets/photos/hero-trident-console-still.jpg` with a matching frame.
4. Rebuild and run `node scripts/overlay-contrast.mjs`: the hero text has to hold contrast over
   every frame.

The video plays on desktop only. Mobile and reduced motion get the poster. The hero pause
button stops it.

---

## Deploy (Jon)

Netlify, either way works:

- **Drag and drop:** `npm run build`, then drag `build/dist/` onto Netlify Drop or the site's
  Deploys tab.
- **New site from Git:** base directory `build`, build command `npm run build`, publish
  directory `dist`. `netlify.toml` already sets these plus Node 24, the `noindex` header and
  cache headers.

Set `PUBLIC_GA4_ID` blank (or leave it unset) in the Netlify environment for the demo.
`astro.config.mjs` uses `https://thresholdstudios-demo.netlify.app` as `site`, which feeds the
canonical, OG and sitemap URLs. Change it if the demo lands on a different subdomain.

Because every internal path is relative, `dist/` also runs from any subfolder or host.

---

## Current design state

The project-root `DECISIONS.md` is the full log. Where it disagrees with the original brief,
`DECISIONS.md` wins. The essentials:

- **Type:** Plus Jakarta Sans everywhere (variable, self-hosted). Headings and display text at
  weight 300 (`--fw-display`). Body 16 to 17px. IBM Plex Mono for labels and readouts only. No
  serif anywhere.
- **Home hero:** centered headline, sub and meter panel over the console video with a heavy edge
  vignette. At 1200px and up, six circle-icon features flank it (Recording, Mixing, Mastering /
  Voice Over & ADR, Filming, Live Recording), each linking to its service card. Below 1200 they
  stack under the panel. Icons are hand-drawn SVG in `src/components/kit/LineIcon.astro`.
- **CTAs under the meters:** BOOK A SESSION under VU L, SEE THE ROOMS under VU R. Both needles rest
  at -20. Hovering or focusing a CTA swings its meter to 0; leaving drops it back. No idle wander.
- **Hero pause button:** 44px icon-only, bottom-right of the hero (WCAG 2.2.2). Pauses the video,
  readout marquee, LEDs and block-map glow, and remembers it for the session. Hidden under reduced
  motion.
- **Logo and wordmark:** `images/logoRGB.png` centered with the "THRESHOLD / RECORDING STUDIOS NYC"
  wordmark: 100px in a 116px bar on desktop, 64px in a 72px bar on phones, 120px in the footer.
  The wordmark uses `--font-wordmark`: Arvo Bold standing in for Memphis Bold until a licensed
  Memphis webfont is added (see DECISIONS.md). Keep the wordmark one text block: on phones it is the
  LCP element, and if the logo outgrows it Lighthouse drops to about 90.
- **No breadcrumbs** (removed 26_10_31). BreadcrumbList JSON-LD is kept.
- **No demo banner.** Removed at Jon's request. Pages stay `noindex`.
- **Knob bullets:** turn 135 degrees on hover, ticks light in sequence.
- **Services preview (Home):** horizontal hairline cards, photo left, two columns from 768px.

## Where things live

| Path | What |
|---|---|
| `src/data/*.ts`, `src/data/pages/*.ts` | All copy. Edit text here, not in components. |
| `src/styles/tokens.css` | Colors, type, spacing, timing tokens. No color literals elsewhere. |
| `src/styles/global.css` | Base styles. |
| `src/components/kit/` | Console component kit (Panel, Nameplate, Knob, Fader, VU Meter, LED, Button, Hairline, Readout, PhotoFrame, BlockMap, LineIcon). Shown on `/dev/`. |
| `src/components/islands/` | React islands. |
| `src/scripts/motion.ts` | GSAP reveals, parallax, nav and fader behavior. |
| `scripts/` | Build, asset, OG and QA scripts. |

---

## What the full build adds

- Ten individual service pages (the DETAILS links already point at their future slugs and show a
  toast for now).
- Blog.
- Contact and booking form.
- The full gear list (200+ lines; the demo shows headline names only).
- Credits page.
- Workshops page.
- SEO migration plan with a 301 map from every live URL.
- Removing `noindex`, setting the real domain in `site`, and turning on GA4.
