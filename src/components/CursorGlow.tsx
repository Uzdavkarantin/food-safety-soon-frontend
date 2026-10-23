"use client";

import { useEffect, useRef } from "react";

// Site-wide mouse tracker: a soft spotlight and a ring that follow the cursor
// over every section. Variables are written on the two overlay elements only,
// once per animation frame. Off for touch input and reduced motion.
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      glow.style.setProperty("--mx", `${x}px`);
      glow.style.setProperty("--my", `${y}px`);
      dot.style.setProperty("--dx", `${x}px`);
      dot.style.setProperty("--dy", `${y}px`);
    };
    const show = (visible: boolean) => {
      const value = visible ? "1" : "0";
      glow.style.setProperty("--co", value);
      dot.style.setProperty("--co", value);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      show(true);
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const hide = () => show(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
