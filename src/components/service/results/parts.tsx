import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import { Icon } from "@/components/icons/Icon";

// Building blocks shared by the per-service result bodies.

export type NoteTone = "green" | "amber" | "red" | "blue";
export type NoteIcon = "check" | "info" | "alert" | "x";

export type NoteData = { tone: NoteTone; icon: NoteIcon; title: string; text: string };

const noteBox: Record<NoteTone, string> = {
  green: "border-success-border bg-success-soft",
  amber: "border-warning-border bg-warning-soft",
  red: "border-danger-border bg-danger-soft",
  blue: "border-accent-border bg-accent-soft",
};

const noteIconColor: Record<NoteTone, string> = {
  green: "text-success",
  amber: "text-warning-text",
  red: "text-danger",
  blue: "text-link",
};

export const glyphs: Record<NoteIcon, ReactNode> = {
  check: <path d="M5 12l4 4L19 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v4M12 18h.01" />
    </>
  ),
  x: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>
  ),
};

export function NoteIconGlyph({ icon, tone }: { icon: NoteIcon; tone: NoteTone }) {
  return <Icon className={`h-5 w-5 ${noteIconColor[tone]}`}>{glyphs[icon]}</Icon>;
}

export function Note({ tone, icon, title, text }: NoteData) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${noteBox[tone]}`}>
      <span className="mt-0.5 flex-none">
        <NoteIconGlyph icon={icon} tone={tone} />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <b>{title}</b>
        <span className="text-sm text-muted">{text}</span>
      </div>
    </div>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} tone="slate">
          {item}
        </Badge>
      ))}
    </div>
  );
}


export type TagData = { tone: "blue" | "green" | "amber" | "red" | "slate"; label: string };

export function Tags({ items }: { items: TagData[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tag) => (
        <Badge key={tag.label} tone={tag.tone}>
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

export type ValueTone = "blue" | "green" | "amber" | "red" | "navy" | "muted";

const valueColor: Record<ValueTone, string> = {
  blue: "text-link",
  green: "text-success",
  amber: "text-warning",
  red: "text-danger",
  navy: "text-foreground",
  muted: "text-muted",
};

const barColor: Record<ValueTone, string> = {
  blue: "bg-accent",
  green: "bg-success-fill",
  amber: "bg-warning",
  red: "bg-danger-bright",
  navy: "bg-navy",
  muted: "bg-muted",
};

export type StatData = { tone: ValueTone; value: string; label: string; delta?: string };

export function Stats({ items, min = 150 }: { items: StatData[]; min?: number }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }}
    >
      {items.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-0 flex-col gap-0.5 rounded-[14px] border border-border bg-background px-4 py-3.5"
        >
          <span
            className={`font-heading text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] ${valueColor[stat.tone]}`}
          >
            {stat.value}
          </span>
          <span className="text-[13px] text-muted">{stat.label}</span>
          {stat.delta ? (
            <span className="text-[13px] font-semibold text-success">{stat.delta}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export type BarData = { tone: ValueTone; label: string; value: number };

// Horizontal percentage bars: label · track · value.
export function Bars({ items, labelWidth = 150 }: { items: BarData[]; labelWidth?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((bar) => (
        <div
          key={bar.label}
          className="grid items-center gap-3 text-sm"
          style={{ gridTemplateColumns: `minmax(0, ${labelWidth}px) 1fr 48px` }}
        >
          <span>{bar.label}</span>
          <span className="block h-2.5 rounded-md bg-divider">
            <span
              className={`block h-full rounded-md ${barColor[bar.tone]}`}
              style={{ width: `${bar.value}%` }}
            />
          </span>
          <b className="text-right">{bar.value}%</b>
        </div>
      ))}
    </div>
  );
}

export type ChatLine = { kind: "citizen" | "ai"; who: string; text: string };

export function Chat({ lines }: { lines: ChatLine[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, i) =>
        line.kind === "ai" ? (
          <div
            key={i}
            className="max-w-[85%] self-end rounded-[14px_14px_4px_14px] bg-navy px-3.5 py-3 text-[15px] text-on-navy"
          >
            <b className="block text-xs text-on-navy-muted">{line.who}</b>
            {line.text}
          </div>
        ) : (
          <div
            key={i}
            className="max-w-[85%] self-start rounded-[14px_14px_14px_4px] border border-border bg-background px-3.5 py-3 text-[15px]"
          >
            <b className="block text-xs text-muted">{line.who}</b>
            {line.text}
          </div>
        ),
      )}
    </div>
  );
}
