# AI Food Safety portal — redesign

Date: 2026-10-23 · Status: draft for approval

## 1. Intent

The site at `food-safety.uz` today is a single "coming soon" page with a countdown and a
Telegram-bot button. It is being replaced by the **AI Food Safety portal** of the Oziq-ovqat
mahsulotlari xavfsizligi qo'mitasi, as designed in `new-design/*.zip`:

- a homepage that presents 12 AI services, 4 technologies, key numbers and a scroll-driven
  "Daladan dasturxongacha — 4 bosqich" (field-to-table) journey;
- one page per service, each with a small demo form that shows a sample ("namuna") result.

There is no backend yet. Every result is mock data, taken from the design files. The goal is
a site that looks and behaves exactly like the designs and is ready to wire to real APIs later.

## 2. Source of truth

`new-design/` holds 13 zip exports (unzip each into its own folder; they are reference
mockups, not code to copy):

| Zip | File | Route slug |
|---|---|---|
| Bosh sahifa | `Main.dc.html` | homepage |
| AI Sertifikat | `Sertifikat.dc.html` | `sertifikat` |
| AI Call Center | `CallCenter.dc.html` | `call-center` |
| AI Murojaatlar | `Murojaatlar.dc.html` | `murojaatlar` |
| AI Fermer | `Fermer.dc.html` | `fermer` |
| AI Reyting | `Reyting.dc.html` | `reyting` |
| AI Import | `Import.dc.html` | `import` |
| AI Eksport | `Eksport.dc.html` | `eksport` |
| AI Bozor | `Bozor.dc.html` | `bozor` |
| AI Yorliq | **`Xizmat.dc.html`** (file name differs) | `yorliq` |
| AI Hisobot | `Hisobot.dc.html` | `hisobot` |
| AI Kuzatuv | `Kuzatuv.dc.html` | `kuzatuv` |
| AI Oshxona | `Oshxona.dc.html` | `oshxona` |

Exact values (colors, sizes, spacing, radii, shadows, keyframes) live in each file's inline
`style="…"` attributes and `<helmet><style>` block. `{{accent}}` = `#1F56C4`. To compare
side by side, serve a folder with `python3 -m http.server` and open the `.dc.html` file.
Read each service file **in full** before building that page; the result blocks differ a lot.

## 3. Goals

1. Rebuild the homepage and all 12 designed service pages faithfully in the existing
   Next.js + Tailwind stack.
