import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { Emblem } from "./Emblem";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex min-h-16 items-center gap-3 py-2.5">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3"
        >
          <Emblem size={36} />
          <span className="line-clamp-2 max-w-[13rem] text-xs font-semibold leading-tight sm:max-w-xs sm:text-sm">
            {t("site.name")}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
