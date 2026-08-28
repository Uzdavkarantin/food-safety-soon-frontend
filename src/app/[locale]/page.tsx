import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { FileCheck2, Network, Send, ShieldCheck } from "lucide-react";
import { siteConfig, type Locale } from "@/config/site";
import { Container } from "@/components/Container";
import { Emblem } from "@/components/Emblem";
import { Countdown } from "@/components/Countdown";

const featureIcons = [Network, FileCheck2, ShieldCheck];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <Home />;
}

function Home() {
  const t = useTranslations();
  const features = t.raw("features.items") as Array<{
    title: string;
    text: string;
  }>;

  return (
    <>
      <section className="grid flex-1 lg:grid-cols-2">
        {/* Left — content */}
        <div className="flex items-center bg-background py-10 sm:py-14 lg:py-20">
          <Container className="w-full max-w-xl lg:mr-0 lg:ml-auto lg:max-w-lg lg:pr-12">
            <div className="flex max-w-md items-center gap-3">
              <Emblem size={72} alt={t("site.name")} />
              <p className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                {t("site.name")}
              </p>
            </div>

            <span className="mt-7 inline-flex max-w-full items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase text-brand">
              {t("hero.badge")}
            </span>
            <h1 className="mt-4 max-w-[16ch] text-3xl font-semibold leading-tight sm:max-w-[18ch] sm:text-4xl lg:text-[2.65rem]">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-xl font-semibold leading-snug text-brand-strong dark:text-brand">
              {t("hero.subtitle")}
            </p>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-muted sm:text-lg">
              {t("hero.text")}
            </p>

            {siteConfig.launchDate ? (
              <div className="mt-8">
                <Countdown date={siteConfig.launchDate} />
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong min-[420px]:w-auto"
              >
                <Send className="h-4 w-4" />
                {t("hero.contactCta")}
              </a>
            </div>
          </Container>
        </div>

        {/* Right — brand panel */}
        <div className="relative overflow-hidden bg-brand-strong text-white">
          <Container className="relative max-w-lg py-10 sm:py-14 lg:ml-0 lg:mr-auto lg:py-20 lg:pl-12">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {t("features.title")}
            </h2>
            <ul className="mt-8 space-y-6">
              {features.map((f, i) => {
                const Icon = featureIcons[i] ?? ShieldCheck;
                return (
                  <li key={f.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{f.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/80">
                        {f.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </div>
      </section>
    </>
  );
}
