import type { ReactNode } from "react";

// Stroke icon wrapper matching the design exports (24×24, round caps/joins).
export function Icon({
  children,
  className = "h-5 w-5",
  strokeWidth = 2,
}: {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}
