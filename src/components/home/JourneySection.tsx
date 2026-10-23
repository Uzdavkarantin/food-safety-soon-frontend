import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { journeyStages } from "@/config/services";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge, type BadgeTone } from "@/components/Badge";
import { Icon } from "@/components/icons/Icon";

type Stage = { tag: string; title: string; text: string; link: string; imageAlt: string };
type StageTone = (typeof journeyStages)[number]["tone"];

const nodeClasses: Record<StageTone, string> = {
  green: "bg-success-fill",
  blue: "bg-accent",
  amber: "bg-warning",
  navy: "bg-navy",
};

const cardShadows: Record<StageTone, string> = {
  green: "shadow-[0_20px_40px_-24px_rgba(43,138,87,0.5)]",
  blue: "shadow-[0_20px_40px_-24px_rgba(31,86,196,0.5)]",
  amber: "shadow-[0_20px_40px_-24px_rgba(227,155,28,0.55)]",
  navy: "shadow-[0_20px_40px_-24px_rgba(14,34,64,0.5)]",
};

const tagTones: Record<StageTone, BadgeTone> = {
  green: "green",
  blue: "blue",
  amber: "amber",
  navy: "slate",
};

export function JourneySection() {
  const t = useTranslations("home.journey");
  const stages = t.raw("stages") as Stage[];

  return (
    <section id="zanjir" className="scroll-mt-4 overflow-hidden pt-[72px] pb-10">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <SectionHeading align="center" eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
          <span
            aria-hidden
            className="cue mt-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-link"
          >
            <Icon className="h-5 w-5" strokeWidth={2.2}>
              <path d="M12 5v14M6 13l6 6 6-6" />
            </Icon>
          </span>
        </div>

        <div className="relative py-5">
          <span className="j-base" aria-hidden />
          <span className="j-line" aria-hidden />

          <ol className="relative">
            {journeyStages.map(({ key, slug, tone }, i) => {
              const stage = stages[i];
              // Desktop alternates sides: image left on odd stages, right on even ones.
              const mediaLeft = i % 2 === 0;
              return (
                <li
                  key={key}
                  className="j-stage relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 gap-y-4 py-[26px] md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] md:items-center md:gap-x-3 md:gap-y-0"
                >
                  <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
                    <span
                      className={`j-node grid h-11 w-11 place-items-center rounded-full font-heading text-[17px] font-extrabold text-white shadow-[0_0_0_8px_var(--background)] ${nodeClasses[tone]}`}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <div
                    className={`j-media col-start-2 row-start-1 flex min-w-0 ${
                      mediaLeft ? "md:col-start-1 md:justify-end" : "md:col-start-3 md:justify-start"
                    }`}
                  >
                    <div
                      className={`w-full max-w-[440px] rounded-[20px] border border-border bg-surface p-[22px] ${cardShadows[tone]}`}
                    >
                      <Image
                        src={`/images/journey/${key}.jpg`}
                        alt={stage.imageAlt}
                        width={1200}
                        height={896}
                        sizes="(min-width: 768px) 400px, 90vw"
                        className="aspect-[3/2] w-full rounded-xl object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={`j-text col-start-2 row-start-2 flex min-w-0 max-w-[440px] flex-col gap-2 md:row-start-1 ${
                      mediaLeft
                        ? "md:col-start-3"
                        : "md:col-start-1 md:items-end md:justify-self-end md:text-right"
                    }`}
                  >
                    <Badge tone={tagTones[tone]} variant="tag" className={mediaLeft ? "" : "md:self-end"}>
                      {stage.tag}
                    </Badge>
                    <b className="font-heading text-[22px] leading-[1.15] sm:text-[26px]">{stage.title}</b>
                    <span className="text-base text-muted">{stage.text}</span>
                    <Link href={`/xizmatlar/${slug}`} className="text-sm font-semibold text-link">
                      {stage.link}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative flex justify-center pt-[26px]">
            <div className="j-stage inline-flex items-center gap-3 rounded-full bg-navy px-6 py-3.5 text-on-navy shadow-[0_0_0_8px_var(--background)]">
              <Icon className="h-[22px] w-[22px] text-mint">
                <path d="M3 12h18" />
                <path d="M5 12a7 7 0 0 1 14 0" />
                <path d="M12 5V3M8 14v3M16 14v3" />
              </Icon>
              <span className="font-heading text-[17px] font-bold">{t("finale")}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
