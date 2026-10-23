import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/config/services";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceIcon, iconTileClasses } from "@/components/icons/ServiceIcon";

export function ServicesSection() {
  const t = useTranslations("home.services");
  const items = useTranslations("services.items");

  return (
    <section id="xizmatlar" className="scroll-mt-4 pt-6 pb-[72px]">
      <Container className="flex flex-col gap-7">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-[18px]">
          {services.map(({ slug, tone }) => (
            <article
              key={slug}
              className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-[22px]"
            >
              <span
                className={`grid h-[46px] w-[46px] place-items-center rounded-xl border ${iconTileClasses[tone]}`}
              >
                <ServiceIcon slug={slug} />
              </span>
              <h3 className="font-heading text-[19px] font-bold">{items(`${slug}.name`)}</h3>
              <p className="grow text-[15px] text-muted">{items(`${slug}.card`)}</p>
              <Link href={`/xizmatlar/${slug}`} className="self-start text-sm font-semibold text-link">
                {t("more")}
                <span className="sr-only"> {items(`${slug}.name`)}</span>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
