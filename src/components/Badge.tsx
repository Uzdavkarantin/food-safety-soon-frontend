import type { ReactNode } from "react";
import type { Tone } from "@/config/services";

export type BadgeTone = Tone;

const toneClasses: Record<BadgeTone, string> = {
  blue: "border-accent-border bg-accent-soft text-link",
  green: "border-success-border bg-success-soft text-success",
  amber: "border-warning-border bg-warning-soft text-warning-text",
  red: "border-danger-border bg-danger-soft text-danger",
  slate: "border-slate-border bg-slate-soft text-foreground",
};

const dotClasses: Record<BadgeTone, string> = {
  blue: "bg-accent",
  green: "bg-success-fill",
  amber: "bg-warning",
  red: "bg-danger-bright",
  slate: "bg-navy",
};

// pill: status/result badges (14px) · tag: small uppercase stage labels (12px)
export function Badge({
  tone,
  dot,
  variant = "pill",
  className = "",
  children,
}: {
  tone: BadgeTone;
  dot?: BadgeTone;
  variant?: "pill" | "tag";
  className?: string;
  children: ReactNode;
}) {
  const shape =
    variant === "tag"
      ? "px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em]"
      : "gap-2 px-3 py-1.5 text-sm font-semibold";

  return (
    <span
      className={`inline-flex items-center self-start rounded-full border ${shape} ${toneClasses[tone]} ${className}`}
    >
      {dot ? (
        <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dotClasses[dot]}`} />
      ) : null}
      {children}
    </span>
  );
}
