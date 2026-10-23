# AI Food Safety Portal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "coming soon" page with the AI Food Safety portal from `new-design/`: a homepage plus 12 service pages with mock-data demos, in uz/ru/en, light and dark.

**Architecture:**
- **Content:** every piece of copy, including mock data, lives in split message JSON
  (`src/messages/{locale}/{common,home,services}.json`). Non-text metadata (slugs, order,
  tones, related links, journey stages) lives in a data-only `src/config/services.ts`.
- **Service pages:** one statically generated route `/[locale]/xizmatlar/[slug]` renders a
  shared template.
  - Forms are generated from field data.
  - A small client component toggles the result card.
  - Each service supplies only its result-body component.
- **Homepage:** server-rendered sections. Two pieces need the client: the hero mouse tracker
  and the mobile menu.

**Tech Stack:** Next.js 16.3.3 App Router, React 19.2, next-intl 4, next-themes, Tailwind v4,
`node:test` (built into Node 22.18, which strips TS types natively). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-23-ai-portal-redesign-design.md` (read it first, together with this plan)

## Global Constraints

- **Never `git commit` or `git push`.** Leave everything in the working tree (user rule;
  overrides any skill).
- **No new npm dependencies.** Don't run `npm install` or `pnpm add`.
- **No subagents or Workflow** (user rule). Execute inline.
- **Read Next 16 docs before writing code** (AGENTS.md):
  - `params` is a `Promise`, so `await` it.
  - Unknown slugs → `export const dynamicParams = false`.
  - `next/image` allows quality 75 only, and no query strings on local `src`.
- **Design files are the source of truth for every value.** Unzip
  `new-design/<name>-html.zip` into its own folder, then serve that folder with
  `python3 -m http.server` (the extracted designs are already in
  `/private/tmp/claude-501/-Users-davronbekdev-Desktop-FoodSafety-food-safety-frontend-uz/933c5d6b-0375-4181-93ee-548d266532ca/scratchpad/designs/`).
  Read each page's file **in full** before building it.
- **Accent:** `#1F56C4`.
- **Fonts:** Plus Jakarta Sans 600/700/800 for headings, Inter 400/500/600 for body.
  - Heading stack: `Plus Jakarta Sans, Inter, …`. Plus Jakarta has no basic Cyrillic, so
    Russian headings fall back to Inter.
- **No hex colours in `src/**/*.tsx`.** Every colour is a token in `globals.css` with a
  light and a dark value.
- **Services:** 12 in this order: `sertifikat, call-center, murojaatlar, fermer, reyting,
  import, eksport, bozor, yorliq, hisobot, kuzatuv, oshxona`.
  - **AI Patogen does not exist.** No card, page, link or message key. Service counts read
    **12**, never 13.
  - The only exception is Kuzatuv's lab line "Patogen aniqlanmadi", which stays.
- **Domain:** `https://ai.food-safety.uz` (`siteConfig.url` fallback, footer host, title
  template `%s — ai.food-safety.uz`).
- **Telegram:** stays `https://t.me/food_safety_uzb`.
- **External links:** "Kirish" and "Shaxsiy kabinetga kirish" → `https://cabinet.karantin.uz`.
- **Copy:**
  - Uzbek is verbatim from the designs. Russian and English are faithful translations.
  - IDs and proper nouns are unchanged (RASFF 2026.4312, UZ-2026-048213, "Baraka savdo"
    MChJ, 1288, ePhyto, MRL, E-171).
- **Disclaimer on every service result:** "Natija tavsiyaviy. Yakuniy qarorni Qo'mita
  mutaxassisi qabul qiladi."
- **Browser:** Chrome on **Davrons iMac** (deviceId `88e765c9-7f1b-4286-b361-8c1ef54505ad`),
  which is the same machine as the repo. Use the dev server at `http://localhost:3000`.

## Review Focus

1. **Russian/English strings at 360 px.** Header, buttons, badges and the Oshxona badge
   ("312 oshxona · 14 ogohlantirish · 2 jiddiy") must wrap with no horizontal page scroll.
   *Test:* Task 12 runs `document.documentElement.scrollWidth <= innerWidth` in `ru` at
   360 px on `/` and on every service page.
2. **Dark mode on navy surfaces and journey images.** The navy bands must stay distinct from
   the dark page background, and all text must stay readable. *Tests:* the
   `tests/styles.test.mjs` colour scan (Task 2) and Task 12 dark-mode screenshots of every
   homepage section.
