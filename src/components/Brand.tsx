import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Emblem } from "./Emblem";

export function Brand() {
  const t = useTranslations("site");

  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-3 text-foreground hover:text-foreground max-xl:flex-1"
    >
      <Emblem size={46} alt={t("emblemAlt")} preload />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-heading text-[19px] font-extrabold leading-tight tracking-[-0.01em]">
          {t("brand")}
        </span>
        <span className="text-[11px] uppercase leading-snug tracking-[0.08em] text-muted">
          {t("committee")}
        </span>
      </span>
    </Link>
  );
}
