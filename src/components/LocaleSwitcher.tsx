"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/config/site";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === active ? "true" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase transition-colors sm:w-10 sm:text-sm ${
            loc === active
              ? "bg-brand text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