3. **Header anchors from a service page.** "Xizmatlar" must land on `/{locale}#xizmatlar`,
   scrolled to the section. *Test:* Task 8 Chrome step (header "Xizmatlar" clicked from
   `/uz/xizmatlar/sertifikat`).
4. **Form behaviour.**
   - Enter in a text input submits and shows the result.
   - "Tozalash" restores default values and hides the result.
   - The file input shows the chosen file name and uploads nothing.

   *Tests:* Task 8 Chrome step on `sertifikat`, Task 10 on `yorliq`.
5. **Reduced motion and touch.** Every animation stops under `prefers-reduced-motion`, and
   the hero tracker never runs on touch-only devices. *Tests:* the `tests/styles.test.mjs`
   reduced-motion assertion (Task 2, extended in Tasks 5 and 7) and the `HeroTracker`
   matchMedia gate (Task 5).

---

## File Structure

```
package.json                         + "test": "node --test tests/"
tests/messages.test.mjs              locale parity, enum equality, no Patogen / no "13"
tests/services.test.mjs              config ↔ messages integrity
tests/styles.test.mjs                no raw hex in TSX; reduced-motion coverage
src/config/site.ts                   url fallback, laws, social (no launchDate/telegramBot)
src/config/services.ts               data only, zero imports
src/i18n/request.ts                  merges split messages
src/messages/{uz,ru,en}/common.json  site, theme, locale, nav, notice, footer, notFound
src/messages/{uz,ru,en}/home.json    hero, services, tech, numbers, journey
src/messages/{uz,ru,en}/services.json  common + items.<slug>
src/app/globals.css                  tokens (light/dark), keyframes, base
src/app/manifest.ts, sitemap.ts, not-found.tsx
src/app/[locale]/layout.tsx          fonts, NoticeBar, title template
src/app/[locale]/page.tsx            homepage
src/app/[locale]/not-found.tsx
src/app/[locale]/xizmatlar/[slug]/page.tsx
src/components/Container.tsx, Emblem.tsx, Brand.tsx, NoticeBar.tsx, Header.tsx,
  MobileMenu.tsx, Footer.tsx, SocialLinks.tsx, LocaleSwitcher.tsx, ThemeToggle.tsx,
  SectionHeading.tsx, Badge.tsx
src/components/icons/ServiceIcon.tsx
src/components/home/{Hero,HeroTracker,ServicesSection,TechSection,NumbersSection,JourneySection}.tsx
src/components/service/{types.ts,ServicePage.tsx,ServiceDemo.tsx,FormFields.tsx}
src/components/service/results/{index.ts,<Name>Result.tsx ×12}
public/logo.jpg (replaced), public/images/journey/{dala,laboratoriya,chegara,bozor}.jpg
deleted: src/messages/{uz,ru,en}.json, src/components/Countdown.tsx
```

---

### Task 1: Test harness and split messages (no visual change)

**Files:**
- Create: `tests/messages.test.mjs`, `src/messages/{uz,ru,en}/{common,home,services}.json`
- Modify: `package.json` (scripts), `src/i18n/request.ts`
- Delete: `src/messages/{uz,ru,en}.json`

**Interfaces:**
- Produces:
  - **Message shape:** `{ ...common.json, home: home.json, services: services.json }`.
  - **Namespaces:** `site`, `theme`, `locale`, `nav`, `notice`, `footer`, `notFound`, `home.*`
    and `services.*`.
  - **Test helper:** `loadMessages(locale): object`, exported from
    `tests/messages.test.mjs`. It merges the 3 files the same way `request.ts` does.

- [ ] **Step 1: Write the failing tests** in `tests/messages.test.mjs`:
  - `"locales have identical shape"`: deep-compare `uz` against `ru` and `en`.
    - Same keys at every level.
    - Same array lengths.
    - Same value types (`string` / `number` / `object` / `array`).
    - Failures report the path.
  - `"enum values are identical across locales"`: any key named `status`, `tone`, `level` or
    `kind` has an identical value in all locales.
  - `"no Patogen service and no 13-service counts"`: `services.items.patogen` is undefined.
    No string in any locale matches
    `/\b13\b\s*(ta|xizmat|AI|услуг|сервис|ИИ|services|AI services)/i`.
- [ ] **Step 2: Add `"test": "node --test tests/"` to package.json. Run `npm test`.**
  Expected: FAIL, because `src/messages/uz/common.json` doesn't exist yet.
