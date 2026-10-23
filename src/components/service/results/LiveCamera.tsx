"use client";

import { useEffect, useRef } from "react";

// Demo "live" kitchen camera: a generated, looping clip with AI detection boxes
// drawn on top. Box positions follow the video's playback time (keyframes below,
// calibrated against public/videos/oshxona-live.mp4), so they stay on the cooks.

export type LiveBox = { level: "green" | "red"; label: string };

// [time (s), left %, top %, width %, height %] per box, matched to boxes[] by index.
type Keyframe = [number, number, number, number, number];
// The clip is 10 s and loops; the last keyframe matches the first.
export const tracks: Keyframe[][] = [
  // front cook — hairnet
  [[0, 22.5, 29, 11, 13], [3, 23.5, 30, 11, 13], [6, 21.5, 29, 11, 13], [8, 22.5, 29.5, 11, 13], [10, 22.5, 29, 11, 13]],
  // front cook — gloves
  [[0, 17.5, 70, 12, 13], [3, 21, 70, 11, 13], [6, 13, 69, 13, 12], [7, 20, 70, 11, 13], [10, 18, 70, 12, 13]],
  // middle cook — hairnet
  [[0, 54, 23, 8, 12], [3, 54.5, 22, 8, 12], [5, 58.5, 22, 8, 12], [7, 61, 22, 7.5, 12], [9, 60.5, 22, 7.5, 12], [10, 54, 23, 8, 12]],
  // back-right cook — flagged
  [[0, 72, 20, 10, 36], [3, 76, 21, 10, 35], [6, 73.5, 21, 10, 35], [8, 76, 21, 10, 34], [10, 72, 20, 10, 36]],
];

function at(track: Keyframe[], t: number): Keyframe {
  if (t <= track[0][0]) return track[0];
  for (let i = 1; i < track.length; i++) {
    const [t1] = track[i];
    if (t <= t1) {
      const a = track[i - 1];
      const b = track[i];
      const k = (t - a[0]) / (b[0] - a[0]);
      return a.map((v, j) => v + (b[j] - v) * k) as Keyframe;
    }
  }
  return track[track.length - 1];
}

const boxColor = {
  green: "border-success-fill",
  red: "border-danger-bright",
} as const;

const chipColor = {
  green: "bg-success-fill",
  red: "bg-danger-bright",
} as const;

export function LiveCamera({
  title,
  live,
  boxes,
}: {
  title: string;
  live: string;
  boxes: LiveBox[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Reduced motion: keep the poster frame and the boxes at their first keyframe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});

    let frame = 0;
    let shownSecond = -1;
    const paint = () => {
      const t = video.currentTime;
      boxRefs.current.forEach((el, i) => {
        const track = tracks[i];
        if (!el || !track) return;
        const [, left, top, width, height] = at(track, t);
        el.style.left = `${left}%`;
        el.style.top = `${top}%`;
        el.style.width = `${width}%`;
        el.style.height = `${height}%`;
      });
      const now = new Date();
      if (clockRef.current && now.getSeconds() !== shownSecond) {
        shownSecond = now.getSeconds();
        clockRef.current.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden rounded-[14px] border border-border bg-navy">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/oshxona-live.mp4"
          poster="/videos/oshxona-live.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />

        {boxes.map((box, i) => {
          const [, left, top, width, height] = tracks[i]?.[0] ?? [0, 0, 0, 0, 0];
          // Labels of boxes on the right half hang from the box's right edge so they stay in
          // frame; violation labels sit under the box so they never collide with the others.
          const anchor = left > 55 ? "right-[-2px]" : "left-[-2px]";
          const side =
            box.level === "red" ? "-bottom-[20px] sm:-bottom-[22px]" : "-top-[20px] sm:-top-[22px]";
          return (
            <div
              key={box.label + i}
              ref={(el) => {
                boxRefs.current[i] = el;
              }}
              className={`absolute rounded-sm border-2 ${boxColor[box.level]}`}
              style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
            >
              <span
                className={`absolute ${side} ${anchor} whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase leading-none text-white sm:text-[11px] ${chipColor[box.level]}`}
              >
                {box.label}
              </span>
            </div>
          );
        })}

        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-danger-bright" />
            {live}
          </span>
          <span aria-hidden className="hidden rounded-md bg-black/55 px-2 py-1 text-xs font-semibold text-white sm:inline">
            {title}
          </span>
        </div>
        <span
          ref={clockRef}
          aria-hidden
          className="absolute top-2.5 right-2.5 hidden rounded-md bg-black/55 px-2 py-1 font-mono text-xs text-white sm:block"
        />
      </div>
      <figcaption className="text-sm text-muted sm:sr-only">{title}</figcaption>
    </figure>
  );
}
