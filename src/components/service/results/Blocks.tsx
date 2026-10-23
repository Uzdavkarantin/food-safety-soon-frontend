import { Fragment, type ReactNode } from "react";
import { Badge } from "@/components/Badge";
import {
  Bars,
  Chat,
  Note,
  Pills,
  Stats,
  Tags,
  type BarData,
  type ChatLine,
  type NoteData,
  type StatData,
  type TagData,
  type ValueTone,
} from "./parts";
import { LiveCamera, type LiveBox } from "./LiveCamera";

// A service's result body is a list of typed blocks from
// services.items.<slug>.result.blocks; `kind` is identical in every locale.
export type Block =
  | { kind: "text"; paragraphs: string[] }
  | ({ kind: "note" } & NoteData)
  | { kind: "tags"; items: TagData[] }
  | { kind: "pills"; items: string[] }
  | { kind: "stats"; items: StatData[] }
  | { kind: "bars"; title?: string; items: BarData[] }
  | { kind: "chat"; lines: ChatLine[] }
  | {
      kind: "score";
      tone: ValueTone;
      value: number;
      outOf: string;
      title: string;
      meta: string;
      action: string;
    }
  | { kind: "signal"; level: "green" | "amber" | "red"; title: string; text: string }
  | { kind: "progress"; label: string; value: number }
  | {
      kind: "timeline";
      steps: { tone: "green" | "blue" | "amber" | "navy"; title: string; text: string }[];
    }
  | { kind: "action"; label: string }
  | { kind: "live"; title: string; live: string; boxes: LiveBox[] }
  | {
      kind: "cameras";
      items: { level: "green" | "amber" | "red"; label: string; title: string; text: string }[];
    };

const ringColor: Record<ValueTone, string> = {
  blue: "var(--accent)",
  green: "var(--success-fill)",
  amber: "var(--warning)",
  red: "var(--danger-bright)",
  navy: "var(--navy)",
  muted: "var(--muted)",
};

const scoreText: Record<ValueTone, string> = {
  blue: "text-link",
  green: "text-success",
  amber: "text-warning-text",
  red: "text-danger",
  navy: "text-foreground",
  muted: "text-muted",
};

// Traffic light: the active lamp is lit, the other two are dimmed.
const lamps = [
  { level: "green", className: "bg-success-fill" },
  { level: "amber", className: "bg-gold-strong" },
  { level: "red", className: "bg-danger-bright" },
] as const;

const stepNode = {
  green: "bg-success-fill",
  blue: "bg-accent",
  amber: "bg-warning",
  navy: "bg-navy",
} as const;

const cameraDot = {
  green: "bg-success-fill",
  amber: "bg-warning",
  red: "bg-danger-bright",
} as const;

// Copy marks emphasis with <b>…</b>; nothing else is interpreted.
function rich(text: string): ReactNode {
  return text.split(/<b>(.*?)<\/b>/g).map((part, i) =>
    i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>,
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return (
        <div className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
          {block.paragraphs.map((p, i) => (
            <p key={i}>{rich(p)}</p>
          ))}
        </div>
      );
    case "note":
      return <Note {...block} />;
    case "tags":
      return <Tags items={block.items} />;
    case "pills":
      return <Pills items={block.items} />;
    case "stats":
      return <Stats items={block.items} />;
    case "bars":
      return (
        <div className="flex flex-col gap-2">
          {block.title ? <b className="text-[15px]">{block.title}</b> : null}
          <Bars items={block.items} />
        </div>
      );
    case "chat":
      return <Chat lines={block.lines} />;
    case "score":
      return (
        <div className="flex flex-wrap items-center gap-6">
          <div
            className="grid h-[132px] w-[132px] flex-none place-items-center rounded-full"
            style={{
              background: `conic-gradient(${ringColor[block.tone]} 0 ${block.value}%, var(--divider) ${block.value}% 100%)`,
            }}
          >
            <div className="grid h-[102px] w-[102px] place-items-center rounded-full bg-surface text-center">
              <span className={`font-heading text-[34px] font-extrabold leading-none ${scoreText[block.tone]}`}>
                {block.value}
                <span className="text-sm text-muted">{block.outOf}</span>
              </span>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2 text-[15px]">
            <b className="text-[17px]">{block.title}</b>
            <span className="text-muted">{block.meta}</span>
            <Badge tone="red">{block.action}</Badge>
          </div>
        </div>
      );
    case "signal":
      return (
        <div className="flex flex-wrap items-center gap-6">
          <div aria-hidden className="inline-flex gap-3 rounded-full bg-navy p-3">
            {lamps.map((lamp) => (
              <span
                key={lamp.level}
                className={`h-11 w-11 rounded-full ${lamp.className} ${
                  lamp.level === block.level ? "" : "opacity-20"
                }`}
              />
            ))}
          </div>
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1.5 text-[15px]">
            <b className="text-[17px]">{block.title}</b>
            <span className="text-muted">{block.text}</span>
          </div>
        </div>
      );
    case "progress":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[15px]">
            <b>{block.label}</b>
            <b className="text-link">{block.value}%</b>
          </div>
          <span className="block h-3 rounded-md bg-divider">
            <span
              className="block h-full rounded-md bg-linear-to-r from-success-fill to-accent"
              style={{ width: `${block.value}%` }}
            />
          </span>
        </div>
      );
    case "timeline":
      return (
        <ol className="flex flex-col">
          {block.steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[36px_1fr] gap-3.5">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-8 w-8 flex-none place-items-center rounded-full text-sm font-bold text-white ${stepNode[step.tone]}`}
                >
                  {i + 1}
                </span>
                {i < block.steps.length - 1 ? <span className="w-0.5 flex-1 bg-border" /> : null}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5 pb-4">
                <b>{step.title}</b>
                <span className="text-sm text-muted">{step.text}</span>
              </div>
            </li>
          ))}
        </ol>
      );
    case "action":
      // Demo only: the button has no effect.
      return (
        <div>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-border bg-surface px-[18px] font-semibold text-foreground transition-colors hover:border-accent"
          >
            {block.label}
          </button>
        </div>
      );
    case "live":
      return <LiveCamera title={block.title} live={block.live} boxes={block.boxes} />;
    case "cameras":
      return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5">
          {block.items.map((camera) => (
            <div
              key={camera.title}
              className="flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-border bg-surface"
            >
              <div className="relative flex aspect-video items-end bg-linear-to-b from-navy-2 to-navy p-2.5">
                <svg
                  aria-hidden
                  viewBox="0 0 160 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute inset-0 h-full w-full text-sky opacity-55"
                >
                  <path d="M10 70h140M30 70V40h40v30M90 70V48h50v22M40 40l10-10h20" />
                  <circle cx="118" cy="36" r="6" />
                  <path d="M118 42v12M110 50l8 4 8-4" />
                </svg>
                <span className="relative inline-flex items-center gap-1.5 rounded-md bg-white/12 px-2 py-1 text-xs font-semibold text-on-navy">
                  <span className={`h-2 w-2 rounded-full ${cameraDot[camera.level]}`} />
                  {camera.label}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 px-3.5 py-3">
                <b className="text-[15px]">{camera.title}</b>
                <span className="text-sm text-muted">{camera.text}</span>
              </div>
            </div>
          ))}
        </div>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