- [ ] **Step 3: Split the messages.**
  - Move every current key **except** `hero`, `countdown` and `features` into
    `common.json`.
  - Keep `hero`, `countdown` and `features` temporarily under `home.json` → `legacy` so the
    old page still builds. Task 5 deletes them.
  - `services.json` = `{ "common": {}, "items": {} }`.
  - Merge the 3 files in `request.ts` with three dynamic imports.
  - Update the old `page.tsx` and the layout's `generateMetadata` (which reads the `hero`
    namespace) to read `home.legacy.*` (temporary).
- [ ] **Step 4: Verify.**
  - Run `npm test`. Expected: 3 pass.
  - Run `npm run lint && npm run build`. Expected: success, with routes `/uz`, `/ru`, `/en`.

### Task 2: Tokens, fonts, emblem, config

**Files:**
- Create: `tests/styles.test.mjs`
- Modify: `src/app/globals.css`, `src/app/[locale]/layout.tsx` (fonts, title template),
  `src/config/site.ts`, `src/app/manifest.ts`, `src/components/Container.tsx`,
  `src/app/not-found.tsx`, `src/app/[locale]/not-found.tsx`, `public/logo.jpg`

**Interfaces:**
- Produces:
  - **Tailwind colour tokens** (use them as `bg-*`, `text-*`, `border-*`):
    - base: `background`, `surface`, `surface-soft`, `foreground`, `muted`, `border`,
      `divider`
    - accent: `accent`, `accent-hover`, `accent-soft`, `accent-border`
    - navy: `navy`, `navy-border`, `on-navy`, `on-navy-muted`
    - palette: `sky`, `cyan`, `mint`, `gold`, `gold-strong`
    - green: `success`, `success-soft`, `success-border`
    - amber: `warning`, `warning-text`, `warning-soft`, `warning-border`
    - red: `danger`, `danger-bright`, `danger-soft`, `danger-border`
    - slate: `slate-soft`, `slate-border`
  - **Font utilities:** `font-heading` and `font-sans`.
  - **CSS classes** with the design's exact keyframes: `.marquee`, `.hero-scene`, `.tilt`,
    `.logo-3d`, `.glow`, `.ring`, `.ring2`, `.orbit`, `.o2`, `.spot`, `.cursor-dot`, `.cue`,
    `.j-base`, `.j-line`, `.j-stage`, `.j-media`, `.j-text`, `.j-node`. The SVG-only ones
    (`.sun`, `.bub`, `.truck`, `.lamp`, `.scan`) are dropped.
  - **`siteConfig`:**
    - `url` falls back to `https://ai.food-safety.uz`
    - `cabinetUrl: "https://cabinet.karantin.uz"`
    - `hotline: "1288"`
    - `laws: { href: string }[]` (4 design URLs) and `lawsAllUrl: "https://lex.uz"`
    - `social` unchanged
    - `launchDate` and `telegram*` stay until Task 5
  - **`Container`:** `max-w-[1200px] px-4 sm:px-6`.

- [ ] **Step 1: Write the failing tests** in `tests/styles.test.mjs`:
  - `"no hex colours in components"`: no `src/**/*.tsx` file matches
    `/#[0-9a-fA-F]{3,8}\b/`.
  - `"dark theme defines every light token"`: every `--name` declared in the `:root` block of
    `globals.css` is also declared in `.dark`.
  - `"reduced motion stops every animated class"`: the `@media (prefers-reduced-motion:
    reduce)` block contains `.marquee`, `.logo-3d`, `.ring`, `.orbit`, `.glow`, `.cue`,
    `.j-stage`, `.j-media`, `.j-text`, `.j-node` and `.j-line`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL. The current page has hex-free TSX, but
  the token and reduced-motion assertions fail.
- [ ] **Step 3: Implement.**
  - Write the tokens with the light values from the spec §8.5 table plus `danger-soft`
    `#FFF1F1` / `danger-border` `#F2C9C9`. Pick the dark values by eye (WCAG AA).
  - In dark mode, `navy` must differ from `background`.
  - Port the keyframes and classes from `Main.dc.html` `<helmet>` verbatim, swapping hexes
    for tokens. That includes `box-shadow: 0 0 0 8px var(--background)` on nodes.
  - Swap the fonts in the layout.
  - Copy the design's 640 px emblem over `public/logo.jpg`.
  - Manifest: `short_name: "ai.food-safety.uz"`, `background_color: "#F2F7FD"`,
    `theme_color: "#1F56C4"`.
  - Restyle both 404 pages with the tokens.
- [ ] **Step 4: Verify.** Run `npm test && npm run lint && npm run build`. Expected: all
  pass.

### Task 3: Site shell (notice bar, header, footer)

