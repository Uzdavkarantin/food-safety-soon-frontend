import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import type { ServiceConfig } from "@/config/services";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { ServiceIcon, iconTileClasses } from "@/components/icons/ServiceIcon";
import { ServiceDemo } from "./ServiceDemo";
import { Blocks, type Block } from "./results";
import type { ServiceForm, ServiceStep } from "./types";

const asideCard = "flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5";

export function ServicePage({ service }: { service: ServiceConfig }) {
  const { slug, tone, badgeTone, related } = service;
  const t = useTranslations("services");
  const item = (key: string) => t(`items.${slug}.${key}`);
  const form = t.raw(`items.${slug}.form`) as ServiceForm;
  const steps = t.raw(`items.${slug}.steps`) as ServiceStep[];
  const blocks = (t.has(`items.${slug}.result.blocks`)
    ? t.raw(`items.${slug}.result.blocks`)
    : []) as Block[];

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-[72px]">
      <nav aria-label={t("common.breadcrumbLabel")} className="text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/">{t("common.home")}</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={{ pathname: "/", hash: "xizmatlar" }}>{t("common.services")}</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-foreground">
            {item("name")}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
        <span
          className={`grid h-16 w-16 flex-none place-items-center rounded-2xl border ${iconTileClasses[tone]}`}
        >
          <ServiceIcon slug={slug} className="h-[30px] w-[30px]" />
        </span>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-1.5">
          <h1 className="font-heading text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
            {item("name")}
          </h1>
          <p className="max-w-[60ch] text-[17px] text-muted sm:text-lg">{item("lead")}</p>
        </div>
        <Badge tone="green" dot="green">
          {t("common.statusLabel")}
        </Badge>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
          <ServiceDemo
            form={form}
            resultTitle={item("result.title")}
            badge={{ label: item("result.badge"), tone: badgeTone }}
            disclaimer={t("common.disclaimer")}
          >
            <Blocks blocks={blocks} />
          </ServiceDemo>

          <section className="flex flex-col gap-3.5">
            <h2 className="font-heading text-[22px] font-bold">{t("common.howTitle")}</h2>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex min-w-0 flex-col gap-1.5 rounded-[14px] border border-border bg-surface p-[18px]"
                >
                  <span className="font-heading text-[26px] font-extrabold leading-none text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <b>{step.title}</b>
                  <span className="text-sm text-muted">{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <div className={asideCard}>
            <b className="font-heading text-base">{t("common.forWhoTitle")}</b>
            <span className="text-sm text-muted">{item("forWho")}</span>
          </div>
          <div className={asideCard}>
            <b className="font-heading text-base">{t("common.basisTitle")}</b>
            <span className="text-sm text-muted">{item("basis")}</span>
          </div>
          <nav aria-label={t("common.otherTitle")} className={`${asideCard} gap-2.5`}>
            <b className="font-heading text-base">{t("common.otherTitle")}</b>
            {related.map((other) => (
              <Link
                key={other}
                href={`/xizmatlar/${other}`}
                className="border-b border-divider py-2 text-foreground hover:text-link"
              >
                {t(`items.${other}.name`)}
              </Link>
            ))}
            <Link
              href={{ pathname: "/", hash: "xizmatlar" }}
              className="py-2 font-semibold text-link"
            >
              {t("common.allServices")}
            </Link>
          </nav>
          <div className="flex flex-col gap-2 rounded-2xl bg-navy p-5 text-on-navy">
            <b className="font-heading text-base">{t("common.helpTitle")}</b>
            <span className="text-sm text-on-navy-muted">
              {t("common.helpText", { phone: siteConfig.hotline })}
            </span>
          </div>
        </aside>
      </div>
    </Container>
  );
}
