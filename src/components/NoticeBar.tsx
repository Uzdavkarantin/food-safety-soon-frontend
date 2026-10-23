import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./icons/Icon";

const REPEAT = 4;

export function NoticeBar() {
  const t = useTranslations("notice");

  // Two identical groups; the track slides by -50% so the loop is seamless.
  const group = (
    <span className="inline-flex items-center gap-14 pr-14">
      {Array.from({ length: REPEAT }, (_, i) => (
        <Fragment key={i}>
          <span className="inline-flex items-center gap-2.5">
            <Icon className="h-[15px] w-[15px] text-gold">
              <path d="M12 3l10 18H2z" />
              <path d="M12 10v4M12 18h.01" />
            </Icon>
            {t("testMode")}
          </span>
          <span className="text-sky">•</span>
        </Fragment>
      ))}
    </span>
  );

  return (
    <div
      role="status"
      aria-label={t("label")}
      className="overflow-hidden border-b border-navy-border bg-navy text-[13px] font-semibold text-on-navy"
    >
      <div aria-hidden className="marquee flex w-max whitespace-nowrap py-[9px]">
        {group}
        {group}
      </div>
    </div>
  );
}