**Files:**
- Create: `Brand.tsx`, `NoticeBar.tsx`, `MobileMenu.tsx`, `SectionHeading.tsx`, `Badge.tsx`
- Modify: `Header.tsx`, `Footer.tsx`, `SocialLinks.tsx`, `LocaleSwitcher.tsx`,
  `ThemeToggle.tsx`, `src/app/[locale]/layout.tsx`,
  `src/messages/*/common.json`

**Interfaces:**
- Produces:
  - `<Brand />`: a link to `/` with the 46 px emblem, "AI Food Safety" and the committee line.
  - `<SectionHeading eyebrow title lead? align?: "start" | "center" tone?: "default" |
    "onNavy" />`
  - `<Badge tone: "blue" | "green" | "amber" | "red" | "slate" dot?: boolean>{label}</Badge>`
  - `common.json` keys:
    - `site`: `brand`, `committee`, `emblemAlt`
    - `nav`: `label`, `services`, `technologies`, `numbers`, `journey`, `login`, `menuOpen`,
      `menuClose`
    - `notice`: `testMode`, `label`
    - `footer`: `org`, `portal`, `hotline`, `lawsTitle`, `laws[4]`, `allLaws`,
      `socialLabel`, `copyright`
- Consumes: tokens and `siteConfig` (Task 2).

- [ ] **Step 1: Write the copy.** Add the keys above to `uz/ru/en` `common.json` (uz
  verbatim from `Main.dc.html`). Run `npm test`. Expected: PASS (parity).
- [ ] **Step 2: Build the components.**
  - **`NoticeBar`:** two identical groups of 4 items, the second `aria-hidden`. The outer
    element has `role="status"` and `aria-label={notice.label}`.
  - **`Header`:**
    - Not sticky, as in the design.
    - Nav links use next-intl `Link` with `href={{ pathname: "/", hash: "xizmatlar" }}` (and
      `yechimlar`, `raqamlar`, `zanjir`).
    - "Kirish" goes to `siteConfig.cabinetUrl` and gets the design's login icon.
    - Then `LocaleSwitcher` and `ThemeToggle`, restyled to tokens with 44 px targets.
    - Below `lg`, the nav and Kirish move into `MobileMenu`.
  - **`MobileMenu`** (client): a button with `aria-expanded` / `aria-controls`. The panel
    closes on link click and on Escape.
  - **`Footer`:**
    - Layout as in the design.
    - Laws from `siteConfig.laws` + `footer.laws[i]`.
    - `SocialLinks` as text pills (Telegram, YouTube, Facebook, Instagram, X) from
      `siteConfig.social`.
    - Bottom row: `© {year} {footer.copyright}` and `new URL(siteConfig.url).host`.
  - Mount `NoticeBar` above `Header` in the layout.
- [ ] **Step 3: Verify.** Run `npm test && npm run lint && npm run build`.
- [ ] **Step 4: Check in Chrome (iMac).**
  - **Compare** `/uz` against `Main.dc.html` for the marquee, header and footer, at 1440 px
    and 375 px:
    - mobile menu opens and closes
    - Escape closes it
    - focus ring is visible
  - **Themes:** both.

### Task 4: Services config and icons

**Files:**
- Create: `src/config/services.ts`, `src/components/icons/ServiceIcon.tsx`,
  `tests/services.test.mjs`
- Modify: `src/messages/*/services.json`

**Interfaces:**
- Produces:
  - **Types and data in `src/config/services.ts`:**

    ```ts
    export type Tone = "blue" | "green" | "amber" | "red" | "slate";
    export type ServiceConfig = { slug: string; tone: "blue" | "green"; badgeTone: Tone; related: string[] };
    export const services: ServiceConfig[];          // 12, global order
    export const serviceSlugs: string[];
    export function getService(slug: string): ServiceConfig | undefined;
    export const journeyStages: { key: "dala" | "laboratoriya" | "chegara" | "bozor";
      slug: string; tone: "green" | "blue" | "amber" | "navy" }[];
    ```

  - **`tone`:** `green` for fermer, `blue` for everything else.
  - **`badgeTone`:**
    - `blue`: sertifikat
    - `green`: call-center, fermer, hisobot, kuzatuv
    - `amber`: eksport, import, oshxona
    - `red`: bozor, murojaatlar, reyting, yorliq
  - **`related`:** each design's "Boshqa xizmatlar" list. Oshxona becomes
    `["murojaatlar","reyting"]` (Patogen dropped).
  - **`journeyStages`:** dala→fermer/green, laboratoriya→eksport/blue,
    chegara→import/amber, bozor→bozor/navy.
  - **`<ServiceIcon slug size? />`:** the design's SVG for each service (from the
    `Main.dc.html` cards), `aria-hidden`.
  - **`services.json`:** `items.<slug>.name` and `items.<slug>.card` (homepage card text).

