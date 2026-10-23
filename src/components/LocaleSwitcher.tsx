"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/config/site";

// "segmented": three buttons (mobile menu) · "select": compact dropdown (desktop header)
export function LocaleSwitcher({
  variant = "segmented",
}: {
  variant?: "segmented" | "select";
}) {
  const t = useTranslations("locale");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (loc: Locale) => {
    // Keep the section anchor (e.g. #xizmatlar) when changing language.
    router.replace(`${pathname}${window.location.hash}`, { locale: loc });
  };

  if (variant === "select") {
    return (
      <span className="relative inline-flex">
        <select
          aria-label={t("label")}
          value={active}
          onChange={(e) => switchTo(e.target.value as Locale)}
          className="h-11 cursor-pointer appearance-none rounded-[10px] border border-border bg-surface pr-8 pl-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft"
        >
          {locales.map((loc) => (
            <option key={loc} value={loc} title={t(loc)}>
              {loc.toUpperCase()}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted"
        />
      </span>
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-[10px] border border-border bg-surface p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-current={loc === active ? "true" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold uppercase transition-colors ${
            loc === active
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
