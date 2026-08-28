function resolveUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Vercel provides this at build & runtime (host only, no protocol)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://food-safety.uz";
}

export const siteConfig = {
  url: resolveUrl(),
  telegramBot: "@food_safety_robot",
  telegramUrl: "https://t.me/food_safety_robot",
  contactEmail: "info@food-safety.uz", // TODO(content): real address
  contactPhone: "+998 71 000 00 00", // TODO(content): real phone
  // TODO(content): confirm launch date, or set to null to hide the countdown
  launchDate: "2026-10-01T09:00:00+05:00" as string | null,
  social: {
    telegram: "https://t.me/food_safety_uzb",
    facebook: "https://www.facebook.com/foodsafetyuzb",
    instagram: "https://www.instagram.com/uzdavkarantin",
    youtube: "https://www.youtube.com/@Foodsafetyuzb",
    x: "https://x.com/foodsafetyuzb",
  },
};

export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";
