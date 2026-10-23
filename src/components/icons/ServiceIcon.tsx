import type { ReactNode } from "react";
import { Icon } from "./Icon";

// Glyphs copied from the service cards in the design (Main.dc.html).
const glyphs: Record<string, ReactNode> = {
  sertifikat: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 14l2 2 4-4" />
    </>
  ),
  "call-center": (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  murojaatlar: (
    <>
      <path d="M5 5h14l2 8v6H3v-6z" />
      <path d="M3 13h5l2 3h4l2-3h5" />
    </>
  ),
  fermer: (
    <>
      <path d="M12 21V11" />
      <path d="M12 11c-5 0-7-3-7-7 4 0 7 2 7 7z" />
      <path d="M12 14c0-4 3-6 7-6 0 4-2 6-7 6z" />
    </>
  ),
  reyting: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-5" />
      <circle cx="12" cy="15" r="1.5" />
    </>
  ),
  import: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  eksport: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  bozor: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  yorliq: (
    <>
      <path d="M3 12l9-9h9v9l-9 9z" />
      <circle cx="16.5" cy="7.5" r="1.5" />
    </>
  ),
  hisobot: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  kuzatuv: (
    <>
      <path d="M6 18c0-6 12-6 12-12" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
    </>
  ),
  oshxona: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 11l5-3v8l-5-3z" />
    </>
  ),
};

// Icon tile colours by ServiceConfig.tone (cards and the service page title).
export const iconTileClasses = {
  blue: "border-accent-border bg-accent-soft text-link",
  green: "border-success-border bg-success-soft text-success",
} as const;

export function ServiceIcon({
  slug,
  className = "h-[22px] w-[22px]",
}: {
  slug: string;
  className?: string;
}) {
  return <Icon className={className}>{glyphs[slug]}</Icon>;
}
