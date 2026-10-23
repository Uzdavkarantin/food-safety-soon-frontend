import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, siteConfig, type Locale } from "@/config/site";
import { getService, serviceSlugs } from "@/config/services";
import { ServicePage } from "@/components/service/ServicePage";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Only the 12 known services exist; anything else (e.g. /patogen) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getService(slug)) return {};
  const t = await getTranslations({ locale, namespace: `services.items.${slug}` });
  const path = `/xizmatlar/${slug}`;

  return {
    title: t("name"),
    description: t("lead"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])),
    },
  };
}

export default async function ServiceRoute({ params }: Props) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  setRequestLocale(locale as Locale);

  return <ServicePage service={service} />;
}