- [ ] **Step 1: Write the failing tests** in `tests/services.test.mjs`. Import
  `../src/config/services.ts` directly.
  - `"12 services in design order"`: `serviceSlugs` deep-equals the list in Global
    Constraints.
  - `"related and journey slugs exist"`: every `related` entry is in `serviceSlugs` and is not
    the service itself. Each journey `slug` is in `serviceSlugs`. The stages are exactly
    `dala, laboratoriya, chegara, bozor`.
  - `"every service has card copy in every locale"`: `items[slug].name` and `.card` are
    non-empty in uz/ru/en.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL, the module is not found.
- [ ] **Step 3: Implement** the config, the icon component and the copy in 3 locales.
- [ ] **Step 4: Run `npm test && npm run lint`.** Expected: PASS.

### Task 5: Homepage (hero, services, technologies, numbers)

**Files:**
- Create: `src/components/home/{Hero,HeroTracker,ServicesSection,TechSection,NumbersSection}.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/messages/*/home.json`, `src/config/site.ts`,
  `tests/styles.test.mjs`
- Delete: `src/components/Countdown.tsx`, `home.legacy`, and `siteConfig.launchDate` /
  `telegramBot` / `telegramUrl`

**Interfaces:**
- Consumes: `services`, `ServiceIcon`, `SectionHeading`, `Badge`, `Container`.
- Produces:
  - `<HeroTracker>{children}</HeroTracker>`: a client component that renders
    `<section id="top">`.
  - `home.json`:
    - `hero`: `badge`, `title`, `lead`, `ctaServices`, `ctaCabinet`, `factHotline`,
      `factOfficial`, `stats[2]{value,label}`
    - `services`: `eyebrow`, `title`, `lead`, `more`
    - `tech`: `eyebrow`, `title`, `lead`, `items[4]{title,text}`
    - `numbers`: `eyebrow`, `title`, `items[3]{value,label,note}`

- [ ] **Step 1: Extend the tests.**
  - `tests/messages.test.mjs` `"homepage counts read 12"`: `home.hero.stats[1].value ===
    "12"` in every locale, and `home.services.title` contains `12`.
  - `tests/styles.test.mjs`: the reduced-motion block also contains `.tilt`.
  - Run `npm test`. Expected: FAIL.
- [ ] **Step 2: Write `home.json` in uz/ru/en.**
  - uz is verbatim from `Main.dc.html`, with 13 changed to 12.
  - Eyebrows run "02 · Xizmatlar", "03 · Texnologiyalar", "04 · Raqamlar".
- [ ] **Step 3: Build the sections from `Main.dc.html`.**
  - **`HeroTracker`:**
    - Use refs only, no React state.
    - Set `--mx`, `--my` and `--co` on the section.
    - Set `--tx` / `--ty` (±16°) on the `[data-tilt]` child.
    - Attach listeners only when `matchMedia("(hover: hover) and (pointer: fine)")` matches
      and `matchMedia("(prefers-reduced-motion: reduce)")` doesn't.
  - **Hero emblem:** `next/image` at 220 px, 160 px below `sm`.
  - **Service cards:** link to `/xizmatlar/{slug}` via next-intl `Link`.
  - **Page:** `page.tsx` renders the sections in order with ids `top`, `xizmatlar`,
    `yechimlar`, `raqamlar`.
- [ ] **Step 4: Verify.** Run `npm test && npm run lint && npm run build`. Expected: PASS.
- [ ] **Step 5: Check in Chrome.** Compare `/uz`, `/ru` and `/en` side by side with the
  design at 1440 and 375 px, in light and dark:
  - the tracker spotlight and tilt work
  - nothing overflows at 360 px

### Task 6: Gemini journey images

**Files:**
- Create: `public/images/journey/{dala,laboratoriya,chegara,bozor}.jpg`

**Interfaces:**
- Produces: four ~1200×800 JPGs. Task 7 renders them with `aspect-[3/2] object-cover`, so
  other aspect ratios still work.

- [ ] **Step 1: Open Gemini.** Make sure the browser is the iMac (`select_browser
  88e765c9-…`). Open `https://gemini.google.com/app` in a new tab and start a new chat.
