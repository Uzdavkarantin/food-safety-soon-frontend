# food-safety.uz — coming-soon site

Oziq-ovqat mahsulotlari xavfsizligi qo'mitasi.
Next.js 16 (App Router) · next-intl (UZ/RU/EN) · Tailwind v4 · next-themes.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/uz
npm run build && npm run start
```

## Deploy (Vercel)

1. Import the repo — framework auto-detected as Next.js, no build config needed.
2. Env vars (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` = `https://food-safety.uz` (used for canonical URLs,
     hreflang, sitemap, OG, JSON-LD). Falls back to the Vercel URL if unset.
3. Add the custom domain `food-safety.uz` in Project → Domains.
4. Node 22 (`.nvmrc` / `engines`).

Security headers are set in `next.config.ts`. `robots.ts` / `sitemap.ts` auto-serve
at `/robots.txt` and `/sitemap.xml`.

## Content to finalise

Grep `TODO(content)`:

- `src/config/site.ts` — launch date (or `launchDate: null` to hide countdown),
  contact email/phone. Telegram bot: `@food_safety_robot`.
- `public/logo.jpg` — replace with official emblem (SVG preferred).
- `src/messages/{uz,ru,en}.json` — RU/EN copy review.
