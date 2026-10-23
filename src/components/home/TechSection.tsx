import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/icons/Icon";

// Language model · computer vision · speech to text · model platform
const glyphs: ReactNode[] = [
  <>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9h8M8 12h5" />
  </>,
  <>
    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  <>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </>,
  <>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="10" y="10" width="4" height="4" />
    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </>,
];

export function TechSection() {
  const t = useTranslations("home.tech");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section id="yechimlar" className="scroll-mt-4 pb-[72px]">
      <Container className="flex flex-col gap-7">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-[18px]">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-surface p-[22px]"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-navy text-on-navy">
                <Icon className="h-[22px] w-[22px]">{glyphs[i]}</Icon>
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <b className="font-heading text-[17px]">{item.title}</b>
                <span className="text-sm text-muted">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