- [ ] **Step 2: Generate image 1 (Dala) only.** Send the prompt below. It is the style
  preamble plus scene 1.

  > Create an image. Soft 3D clay-style illustration, rounded shapes, gentle studio lighting, soft shadows, clean centered composition with generous margins. Use only this palette: royal blue #1F56C4, green #2B8A57, amber #E39B1C, deep navy #0E2240, on a plain soft light-blue background #EDF4FF. Absolutely no text, letters, numbers, signs or logos anywhere. Landscape 3:2 aspect ratio. Scene: a small farm field with neat rows of young cotton and wheat plants, a pheromone insect trap on a short pole and a small weather sensor station, a warm sun in the sky.

- [ ] **Step 3: Prove the download pipeline.**
  1. Use the image's download button (full size). It lands in `~/Downloads`.
  2. Find the file with `ls -t ~/Downloads | head -3`.
  3. Run `mkdir -p public/images/journey && sips -s format jpeg -s formatOptions 82
     --resampleWidth 1200 "<file>" --out public/images/journey/dala.jpg`.
  4. Read the JPG to confirm it opens.
  5. Crop any visible watermark with `sips --cropToHeightWidth` and `--cropOffset`.
  6. If Chrome shows a "Save as" dialog or the download fails, stop and ask the user.
- [ ] **Step 4: Generate images 2–4 in the same chat.** Each prompt starts with "Same style,
  palette, background and rules as the previous image." followed by the scene:
  - **laboratoriya:** "a clean food-safety laboratory bench with a conical flask of
    light-blue liquid, a rack of test tubes, a microscope and a clipboard with a green check
    mark."
  - **chegara:** "a cargo truck stopped at a border checkpoint barrier, a traffic light with
    the amber light glowing, and a green shield with a check mark floating above."
  - **bozor:** "a friendly market stall with crates of fruit and vegetables, a hand holding
    a smartphone scanning a QR code on a product, and a green shield with a check mark."

  Convert each one as in Step 3. Regenerate any image that contains text.
- [ ] **Step 5: Get the user's approval.** Show the user all 4 files and ask (with
  AskUserQuestion) whether to use them or regenerate specific ones. Don't continue to Task 7
  until they approve. Close the Gemini tab.

### Task 7: Journey section

**Files:**
- Create: `src/components/home/JourneySection.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/messages/*/home.json`, `tests/styles.test.mjs`

**Interfaces:**
- Consumes: `journeyStages`, `SectionHeading`, the images from Task 6.
- Produces: `home.journey` = `{ eyebrow, title, lead, stages[4]{tag,title,text,link,imageAlt}, finale }`.

- [ ] **Step 1: Extend the tests.**
  - `tests/messages.test.mjs` `"journey has 4 stages and stage 2 has no Patogen"`:
    `home.journey.stages.length === 4`, and `stages[1].link` doesn't match `/patogen/i`.
  - `tests/styles.test.mjs`: `.j-*` classes are only animated inside
    `@supports (animation-timeline: view())`.
  - Run `npm test`. Expected: FAIL.
- [ ] **Step 2: Write the copy.**
  - uz is verbatim from `Main.dc.html`, except stage 2:
    - title: "Namuna tekshiriladi, natija talab bilan solishtiriladi"
    - text: "Pestitsid qoldig'i chegara ichidami — tizim solishtiradi. Natija chet el talabi
      bilan oldindan tekshiriladi."
    - link: "AI Eksport →"
  - Eyebrow: "05 · Daladan dasturxongacha".
- [ ] **Step 3: Build the section.**
  - **Desktop (`md` and up):** the design's alternating 3-column grid
    (`1fr 72px 1fr`). Odd stages put the image on the left; even stages put the text on
    the left, right-aligned.
  - **Image cards:** a white/`surface` card, radius 20, padding 22, and the coloured shadow
    from the design. The image is `next/image` with `sizes="(min-width: 768px) 440px,
    100vw"` and rounded 12.
  - **Below `md`:** a single column with the line at `left: 22px`. Each stage shows node,
    image, then text, all left-aligned.
  - **Finale:** the navy pill.
  - Add the section to `page.tsx` with `id="zanjir"`.
- [ ] **Step 4: Verify.** Run `npm test && npm run lint && npm run build`. Then check in
  Chrome:
  - scrolling plays the stage-in and line-grow animations
  - the section looks right in dark mode
  - the mobile single column works at 375 px

### Task 8: Service page template and AI Sertifikat

**Files:**
- Create: `src/app/[locale]/xizmatlar/[slug]/page.tsx`, `src/components/service/{types.ts,ServicePage.tsx,ServiceDemo.tsx,FormFields.tsx}`,
  `src/components/service/results/{index.ts,SertifikatResult.tsx}`
