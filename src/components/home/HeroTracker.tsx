"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Tilts the hero card toward the cursor (±16°). The spotlight and cursor ring
// are site-wide (CursorGlow). Writes CSS variables only, never re-renders.
// Disabled on touch-only devices and when reduced motion is requested.
export function HeroTracker({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = ref.current;
    const card = hero?.querySelector<HTMLElement>("[data-tilt]");
    if (!hero || !card) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const move = (e: PointerEvent) => {
      const c = card.getBoundingClientRect();
      const dx = (e.clientX - (c.left + c.width / 2)) / c.width;
      const dy = (e.clientY - (c.top + c.height / 2)) / c.height;
      card.style.setProperty("--tx", `${(dx * 16).toFixed(2)}deg`);
      card.style.setProperty("--ty", `${(-dy * 16).toFixed(2)}deg`);
    };
    const leave = () => {
      card.style.setProperty("--tx", "0deg");
      card.style.setProperty("--ty", "0deg");
    };

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-linear-to-b from-surface to-background"
    >
      {children}
    </section>
  );
}
