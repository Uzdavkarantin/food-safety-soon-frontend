import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

const valueColors = ["text-sky", "text-gold", "text-mint"];

export function NumbersSection() {
  const t = useTranslations("home.numbers");
  const items = t.raw("items") as { value: string; label: string; note: string }[];

  return (
    <section id="raqamlar" className="scroll-mt-4 bg-navy py-16 text-on-navy">
      <Container className="flex flex-col gap-7">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} tone="onNavy" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-[18px]">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-navy-border p-[26px]"
            >
              <span
                className={`font-heading text-[40px] font-extrabold leading-none tracking-[-0.02em] sm:text-[48px] ${valueColors[i]}`}
              >
                {item.value}
              </span>
              <span className="text-[17px] font-semibold">{item.label}</span>
              <span className="text-sm text-on-navy-muted">{item.note}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
