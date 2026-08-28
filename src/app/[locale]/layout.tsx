import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Lexend, Source_Sans_3 } from "next/font/google";
import { routing } from "@/i18n/routing";
import { locales, siteConfig, type Locale } from "@/config/site";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

const heading = Lexend({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const body = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
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
  const t = await getTranslations({ locale, namespace: "hero" });
  const s = await getTranslations({ locale, namespace: "site" });

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: s("name"),
      template: "%s — food-safety.uz",
    },
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: s("name"),
      title: s("name"),
      description: t("subtitle"),
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
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
            >
              {t("skip")}
            </a>
            <Header />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
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
