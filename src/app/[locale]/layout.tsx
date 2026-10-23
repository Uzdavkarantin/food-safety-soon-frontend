import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import { locales, siteConfig, type Locale } from "@/config/site";
import { Providers } from "@/components/Providers";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";
import "../globals.css";

// Plus Jakarta Sans has no basic Cyrillic subset; Russian headings fall back to Inter.
const heading = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "cyrillic-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});
const body = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const s = await getTranslations({ locale, namespace: "site" });

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: s("name"),
      template: "%s — ai.food-safety.uz",
    },
    description: t("lead"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: s("name"),
      title: s("name"),
      description: t("lead"),
      url: `${siteConfig.url}/${locale}`,
      locale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "site" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: t("name"),
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.jpg`,
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    areaServed: "UZ",
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
            >
              {t("skip")}
            </a>
            <NoticeBar />
            <Header />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
            <CursorGlow />
          </NextIntlClientProvider>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
