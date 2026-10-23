import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Container } from "./Container";
import { Emblem } from "./Emblem";
import { SocialLinks } from "./SocialLinks";
import { Icon } from "./icons/Icon";

export function Footer() {
  const t = useTranslations("footer");
  const laws = t.raw("laws") as string[];
  const year = new Date().getFullYear();

  return (
    <footer id="aloqa" className="mt-auto border-t border-border bg-surface">
      <Container className="flex flex-col gap-6 pt-10 pb-7">
        <div className="flex flex-wrap justify-between gap-6">
          <div className="flex min-w-0 max-w-[520px] items-start gap-3.5">
            <Emblem size={48} />
            <div className="flex flex-col gap-1">
              <b className="font-heading text-base font-bold">{t("org")}</b>
              <span className="text-sm text-muted">{t("portal")}</span>
              <span className="text-sm text-muted">
                {t("hotline", { phone: siteConfig.hotline })}
              </span>
            </div>
          </div>

          <nav
            aria-label={t("lawsTitle")}
            className="flex min-w-0 max-w-[360px] flex-[1_1_260px] flex-col gap-2"
          >
            <b className="inline-flex items-center gap-2 font-heading text-sm font-bold">
              <Icon className="h-4 w-4 text-link">
                <path d="M12 3v18M4 7h16M6 7l-3 7h6zM18 7l-3 7h6z" />
                <path d="M3 14a3 3 0 0 0 6 0M15 14a3 3 0 0 0 6 0" />
              </Icon>
              {t("lawsTitle")}
            </b>
            {siteConfig.laws.map(({ href }, i) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-[3px] text-sm text-muted hover:text-link"
              >
                {laws[i]}
              </a>
            ))}
            <a
              href={siteConfig.lawsAllUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-[3px] text-sm font-semibold text-link"
            >
              {t("allLaws")}
            </a>
          </nav>

          <SocialLinks label={t("socialLabel")} />
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-border pt-[18px] text-[13px] text-muted">
          <span>
            © {year} {t("copyright")}
          </span>
          <span>{new URL(siteConfig.url).host}</span>
        </div>
      </Container>
    </footer>
  );
}