2. **Remove AI Patogen completely.** The homepage has no Patogen card (the design's
   `Patogen.dc.html` doesn't exist), and every "13" in the copy becomes "12" (§8.6).
3. Replace the 4 line-drawing SVGs in the journey section with **4 images generated in the
   user's Gemini Pro** (via Chrome), soft 3D illustration style.
4. Keep the site **trilingual (uz / ru / en)**. Uzbek copy comes from the designs verbatim;
   Russian and English are translations of that copy, mock data included.
5. Keep **dark mode** with a dark version of the new palette.
6. Work well from 360 px phones up to 1440 px desktops.

## 4. Non-goals

- No backend, no API calls, no data sent anywhere. Forms only toggle the mock result.
- No auth. "Kirish" and "Shaxsiy kabinetga kirish" link out to `https://cabinet.karantin.uz`.
- No CMS, no analytics, no new npm dependencies.
- The design's accent-colour switcher (a design-tool prop) is not built. The accent is `#1F56C4`.

## 5. Anti-goals (a failure even if it "works")

- Visible drift from the designs: wrong spacing, font, colour or radius; new sections the
  designs don't have.
- Text inside the Gemini images (Uzbek comes out garbled), or images that look pasted-on
  in dark mode.
- Any page that is unreadable or broken in dark mode or on a phone.
- `npm run lint` or `npm run build` failing.
- Mock results that could be mistaken for real decisions. Keep the design's "(namuna)" labels
  and the "Natija tavsiyaviy…" disclaimer on every page.

## 6. Decided by the user

| Decision | Choice |
|---|---|
| What Gemini makes | 4 images, one per journey stage (Dala, Laboratoriya, Chegara, Bozor) |
| Image style | Soft 3D illustration in the site palette |
| Languages | Keep uz / ru / en; mock text translated |
| Dark mode | Keep it; create a dark palette |
| Service pages | All 12 designed pages. **AI Patogen removed completely** (no card, no page). |
| Countdown and hero Telegram button | Remove both. Telegram stays in the footer social links. |
| Domain | `ai.food-safety.uz`: the footer shows it, and the `siteConfig.url` fallback changes to `https://ai.food-safety.uz` |
| Telegram link | Keep `t.me/food_safety_uzb` from the current config (not the design's `uzdavkarantinuz`) |
| Image downloads | Allowed: from `gemini.google.com` to `~/Downloads`, then into the project |
| Browser | Chrome on the **iMac**, not the MacBook |

## 7. Constraints and stack

- **Existing stack, unchanged:** Next.js 16.3.3 (App Router, Turbopack), React 19.2,
  next-intl 4 (`localePrefix: "always"`, routing via `src/proxy.ts`, not middleware),
  next-themes (`attribute="class"`), Tailwind v4 (`@theme inline` tokens in
  `globals.css`), lucide-react.
- **AGENTS.md rule:** read the relevant guide in `node_modules/next/dist/docs/` before writing
  code. Points already checked that matter here:
  - `params` is a Promise in pages, layouts and `generateMetadata`; always `await` it.
  - A nested `[slug]` under `[locale]` uses `generateStaticParams`. Set `dynamicParams = false`
    so unknown slugs 404.
  - Next 16 no longer overrides `scroll-behavior` during navigation. If smooth anchor
    scrolling is added, put `data-scroll-behavior="smooth"` on `<html>`.
  - `next/image`: `qualities` defaults to `[75]` only, and local `src` values with query
    strings need `localPatterns`. Avoid both.
- Both `package-lock.json` and `pnpm-lock.yaml` exist (pnpm is what `node_modules` uses).
  No installs are needed.
- **Never commit.** All work stays in the working tree for the user to review.

## 8. What gets built

### 8.1 Global shell (all pages)

- **Marquee notice bar** (navy): "Sayt test rejimida ishlamoqda" scrolls right-to-left
  (26 s loop) and pauses on hover. `role="status"` with the duplicated copies `aria-hidden`,
  as in the design. No animation when reduced motion is on.
- **Header**: emblem (46 px) + "AI Food Safety" + "Oziq-ovqat mahsulotlari xavfsizligi
  qo'mitasi" (11 px uppercase). Nav: Xizmatlar, Texnologiyalar, Raqamlar, Daladan
  dasturxongacha, plus a filled "Kirish" button. Add the **locale switcher and theme toggle**
  (not in the design), restyled to the new tokens.
  - Nav links point to `/{locale}#xizmatlar`, `#yechimlar`, `#raqamlar`, `#zanjir`, so they
    also work from service pages.
  - *(builder's call)* The same 4 links appear on every page. The service-page designs drop
    "Daladan dasturxongacha"; we keep it so the header stays consistent.
  - *(builder's call)* Below `lg` the nav collapses into a menu button with a disclosure panel.
    The design only wraps, which won't fit with the two extra controls.
- **Footer**:
  - **Brand block:** emblem, full committee name, "sun'iy intellekt portali", Ishonch
    telefoni 1288.
  - **"Sun'iy intellekt qonunchiligi":** the 4 law links plus "Barcha hujjatlar — lex.uz →",
    URLs exactly as in the design.
  - **Social buttons:** text pill style, as in the design, using the real URLs from
    `siteConfig.social` (the design's are `#aloqa` placeholders). *(builder's call)* All 5
    networks in the config, X included.
  - **Bottom row:** © {current year} + committee name on the left, and the site host on the
    right. The host is derived from `siteConfig.url`, whose fallback becomes
    `https://ai.food-safety.uz`.
    - `NEXT_PUBLIC_SITE_URL` and `VERCEL_PROJECT_PRODUCTION_URL` still override the fallback,
      so production must point at `ai.food-safety.uz`. Note this in the handover.
    - The `title.template` "%s — food-safety.uz" and the manifest `short_name` change to
      `ai.food-safety.uz`.
- **Fonts**: **Plus Jakarta Sans** (600/700/800) for headings and **Inter** (400/500/600)
  for body, via `next/font/google`. They replace Lexend and Source Sans 3.
  - Plus Jakarta Sans has no basic `cyrillic` subset (only `cyrillic-ext`), so the heading stack
    must be `Plus Jakarta Sans, Inter, …`. Russian headings then render in Inter. This is
    expected.
- **Emblem**: replace `public/logo.jpg` with the design's 640×640 asset. It is the same
  emblem, sharper at the hero's 220 px.

### 8.2 Homepage `/[locale]`

Sections in design order, with the same anchors and eyebrow numbering ("02 · Xizmatlar" …
"05 · Daladan dasturxongacha"):

1. **Hero (`#top`)**
   - **Left column:**
     - green-dot badge "Davlat xizmati · 24/7 ishlaydi"
     - H1 (54 px desktop, scaling down on phones)
     - lead text
     - two buttons: "Xizmatlarni ko'rish" → `#xizmatlar`, "Shaxsiy kabinetga kirish" →
       cabinet
     - two facts: hotline 1288, official data
   - **Right column:** a white card holding the **3D floating emblem**, with these keyframes
     from the design: glow pulse, dashed and solid rotating rings, two orbiting dots (blue and
     gold), and the float/rotate animation. Under it sit two stat tiles: "80 000 nazorat
     obyekti" and "12 AI xizmati bitta portalda".
   - **Mouse tracker (client component):**
     - A spotlight follows the cursor, a ring cursor-dot appears, and the card tilts up to
       ±16°.
     - It writes CSS variables through refs (`--mx`, `--my`, `--co`, `--tx`, `--ty`) and
       never re-renders React.
     - It is off on touch-only devices and when reduced motion is on.
2. **Xizmatlar (`#xizmatlar`)**: 12 cards (icon tile, title, one-line description,
   "Batafsil →") linking to `/{locale}/xizmatlar/{slug}`. AI Fermer uses the green icon
   tile; all the others use blue. Card order follows the design, with AI Patogen left out.
   At 3 columns, 12 cards make 4 full rows.
3. **Texnologiyalar (`#yechimlar`)**: 4 cards with navy icon tiles.
4. **Raqamlar (`#raqamlar`)**: navy band with 3 big numbers (80 000 · 1288 · 70 mlrd so'm),
   coloured blue, gold and green.
5. **Daladan dasturxongacha (`#zanjir`)**: heading, bouncing down-arrow cue, and a centre
   line with a 4-colour gradient that "grows" as you scroll.
   - **Stages:** Dala (green) → Laboratoriya (blue) → Chegara (amber) → Bozor (navy). They
     alternate sides: image card, numbered node, then text with a coloured tag, title,
     description and service link (AI Fermer, **AI Eksport**, AI Import, AI Bozor).
   - **Stage 2 (Laboratoriya) without Patogen** *(builder's call)*:
     - **Title:** "Namuna tekshiriladi, natija talab bilan solishtiriladi"
     - **Text:** "Pestitsid qoldig'i chegara ichidami — tizim solishtiradi. Natija chet el
       talabi bilan oldindan tekshiriladi."
     - **Link:** "AI Eksport →". Eksport's result includes the MRL / aflatoxin lab checks.
   - **Closing pill:** "Dasturxon — xavfsiz mahsulot".
   - **Scroll animations:** port the scroll-driven ones from the design (`stageIn`, `slideL`,
     `slideR`, `nodePop`, `lineGrow` via `animation-timeline: view()` inside
     `@supports`). Browsers without support show everything statically.
   - **Images:** the Gemini images (§8.4) replace the 4 inline SVGs inside the same white,
     rounded, coloured-shadow cards. **The per-SVG micro-animations (pulsing sun, rising
     bubbles, rocking truck, blinking lamp, scan line) are lost** with the SVGs. That is
     accepted.
   - **Phones (< md):** a single column with the line and nodes on the left. Each stage shows
     node, then image card, then text.

### 8.3 Service pages `/[locale]/xizmatlar/[slug]`

One shared template, matching the designs. *(builder's call)* The path segment is
`xizmatlar` in all three locales, with no localized pathnames.

- breadcrumb: Bosh sahifa / Xizmatlar / AI {name}. "Xizmatlar" and "Barcha 12 xizmat →" both
  go to `/{locale}#xizmatlar`.
- title row: 64 px icon tile, H1 (40 px), lead text, green "Ishlamoqda" status pill
- two columns that wrap: main (basis 560 px) and aside (basis 300 px)
  - **Main**:
    1. form card with the service's own fields, a primary submit button and a "Tozalash"
       (clear) button
    2. result card "… (namuna)" with the service's own mock result, plus the disclaimer
       "Natija tavsiyaviy. Yakuniy qarorni Qo'mita mutaxassisi qabul qiladi."
    3. "Qanday ishlaydi": 3 numbered step cards
  - **Aside**: "Kim uchun" · "Asos" · "Boshqa xizmatlar" (related links + "Barcha 12 xizmat
    →") · navy "Savol bormi?" hotline card
- **Aside "Boshqa xizmatlar":** use the links each design lists, minus AI Patogen. Oshxona's
  design lists it; drop that link.
- **Behaviour (same as the design logic):**
  - The result is visible on load.
  - Submitting the form (prevent default) shows it. "Tozalash" resets the fields and hides it.
    Hisobot's second button is "Standart ko'rinish" instead. Follow what that design's logic
    does.
  - No network calls. Inputs are prefilled with the design's sample values.
- **Per-service result blocks:**

  | Service | Result |
  |---|---|
  | Sertifikat | answer text, required documents, where to apply, deadline, warning |
  | Call Center | chat transcript (citizen / AI operator) + "Mutaxassisga ulash" |
  | Murojaatlar | classification tags, responsible office, similar cases, links |
  | Fermer | 7-day pest risk list (high / medium / low) + recommendation |
  | Reyting | object risk score + weighted factor bars |
  | Import | traffic-light decision + checklist + inspector note |
  | Eksport | readiness 78 % bar + document checklist + past experience |
  | Bozor | alert list (RASFF, local, social) + recall explainer |
  | Yorliq | image file picker (local only, never uploaded) + findings list |
  | Hisobot | KPI tiles + bar chart by violation type + Q&A answer |
  | Kuzatuv | batch chain timeline (Dala → Lab → Ombor → Bozor) + recall button (no-op) |
  | Oshxona | camera status cards per kindergarten/school + privacy note |

- Kuzatuv's timeline line "Patogen aniqlanmadi" is a lab result, not the service. It stays.
- **Per-page metadata:** title "AI {name}" (template "%s — ai.food-safety.uz") and the
  lead as description. An unknown slug (including `patogen`) → 404.

### 8.4 Gemini journey images

- **Where:** in the user's Gemini Pro, in Chrome on the **iMac** ("Davrons iMac", the same
  machine as the repo; not the MacBook), through the Chrome extension. Use one chat so the
  style stays consistent.
- **Style preamble used for every prompt:**
  - soft 3D clay-style illustration, rounded shapes, gentle studio lighting
  - palette: blue `#1F56C4`, green `#2B8A57`, amber `#E39B1C`, navy `#0E2240`, light blue
    `#EDF4FF`
  - plain soft light-blue background
  - **no text, letters, numbers or logos**
  - landscape **3:2**
- **Scenes:**
  1. **Dala:** cotton/wheat field rows, a pheromone insect trap and a small weather sensor, sun.
  2. **Laboratoriya:** lab flask with liquid, test tubes, a microscope, a clipboard with a
     check mark (no DNA, since Patogen is gone).
  3. **Chegara:** a cargo truck at a border checkpoint barrier with a traffic light (amber lit)
     and a shield-check symbol.
  4. **Bozor:** a market stall / small shop front with produce and a phone scanning a QR code,
     shield-check symbol.
- **Dark mode:** the image fills the card as a rounded picture (not a cut-out), so its light
  background reads as a picture in both themes.
- **File handling:**
  - Download from Gemini (lands in `~/Downloads`).
  - Crop any visible watermark.
  - Save as `public/images/journey/{dala,laboratoriya,chegara,bozor}.jpg` (~1200×800) and
    render with `next/image`.
  - Alt text is translated.
- **Order:**
  1. Generate **one** image and get it all the way into `public/`, to prove the pipeline.
  2. Generate the other three.
  3. Show all 4 to the user for approval before they go into the page.
- **Fallback** if Gemini or downloading fails: port the design's 4 SVGs as React components
  (with their micro-animations), and tell the user.

### 8.5 Design tokens and dark mode

Replace the current teal tokens in `globals.css` with the design palette, exposed as Tailwind
colours through `@theme inline`. Every hex used in the designs becomes a token.

| Role | Light (from design) | Dark (*builder's call, tune visually, keep WCAG AA*) |
|---|---|---|
| page background | `#F2F7FD` | ~`#0A1628` |
| surface (cards, header, footer) | `#FFFFFF` | ~`#10213A` |
| text | `#0E2240` | ~`#E6EEF9` |
| muted text | `#54698A` | ~`#9DB0CC` |
| border / soft divider | `#D3E1F1` / `#EDF1F7` | ~`#22395C` / `#1A2F4F` |
| accent / hover | `#1F56C4` / `#163F94` | lighter blue ~`#5B8DEF` / `#8AB0F5` |
| accent soft bg / border | `#EDF4FF` / `#C9DBF5` | translucent blue |
| navy band (marquee, numbers, aside card, tech icons) | `#0E2240`, border `#2A4470` | a navy distinct from the dark page bg |
| on-navy text / soft | `#FFFFFF` / `#B9CBE6`, `#8DBDF5` | same |
| green / soft / border | `#2B8A57` / `#EEF9F2` / `#C3E6D0` | brighter green + translucent |
| amber text / soft / border | `#B07A0C` / `#FFF6E5` / `#F3DDAA` | brighter amber + translucent |
| gold, red, sky, mint | `#E8BD3A`/`#E2AE1C`, `#B93A3A`/`#D14B4B`, `#3C9DE6`, `#7FD3A3` | same or lifted |

Details that are easy to miss:

- The journey nodes' `box-shadow: 0 0 0 8px #F2F7FD` must use the page-background token.
- The hero emblem's `0 0 0 10px #EDF4FF` ring must use the accent-soft token.
- The hero gradient `#FFFFFF → #F2F7FD` becomes surface → background.
- `manifest.ts` `background_color` and `theme_color` move to `#F2F7FD` / `#1F56C4`.
- The global `404` (`src/app/not-found.tsx`) and the locale `not-found.tsx` are restyled with
  the new tokens.

### 8.6 Content and i18n

- **All copy lives in message JSON.** That includes mock data, form labels, select options and
  alt text. Arrays and objects are read with `t.raw`.
- **Layout** *(builder's call)*: split each locale into `src/messages/{locale}/common.json`,
  `home.json` and `services.json` (one `services.<slug>` object per service). Merge them in
  `src/i18n/request.ts`. The current single file would grow past 1 500 lines.
- **Translation rules:**
  - Uzbek is copied verbatim from the designs. Russian and English are faithful translations.
  - Proper nouns and IDs stay as-is: RASFF 2026.4312, UZ-2026-048213, "Baraka savdo" MChJ,
    1288, ePhyto, MRL, E-171.
- **Non-text service metadata** goes in `src/config/services.ts`:
  - slug and order
  - icon (inline SVG paths from the design)
  - tile colour
  - related services for the aside
  - journey stage links
- **Remove:** old message keys (`hero`, `countdown`, `features`), `Countdown.tsx`,
  `siteConfig.launchDate`, and any config that becomes unused.
- **Sitemap:** list the homepage plus the 12 service routes for every locale.
- **"13" → "12" everywhere it counts services** (in all 3 languages):
  - hero lead "13 ta AI xizmati bitta portalda…"
  - hero stat tile "13"
  - section H2 "13 ta sun'iy intellekt xizmati"
  - technologies lead "Barcha 13 xizmat shu to'rtta texnologiya ustida ishlaydi"
  - every aside's "Barcha 13 xizmat →"

  Grep the finished messages for `13` to confirm none are left.

### 8.7 Responsiveness and accessibility

- The design's `auto-fit` grids carry most of the responsive work.
- **Additions:**
  - fluid H1/H2 sizes
  - hero emblem 220 → ~160 px on phones
  - journey collapses to a single column (§8.2)
  - header menu (§8.1)
  - no horizontal scroll at 360 px
- **Accessibility:**
  - Keep the skip link, landmarks and `aria-label`s from the designs.
  - Visible focus rings.
  - 44 px minimum touch targets.
  - Every form control has a `<label>`.
  - Decorative SVGs are `aria-hidden`.
  - All animation honours `prefers-reduced-motion`.

## 9. Left to the builder

Component and file breakdown; exact dark-palette values; mobile menu details; Russian and
English wording; how the per-service form/result components are structured, provided they
share one template. Calls already made on the builder's behalf are marked *(builder's call)*
above.

## 10. Verification

- `npm run lint` and `npm run build` pass. The build pre-renders 3 locales × (1 + 12) pages.
- **In Chrome:**
  - Compare each page side by side with its design export (served from the unzipped folder)
    at 1440 px and ~375 px.
  - Check both themes, all 3 locales and all 12 service routes.
  - On each service page, check that Tozalash hides the result and submit shows it.
  - Check keyboard navigation and the header menu on mobile.
  - Check that reduced motion stops the animations.
  - Check that an unknown slug returns 404.

## 11. Questions — all answered

All open questions are settled; the answers are recorded in §6. None remain. The user approves
the 4 Gemini images before they go on the page (§8.4).
