"use client";

import { useEffect, useId, useState, type MouseEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenu({
  openLabel,
  closeLabel,
  children,
}: {
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close after following any link inside the panel.
  const onPanelClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-foreground transition-colors hover:bg-accent-soft xl:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div
        id={panelId}
        hidden={!open}
        onClick={onPanelClick}
        className="basis-full border-t border-divider pt-2 xl:hidden"
      >
        {children}
      </div>
    </>
  );
}