- Modify: `src/messages/*/services.json`, `src/app/sitemap.ts`, `tests/services.test.mjs`

**Interfaces:**
- Consumes: `getService`, `serviceSlugs`, `ServiceIcon`, `Badge`, `Container`.
- Produces:

  ```ts
  // types.ts
  export type FormField =
    | { id: string; label: string; type: "textarea" | "text" | "number"; value: string }
    | { id: string; label: string; type: "select"; options: string[] }
    | { id: string; label: string; type: "file"; hint: string };
  export type ServiceForm = { title: string; submit: string; reset: string; fields: FormField[] };
  // ServiceDemo.tsx ("use client")
  export function ServiceDemo(props: { form: ServiceForm; resultTitle: string;
    badge: { label: string; tone: Tone }; disclaimer: string; children: React.ReactNode }): JSX.Element;
  // results/index.ts
  export const resultComponents: Partial<Record<string, React.ComponentType>>;
  ```

  - **`services.json` `common`:** `breadcrumbLabel`, `home`, `services`, `status`,
    `howTitle`, `forWhoTitle`, `basisTitle`, `otherTitle`, `allServices`, `helpTitle`,
    `helpText`, `disclaimer`.
  - **`services.json` `items.<slug>`**, filled in this task **for all 12 services**, from
    each design file:
    - `lead`, `form` (ServiceForm), `result.title`, `result.badge`
    - `steps[3]{title,text}`, `forWho`, `basis`
- **Form rules:**
  - `textarea` and `file` fields are full width. All other fields share one
    `repeat(auto-fit,minmax(220px,1fr))` grid.
  - Inputs are uncontrolled, with `defaultValue`.
  - Submit (including Enter) runs `preventDefault`, then shows the result.
  - The reset button is `type="reset"`, which restores defaults and hides the result.
  - The result starts visible.
- **Route:**
  - `export const dynamicParams = false`
  - `generateStaticParams` returns `serviceSlugs.map(slug => ({ slug }))`
  - `generateMetadata`: title `items.<slug>.name`, description `lead`
  - unknown slug → `notFound()`
- **`ServicePage` layout:**
  - breadcrumb (`Bosh sahifa / Xizmatlar / AI …`; Xizmatlar goes to `/#xizmatlar`)
  - title row with 64 px icon, H1 40 px, lead and green "Ishlamoqda" badge
  - main column (basis 560): `ServiceDemo`, then the steps
  - aside (basis 300): `forWho`, `basis`, `related` links + "Barcha 12 xizmat →", and the
    navy help card
- **Sitemap:** `paths = ["", ...serviceSlugs.map(s => "/xizmatlar/" + s)]`.

- [ ] **Step 1: Write the failing tests** in `tests/services.test.mjs`:
  - `"every service page has complete copy"`: for every slug and locale:
    - `lead`, `forWho`, `basis` and `result.title` are non-empty
    - `steps.length === 3`
    - `form.fields.length >= 2`
    - each field `type` is in `[textarea, text, number, select, file]`
    - every select has `options.length >= 2`
    - field `id`s are unique within the page
  - `"service common copy says 12"`: `services.common.allServices` contains `12`.
  - Run `npm test`. Expected: FAIL.
