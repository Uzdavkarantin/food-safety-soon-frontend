export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  tone?: "default" | "onNavy";
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col ${
        centered ? "items-center gap-2.5 text-center" : "max-w-[720px] gap-2"
      }`}
    >
      <span
        className={`text-[13px] font-bold uppercase tracking-[0.14em] ${
          tone === "onNavy" ? "text-sky" : "text-link"
        }`}
      >
        {eyebrow}
      </span>
      <h2 className="font-heading text-[30px] font-extrabold leading-[1.12] tracking-[-0.015em] sm:text-[38px]">
        {title}
      </h2>
      {lead ? (
        <p className={`text-[17px] text-muted ${centered ? "max-w-[60ch]" : ""}`}>{lead}</p>
      ) : null}
    </div>
  );
}
