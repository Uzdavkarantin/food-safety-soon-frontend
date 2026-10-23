import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "./Container";
import { Brand } from "./Brand";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Icon } from "./icons/Icon";

const sections = [
  { hash: "xizmatlar", key: "services" },
  { hash: "yechimlar", key: "technologies" },
  { hash: "raqamlar", key: "numbers" },
  { hash: "zanjir", key: "journey" },
] as const;

export function Header() {
  const t = useTranslations("nav");

  const links = (className: string) =>
    sections.map(({ hash, key }) => (
      <Link key={hash} href={{ pathname: "/", hash }} className={className}>
        {t(key)}
      </Link>
    ));

  const login = (
    <a
      href={siteConfig.cabinetUrl}
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-[10px] bg-accent px-[18px] font-semibold text-white transition-colors hover:bg-accent-strong hover:text-white"
    >
      <Icon className="h-[18px] w-[18px]">
        <path d="M15 3h4v18h-4M10 17l5-5-5-5M3 12h12" />
      </Icon>
      {t("login")}
    </a>
  );

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3.5 xl:gap-x-5">
        <Brand />

        <div className="ml-auto hidden items-center gap-x-4 xl:flex">
          <nav
            aria-label={t("label")}
            className="flex items-center gap-x-[22px] text-[15px] font-medium"
          >
            {links("py-2 text-foreground hover:text-link")}
          </nav>
          {login}
          <div className="flex items-center gap-2">
            <LocaleSwitcher variant="select" />
            <ThemeToggle />
          </div>
        </div>

        <MobileMenu openLabel={t("menuOpen")} closeLabel={t("menuClose")}>
          <nav aria-label={t("label")} className="flex flex-col text-base font-medium">
            {links("border-b border-divider py-3 text-foreground hover:text-link")}
          </nav>
          <div className="flex flex-wrap items-center gap-3 py-4">
            {login}
            <div className="ml-auto flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </MobileMenu>
      </Container>
    </header>
  );
}