- [ ] **Step 2: Write the copy** for `services.common` and all 12 `items` shells in 3
  locales. Take fields, options, defaults, buttons, steps, aside text and result
  title/badge from each `.dc.html` (Hisobot's reset label is "Standart ko'rinish").
- [ ] **Step 3: Build the template**, then `SertifikatResult` from `Sertifikat.dc.html`.
  Register it in `resultComponents`. Slugs without a component render no body yet.
- [ ] **Step 4: Verify.** Run `npm test && npm run lint && npm run build`. Expected: PASS.
  The build lists 36 `/[locale]/xizmatlar/[slug]` paths.
- [ ] **Step 5: Check in Chrome** at `/uz/xizmatlar/sertifikat` against
  `Sertifikat.dc.html`, at 1440 and 375 px, in both themes:
  - Enter in a field shows the result.
  - Tozalash hides it and restores the textarea text.
  - "Javob olish" shows it again.
  - Clicking the header's "Xizmatlar" lands on `/uz#xizmatlar`, scrolled to the section.
  - `/uz/xizmatlar/patogen` returns 404.

### Task 9: Results: Call Center, Murojaatlar, Fermer, Reyting

**Files:**
- Create: `results/{CallCenter,Murojaatlar,Fermer,Reyting}Result.tsx`
- Modify: `results/index.ts`, `src/messages/*/services.json`, `tests/services.test.mjs`

**Interfaces:**
- Consumes: the `ServiceDemo` children slot and `Badge`.
- Produces: `items.<slug>.result.*` body data. Each component reads
  `t.raw("items.<slug>.result")` with a local type.
- Levels and statuses in the data use the enum keys `status` / `level` with values
  `"high" | "medium" | "low" | "ok" | "warn" | "bad"`. The parity test enforces that these
  match across locales.

- [ ] **Step 1: Extend the test.** In `tests/services.test.mjs`, set
  `const resultSlugs = ["sertifikat","call-center","murojaatlar","fermer","reyting"]`.
  `"built services have result body data"` checks that `Object.keys(result).length > 2`
  (more than `title` + `badge`) in every locale. Run `npm test`. Expected: FAIL.
- [ ] **Step 2: Build each result.** Read each design file in full, write its copy in 3
  locales and build the component:
  - **Call Center:** chat bubbles (citizen on the left, AI on the right) plus the
    "Mutaxassisga ulash" note.
  - **Murojaatlar:** tags, responsible office, similar cases, and the AI Oshxona link to
    `/xizmatlar/oshxona`.
  - **Fermer:** a list of 3 risk rows with level colours plus the recommendation.
  - **Reyting:** the score plus weighted factor bars (widths from the data).
- [ ] **Step 3: Verify.** Run `npm test && npm run lint && npm run build`. Then compare each
  page with its design in Chrome at 1440 and 375 px, in both themes.

### Task 10: Results: Import, Eksport, Bozor, Yorliq

Same files, interfaces and steps as Task 9.
- `resultSlugs` gains `import`, `eksport`, `bozor`, `yorliq`.
- **Import:** traffic light, checklist, inspector note.
- **Eksport:** 78 % readiness bar, checklist, past experience.
- **Bozor:** 3 alert cards plus the recall explainer.
- **Yorliq:**
  - Findings list.
  - The file `FormField` renders the design's dashed dropzone.
  - Choosing a file shows its name.
  - Nothing is uploaded.
- **Chrome check:** on `/uz/xizmatlar/yorliq`, pick a local image. The name shows, and the
  Network panel (`read_network_requests`) shows no upload.

### Task 11: Results: Hisobot, Kuzatuv, Oshxona

Same files, interfaces and steps as Task 9.
- `resultSlugs` gains `hisobot`, `kuzatuv`, `oshxona`. Add the assertion
  `resultSlugs` deep-equals `serviceSlugs` sorted the same way, so every service has a body.
- **Hisobot:** KPI tiles, bar chart by violation type (38/27/21/14 %), and the Q&A answer.
- **Kuzatuv:**
  - The 4-step chain timeline, keeping the "Patogen aniqlanmadi" line.
  - The recall button is `type="button"` and does nothing.
- **Oshxona:** camera status cards plus the privacy and "why it matters" notes.
- After this task, `resultComponents` has all 12 entries.

### Task 12: Full verification and handover

**Files:** none new. This task fixes whatever the checks find.

- [ ] **Step 1: Run the checks.**
  - Run `npm test && npm run lint && npm run build`. Expected: all pass, with 3 + 36
    pre-rendered pages.
  - Run `grep -rn "13" src/messages` and confirm none of the matches is a service count.
- [ ] **Step 2: Check the routes.**
  - Run `npm run start`.
  - For each locale `uz ru en` and each of the 12 slugs, run
    `curl -s -o /dev/null -w "%{http_code}"`. Expected: 200.
  - `/uz/xizmatlar/patogen` and `/uz/xizmatlar/nope`: expected 404.
  - `/sitemap.xml` lists 39 URLs on `https://ai.food-safety.uz`.
- [ ] **Step 3: Review in Chrome on the iMac.** For `/uz`, `/ru` and `/en`, and every
  service page in `uz`, compare with the design at 1440 px. For each:
  - Switch to dark mode and check that every section is readable and navy bands are
    distinct.
  - At 360 px in `ru`, run `document.documentElement.scrollWidth <= innerWidth`. Expected:
    `true`.
  - Check keyboard Tab order and the mobile menu.
- [ ] **Step 4: Clean up.**
  - Close the tabs you opened.
  - Make sure `git status` shows only the intended changes, plus `docs/`, `new-design/` and
    `PLAN.md`.
  - **Do not commit.**
- [ ] **Step 5: Report.**
  - Summarize what changed and the check results, including anything that failed.
  - Remind the user that `NEXT_PUBLIC_SITE_URL` or the Vercel production domain must point
    to `ai.food-safety.uz`.
  - Offer a commit in one line.
