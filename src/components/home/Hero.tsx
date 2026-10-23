import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Icon } from "@/components/icons/Icon";
import { HeroTracker } from "./HeroTracker";

export function Hero() {
  const t = useTranslations("home.hero");
  const site = useTranslations("site");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <HeroTracker>
      <Container className="relative grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-12 pt-12 pb-16 sm:pt-[72px]">
        <div className="flex min-w-0 flex-col gap-[22px]">
          <Badge tone="blue" dot="green" className="text-[13px]">
            {t("badge")}
          </Badge>
          <h1 className="font-heading text-[36px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[46px] lg:text-[54px]">
            {t("title")}
          </h1>
          <p className="max-w-[56ch] text-[17px] leading-[1.55] text-muted sm:text-[19px]">
            {t("lead")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <a
              href="#xizmatlar"
              className="inline-flex min-h-[50px] items-center gap-2.5 rounded-xl bg-accent px-[22px] font-semibold text-white transition-colors hover:bg-accent-strong hover:text-white"
            >
              {t("ctaServices")}
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            </a>
            <a
              href={siteConfig.cabinetUrl}
              className="inline-flex min-h-[50px] items-center rounded-xl border border-border bg-surface px-[22px] font-semibold text-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              {t("ctaCabinet")}
            </a>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Icon className="h-[18px] w-[18px] text-link">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </Icon>
              {t("factHotline", { phone: siteConfig.hotline })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon className="h-[18px] w-[18px] text-link">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </Icon>
              {t("factOfficial")}
            </span>
          </div>
        </div>

        <div className="hero-scene flex min-w-0 flex-col gap-4">
          <div
            data-tilt
            className="tilt relative flex flex-col items-center gap-[30px] rounded-3xl border border-border bg-surface px-5 pt-14 pb-6 shadow-card sm:px-8 sm:pt-16 sm:pb-8"
          >
            <div className="logo-3d">
              <span className="glow" aria-hidden />
              <span className="ring" aria-hidden />
              <span className="ring ring2" aria-hidden />
              <span className="orbit" aria-hidden>
                <i />
              </span>
              <span className="orbit o2" aria-hidden>
                <i />
              </span>
              <Image
                src="/logo.jpg"
                alt={site("emblemAlt")}
                width={220}
                height={220}
                sizes="(min-width: 640px) 220px, 160px"
                preload
              />
            </div>
            <div className="mt-8 grid w-full grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex min-w-0 flex-col gap-0.5 rounded-[14px] border border-border bg-background px-4 py-3.5"
                >
                  <span className="font-heading text-[26px] font-extrabold tracking-[-0.02em] text-link">
                    {s.value}
                  </span>
                  <span className="text-[13px] text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </HeroTracker>
  );
}
